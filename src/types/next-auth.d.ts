import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      coins?: number
      xp?: number
      level?: number
      isBanned?: boolean
      bannedUntil?: Date | null
      banReason?: string | null
    } & DefaultSession['user']
  }

  interface User {
    role: string
    coins?: number
    xp?: number
    level?: number
    isBanned?: boolean
    bannedUntil?: Date | null
    banReason?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
