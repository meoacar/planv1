# Blog Editor - Tiptap Implementation

## Özellikler

### ✅ Tamamlanan Özellikler

#### 1. Rich Text Editor (Tiptap)
- **StarterKit**: Temel metin düzenleme özellikleri
- **Image Extension**: Görsel ekleme ve yönetimi
- **Link Extension**: Bağlantı ekleme
- **Underline Extension**: Alt çizgi desteği
- **Text Align Extension**: Metin hizalama (sol, orta, sağ)
- **Placeholder Extension**: Placeholder metni

#### 2. Toolbar Özellikleri
- **Metin Biçimlendirme**: Bold, Italic, Underline
- **Başlıklar**: H2, H3
- **Listeler**: Sıralı ve sırasız listeler
- **Hizalama**: Sol, orta, sağ hizalama
- **Ekleme**: Link, görsel, kod bloğu, alıntı
- **Geri Al/İleri Al**: Undo/Redo

#### 3. Görsel Yükleme
- Dosya seçici ile görsel yükleme
- Görsel validasyonu (tip ve boyut kontrolü)
- Otomatik görsel sıkıştırma (max 1200px genişlik)
- Desteklenen formatlar: JPEG, PNG, GIF, WebP
- Maksimum dosya boyutu: 5MB
- Toast bildirimleri

#### 4. Markdown Import/Export
- HTML'den Markdown'a dönüştürme
- Markdown'dan HTML'e dönüştürme
- Markdown dosyası içe aktarma (.md, .markdown)
- Markdown dosyası dışa aktarma
- Desteklenen özellikler:
  - Başlıklar (H2, H3, H4)
  - Bold, Italic, Underline
  - Listeler (sıralı ve sırasız)
  - Bağlantılar
  - Görseller
  - Kod blokları
  - Alıntılar

## Kullanım

### Temel Kullanım

```tsx
import { BlogEditor } from "@/components/blog/admin";
import { useState } from "react";

export function MyBlogForm() {
  const [content, setContent] = useState("");

  return (
    <BlogEditor
      content={content}
      onChange={setContent}
      placeholder="Blog içeriğinizi yazın..."
    />
  );
}
```

### Görsel Yükleme ile Kullanım

```tsx
import { BlogEditor } from "@/components/blog/admin";
import { uploadBlogImage } from "@/lib/blog/image-upload";
import { useState } from "react";

export function MyBlogForm() {
  const [content, setContent] = useState("");

  const handleImageUpload = async (file: File): Promise<string> => {
    // Sunucuya yükle
    const url = await uploadBlogImage(file);
    return url;
  };

  return (
    <BlogEditor
      content={content}
      onChange={setContent}
      onImageUpload={handleImageUpload}
    />
  );
}
```

## API

### BlogEditor Props

| Prop | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `content` | `string` | ✅ | Editor içeriği (HTML) |
| `onChange` | `(content: string) => void` | ✅ | İçerik değiştiğinde çağrılır |
| `placeholder` | `string` | ❌ | Placeholder metni |
| `onImageUpload` | `(file: File) => Promise<string>` | ❌ | Görsel yükleme handler'ı |

### Utility Functions

#### Image Upload

```tsx
import { 
  uploadBlogImage, 
  validateImageFile, 
  compressImage,
  getImageDimensions 
} from "@/lib/blog/image-upload";

// Görsel yükle
const url = await uploadBlogImage(file);

// Görsel validasyonu
const validation = validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
}

// Görsel sıkıştır
const compressed = await compressImage(file, 1200);

// Görsel boyutlarını al
const { width, height } = await getImageDimensions(file);
```

#### Markdown Utils

```tsx
import {
  htmlToMarkdown,
  markdownToHtml,
  exportAsMarkdown,
  importMarkdownFile
} from "@/lib/blog/markdown-utils";

// HTML'den Markdown'a
const markdown = htmlToMarkdown(html);

// Markdown'dan HTML'e
const html = markdownToHtml(markdown);

// Markdown dışa aktar
exportAsMarkdown(html, "my-post.md");

// Markdown içe aktar
const html = await importMarkdownFile(file);
```

## Stil Özelleştirme

Editor içeriği için Tailwind Typography kullanılır:

```tsx
<EditorContent 
  editor={editor}
  className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
/>
```

Özel stiller eklemek için:

```css
.ProseMirror {
  /* Özel stilleriniz */
}
```

## Klavye Kısayolları

- **Bold**: `Ctrl/Cmd + B`
- **Italic**: `Ctrl/Cmd + I`
- **Undo**: `Ctrl/Cmd + Z`
- **Redo**: `Ctrl/Cmd + Shift + Z`
- **Heading 2**: `Ctrl/Cmd + Alt + 2`
- **Heading 3**: `Ctrl/Cmd + Alt + 3`

## Gereksinimler

### Yüklü Paketler

```json
{
  "@tiptap/react": "^3.10.7",
  "@tiptap/starter-kit": "^3.10.7",
  "@tiptap/extension-image": "^3.10.7",
  "@tiptap/extension-link": "^3.10.7",
  "@tiptap/extension-underline": "^3.10.7",
  "@tiptap/extension-text-align": "^3.10.7",
  "@tiptap/extension-placeholder": "^3.10.7"
}
```

## Notlar

- Editor client-side component'tir (`"use client"`)
- Görsel yükleme için backend API endpoint'i gereklidir (`/api/admin/blog/upload-image`)
- Markdown import/export tarayıcıda çalışır, sunucu gerektirmez
- Görsel sıkıştırma otomatik olarak yapılır (max 1200px genişlik)

## Gelecek Geliştirmeler

- [ ] Tablo desteği
- [ ] Video embed
- [ ] Syntax highlighting (kod blokları için)
- [ ] Emoji picker
- [ ] Mention (@kullanıcı)
- [ ] Hashtag (#etiket)
- [ ] Auto-save özelliği
- [ ] Collaboration (çoklu kullanıcı)
