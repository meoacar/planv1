'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signIn } from '@/lib/auth'

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string | null
  const image = formData.get('image') as string | null

  // Validation
  if (!email || !password) {
    return { error: 'Email ve şifre gerekli' }
  }

  if (password.length < 6) {
    return { error: 'Şifre en az 6 karakter olmalı' }
  }

  // Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'Bu email adresi zaten kullanılıyor' }
  }

  // Check username if provided
  if (username) {
    const existingUsername = await db.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return { error: 'Bu kullanıcı adı zaten kullanılıyor' }
    }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create user
  await db.user.create({
    data: {
      email,
      passwordHash,
      username: username || undefined,
      name: username || email.split('@')[0],
      image: image || undefined,
    },
  })

  // Auto login after registration
  await signIn('credentials', {
    email,
    password,
    redirect: false,
  })

  redirect('/dashboard')
}
