'use server'

import { db } from '@/lib/db'
import crypto from 'crypto'

export async function sendPasswordResetEmail(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email adresi gereklidir' }
  }

  // Check if user exists
  const user = await db.user.findUnique({
    where: { email },
  })

  // Always return success to prevent email enumeration
  // (Don't tell attackers if email exists or not)
  if (!user) {
    return { 
      success: true, 
      message: 'Eğer bu email adresi kayıtlıysa, şifre sıfırlama linki gönderildi.' 
    }
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

  // Save token to database
  await db.user.update({
    where: { id: user.id },
    data: {
      // We'll need to add these fields to the schema
      // For now, we'll use a workaround
      // resetToken: resetToken,
      // resetTokenExpiry: resetTokenExpiry,
    },
  })

  // TODO: Send email with reset link
  // const resetUrl = `${process.env.NEXTAUTH_URL}/sifre-sifirla?token=${resetToken}`
  // await sendEmail({
  //   to: email,
  //   subject: 'Şifre Sıfırlama',
  //   html: `Şifrenizi sıfırlamak için <a href="${resetUrl}">buraya tıklayın</a>`
  // })

  console.log('Password reset requested for:', email)
  console.log('Reset token:', resetToken)
  console.log('Reset URL would be:', `http://localhost:3000/sifre-sifirla?token=${resetToken}`)

  return { 
    success: true, 
    message: 'Şifre sıfırlama talimatları email adresinize gönderildi.',
    // For development, return the token
    ...(process.env.NODE_ENV === 'development' && { token: resetToken })
  }
}
