# Blog Yorum Moderasyon API Dokümantasyonu

Bu dokümantasyon, blog yorum moderasyon sisteminin API endpoint'lerini açıklar.

## Endpoints

### 1. Yorum Listesi (Admin)

Bekleyen, onaylanmış, reddedilmiş veya spam olarak işaretlenmiş yorumları listeler.

**Endpoint:** `GET /api/admin/blog/comments`

**Auth:** Admin yetkisi gereklidir

**Query Parameters:**

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| `page` | number | Hayır | 1 | Sayfa numarası |
| `limit` | number | Hayır | 20 | Sayfa başına yorum sayısı |
| `status` | string | Hayır | PENDING | Yorum durumu (PENDING, APPROVED, REJECTED, SPAM) |
| `postId` | string | Hayır | - | Belirli bir blog yazısının yorumlarını filtrele |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc",
      "content": "Harika bir yazı, çok faydalı bilgiler!",
      "status": "PENDING",
      "createdAt": "2025-11-17T10:30:00.000Z",
      "updatedAt": "2025-11-17T10:30:00.000Z",
      "user": {
        "id": "clx456def",
        "name": "Ahmet Yılmaz",
        "username": "ahmetyilmaz",
        "image": "https://example.com/avatar.jpg",
        "email": "ahmet@example.com"
      },
      "post": {
        "id": "clx789ghi",
        "title": "Sağlıklı Beslenme İpuçları",
        "slug": "saglikli-beslenme-ipuclari"
      }
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

**Hata Durumları:**

- `401 Unauthorized`: Admin yetkisi yok
- `500 Internal Server Error`: Sunucu hatası

**Örnek Kullanım:**

```bash
# Bekleyen yorumları listele
curl -X GET "http://localhost:3000/api/admin/blog/comments?status=PENDING&page=1&limit=10" \
  -H "Cookie: session=..."

# Belirli bir blog yazısının yorumlarını listele
curl -X GET "http://localhost:3000/api/admin/blog/comments?postId=clx789ghi" \
  -H "Cookie: session=..."

# Onaylanmış yorumları listele
curl -X GET "http://localhost:3000/api/admin/blog/comments?status=APPROVED" \
  -H "Cookie: session=..."
```

---

### 2. Yorum Moderasyonu (Admin)

Bir yorumun durumunu günceller (onayla, reddet, spam işaretle).

**Endpoint:** `PUT /api/admin/blog/comments/[id]`

**Auth:** Admin yetkisi gereklidir

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| `id` | string | Yorumun benzersiz ID'si |

**Request Body:**

```json
{
  "status": "APPROVED" // PENDING, APPROVED, REJECTED, SPAM
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "content": "Harika bir yazı, çok faydalı bilgiler!",
    "status": "APPROVED",
    "createdAt": "2025-11-17T10:30:00.000Z",
    "updatedAt": "2025-11-17T10:35:00.000Z",
    "user": {
      "id": "clx456def",
      "name": "Ahmet Yılmaz",
      "username": "ahmetyilmaz",
      "image": "https://example.com/avatar.jpg",
      "email": "ahmet@example.com"
    },
    "post": {
      "id": "clx789ghi",
      "title": "Sağlıklı Beslenme İpuçları",
      "slug": "saglikli-beslenme-ipuclari"
    }
  },
  "message": "Yorum onaylandı"
}
```

**Hata Durumları:**

- `400 Bad Request`: Geçersiz status değeri
- `401 Unauthorized`: Admin yetkisi yok
- `404 Not Found`: Yorum bulunamadı
- `500 Internal Server Error`: Sunucu hatası

**Örnek Kullanım:**

```bash
# Yorumu onayla
curl -X PUT "http://localhost:3000/api/admin/blog/comments/clx123abc" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{"status": "APPROVED"}'

# Yorumu reddet
curl -X PUT "http://localhost:3000/api/admin/blog/comments/clx123abc" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{"status": "REJECTED"}'

# Yorumu spam olarak işaretle
curl -X PUT "http://localhost:3000/api/admin/blog/comments/clx123abc" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{"status": "SPAM"}'

# Yorumu tekrar beklemeye al
curl -X PUT "http://localhost:3000/api/admin/blog/comments/clx123abc" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{"status": "PENDING"}'
```

---

## Yorum Durumları (Status)

| Status | Açıklama |
|--------|----------|
| `PENDING` | Yorum admin onayı bekliyor (varsayılan) |
| `APPROVED` | Yorum onaylandı ve yayında |
| `REJECTED` | Yorum reddedildi |
| `SPAM` | Yorum spam olarak işaretlendi |

---

## Validation Kuralları

### Yorum Moderasyon

- `status`: Zorunlu, `PENDING`, `APPROVED`, `REJECTED` veya `SPAM` değerlerinden biri olmalı

---

## Güvenlik

### Authentication

Tüm admin endpoint'leri için:
- Kullanıcı giriş yapmış olmalı
- Kullanıcının rolü `ADMIN` olmalı

### Authorization

Admin olmayan kullanıcılar bu endpoint'lere erişemez ve `401 Unauthorized` hatası alır.

---

## Spam Filtreleme

Yorum oluşturma sırasında otomatik spam filtreleme yapılır:

1. **Rate Limiting**: 10 dakikada maksimum 5 yorum
2. **Duplicate Content**: Aynı içerik 1 saat içinde tekrar gönderilemez
3. **Uygunsuz İçerik**: Belirli kelimeler ve URL'ler engellenir

Spam olarak tespit edilen yorumlar otomatik olarak `PENDING` durumunda oluşturulur ve admin onayı bekler.

---

## Kullanım Senaryoları

### Senaryo 1: Bekleyen Yorumları Onaylama

1. Admin panelinde bekleyen yorumları listele:
   ```
   GET /api/admin/blog/comments?status=PENDING
   ```

2. Her yorumu incele ve uygun olanları onayla:
   ```
   PUT /api/admin/blog/comments/[id]
   Body: { "status": "APPROVED" }
   ```

### Senaryo 2: Spam Yorumları Temizleme

1. Spam olarak işaretlenmiş yorumları listele:
   ```
   GET /api/admin/blog/comments?status=SPAM
   ```

2. Gerekirse yorumları kalıcı olarak sil (veritabanından)

### Senaryo 3: Belirli Bir Blog Yazısının Yorumlarını Yönetme

1. Blog yazısının yorumlarını listele:
   ```
   GET /api/admin/blog/comments?postId=clx789ghi
   ```

2. Uygunsuz yorumları reddet veya spam işaretle:
   ```
   PUT /api/admin/blog/comments/[id]
   Body: { "status": "REJECTED" }
   ```

---

## Test

Test script'i çalıştırmak için:

```bash
npx tsx test-blog-comment-moderation.ts
```

Test script'i şunları kontrol eder:
- Yetkisiz erişim kontrolü
- Bekleyen yorumları listeleme
- Farklı statuslara göre filtreleme
- Yorum onaylama
- Yorum reddetme
- Spam işaretleme
- Geçersiz ID kontrolü

---

## Notlar

- Yorumlar soft delete yapılmaz, sadece status değiştirilir
- `REJECTED` ve `SPAM` yorumlar kullanıcılara gösterilmez
- Admin panelinde tüm yorumlar görüntülenebilir
- Yorum sayıları blog post'larda sadece `APPROVED` yorumları içerir

---

## İlgili Dokümantasyon

- [Blog API Dokümantasyonu](./BLOG_ADMIN_API.md)
- [Blog Yorum API Dokümantasyonu](./BLOG_COMMENT_API.md)
