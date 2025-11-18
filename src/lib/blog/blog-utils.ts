import DOMPurify from 'isomorphic-dompurify'
import type { BlogPostDetail, TOCItem } from '@/types/blog'
import { db as prisma } from '@/lib/db'

/**
 * Blog içeriğinin okuma süresini hesaplar
 * @param content - Blog içeriği (HTML veya plain text)
 * @returns Tahmini okuma süresi (dakika)
 */
export function calculateReadingTime(content: string): number {
  // Ortalama okuma hızı (kelime/dakika)
  const wordsPerMinute = 200

  // HTML etiketlerini temizle
  const plainText = content.replace(/<[^>]*>/g, '')

  // Kelime sayısını hesapla
  const wordCount = plainText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length

  // Okuma süresini hesapla (en az 1 dakika)
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return Math.max(1, readingTime)
}

/**
 * Türkçe karakterleri destekleyen slug oluşturucu
 * @param text - Slug'a çevrilecek metin
 * @returns SEO dostu slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Türkçe karakterleri değiştir
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Özel karakterleri temizle
    .replace(/[^a-z0-9\s-]/g, '')
    // Boşlukları tire ile değiştir
    .replace(/\s+/g, '-')
    // Birden fazla tireyi tek tireye indir
    .replace(/-+/g, '-')
    // Baş ve sondaki tireleri kaldır
    .replace(/^-+|-+$/g, '')
}

/**
 * İçerikten özet çıkarır
 * @param content - Blog içeriği
 * @param length - Özet uzunluğu (karakter)
 * @returns Özet metin
 */
export function extractExcerpt(content: string, length: number = 300): string {
  // HTML etiketlerini temizle
  const plainText = content.replace(/<[^>]*>/g, '')

  // Belirtilen uzunlukta kes
  const excerpt = plainText.substring(0, length).trim()

  // Son kelimeyi tamamla
  const lastSpaceIndex = excerpt.lastIndexOf(' ')
  const trimmedExcerpt = lastSpaceIndex > 0 
    ? excerpt.substring(0, lastSpaceIndex) 
    : excerpt

  return trimmedExcerpt + (plainText.length > length ? '...' : '')
}

/**
 * Blog içeriğini XSS saldırılarına karşı temizler
 * Rich text editor içeriği için güvenli HTML etiketlerine izin verir
 * @param content - Temizlenecek blog içeriği
 * @returns Güvenli HTML içerik
 */
export function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      // Metin formatlama
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'mark',
      // Başlıklar
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Listeler
      'ul', 'ol', 'li',
      // Bağlantılar
      'a',
      // Görseller
      'img',
      // Alıntılar
      'blockquote', 'cite',
      // Kod
      'code', 'pre',
      // Tablolar
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      // Diğer
      'hr', 'div', 'span',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', // Link özellikleri
      'src', 'alt', 'width', 'height', // Görsel özellikleri
      'class', 'id', // Stil özellikleri
      'title', // Genel özellik
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Güvenlik için external link'lere otomatik rel="noopener noreferrer" ekle
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  })
}

/**
 * Blog yazısı için SEO meta tags oluşturur
 * @param post - Blog yazısı detayı
 * @param baseUrl - Site base URL'i (örn: https://example.com)
 * @returns SEO meta tags objesi
 */
export function generateSEOMeta(post: BlogPostDetail, baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://zayiflamaplan.com') {
  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || extractExcerpt(post.content, 160)
  const url = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.coverImage ? `${baseUrl}${post.coverImage}` : `${baseUrl}/og-default.svg`
  const authorName = post.author.name || post.author.username || 'Zayıflama Plan'
  
  return {
    title,
    description,
    keywords: post.tags.map(tag => tag.name).join(', '),
    authors: [{ name: authorName }],
    creator: authorName,
    publisher: 'Zayıflama Plan',
    
    // Open Graph
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Zayıflama Plan',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.coverImageAlt || post.title,
        },
      ],
      publishedTime: post.publishedAt ? (typeof post.publishedAt === 'string' ? post.publishedAt : post.publishedAt.toISOString()) : undefined,
      modifiedTime: post.updatedAt ? (typeof post.updatedAt === 'string' ? post.updatedAt : post.updatedAt.toISOString()) : undefined,
      authors: [authorName],
      section: post.category.name,
      tags: post.tags.map(tag => tag.name),
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@zayiflamaplan',
      site: '@zayiflamaplan',
    },
    
    // Canonical URL
    alternates: {
      canonical: url,
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  }
}

/**
 * Blog yazısı için JSON-LD structured data oluşturur
 * @param post - Blog yazısı detayı
 * @param baseUrl - Site base URL'i
 * @returns JSON-LD schema objesi
 */
export function generateStructuredData(post: BlogPostDetail, baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://zayiflamaplan.com') {
  const url = `${baseUrl}/blog/${post.slug}`
  const imageUrl = post.coverImage ? `${baseUrl}${post.coverImage}` : `${baseUrl}/og-default.svg`
  const authorName = post.author.name || post.author.username || 'Zayıflama Plan'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || extractExcerpt(post.content, 160),
    image: imageUrl,
    datePublished: post.publishedAt ? (typeof post.publishedAt === 'string' ? post.publishedAt : post.publishedAt.toISOString()) : undefined,
    dateModified: post.updatedAt ? (typeof post.updatedAt === 'string' ? post.updatedAt : post.updatedAt.toISOString()) : undefined,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${baseUrl}/profile/${post.author.username || post.author.id}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zayıflama Plan',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category.name,
    keywords: post.tags.map(tag => tag.name).join(', '),
    wordCount: post.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length,
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: 'tr-TR',
    url,
  }
}

/**
 * Blog içeriğinden H2 ve H3 başlıklarını çıkararak içindekiler tablosu oluşturur
 * @param content - Blog HTML içeriği
 * @returns İçindekiler tablosu öğeleri
 */
export function generateTOC(content: string): TOCItem[] {
  const toc: TOCItem[] = []
  
  // HTML içeriğinden H2 ve H3 başlıklarını bul
  const headingRegex = /<h([23])(?:\s+[^>]*)?>([^<]+)<\/h\1>/gi
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].trim()
    
    // Başlıktan ID oluştur (anchor link için)
    const id = generateSlug(text)
    
    toc.push({
      id,
      text,
      level,
    })
  }
  
  return toc
}

/**
 * Blog içeriğine anchor link'ler ekler
 * H2 ve H3 başlıklarına otomatik ID ekleyerek içindekiler tablosundan erişilebilir hale getirir
 * @param content - Blog HTML içeriği
 * @returns Anchor link'li HTML içerik
 */
export function addAnchorLinks(content: string): string {
  return content.replace(
    /<h([23])(?:\s+[^>]*)?>([^<]+)<\/h\1>/gi,
    (match, level, text) => {
      const id = generateSlug(text.trim())
      return `<h${level} id="${id}">${text}</h${level}>`
    }
  )
}

/**
 * Blog sitemap XML'i oluşturur
 * @param baseUrl - Site base URL'i
 * @returns Sitemap XML string
 */
export async function generateBlogSitemap(baseUrl: string = process.env.NEXT_PUBLIC_APP_URL || 'https://zayiflamaplan.com'): Promise<string> {
  // Yayınlanmış tüm blog yazılarını getir
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      deletedAt: null,
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  // Kategorileri getir
  const categories = await prisma.blogCategory.findMany({
    select: {
      slug: true,
    },
  })

  // Etiketleri getir
  const tags = await prisma.blogTag.findMany({
    select: {
      slug: true,
    },
  })

  // XML oluştur
  const urls: string[] = []

  // Blog ana sayfası
  urls.push(`
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`)

  // Blog yazıları
  posts.forEach((post: { slug: string; updatedAt: Date | string }) => {
    const lastmod = typeof post.updatedAt === 'string' ? post.updatedAt : post.updatedAt.toISOString()
    urls.push(`
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
  })

  // Kategoriler
  categories.forEach((category: { slug: string }) => {
    urls.push(`
  <url>
    <loc>${baseUrl}/blog/category/${category.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
  })

  // Etiketler
  tags.forEach((tag: { slug: string }) => {
    urls.push(`
  <url>
    <loc>${baseUrl}/blog/tag/${tag.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`)
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`
}
