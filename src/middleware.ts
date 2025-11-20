import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // SEO Redirects - Eski URL'lerden yeni URL'lere yönlendirme
  
  // Eski blog URL'leri: /blog/evde-yapabileceginiz-15-dakikalik-hiit-antrenman
  // Yeni: /blog/[slug] (aynı kalıyor, redirect gerekmiyor)
  
  // Eski plan URL'leri: /plan/3-ayda-15-kilo-verdim-gercek-hikayem-abc123
  // Yeni: /plan/[slug] (aynı kalıyor, redirect gerekmiyor)

  // Eğer eski domain'den geliyorsa (zayiflamaplan.com -> zayiflamaplanim.com)
  const host = request.headers.get('host') || ''
  if (host.includes('zayiflamaplan.com') && !host.includes('zayiflamaplanim.com')) {
    const newUrl = request.nextUrl.clone()
    newUrl.host = 'zayiflamaplanim.com'
    return NextResponse.redirect(newUrl, 301)
  }

  // Admin sayfalarına erişim kontrolü
  if (pathname.startsWith('/admin')) {
    console.log('Admin route accessed:', pathname)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
