'use server'

import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'
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
  const expiresAt = new Date(Date.now() + 3600000) // 1 hour

  // Delete old unused tokens for this user
  await db.passwordReset.deleteMany({
    where: {
      userId: user.id,
      used: false,
    },
  })

  // Save token to database
  await db.passwordReset.create({
    data: {
      userId: user.id,
      token: resetToken,
      expiresAt,
    },
  })

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sifre-sifirla?token=${resetToken}`

  // Send email with reset link
  const emailResult = await sendPasswordResetEmail(email, resetUrl)

  if (!emailResult.success) {
    console.error('Failed to send password reset email')
    // Don't reveal email sending failure to prevent enumeration
  }

  // Log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Password reset requested for:', email)
    console.log('Reset URL:', resetUrl)
  }

  return { 
    success: true, 
    message: 'Şifre sıfırlama talimatları email adresinize gönderildi.',
    // For development, return the token
    ...(process.env.NODE_ENV === 'development' && { token: resetToken })
  }
}
