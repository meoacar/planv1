import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin sayfalarına erişim kontrolü
  if (pathname.startsWith('/admin')) {
    // Geçici olarak middleware'i bypass et - auth kontrolü layout'ta yapılıyor
    console.log('Admin route accessed:', pathname)
  }

  return NextResponse.next()
}

// Geçici olarak middleware devre dışı
export const config = {
  matcher: [],
}
