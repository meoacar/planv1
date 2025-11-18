# Blog Admin API Dokümantasyonu

Bu dokümantasyon, blog yönetimi için admin API endpoint'lerini açıklar.

## Kimlik Doğrulama

Tüm admin endpoint'leri **ADMIN** rolüne sahip kullanıcı oturumu gerektirir.

## Endpoints

### 1. Blog Oluştur

**POST** `/api/admin/blog`

Yeni bir blog yazısı oluşturur.

#### Request Body

```json
{
  "title": "Blog Başlığı",
  "slug": "blog-basligi", // Opsiyonel, otomatik oluşturulur
  "content": "Blog içeriği (HTML destekli)",
  "excerpt": "Kısa özet", // Opsiyonel, otomatik oluşturulur
  "coverImage": "https://example.com/image.jpg", // Opsiyonel
  "coverImageAlt": "Görsel açıklaması", // Opsiyonel
  "metaTitle": "SEO Başlığı", // Opsiyonel
  "metaDescription": "SEO Açıklaması", // Opsiyonel
  "categoryId": "clxxx...",
  "tags": ["beslenme", "sağlık"], // Opsiyonel
  "status": "DRAFT", // DRAFT, PUBLISHED, ARCHIVED
  "featured": false, // Opsiyonel
  "featuredOrder": 1 // Opsiyonel (0-10)
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "title": "Blog Başlığı",
    "slug": "blog-basligi",
    "content": "...",
    "excerpt": "...",
    "coverImage": "...",
    "status": "DRAFT",
    "readingTime": 5,
    "viewCount": 0,
    "featured": false,
    "author": {
      "id": "...",
      "name": "Admin",
      "username": "admin",
      "image": "..."
    },
    "category": {
      "id": "...",
      "name": "Beslenme",
      "slug": "beslenme"
    },
    "tags": [
      {
        "id": "...",
        "name": "beslenme",
        "slug": "beslenme"
      }
    ],
    "createdAt": "2025-11-17T...",
    "updatedAt": "2025-11-17T...",
    "publishedAt": null
  }
}
```

---

### 2. Blog Listesi (Admin)

**GET** `/api/admin/blog`

Admin için blog listesini getirir (soft delete edilenler hariç).

#### Query Parameters

- `page` (number, default: 1) - Sayfa numarası
- `limit` (number, default: 20) - Sayfa başına kayıt
- `status` (string) - Durum filtresi (DRAFT, PUBLISHED, ARCHIVED)
- `categoryId` (string) - Kategori filtresi
- `search` (string) - Başlık ve içerikte arama

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "slug": "...",
      "excerpt": "...",
      "status": "PUBLISHED",
      "featured": false,
      "viewCount": 150,
      "readingTime": 5,
      "author": { ... },
      "category": { ... },
      "tags": [ ... ],
      "_count": {
        "comments": 12
      },
      "createdAt": "...",
      "publishedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### 3. Blog Detay (Admin)

**GET** `/api/admin/blog/[id]`

Belirli bir blog yazısının detayını getirir.

#### Response

```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "slug": "...",
    "content": "...",
    "excerpt": "...",
    "coverImage": "...",
    "coverImageAlt": "...",
    "metaTitle": "...",
    "metaDescription": "...",
    "status": "PUBLISHED",
    "featured": false,
    "featuredOrder": null,
    "viewCount": 150,
    "readingTime": 5,
    "author": { ... },
    "category": { ... },
    "tags": [ ... ],
    "_count": {
      "comments": 12
    },
    "createdAt": "...",
    "updatedAt": "...",
    "publishedAt": "..."
  }
}
```

---

### 4. Blog Güncelle

**PUT** `/api/admin/blog/[id]`

Mevcut bir blog yazısını günceller.

#### Request Body

Tüm alanlar opsiyoneldir. Sadece güncellemek istediğiniz alanları gönderin.

```json
{
  "title": "Güncellenmiş Başlık",
  "content": "Güncellenmiş içerik",
  "status": "PUBLISHED",
  "categoryId": "clxxx...",
  "tags": ["yeni", "etiketler"]
}
```

#### Response

```json
{
  "success": true,
  "data": {
    // Güncellenmiş blog verisi
  }
}
```

---

### 5. Blog Sil (Soft Delete)

**DELETE** `/api/admin/blog/[id]`

Blog yazısını soft delete yapar (veritabanından silmez, sadece `deletedAt` alanını doldurur).

#### Response

```json
{
  "success": true,
  "message": "Blog yazısı başarıyla silindi"
}
```

---

### 6. Blog Yayınla

**POST** `/api/admin/blog/[id]/publish`

Taslak bir blog yazısını yayınlar.

#### Response

```json
{
  "success": true,
  "message": "Blog yazısı başarıyla yayınlandı",
  "data": {
    // Güncellenmiş blog verisi
    "status": "PUBLISHED",
    "publishedAt": "2025-11-17T..."
  }
}
```

---

### 7. Blog Öne Çıkar

**POST** `/api/admin/blog/[id]/feature`

Blog yazısını öne çıkarır veya öne çıkarılmış listesinden kaldırır.

**Not:** Maksimum 3 blog yazısı öne çıkarılabilir.

#### Request Body

```json
{
  "featured": true,
  "featuredOrder": 1 // 0-10 arası (opsiyonel)
}
```

#### Response

```json
{
  "success": true,
  "message": "Blog yazısı öne çıkarıldı",
  "data": {
    // Güncellenmiş blog verisi
    "featured": true,
    "featuredOrder": 1
  }
}
```

---

### 8. Kategori Oluştur

**POST** `/api/admin/blog/categories`

Yeni bir blog kategorisi oluşturur.

#### Request Body

```json
{
  "name": "Kategori Adı",
  "slug": "kategori-adi", // Opsiyonel, otomatik oluşturulur
  "description": "Kategori açıklaması", // Opsiyonel
  "icon": "🍎", // Opsiyonel (emoji veya icon adı)
  "color": "#FF5733", // Opsiyonel (hex renk kodu)
  "order": 0 // Opsiyonel (sıralama için)
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "name": "Kategori Adı",
    "slug": "kategori-adi",
    "description": "Kategori açıklaması",
    "icon": "🍎",
    "color": "#FF5733",
    "order": 0,
    "createdAt": "2025-11-17T...",
    "updatedAt": "2025-11-17T..."
  }
}
```

---

### 9. Kategori Listesi

**GET** `/api/admin/blog/categories`

Tüm kategorileri listeler (blog yazısı sayısı ile birlikte).

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx...",
      "name": "Beslenme",
      "slug": "beslenme",
      "description": "Beslenme ile ilgili yazılar",
      "icon": "🍎",
      "color": "#FF5733",
      "order": 0,
      "_count": {
        "posts": 15
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 10. Kategori Güncelle

**PUT** `/api/admin/blog/categories/[id]`

Mevcut bir kategoriyi günceller.

#### Request Body

Tüm alanlar opsiyoneldir. Sadece güncellemek istediğiniz alanları gönderin.

```json
{
  "name": "Güncellenmiş Kategori Adı",
  "description": "Yeni açıklama",
  "color": "#00FF00"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "clxxx...",
    "name": "Güncellenmiş Kategori Adı",
    "slug": "guncellenmiş-kategori-adi",
    "description": "Yeni açıklama",
    "icon": "🍎",
    "color": "#00FF00",
    "order": 0,
    "_count": {
      "posts": 15
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 11. Kategori Sil

**DELETE** `/api/admin/blog/categories/[id]`

Kategoriyi siler. **Önemli:** Kategoriye ait blog yazısı varsa silme işlemi başarısız olur.

#### Response (Başarılı)

```json
{
  "success": true,
  "message": "Kategori başarıyla silindi"
}
```

#### Response (Başarısız - Blog Yazısı Var)

```json
{
  "error": "Bu kategoriye ait blog yazıları var. Önce blog yazılarını silmeniz veya başka bir kategoriye taşımanız gerekiyor.",
  "postCount": 15
}
```

---

## Hata Kodları

- **400** - Geçersiz veri (validation hatası)
- **401** - Yetkisiz erişim (admin değil)
- **404** - Blog yazısı bulunamadı
- **500** - Sunucu hatası

## Validation Kuralları

### Blog Post

- `title`: 5-200 karakter
- `slug`: 3-200 karakter, sadece küçük harf, rakam ve tire
- `content`: Minimum 100 karakter
- `excerpt`: Maksimum 300 karakter
- `metaTitle`: Maksimum 60 karakter
- `metaDescription`: Maksimum 160 karakter
- `tags`: Maksimum 10 etiket
- `featuredOrder`: 0-10 arası

### Blog Category

- `name`: 2-50 karakter, benzersiz olmalı
- `slug`: 2-50 karakter, sadece küçük harf, rakam ve tire, benzersiz olmalı
- `description`: Maksimum 500 karakter
- `icon`: Maksimum 50 karakter (emoji veya icon adı)
- `color`: Geçerli hex renk kodu (#RRGGBB formatında)
- `order`: 0 veya pozitif tam sayı

### Otomatik İşlemler

#### Blog Post

1. **Slug Oluşturma**: Başlıktan otomatik slug oluşturulur (Türkçe karakter desteği)
2. **Okuma Süresi**: İçerik kelime sayısına göre otomatik hesaplanır (200 kelime/dakika)
3. **Excerpt**: Belirtilmezse içeriğin ilk 300 karakteri alınır
4. **Meta Title**: Belirtilmezse başlık kullanılır
5. **Meta Description**: Belirtilmezse excerpt kullanılır
6. **Published At**: Status PUBLISHED'a değiştiğinde otomatik set edilir

#### Blog Category

1. **Slug Oluşturma**: Kategori adından otomatik slug oluşturulur (Türkçe karakter desteği)
2. **Benzersizlik Kontrolü**: Hem isim hem slug benzersiz olmalıdır
3. **Silme Koruması**: Kategoriye ait blog yazısı varsa kategori silinemez

## Örnek Kullanım

### cURL ile Blog Oluşturma

```bash
curl -X POST http://localhost:3000/api/admin/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sağlıklı Beslenme İpuçları",
    "content": "Bu yazıda sağlıklı beslenme hakkında önemli ipuçları paylaşacağız...",
    "categoryId": "clxxx...",
    "tags": ["beslenme", "sağlık"],
    "status": "DRAFT"
  }'
```

### JavaScript ile Blog Güncelleme

```javascript
const response = await fetch('/api/admin/blog/clxxx...', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Güncellenmiş Başlık',
    status: 'PUBLISHED',
  }),
})

const data = await response.json()
console.log(data)
```

### JavaScript ile Kategori Oluşturma

```javascript
const response = await fetch('/api/admin/blog/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Beslenme',
    description: 'Sağlıklı beslenme ile ilgili yazılar',
    icon: '🍎',
    color: '#FF5733',
    order: 0,
  }),
})

const data = await response.json()
console.log(data)
```

### JavaScript ile Kategori Silme

```javascript
const response = await fetch('/api/admin/blog/categories/clxxx...', {
  method: 'DELETE',
})

const data = await response.json()
if (data.success) {
  console.log('Kategori silindi')
} else {
  console.error('Hata:', data.error)
  if (data.postCount) {
    console.log(`Bu kategoride ${data.postCount} blog yazısı var`)
  }
}
```
