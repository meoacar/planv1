/**
 * SEO Utils Kullanım Örnekleri
 * 
 * Bu dosya, blog SEO fonksiyonlarının nasıl kullanılacağını gösterir.
 * Gerçek implementasyonda bu örnekleri blog detay sayfasında kullanabilirsiniz.
 */

import { generateSEOMeta, generateStructuredData } from './blog-utils'
import type { BlogPostDetail } from '@/types/blog'

/**
 * Örnek 1: Blog detay sayfası için metadata oluşturma
 * 
 * Next.js App Router'da kullanım:
 * 
 * // app/blog/[slug]/page.tsx
 * export async function generateMetadata({ params }: { params: { slug: string } }) {
 *   const post = await fetchBlogPost(params.slug)
 *   return generateSEOMeta(post)
 * }
 */

/**
 * Örnek 2: Blog detay sayfasında JSON-LD structured data ekleme
 * 
 * // app/blog/[slug]/page.tsx
 * export default async function BlogPostPage({ params }: { params: { slug: string } }) {
 *   const post = await fetchBlogPost(params.slug)
 *   const structuredData = generateStructuredData(post)
 *   
 *   return (
 *     <>
 *       <script
 *         type="application/ld+json"
 *         dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
 *       />
 *       <article>
 *         {/* Blog içeriği */}
 *       </article>
 *     </>
 *   )
 * }
 */

/**
 * Örnek 3: Sitemap kullanımı
 * 
 * Sitemap otomatik olarak /blog-sitemap.xml endpoint'inde sunuluyor.
 * 
 * robots.txt dosyasına eklenebilir:
 * Sitemap: https://zayiflamaplan.com/blog-sitemap.xml
 * 
 * Google Search Console'a manuel olarak gönderilebilir.
 */

/**
 * Örnek 4: SEO meta tags'leri manuel olarak özelleştirme
 */
export function customizeSEOMeta(post: BlogPostDetail) {
  const baseMeta = generateSEOMeta(post)
  
  // Özel meta tags ekle veya değiştir
  return {
    ...baseMeta,
    // Özel keywords ekle
    keywords: `${baseMeta.keywords}, diyet, sağlıklı yaşam, kilo verme`,
    // Özel robots ayarları
    robots: {
      ...baseMeta.robots,
      // Belirli bir yazıyı indexleme
      index: post.category.slug !== 'draft',
    },
  }
}

/**
 * Örnek 5: Structured data'yı zenginleştirme
 */
export function enrichStructuredData(post: BlogPostDetail) {
  const baseData = generateStructuredData(post)
  
  // Ek bilgiler ekle
  return {
    ...baseData,
    // Breadcrumb ekle
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Ana Sayfa',
          item: 'https://zayiflamaplan.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://zayiflamaplan.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.category.name,
          item: `https://zayiflamaplan.com/blog/category/${post.category.slug}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: post.title,
          item: `https://zayiflamaplan.com/blog/${post.slug}`,
        },
      ],
    },
    // FAQ ekle (eğer varsa)
    ...(post.tags.some(tag => tag.slug === 'sss') && {
      '@type': 'FAQPage',
      mainEntity: [
        // FAQ soruları buraya eklenebilir
      ],
    }),
  }
}
