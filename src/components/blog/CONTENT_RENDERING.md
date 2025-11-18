# Blog Content Rendering

Bu dokümantasyon, blog içeriğinin nasıl render edildiğini ve optimize edildiğini açıklar.

## Özellikler

### 1. Tiptap HTML'den Optimize Edilmiş HTML'e Dönüşüm

`renderBlogContent()` fonksiyonu Tiptap editöründen gelen HTML'i optimize eder:

```typescript
import { renderBlogContent } from '@/lib/blog/content-renderer'

const optimizedHtml = renderBlogContent(tiptapHtml, {
  sanitize: true,           // XSS koruması
  addImageClasses: true,    // Responsive image sınıfları
  addCodeClasses: true,     // Syntax highlighting sınıfları
  lazyLoadImages: true,     // Lazy loading
})
```

### 2. Syntax Highlighting

Kod blokları için **highlight.js** kullanılır:

- Otomatik dil algılama
- GitHub Dark teması
- 180+ dil desteği
- Kod bloklarına `.hljs` sınıfı eklenir

**Örnek:**

```typescript
// Editor'da
editor.chain().focus().toggleCodeBlock().run()

// Render edilen HTML
<pre><code class="hljs language-typescript">
  const hello = "world"
</code></pre>
```

### 3. Responsive Görseller

Tüm görseller otomatik olarak responsive hale getirilir:

```html
<!-- Orijinal -->
<img src="/image.jpg" alt="Açıklama" />

<!-- Optimize edilmiş -->
<figure class="my-6">
  <img 
    src="/image.jpg" 
    alt="Açıklama"
    class="w-full h-auto rounded-lg shadow-md"
    loading="lazy"
  />
  <figcaption class="text-sm text-muted-foreground text-center mt-2 italic">
    Açıklama
  </figcaption>
</figure>
```

**Özellikler:**
- `w-full h-auto` - Responsive boyutlandırma
- `rounded-lg shadow-md` - Görsel stil
- `loading="lazy"` - Performans optimizasyonu
- Alt text varsa otomatik figcaption eklenir

### 4. Heading ID'leri ve TOC

Başlıklara otomatik ID eklenir:

```typescript
import { addHeadingIds, extractHeadings } from '@/lib/blog/content-renderer'

// ID'leri ekle
const htmlWithIds = addHeadingIds(html)

// TOC için başlıkları çıkar
const headings = extractHeadings(html)
// [{ id: 'baslik-1', text: 'Başlık 1', level: 2 }, ...]
```

**Örnek:**

```html
<!-- Orijinal -->
<h2>Sağlıklı Beslenme İpuçları</h2>

<!-- ID eklenmiş -->
<h2 id="saglikli-beslenme-ipuclari">Sağlıklı Beslenme İpuçları</h2>
```

### 5. XSS Koruması

`DOMPurify` ile HTML sanitize edilir:

**İzin verilen etiketler:**
- Başlıklar: `h2`, `h3`
- Metin: `p`, `br`, `strong`, `em`, `u`
- Bağlantılar: `a`
- Listeler: `ul`, `ol`, `li`
- Diğer: `blockquote`, `code`, `pre`, `img`, `figure`, `figcaption`

**İzin verilen özellikler:**
- `href`, `src`, `alt`, `title`, `class`, `style`, `target`, `rel`, `loading`

### 6. Yardımcı Fonksiyonlar

#### Özet Oluşturma

```typescript
import { generateExcerpt } from '@/lib/blog/content-renderer'

const excerpt = generateExcerpt(html, 150)
// "Blog yazısının ilk 150 karakteri..."
```

#### Okuma Süresi Hesaplama

```typescript
import { calculateReadingTime } from '@/lib/blog/content-renderer'

const minutes = calculateReadingTime(html)
// 5 (dakika)
```

#### Plain Text Çıkarma

```typescript
import { extractPlainText } from '@/lib/blog/content-renderer'

const text = extractPlainText(html)
// "Tüm HTML etiketleri kaldırılmış metin"
```

## Kullanım

### BlogContent Bileşeni

```tsx
import { BlogContent } from '@/components/blog/blog-content'

<BlogContent content={post.content} />
```

**Otomatik yapılanlar:**
- HTML sanitize edilir
- Başlıklara ID eklenir
- Görseller responsive yapılır
- Kod blokları highlight edilir
- Smooth scroll eklenir

### BlogTOC Bileşeni

```tsx
import { BlogTOC } from '@/components/blog/blog-toc'

<BlogTOC content={post.content} />
```

**Özellikler:**
- Otomatik heading extraction
- Active heading tracking
- Smooth scroll navigation
- Sticky positioning

## Performans Optimizasyonları

1. **Memoization**: `useMemo` ile content processing cache'lenir
2. **Lazy Loading**: Görseller lazy load edilir
3. **Code Splitting**: Highlight.js sadece gerektiğinde yüklenir
4. **Intersection Observer**: TOC için efficient scroll tracking

## Tailwind Prose Sınıfları

BlogContent bileşeni Tailwind Typography plugin'ini kullanır:

```css
prose prose-slate dark:prose-invert max-w-none
prose-headings:font-bold prose-headings:scroll-mt-20
prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
prose-code:bg-muted prose-code:rounded
prose-pre:bg-[#0d1117] prose-pre:rounded-lg
prose-img:rounded-lg prose-img:shadow-md
```

## Güvenlik

- **XSS Koruması**: DOMPurify ile sanitization
- **CSP Uyumlu**: Inline script'ler yok
- **Safe HTML**: Sadece izin verilen etiketler
- **URL Validation**: Link ve image URL'leri kontrol edilir

## Gelecek İyileştirmeler

- [ ] Code block'larda dil seçici
- [ ] Copy to clipboard butonu
- [ ] Image zoom/lightbox
- [ ] Video embed desteği
- [ ] Table of contents collapse/expand
- [ ] Print-friendly styling
