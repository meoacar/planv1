import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { db } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(db), // Temporarily disabled due to version mismatch
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/giris',
    error: '/giris',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email ve şifre gerekli')
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Geçersiz email veya şifre')
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) {
          throw new Error('Geçersiz email veya şifre')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        
        // Fetch user data including ban status
        try {
          const user = await db.user.findUnique({
            where: { id: token.id as string },
            select: { 
              coins: true, 
              xp: true, 
              level: true,
              isBanned: true,
              bannedUntil: true,
              banReason: true,
            },
          })
          
          if (user) {
            session.user.coins = user.coins
            session.user.xp = user.xp
            session.user.level = user.level
            session.user.isBanned = user.isBanned
            session.user.bannedUntil = user.bannedUntil
            session.user.banReason = user.banReason

            // Eğer yasaklama süresi dolmuşsa, yasaklamayı kaldır
            if (user.isBanned && user.bannedUntil && new Date(user.bannedUntil) < new Date()) {
              await db.user.update({
                where: { id: token.id as string },
                data: { 
                  isBanned: false, 
                  bannedUntil: null, 
                  banReason: null 
                },
              })
              session.user.isBanned = false
              session.user.bannedUntil = null
              session.user.banReason = null
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      return session
    },
  },
})

// Backward compatibility exports for NextAuth v4 style
export const authOptions = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' as const },
};

// Wrapper for getServerSession (NextAuth v5 uses auth() instead)
export async function getServerSession(options?: any) {
  return await auth();
}
