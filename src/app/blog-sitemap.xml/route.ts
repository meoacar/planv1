import { NextResponse } from 'next/server'
import { generateBlogSitemap } from '@/lib/blog/blog-utils'

export async function GET() {
  try {
    const sitemap = await generateBlogSitemap()
    
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Blog sitemap generation error:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
