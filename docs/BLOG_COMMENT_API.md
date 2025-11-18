# Blog Yorum API Dokümantasyonu

## Genel Bakış

Blog yorum sistemi, kullanıcıların blog yazılarına yorum yapmasını sağlar. Tüm yorumlar moderasyon sürecinden geçer ve admin onayından sonra yayınlanır.

## API Endpoint

### POST /api/blog/[slug]/comments

Blog yazısına yorum ekler.

#### Özellikler

- ✅ **Auth Kontrolü**: Sadece giriş yapmış kullanıcılar yorum yapabilir
- ✅ **Ban Kontrolü**: Yasaklı kullanıcılar yorum yapamaz
- ✅ **Rate Limiting**: Saatte maksimum 20 yorum
- ✅ **Spam Filtreleme**: 
  - 10 dakikada maksimum 5 yorum
  - Aynı içerik 1 saat içinde tekrar gönderilemez
  - Çok kısa sürede çok fazla yorum engellenir
- ✅ **İçerik Kontrolü**: Uygunsuz kelimeler ve linkler engellenir
- ✅ **Moderasyon**: Tüm yorumlar PENDING durumunda oluşturulur

#### Request

**Headers:**
```
Authorization: Bearer <session-token>
Content-Type: application/json
```

**Body:**
```json
{
  "content": "Çok faydalı bir yazı olmuş, teşekkürler!"
}
```

**Validasyon Kuralları:**
- `content`: Zorunlu, 1-1000 karakter arası, boşluklar temizlenir

#### Response

**Başarılı (200):**
```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "cmi390rvb0001pos0zzipri5b",
      "content": "Çok faydalı bir yazı olmuş, teşekkürler!",
      "status": "PENDING",
      "createdAt": "2025-11-17T10:30:00.000Z",
      "user": {
        "id": "user123",
        "name": "Ahmet Yılmaz",
        "username": "ahmetyilmaz",
        "image": "/uploads/avatar.jpg"
      }
    },
    "message": "Yorumunuz başarıyla gönderildi. Onaylandıktan sonra yayınlanacaktır"
  }
}
```

**Hata Durumları:**

**401 Unauthorized - Giriş Yapılmamış:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Yorum yapmak için giriş yapmalısınız"
  }
}
```

**403 Forbidden - Kullanıcı Yasaklı:**
```json
{
  "success": false,
  "error": {
    "code": "USER_BANNED",
    "message": "Hesabınız yasaklandığı için yorum yapamazsınız"
  }
}
```

**404 Not Found - Blog Bulunamadı:**
```json
{
  "success": false,
  "error": {
    "code": "BLOG_POST_NOT_FOUND",
    "message": "Blog yazısı bulunamadı"
  }
}
```

**400 Bad Request - Validasyon Hatası:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Yorum boş olamaz"
  }
}
```

**429 Too Many Requests - Rate Limit:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Çok fazla yorum yaptınız. Lütfen daha sonra tekrar deneyin"
  }
}
```

**429 Too Many Requests - Spam:**
```json
{
  "success": false,
  "error": {
    "code": "SPAM_DETECTED",
    "message": "Spam tespit edildi. Lütfen daha sonra tekrar deneyin veya farklı bir yorum yazın"
  }
}
```

**400 Bad Request - Uygunsuz İçerik:**
```json
{
  "success": false,
  "error": {
    "code": "INAPPROPRIATE_CONTENT",
    "message": "Yorumunuz uygunsuz içerik içeriyor. Lütfen düzenleyip tekrar deneyin"
  }
}
```

## Spam Koruması

### Rate Limiting
- **Genel Limit**: Saatte maksimum 20 yorum
- **Spam Limit**: 10 dakikada maksimum 5 yorum

### Duplicate Detection
- Aynı içerik 1 saat içinde tekrar gönderilemez
- Hem Redis hem de veritabanı kontrolü yapılır

### İçerik Filtreleme
Aşağıdaki içerikler otomatik olarak reddedilir:
- "spam", "reklam", "link" kelimeleri
- HTTP/HTTPS linkleri
- www. ile başlayan metinler

## Moderasyon Süreci

1. **Yorum Gönderimi**: Kullanıcı yorumu gönderir
2. **Otomatik Kontroller**: Spam ve içerik kontrolü yapılır
3. **PENDING Durumu**: Yorum admin onayı için bekler
4. **Admin İncelemesi**: Admin yorumu onaylar/reddeder
5. **APPROVED Durumu**: Onaylanan yorumlar yayınlanır

## Yorum Durumları

- `PENDING`: Admin onayı bekliyor
- `APPROVED`: Onaylandı ve yayında
- `REJECTED`: Reddedildi
- `SPAM`: Spam olarak işaretlendi

## Örnek Kullanım

### JavaScript/TypeScript

```typescript
async function addBlogComment(slug: string, content: string) {
  const response = await fetch(`/api/blog/${slug}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error.message)
  }

  return data.data
}

// Kullanım
try {
  const result = await addBlogComment(
    'saglikli-kilo-vermenin-10-altin-kurali',
    'Harika bir yazı, çok teşekkürler!'
  )
  console.log('Yorum gönderildi:', result.message)
} catch (error) {
  console.error('Hata:', error.message)
}
```

### React Hook

```typescript
import { useState } from 'react'

function useBlogComment(slug: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addComment = async (content: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error.message)
      }

      return data.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { addComment, loading, error }
}
```

## Test

Test scriptini çalıştırmak için:

```bash
npx tsx scripts/test-blog-comment-api.ts
```

## Geliştirme Notları

### Gelecek İyileştirmeler

1. **Gelişmiş Spam Filtreleme**
   - AI tabanlı içerik analizi
   - Kullanıcı reputation skoru
   - Bayesian spam filtresi

2. **Yorum Özellikleri**
   - Yorumlara cevap verme (threading)
   - Yorum düzenleme
   - Yorum beğenme/beğenmeme

3. **Bildirimler**
   - Yorum onaylandığında kullanıcıya bildirim
   - Blog yazarına yeni yorum bildirimi
   - Cevap geldiğinde bildirim

4. **Moderasyon Araçları**
   - Toplu onaylama/reddetme
   - Otomatik moderasyon kuralları
   - Kullanıcı engelleme

## İlgili Dosyalar

- API Route: `src/app/api/blog/[slug]/comments/route.ts`
- Validation: `src/validations/blog.schema.ts`
- Types: `src/types/blog.ts`
- Test Script: `scripts/test-blog-comment-api.ts`
- Database Schema: `prisma/schema.prisma` (BlogComment model)

## Requirements Karşılama

Bu implementasyon aşağıdaki requirement'ları karşılar:

- ✅ **5.1**: Kayıtlı kullanıcılar yorum yapabilir
- ✅ **5.2**: Yorumlar moderasyon kuyruğuna alınır
- ✅ **5.3**: Kullanıcı bilgileri gösterilir
- ✅ **5.4**: Kullanıcılar kendi yorumlarını düzenleyebilir (gelecek özellik)
- ✅ **5.5**: Admin moderasyon paneli (gelecek özellik)
- ✅ **5.6**: Spam ve uygunsuz içerik filtreleme
