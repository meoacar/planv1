# Recipe API Documentation

## 📋 Endpoints

### Public Endpoints

#### GET /api/v1/recipes
Liste tüm yayınlanmış tarifleri.

**Query Parameters:**
- `search` (string, optional) - Başlık veya açıklamada ara
- `category` (string, optional) - breakfast, lunch, dinner, snack, dessert, drink, main, side, salad, soup
- `mealType` (string, optional) - breakfast, lunch, dinner, snack
- `difficulty` (string, optional) - easy, medium, hard
- `maxCalories` (number, optional) - Maksimum kalori
- `authorId` (string, optional) - Belirli bir kullanıcının tarifleri
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "izgara-tavuk-salata",
      "title": "Izgara Tavuk Salata",
      "description": "Protein dolu, düşük kalorili öğle yemeği",
      "category": "main",
      "mealType": "lunch",
      "difficulty": "easy",
      "calories": 350,
      "protein": 45,
      "carbs": 20,
      "fat": 10,
      "servings": 2,
      "prepTime": 15,
      "cookTime": 20,
      "views": 1234,
      "likesCount": 89,
      "commentsCount": 23,
      "isFeatured": false,
      "status": "published",
      "createdAt": "2024-01-15T10:00:00Z",
      "author": {
        "id": "clx...",
        "username": "ayse_fit",
        "name": "Ayşe",
        "image": "https://..."
      },
      "_count": {
        "likes": 89,
        "comments": 23
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```

---

#### GET /api/v1/recipes/featured
Öne çıkan tarifleri listele.

**Query Parameters:**
- `limit` (number, optional, default: 6)

**Response:** Yukarıdaki ile aynı format

---

#### GET /api/v1/recipes/:slug
Tarif detayını getir (view sayısını artırır).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "slug": "izgara-tavuk-salata",
    "title": "Izgara Tavuk Salata",
    "description": "Protein dolu, düşük kalorili öğle yemeği",
    "ingredients": "[{\"name\":\"Tavuk göğsü\",\"amount\":\"200\",\"unit\":\"gr\"}]",
    "instructions": "1. Tavuğu marine edin...",
    "images": "[\"https://...\"]",
    "videoUrl": "https://youtube.com/...",
    "tags": "[\"protein\",\"düşük-kalori\"]",
    "category": "main",
    "mealType": "lunch",
    "difficulty": "easy",
    "calories": 350,
    "protein": 45,
    "carbs": 20,
    "fat": 10,
    "fiber": 5,
    "servings": 2,
    "prepTime": 15,
    "cookTime": 20,
    "views": 1235,
    "likesCount": 89,
    "commentsCount": 23,
    "isFeatured": false,
    "status": "published",
    "publishedAt": "2024-01-15T12:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z",
    "author": {
      "id": "clx...",
      "username": "ayse_fit",
      "name": "Ayşe",
      "image": "https://...",
      "bio": "Sağlıklı yaşam tutkunu"
    },
    "_count": {
      "likes": 89,
      "comments": 23
    }
  }
}
```

---

### Authenticated Endpoints

#### POST /api/v1/recipes
Yeni tarif oluştur (onay bekler).

**Headers:**
- `Authorization: Bearer <token>` (NextAuth session gerekli)

**Rate Limit:** 10 tarif/saat

**Body:**
```json
{
  "title": "Izgara Tavuk Salata",
  "description": "Protein dolu, düşük kalorili öğle yemeği. Spor sonrası ideal!",
  "ingredients": [
    {
      "name": "Tavuk göğsü",
      "amount": "200",
      "unit": "gr"
    },
    {
      "name": "Marul",
      "amount": "1",
      "unit": "kase"
    }
  ],
  "instructions": "1. Tavuğu marine edin\n2. Izgarada pişirin\n3. Salatayı hazırlayın",
  "prepTime": 15,
  "cookTime": 20,
  "servings": 2,
  "calories": 350,
  "protein": 45,
  "carbs": 20,
  "fat": 10,
  "fiber": 5,
  "category": "main",
  "mealType": "lunch",
  "difficulty": "easy",
  "tags": ["protein", "düşük-kalori", "spor"],
  "images": ["https://..."],
  "videoUrl": "https://youtube.com/..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "slug": "izgara-tavuk-salata",
    "status": "pending",
    ...
  }
}
```

**Errors:**
- `401 UNAUTHORIZED` - Giriş yapılmamış
- `429 RATE_LIMIT` - Çok fazla tarif oluşturma
- `400 VALIDATION_ERROR` - Geçersiz veri

---

#### PATCH /api/v1/recipes/:slug
Tarifi güncelle (sadece sahibi).

**Headers:**
- `Authorization: Bearer <token>`

**Body:** POST ile aynı (tüm alanlar opsiyonel)

**Response:** POST ile aynı

**Errors:**
- `401 UNAUTHORIZED` - Giriş yapılmamış
- `403 FORBIDDEN` - Tarif sahibi değil
- `404 NOT_FOUND` - Tarif bulunamadı

---

#### DELETE /api/v1/recipes/:slug
Tarifi sil (sadece sahibi veya admin).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Tarif silindi"
  }
}
```

---

#### GET /api/v1/recipes/:slug/like
Kullanıcının tarifi beğenip beğenmediğini kontrol et.

**Headers:**
- `Authorization: Bearer <token>` (opsiyonel)

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true
  }
}
```

---

#### POST /api/v1/recipes/:slug/like
Tarifi beğen/beğeniyi kaldır (toggle).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true
  }
}
```

---

#### GET /api/v1/recipes/:slug/comments
Tarif yorumlarını listele.

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "body": "Harika bir tarif, denedim çok beğendim!",
      "status": "visible",
      "createdAt": "2024-01-15T14:30:00Z",
      "author": {
        "id": "clx...",
        "username": "mehmet_keto",
        "name": "Mehmet",
        "image": "https://..."
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 23,
    "totalPages": 2
  }
}
```

---

#### POST /api/v1/recipes/:slug/comments
Tarife yorum ekle.

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
```json
{
  "body": "Harika bir tarif, denedim çok beğendim!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "body": "Harika bir tarif, denedim çok beğendim!",
    "status": "visible",
    "createdAt": "2024-01-15T14:30:00Z",
    "author": {
      "id": "clx...",
      "username": "mehmet_keto",
      "name": "Mehmet",
      "image": "https://..."
    }
  }
}
```

---

### Admin Endpoints

#### GET /api/v1/admin/recipes
Tüm tarifleri listele (moderasyon için).

**Headers:**
- `Authorization: Bearer <token>` (ADMIN role gerekli)

**Query Parameters:**
- `status` (string, optional, default: "pending") - pending, published, rejected, all
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "izgara-tavuk-salata",
      "title": "Izgara Tavuk Salata",
      "status": "pending",
      "createdAt": "2024-01-15T10:00:00Z",
      "author": {
        "id": "clx...",
        "username": "ayse_fit",
        "name": "Ayşe",
        "email": "ayse@example.com",
        "image": "https://..."
      },
      "_count": {
        "likes": 0,
        "comments": 0
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

#### PATCH /api/v1/admin/recipes/:id/approve
Tarifi onayla ve yayınla.

**Headers:**
- `Authorization: Bearer <token>` (ADMIN role gerekli)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "status": "published",
    "publishedAt": "2024-01-15T15:00:00Z",
    ...
  }
}
```

**Side Effects:**
- Tarif yayınlanır
- Yazara bildirim gönderilir
- Yazar Guild XP kazanır

---

#### PATCH /api/v1/admin/recipes/:id/reject
Tarifi reddet.

**Headers:**
- `Authorization: Bearer <token>` (ADMIN role gerekli)

**Body:**
```json
{
  "reason": "Tarif adımları eksik ve anlaşılır değil. Lütfen daha detaylı açıklama ekleyin."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "status": "rejected",
    "rejectionReason": "Tarif adımları eksik...",
    ...
  }
}
```

**Side Effects:**
- Tarif reddedilir
- Yazara bildirim gönderilir (reddetme sebebiyle)

---

## 🔒 Authentication

Tüm authenticated endpoint'ler NextAuth session gerektirir:

```typescript
const session = await auth()
if (!session?.user) {
  return 401 UNAUTHORIZED
}
```

Admin endpoint'leri için:

```typescript
if (session.user.role !== 'ADMIN') {
  return 403 FORBIDDEN
}
```

---

## 🚦 Rate Limiting

- **Recipe Creation:** 10 tarif/saat per user
- **Comments:** 20 yorum/saat per user (plan API'sinde tanımlı)
- **Likes:** 30 beğeni/dakika per user (plan API'sinde tanımlı)

---

## 📊 Status Flow

```
draft → pending → [admin review] → published ✅
                                 → rejected ❌
```

- **draft:** Kullanıcı taslak olarak kaydetti (şu an kullanılmıyor)
- **pending:** Onay bekliyor
- **published:** Yayında
- **rejected:** Reddedildi (sebep ile)

---

## ✅ Validation Rules

### Title
- Min: 5 karakter
- Max: 100 karakter

### Description
- Min: 20 karakter
- Max: 2000 karakter

### Ingredients
- Min: 1 malzeme
- Her malzeme: name (required), amount (required), unit (optional)

### Instructions
- Min: 50 karakter
- Max: 5000 karakter

### Servings
- Min: 1
- Max: 50

### Times (prepTime, cookTime)
- Min: 0
- Max: 1440 (24 saat)

### Nutrition (calories, protein, carbs, fat, fiber)
- Min: 0
- Max: 10000 (calories), 1000 (others)

### Images
- Max: 4 resim
- URL formatında olmalı

### Tags
- Max: 10 tag

---

## 🎯 Usage Examples

### Frontend Fetch Example

```typescript
// List recipes
const response = await fetch('/api/v1/recipes?category=breakfast&difficulty=easy&page=1')
const { data, meta } = await response.json()

// Get recipe detail
const recipe = await fetch('/api/v1/recipes/izgara-tavuk-salata')
const { data } = await recipe.json()

// Create recipe (authenticated)
const newRecipe = await fetch('/api/v1/recipes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Izgara Tavuk Salata',
    description: '...',
    ingredients: [...],
    instructions: '...',
    category: 'main',
    difficulty: 'easy',
    servings: 2,
  }),
})

// Like recipe
const like = await fetch('/api/v1/recipes/izgara-tavuk-salata/like', {
  method: 'POST',
})

// Add comment
const comment = await fetch('/api/v1/recipes/izgara-tavuk-salata/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    body: 'Harika tarif!',
  }),
})
```

---

## ✅ Completed Features

- ✅ GET /api/v1/recipes (list with filters)
- ✅ POST /api/v1/recipes (create with rate limit)
- ✅ GET /api/v1/recipes/:slug (detail + view increment)
- ✅ PATCH /api/v1/recipes/:slug (update)
- ✅ DELETE /api/v1/recipes/:slug (delete)
- ✅ GET /api/v1/recipes/:slug/like (check like status)
- ✅ POST /api/v1/recipes/:slug/like (toggle like)
- ✅ GET /api/v1/recipes/:slug/comments (list comments)
- ✅ POST /api/v1/recipes/:slug/comments (add comment)
- ✅ GET /api/v1/recipes/featured (featured recipes)
- ✅ GET /api/v1/admin/recipes (admin list)
- ✅ PATCH /api/v1/admin/recipes/:id/approve (approve)
- ✅ PATCH /api/v1/admin/recipes/:id/reject (reject)

---

## 🎉 Recipe API is Complete!

Tüm CRUD operasyonları, moderasyon, sosyal özellikler (beğeni, yorum) hazır!
