'use server'

import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function verifyResetToken(token: string) {
  try {
    const resetToken = await db.passwordReset.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    if (!resetToken) {
      return { valid: false, error: 'Token bulunamadı' }
    }

    if (resetToken.used) {
      return { valid: false, error: 'Bu token zaten kullanılmış' }
    }

    if (new Date() > resetToken.expiresAt) {
      return { valid: false, error: 'Token süresi dolmuş' }
    }

    return { valid: true }
  } catch (error) {
    console.error('Verify token error:', error)
    return { valid: false, error: 'Token doğrulanamadı' }
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Verify token
    const resetToken = await db.passwordReset.findUnique({
      where: { token },
      include: {
        user: true,
      },
    })

    if (!resetToken) {
      return { success: false, error: 'Geçersiz token' }
    }

    if (resetToken.used) {
      return { success: false, error: 'Bu token zaten kullanılmış' }
    }

    if (new Date() > resetToken.expiresAt) {
      return { success: false, error: 'Token süresi dolmuş' }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password and mark token as used
    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash: hashedPassword,
        },
      }),
      db.passwordReset.update({
        where: { id: resetToken.id },
        data: {
          used: true,
        },
      }),
    ])

    return { success: true }
  } catch (error) {
    console.error('Reset password error:', error)
    return { success: false, error: 'Şifre sıfırlanamadı' }
  }
}
