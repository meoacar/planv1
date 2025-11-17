# Blog Sistemi - Implementation Tasks

## Phase 1: Database & Core Setup

### Task 1.1: Database Schema
- [ ] Prisma schema'ya BlogPost, BlogCategory, BlogTag, BlogComment modellerini ekle
- [ ] BlogStatus ve CommentStatus enum'larını tanımla
- [ ] User modeline BlogPost ve BlogComment relation'ları ekle
- [ ] Gerekli index'leri ekle
- [ ] Migration dosyası oluştur (--create-only kullan, kullanıcıya sor)

### Task 1.2: Seed Data
- [ ] Varsayılan blog kategorileri oluştur (Beslenme, Egzersiz, Motivasyon, Tarifler, Sağlık)
- [ ] Test için örnek blog yazıları ekle
- [ ] Örnek etiketler ekle

## Phase 2: API Routes - Public

### Task 2.1: Blog Listesi API
- [ ] `GET /api/blog` route'unu oluştur
- [ ] Pagination implementasyonu (sayfa başına 12 yazı)
- [ ] Kategori filtresi
- [ ] Arama fonksiyonu (başlık, içerik, etiket)
- [ ] Sıralama (en yeni, en çok okunan)
- [ ] Response type tanımla

### Task 2.2: Blog Detay API
- [ ] `GET /api/blog/[slug]` route'unu oluştur
- [ ] İlgili yazıları getir (aynı kategoriden 3 yazı)
- [ ] Yorum sayısını dahil et
- [ ] 404 handling

### Task 2.3: Yardımcı API'ler
- [ ] `GET /api/blog/categories` - Tüm kategoriler
- [ ] `GET /api/blog/tags` - Popüler etiketler
- [ ] `GET /api/blog/featured` - Öne çıkan yazılar
- [ ] `POST /api/blog/[slug]/view` - View count artır

### Task 2.4: Yorum API
- [ ] `POST /api/blog/[slug]/comments` - Yorum ekle
- [ ] Auth kontrolü
- [ ] Spam filtreleme
- [ ] Rate limiting

## Phase 3: API Routes - Admin

### Task 3.1: Blog CRUD
- [ ] `POST /api/admin/blog` - Blog oluştur
- [ ] `PUT /api/admin/blog/[id]` - Blog güncelle
- [ ] `DELETE /api/admin/blog/[id]` - Soft delete
- [ ] `POST /api/admin/blog/[id]/publish` - Yayınla
- [ ] `POST /api/admin/blog/[id]/feature` - Öne çıkar
- [ ] Admin auth middleware
- [ ] Input validation (Zod)

### Task 3.2: Kategori Yönetimi
- [ ] `POST /api/admin/blog/categories` - Kategori oluştur
- [ ] `PUT /api/admin/blog/categories/[id]` - Güncelle
- [ ] `DELETE /api/admin/blog/categories/[id]` - Sil (blog varsa engelle)

### Task 3.3: Yorum Moderasyonu
- [ ] `GET /api/admin/blog/comments` - Bekleyen yorumlar
- [ ] `PUT /api/admin/blog/comments/[id]` - Onayla/Reddet/Spam

### Task 3.4: İstatistikler
- [ ] `GET /api/admin/blog/stats` - Genel istatistikler
- [ ] Toplam blog, yorum, görüntülenme sayıları
- [ ] En çok okunan yazılar
- [ ] Kategori dağılımı

## Phase 4: Utility Functions

### Task 4.1: Blog Utils
- [ ] `calculateReadingTime(content)` - Okuma süresi hesapla
- [ ] `generateSlug(title)` - Türkçe karakter desteği ile slug oluştur
- [ ] `extractExcerpt(content, length)` - İçerikten özet çıkar
- [ ] `sanitizeContent(content)` - XSS koruması

### Task 4.2: SEO Utils
- [ ] `generateSEOMeta(post)` - Meta tags oluştur
- [ ] `generateStructuredData(post)` - JSON-LD schema
- [ ] `generateSitemap()` - Blog sitemap

### Task 4.3: Table of Contents
- [ ] `generateTOC(content)` - H2/H3'lerden içindekiler oluştur
- [ ] Anchor link'ler ekle

## Phase 5: Public Pages

### Task 5.1: Blog Liste Sayfası
- [ ] `/blog/page.tsx` oluştur
- [ ] BlogList component
- [ ] BlogCard component
- [ ] Pagination component
- [ ] Kategori filtresi sidebar
- [ ] Arama çubuğu
- [ ] Featured posts bölümü
- [ ] SEO meta tags

### Task 5.2: Blog Detay Sayfası
- [ ] `/blog/[slug]/page.tsx` oluştur
- [ ] BlogContent component (rich text render)
- [ ] BlogTOC component (sticky sidebar)
- [ ] BlogShare component (sosyal medya butonları)
- [ ] BlogRelated component (ilgili yazılar)
- [ ] BlogComments component (yorum listesi)
- [ ] BlogCommentForm component
- [ ] Reading progress bar
- [ ] SEO meta tags ve structured data

### Task 5.3: Kategori ve Etiket Sayfaları
- [ ] `/blog/category/[slug]/page.tsx`
- [ ] `/blog/tag/[slug]/page.tsx`
- [ ] Filtrelenmiş blog listesi

## Phase 6: Admin Pages

### Task 6.1: Blog Yönetim Paneli
- [ ] `/admin/blog/page.tsx` oluştur
- [ ] BlogTable component (liste, durum, işlemler)
- [ ] Filtreleme (durum, kategori)
- [ ] Arama
- [ ] Toplu işlemler (yayınla, sil)

### Task 6.2: Blog Editor
- [ ] `/admin/blog/new/page.tsx` oluştur
- [ ] `/admin/blog/[id]/edit/page.tsx` oluştur
- [ ] BlogEditor component (Tiptap veya Lexical)
- [ ] BlogForm component
- [ ] Medya yükleme
- [ ] SEO meta alanları
- [ ] Kategori ve etiket seçimi
- [ ] Preview modu
- [ ] Auto-save (her 30 saniye)
- [ ] Taslak kaydet / Yayınla butonları

### Task 6.3: Kategori Yönetimi
- [ ] `/admin/blog/categories/page.tsx` oluştur
- [ ] CategoryForm component
- [ ] Kategori listesi ve düzenleme

### Task 6.4: Yorum Moderasyonu
- [ ] `/admin/blog/comments/page.tsx` oluştur
- [ ] CommentModeration component
- [ ] Bekleyen yorumlar listesi
- [ ] Onayla/Reddet/Spam butonları

### Task 6.5: İstatistikler
- [ ] `/admin/blog/stats/page.tsx` oluştur
- [ ] Genel metrikler (toplam blog, yorum, görüntülenme)
- [ ] En çok okunan yazılar grafiği
- [ ] Kategori dağılımı grafiği
- [ ] Haftalık/Aylık trend grafiği

## Phase 7: Components

### Task 7.1: Blog Components
- [ ] BlogCard - Blog kartı (thumbnail, başlık, özet, meta)
- [ ] BlogList - Blog listesi container
- [ ] BlogFeatured - Öne çıkan yazılar carousel/grid
- [ ] BlogSidebar - Kategoriler, popüler etiketler, son yazılar
- [ ] BlogSearch - Arama input ve sonuçlar

### Task 7.2: Blog Detail Components
- [ ] BlogContent - Rich text renderer
- [ ] BlogTOC - Table of contents (sticky)
- [ ] BlogShare - Sosyal medya paylaşım butonları
- [ ] BlogRelated - İlgili yazılar
- [ ] BlogReadingProgress - Progress bar
- [ ] BlogComments - Yorum listesi
- [ ] BlogCommentForm - Yorum formu

### Task 7.3: Admin Components
- [ ] BlogEditor - Rich text editor (Tiptap)
- [ ] BlogForm - Blog formu (başlık, slug, kategori, etiket, SEO)
- [ ] BlogTable - Admin blog listesi tablosu
- [ ] CategoryForm - Kategori formu
- [ ] CommentModeration - Yorum moderasyon kartları

## Phase 8: Rich Text Editor

### Task 8.1: Tiptap Setup
- [ ] Tiptap ve extension'ları yükle
- [ ] Editor component oluştur
- [ ] Toolbar (başlıklar, bold, italic, liste, link, görsel)
- [ ] Görsel yükleme handler
- [ ] Markdown import/export

### Task 8.2: Content Rendering
- [ ] Tiptap content'i HTML'e çevir
- [ ] Syntax highlighting (kod blokları için)
- [ ] Responsive görseller

## Phase 9: SEO & Performance

### Task 9.1: SEO
- [ ] Dynamic meta tags (title, description, OG)
- [ ] JSON-LD structured data (Article schema)
- [ ] Sitemap.xml oluştur
- [ ] robots.txt güncelle
- [ ] Canonical URL'ler

### Task 9.2: Performance
- [ ] Image optimization (Next.js Image)
- [ ] ISR (Incremental Static Regeneration) - blog listesi ve detay
- [ ] Lazy loading (yorumlar, ilgili yazılar)
- [ ] Database query optimization
- [ ] Redis cache (popüler yazılar, kategoriler)

## Phase 10: Testing & Polish

### Task 10.1: Testing
- [ ] API route'ları test et
- [ ] Blog oluşturma/düzenleme flow test et
- [ ] Yorum sistemi test et
- [ ] Responsive tasarım test et
- [ ] SEO meta tags kontrol et

### Task 10.2: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Toast notifications
- [ ] Accessibility (ARIA labels, keyboard navigation)

### Task 10.3: Documentation
- [ ] Admin kullanım kılavuzu
- [ ] API documentation
- [ ] Component documentation

## Phase 11: Launch

### Task 11.1: Pre-Launch
- [ ] Production database migration
- [ ] İlk blog yazılarını hazırla
- [ ] Kategorileri oluştur
- [ ] Footer'daki /blog linkini aktif et

### Task 11.2: Post-Launch
- [ ] Analytics entegrasyonu (blog görüntülenme tracking)
- [ ] Sitemap'i Google Search Console'a gönder
- [ ] İlk blog yazılarını yayınla
- [ ] Sosyal medyada duyur

## Notes

- Her task için ayrı commit yapılmalı
- Admin route'ları için auth middleware zorunlu
- Tüm form inputları Zod ile validate edilmeli
- Responsive tasarım her component için test edilmeli
- SEO best practices uygulanmalı
- Performance metrics takip edilmeli (Core Web Vitals)
