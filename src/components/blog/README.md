# Blog Bileşenleri

Bu klasör blog sistemi için kullanılan React bileşenlerini içerir.

## Bileşenler

### BlogContent
Blog içeriğini render eden ana bileşen.

**Özellikler:**
- Tiptap HTML'i optimize edilmiş HTML'e çevirir
- XSS koruması (DOMPurify)
- Syntax highlighting (highlight.js)
- Responsive görseller
- Otomatik heading ID'leri
- Smooth scroll navigation

**Kullanım:**
```tsx
import { BlogContent } from '@/components/blog/blog-content'

<BlogContent content={post.content} />
```

### BlogTOC
İçindekiler tablosu (Table of Contents) bileşeni.

**Özellikler:**
- Otomatik heading extraction
- Active heading tracking
- Smooth scroll navigation
- Sticky positioning

**Kullanım:**
```tsx
import { BlogTOC } from '@/components/blog/blog-toc'

<BlogTOC content={post.content} />
```

### BlogCard
Blog kartı bileşeni (liste görünümü için).

**Kullanım:**
```tsx
import { BlogCard } from '@/components/blog/blog-card'

<BlogCard post={post} />
```

### BlogEditor (Admin)
Rich text editor bileşeni (Tiptap tabanlı).

**Özellikler:**
- Zengin metin editörü
- Görsel yükleme
- Kod blokları
- Markdown import/export
- Syntax highlighting

**Kullanım:**
```tsx
import { BlogEditor } from '@/components/blog/admin/blog-editor'

<BlogEditor 
  content={content}
  onChange={setContent}
  onImageUpload={handleImageUpload}
/>
```

## Utility Fonksiyonlar

### content-renderer.ts
Blog içeriği rendering ve optimizasyon fonksiyonları.

**Fonksiyonlar:**
- `renderBlogContent()` - HTML'i optimize et
- `extractHeadings()` - Başlıkları çıkar
- `addHeadingIds()` - Başlıklara ID ekle
- `extractPlainText()` - Plain text çıkar

### blog-utils.ts
Genel blog utility fonksiyonları.

**Fonksiyonlar:**
- `calculateReadingTime()` - Okuma süresi hesapla
- `generateSlug()` - SEO dostu slug oluştur
- `extractExcerpt()` - Özet çıkar
- `sanitizeContent()` - XSS koruması
- `generateSEOMeta()` - SEO meta tags
- `generateStructuredData()` - JSON-LD schema
- `generateTOC()` - İçindekiler tablosu
- `addAnchorLinks()` - Anchor linkler ekle

## Test

Test sayfası: `/test-blog-render`

Bu sayfa BlogContent ve BlogTOC bileşenlerini test etmek için kullanılır.

## Daha Fazla Bilgi

- [Content Rendering Dokümantasyonu](./CONTENT_RENDERING.md)
- [Admin Bileşenleri](./admin/README.md)
