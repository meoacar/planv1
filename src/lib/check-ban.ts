import { auth } from './auth'
import { redirect } from 'next/navigation'

/**
 * Kullanıcının yasaklı olup olmadığını kontrol eder
 * Yasaklıysa /yasakli sayfasına yönlendirir
 */
export async function checkUserBan() {
  const session = await auth()
  
  if (session?.user?.isBanned) {
    redirect('/yasakli')
  }
  
  return session
}
