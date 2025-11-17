# Blog Sistemi - Design Document

## Database Schema

### Blog Post Model
```prisma
model BlogPost {
  id              String         @id @default(cuid())
  title           String
  slug            String         @unique
  content         String         @db.Text
  excerpt         String?        @db.VarChar(300)
  coverImage      String?
  coverImageAlt   String?
  
  // SEO
  metaTitle       String?
  metaDescription String?        @db.VarChar(160)
  
  // Status
  status          BlogStatus     @default(DRAFT)
  featured        Boolean        @default(false)
  featuredOrder   Int?
  
  // Stats
  viewCount       Int            @default(0)
  readingTime     Int            // minutes
  
  // Relations
  authorId        String
  author          User           @relation(fields: [authorId], references: [id])
  categoryId      String
  category        BlogCategory   @relation(fields: [categoryId], references: [id])
  tags            BlogTag[]
  comments        BlogComment[]
  
  // Timestamps
  publishedAt     DateTime?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  deletedAt       DateTime?
  
  @@index([slug])
  @@index([status, publishedAt])
  @@index([categoryId])
  @@index([featured])
}

enum BlogStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model BlogCategory {
  id          String     @id @default(cuid())
  name        String     @unique
  slug        String     @unique
  description String?
  icon        String?    // emoji or icon name
  color       String?    // hex color
  order       Int        @default(0)
  
  posts       BlogPost[]
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@index([slug])
}

model BlogTag {
  id        String     @id @default(cuid())
  name      String     @unique
  slug      String     @unique
  
  posts     BlogPost[]
  
  createdAt DateTime   @default(now())
  
  @@index([slug])
}

model BlogComment {
  id        String        @id @default(cuid())
  content   String        @db.Text
  status    CommentStatus @default(PENDING)
  
  // Relations
  postId    String
  post      BlogPost      @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User          @relation(fields: [userId], references: [id])
  
  // Timestamps
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  
  @@index([postId, status])
  @@index([userId])
}

enum CommentStatus {
  PENDING
  APPROVED
  REJECTED
  SPAM
}
```

## API Routes

### Public Routes
- `GET /api/blog` - Blog listesi (pagination, filter, search)
- `GET /api/blog/[slug]` - Blog detay
- `GET /api/blog/categories` - Kategori listesi
- `GET /api/blog/tags` - Etiket listesi
- `GET /api/blog/featured` - Öne çıkan yazılar
- `POST /api/blog/[slug]/view` - Görüntülenme sayısını artır
- `POST /api/blog/[slug]/comments` - Yorum ekle (auth required)

### Admin Routes
- `POST /api/admin/blog` - Blog oluştur
- `PUT /api/admin/blog/[id]` - Blog güncelle
- `DELETE /api/admin/blog/[id]` - Blog sil (soft delete)
- `POST /api/admin/blog/[id]/publish` - Blog yayınla
- `POST /api/admin/blog/[id]/feature` - Blog öne çıkar
- `GET /api/admin/blog/stats` - Blog istatistikleri
- `GET /api/admin/blog/comments` - Yorum moderasyonu
- `PUT /api/admin/blog/comments/[id]` - Yorum onayla/reddet
- `POST /api/admin/blog/categories` - Kategori oluştur
- `PUT /api/admin/blog/categories/[id]` - Kategori güncelle
- `DELETE /api/admin/blog/categories/[id]` - Kategori sil

## Page Routes

### Public Pages
- `/blog` - Blog ana sayfa (liste, featured, kategoriler)
- `/blog/[slug]` - Blog detay sayfası
- `/blog/category/[slug]` - Kategoriye göre blog listesi
- `/blog/tag/[slug]` - Etikete göre blog listesi
- `/blog/search?q=...` - Arama sonuçları

### Admin Pages
- `/admin/blog` - Blog yönetim paneli
- `/admin/blog/new` - Yeni blog oluştur
- `/admin/blog/[id]/edit` - Blog düzenle
- `/admin/blog/categories` - Kategori yönetimi
- `/admin/blog/comments` - Yorum moderasyonu
- `/admin/blog/stats` - Blog istatistikleri

## Component Structure

```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx                    # Blog liste sayfası
│   │   ├── [slug]/
│   │   │   └── page.tsx                # Blog detay sayfası
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Kategori sayfası
│   │   └── tag/
│   │       └── [slug]/
│   │           └── page.tsx            # Etiket sayfası
│   ├── admin/
│   │   └── blog/
│   │       ├── page.tsx                # Blog yönetim
│   │       ├── new/
│   │       │   └── page.tsx            # Yeni blog
│   │       ├── [id]/
│   │       │   └── edit/
│   │       │       └── page.tsx        # Blog düzenle
│   │       ├── categories/
│   │       │   └── page.tsx            # Kategori yönetimi
│   │       ├── comments/
│   │       │   └── page.tsx            # Yorum moderasyonu
│   │       └── stats/
│   │           └── page.tsx            # İstatistikler
│   └── api/
│       ├── blog/
│       │   ├── route.ts                # Blog listesi
│       │   ├── [slug]/
│       │   │   ├── route.ts            # Blog detay
│       │   │   ├── view/
│       │   │   │   └── route.ts        # View count
│       │   │   └── comments/
│       │   │       └── route.ts        # Yorumlar
│       │   ├── categories/
│       │   │   └── route.ts            # Kategoriler
│       │   ├── tags/
│       │   │   └── route.ts            # Etiketler
│       │   └── featured/
│       │       └── route.ts            # Featured posts
│       └── admin/
│           └── blog/
│               ├── route.ts            # CRUD operations
│               ├── [id]/
│               │   ├── route.ts        # Update/Delete
│               │   ├── publish/
│               │   │   └── route.ts    # Publish
│               │   └── feature/
│               │       └── route.ts    # Feature
│               ├── stats/
│               │   └── route.ts        # Stats
│               ├── comments/
│               │   ├── route.ts        # Comment list
│               │   └── [id]/
│               │       └── route.ts    # Approve/Reject
│               └── categories/
│                   ├── route.ts        # Category CRUD
│                   └── [id]/
│                       └── route.ts    # Update/Delete
├── components/
│   └── blog/
│       ├── blog-card.tsx               # Blog kartı
│       ├── blog-list.tsx               # Blog listesi
│       ├── blog-featured.tsx           # Featured posts
│       ├── blog-sidebar.tsx            # Sidebar (kategoriler, etiketler)
│       ├── blog-search.tsx             # Arama
│       ├── blog-content.tsx            # Blog içerik renderer
│       ├── blog-toc.tsx                # Table of contents
│       ├── blog-share.tsx              # Paylaşım butonları
│       ├── blog-related.tsx            # İlgili yazılar
│       ├── blog-comments.tsx           # Yorum listesi
│       ├── blog-comment-form.tsx       # Yorum formu
│       ├── blog-reading-progress.tsx   # Okuma progress bar
│       └── admin/
│           ├── blog-editor.tsx         # Rich text editor
│           ├── blog-form.tsx           # Blog formu
│           ├── blog-table.tsx          # Blog tablosu
│           ├── category-form.tsx       # Kategori formu
│           └── comment-moderation.tsx  # Yorum moderasyon
└── lib/
    └── blog/
        ├── blog-service.ts             # Blog CRUD işlemleri
        ├── blog-utils.ts               # Yardımcı fonksiyonlar
        ├── reading-time.ts             # Okuma süresi hesaplama
        ├── slug-generator.ts           # Slug oluşturma
        └── seo-generator.ts            # SEO meta oluşturma
```

## Key Features Implementation

### 1. Rich Text Editor
- Tiptap veya Lexical kullanılacak
- Başlıklar (H2, H3), listeler, bağlantılar, görseller, kod blokları desteği
- Markdown import/export

### 2. Reading Time Calculation
```typescript
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
```

### 3. Slug Generation
```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### 4. SEO Meta Generation
```typescript
function generateSEOMeta(post: BlogPost) {
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [{ url: post.coverImage }],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}
```

### 5. Table of Contents Generation
- Blog içeriğindeki H2 ve H3 başlıklarından otomatik oluşturulacak
- Smooth scroll ile ilgili bölüme atlama

### 6. Related Posts Algorithm
```typescript
async function getRelatedPosts(postId: string, categoryId: string) {
  return await prisma.blogPost.findMany({
    where: {
      id: { not: postId },
      categoryId: categoryId,
      status: 'PUBLISHED',
    },
    take: 3,
    orderBy: { viewCount: 'desc' },
  });
}
```

## UI/UX Design Notes

### Blog Card Design
- Kapak görseli (16:9 aspect ratio)
- Kategori badge (renkli)
- Başlık (2 satır max, ellipsis)
- Özet (3 satır max, ellipsis)
- Yazar avatar + isim
- Tarih ve okuma süresi
- Hover efekti

### Blog Detail Page Layout
- Hero section (kapak görseli + başlık)
- Yazar bilgisi ve tarih
- Table of contents (sticky sidebar)
- İçerik (optimal okuma genişliği: 680px)
- Paylaşım butonları (sticky)
- İlgili yazılar
- Yorum bölümü

### Admin Editor
- Split view (editor + preview)
- Auto-save (her 30 saniyede)
- Medya kütüphanesi
- SEO preview
- Publish/Schedule seçenekleri

## Performance Optimizations

1. **Image Optimization**: Next.js Image component ile otomatik optimizasyon
2. **Caching**: Blog listesi ve detay sayfaları ISR ile cache
3. **Lazy Loading**: Yorumlar ve ilgili yazılar lazy load
4. **Database Indexing**: Slug, status, category için index
5. **CDN**: Statik içerikler CDN üzerinden sunulacak

## Security Considerations

1. **XSS Protection**: Blog içeriği sanitize edilecek
2. **CSRF Protection**: Form işlemlerinde CSRF token
3. **Rate Limiting**: Yorum ve arama için rate limit
4. **Input Validation**: Zod ile tüm inputlar validate edilecek
5. **Role-Based Access**: Admin route'ları sadece admin rolüne açık
