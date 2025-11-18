# Blog İstatistikleri API Dokümantasyonu

## Genel Bakış

Blog sistemi için kapsamlı istatistikler sağlayan admin API endpoint'i.

## Endpoint

```
GET /api/admin/blog/stats
```

## Yetkilendirme

- **Gerekli Rol:** ADMIN
- **Auth:** Bearer Token veya Session Cookie

## Request

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Query Parameters
Yok

## Response

### Success Response (200 OK)

```json
{
  "overview": {
    "totalBlogs": 45,
    "publishedBlogs": 38,
    "draftBlogs": 7,
    "totalComments": 234,
    "pendingComments": 12,
    "approvedComments": 210,
    "totalViews": 15420,
    "avgReadingTime": 5
  },
  "trends": {
    "last7Days": 3,
    "last30Days": 12
  },
  "mostReadPosts": [
    {
      "id": "clx123...",
      "title": "10 Sağlıklı Beslenme İpucu",
      "slug": "10-saglikli-beslenme-ipucu",
      "viewCount": 1250,
      "publishedAt": "2024-01-15T10:00:00.000Z",
      "category": {
        "name": "Beslenme",
        "color": "#10b981"
      }
    }
    // ... 9 yazı daha
  ],
  "mostCommentedPosts": [
    {
      "id": "clx456...",
      "title": "Kilo Verme Rehberi",
      "slug": "kilo-verme-rehberi",
      "commentCount": 45
    }
    // ... 4 yazı daha
  ],
  "categoryDistribution": [
    {
      "id": "clx789...",
      "name": "Beslenme",
      "slug": "beslenme",
      "color": "#10b981",
      "icon": "🥗",
      "postCount": 15
    }
    // ... diğer kategoriler
  ]
}
```

## Response Alanları

### overview
Genel istatistikler

| Alan | Tip | Açıklama |
|------|-----|----------|
| `totalBlogs` | number | Toplam blog sayısı (silinmemiş) |
| `publishedBlogs` | number | Yayınlanmış blog sayısı |
| `draftBlogs` | number | Taslak blog sayısı |
| `totalComments` | number | Toplam yorum sayısı |
| `pendingComments` | number | Onay bekleyen yorum sayısı |
| `approvedComments` | number | Onaylanmış yorum sayısı |
| `totalViews` | number | Toplam görüntülenme sayısı |
| `avgReadingTime` | number | Ortalama okuma süresi (dakika) |

### trends
Zaman bazlı trendler

| Alan | Tip | Açıklama |
|------|-----|----------|
| `last7Days` | number | Son 7 günde yayınlanan blog sayısı |
| `last30Days` | number | Son 30 günde yayınlanan blog sayısı |

### mostReadPosts
En çok okunan yazılar (top 10)

| Alan | Tip | Açıklama |
|------|-----|----------|
| `id` | string | Blog ID |
| `title` | string | Blog başlığı |
| `slug` | string | Blog slug |
| `viewCount` | number | Görüntülenme sayısı |
| `publishedAt` | string | Yayınlanma tarihi (ISO 8601) |
| `category` | object | Kategori bilgisi (name, color) |

### mostCommentedPosts
En çok yorum alan yazılar (top 5)

| Alan | Tip | Açıklama |
|------|-----|----------|
| `id` | string | Blog ID |
| `title` | string | Blog başlığı |
| `slug` | string | Blog slug |
| `commentCount` | number | Onaylanmış yorum sayısı |

### categoryDistribution
Kategori dağılımı

| Alan | Tip | Açıklama |
|------|-----|----------|
| `id` | string | Kategori ID |
| `name` | string | Kategori adı |
| `slug` | string | Kategori slug |
| `color` | string | Kategori rengi (hex) |
| `icon` | string | Kategori ikonu (emoji) |
| `postCount` | number | Kategorideki yayınlanmış blog sayısı |

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Yetkisiz erişim"
}
```

Kullanıcı giriş yapmamış veya session geçersiz.

### 403 Forbidden
```json
{
  "error": "Bu işlem için admin yetkisi gerekli"
}
```

Kullanıcı admin değil.

### 500 Internal Server Error
```json
{
  "error": "İstatistikler alınırken bir hata oluştu"
}
```

Sunucu hatası.

## Kullanım Örnekleri

### JavaScript/TypeScript (fetch)

```typescript
async function getBlogStats() {
  const response = await fetch('/api/admin/blog/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('İstatistikler alınamadı');
  }

  const stats = await response.json();
  return stats;
}
```

### React Hook

```typescript
import { useEffect, useState } from 'react';

function useBlogStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/blog/stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
```

### cURL

```bash
curl -X GET \
  http://localhost:3000/api/admin/blog/stats \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

## Performans Notları

- Tüm istatistikler tek bir request'te paralel olarak hesaplanır (Promise.all)
- Veritabanı sorguları optimize edilmiştir (index kullanımı)
- Ortalama response süresi: ~200-500ms (blog sayısına bağlı)
- Cache stratejisi: İsteğe bağlı olarak Redis ile 5 dakika cache eklenebilir

## İlgili Endpoint'ler

- `GET /api/admin/blog` - Blog listesi
- `GET /api/admin/blog/comments` - Yorum moderasyonu
- `GET /api/admin/blog/categories` - Kategori yönetimi

## Değişiklik Geçmişi

| Versiyon | Tarih | Değişiklik |
|----------|-------|------------|
| 1.0.0 | 2024-11-17 | İlk versiyon |

## Notlar

- İstatistikler soft-delete yapılmış blogları içermez
- Sadece onaylanmış yorumlar sayılır
- Kategori dağılımı sadece yayınlanmış blogları içerir
- Trendler UTC timezone'a göre hesaplanır
