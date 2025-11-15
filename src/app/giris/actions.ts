'use server'

import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email ve şifre gereklidir' }
  }

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { error: 'Email veya şifre hatalı' }
    }

    redirect('/dashboard')
  } catch (error) {
    // redirect() throws NEXT_REDIRECT error which is expected
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    
    // Handle auth errors
    if (error instanceof AuthError) {
      return { error: 'Email veya şifre hatalı' }
    }
    
    return { error: 'Giriş yapılırken bir hata oluştu' }
  }
}
