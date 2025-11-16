# Group API Documentation

## 📋 Endpoints

### Public Endpoints

#### GET /api/v1/groups
Tüm yayınlanmış grupları listele.

**Query Parameters:**
- `category` (string, optional) - general, motivation, recipes, exercise, support, age_based, goal_based, lifestyle
- `search` (string, optional) - Grup adı veya açıklamada ara
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "30'lu Yaşlar Motivasyon",
      "slug": "30lu-yaslar-motivasyon",
      "description": "30'lu yaşlarda zayıflama yolculuğunda olanlar için destek grubu",
      "image": "https://...",
      "category": "age_based",
      "isPublic": true,
      "maxMembers": 100,
      "memberCount": 45,
      "postCount": 234,
      "status": "published",
      "createdAt": "2024-01-15T10:00:00Z",
      "creator": {
        "id": "clx...",
        "username": "ayse_fit",
        "name": "Ayşe",
        "image": "https://..."
      },
      "_count": {
        "members": 45,
        "posts": 234
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

#### GET /api/v1/groups/:slug
Grup detayını getir.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "30'lu Yaşlar Motivasyon",
    "slug": "30lu-yaslar-motivasyon",
    "description": "30'lu yaşlarda zayıflama yolculuğunda olanlar için destek grubu",
    "image": "https://...",
    "category": "age_based",
    "isPublic": true,
    "maxMembers": 100,
    "memberCount": 45,
    "postCount": 234,
    "tags": "[\"motivasyon\",\"30lar\"]",
    "rules": "1. Saygılı olun\n2. Spam yapmayın",
    "status": "published",
    "publishedAt": "2024-01-15T12:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z",
    "creator": {
      "id": "clx...",
      "username": "ayse_fit",
      "name": "Ayşe",
      "image": "https://..."
    },
    "members": [
      {
        "id": "clx...",
        "role": "creator",
        "joinedAt": "2024-01-15T10:00:00Z",
        "user": {
          "id": "clx...",
          "username": "ayse_fit",
          "name": "Ayşe",
          "image": "https://..."
        }
      }
    ],
    "_count": {
      "members": 45,
      "posts": 234
    },
    "isMember": true,
    "memberRole": "member"
  }
}
```

---

### Authenticated Endpoints

#### POST /api/v1/groups
Yeni grup oluştur (admin onayı bekler).

**Headers:**
- `Authorization: Bearer <token>` (NextAuth session gerekli)

**Body:**
```json
{
  "name": "30'lu Yaşlar Motivasyon",
  "description": "30'lu yaşlarda zayıflama yolculuğunda olanlar için destek grubu",
  "category": "age_based",
  "isPublic": true,
  "maxMembers": 100,
  "tags": ["motivasyon", "30lar"],
  "rules": "1. Saygılı olun\n2. Spam yapmayın"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "30'lu Yaşlar Motivasyon",
    "slug": "30lu-yaslar-motivasyon",
    "status": "pending",
    ...
  },
  "message": "Grubunuz oluşturuldu ve admin onayı bekliyor."
}
```

**Errors:**
- `401 UNAUTHORIZED` - Giriş yapılmamış
- `400 VALIDATION_ERROR` - Geçersiz veri

---

#### DELETE /api/v1/groups/:slug
Grubu sil (sadece kurucu).

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Grup silindi"
  }
}
```

**Errors:**
- `401 UNAUTHORIZED` - Giriş yapılmamış
- `403 FORBIDDEN` - Grup kurucusu değil
- `404 NOT_FOUND` - Grup bulunamadı

---

#### POST /api/v1/groups/:slug/join
Gruba katıl.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Gruba katıldınız"
  }
}
```

**Errors:**
- `401 UNAUTHORIZED` - Giriş yapılmamış
- `400 ALREADY_MEMBER` - Zaten üye
- `400 GROUP_FULL` - Grup dolu
- `404 NOT_FOUND` - Grup bulunamadı

---

#### DELETE /api/v1/groups/:slug/join
Gruptan ayrıl.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Gruptan ayrıldınız"
  }
}
```

**Errors:**
- `401 UNAUTHORIZED` - Giriş yapılmamış
- `403 FORBIDDEN` - Grup kurucusu ayrılamaz
- `400 NOT_MEMBER` - Üye değil
- `404 NOT_FOUND` - Grup bulunamadı

---

#### GET /api/v1/groups/:slug/posts
Grup gönderilerini listele.

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
      "title": "İlk Haftam Bitti!",
      "body": "Bugün ilk haftamı tamamladım, 2kg verdim! 🎉",
      "images": "[\"https://...\"]",
      "likesCount": 12,
      "status": "visible",
      "isPinned": false,
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
    "total": 234,
    "totalPages": 12
  }
}
```

---

#### POST /api/v1/groups/:slug/posts
Gruba gönderi ekle (sadece üyeler).

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "İlk Haftam Bitti!",
  "body": "Bugün ilk haftamı tamamladım, 2kg verdim! 🎉",
  "images": ["https://..."]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "İlk Haftam Bitti!",
    "body": "Bugün ilk haftamı tamamladım, 2kg verdim! 🎉",
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

**Errors:**
- `401 UNAUTHORIZED` - Giriş yapılmamış
- `403 FORBIDDEN` - Grup üyesi değil
- `400 VALIDATION_ERROR` - Geçersiz veri

---

#### GET /api/v1/groups/my-groups
Kullanıcının oluşturduğu grupları listele.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "30'lu Yaşlar Motivasyon",
      "slug": "30lu-yaslar-motivasyon",
      "status": "published",
      "memberCount": 45,
      "postCount": 234,
      "createdAt": "2024-01-15T10:00:00Z",
      "_count": {
        "members": 45,
        "posts": 234
      }
    }
  ]
}
```

---

### Admin Endpoints

#### PATCH /api/v1/admin/groups/:id/approve
Grubu onayla ve yayınla.

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
- Grup yayınlanır
- Kurucuya bildirim gönderilir

---

#### PATCH /api/v1/admin/groups/:id/reject
Grubu reddet.

**Headers:**
- `Authorization: Bearer <token>` (ADMIN role gerekli)

**Body:**
```json
{
  "reason": "Grup kuralları belirsiz. Lütfen daha detaylı kurallar ekleyin."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "status": "rejected",
    "rejectionReason": "Grup kuralları belirsiz...",
    ...
  }
}
```

**Side Effects:**
- Grup reddedilir
- Kurucuya bildirim gönderilir (reddetme sebebiyle)

---

## 🔒 Authentication

Tüm authenticated endpoint'ler NextAuth session gerektirir.

Admin endpoint'leri için:
```typescript
if (session.user.role !== 'ADMIN') {
  return 403 FORBIDDEN
}
```

---

## 📊 Status Flow

```
pending → [admin review] → published ✅
                         → rejected ❌
```

- **pending:** Onay bekliyor
- **published:** Yayında
- **rejected:** Reddedildi (sebep ile)

---

## ✅ Validation Rules

### Name
- Min: 3 karakter
- Max: 100 karakter

### Description
- Max: 500 karakter

### Category
- Enum: general, motivation, recipes, exercise, support, age_based, goal_based, lifestyle

### Max Members
- Pozitif integer
- Null = sınırsız

### Tags
- Array of strings

### Rules
- Max: 1000 karakter

### Post Body
- Min: 1 karakter
- Max: 5000 karakter

### Post Images
- Max: 4 resim
- URL formatında olmalı

---

## 🎯 Usage Examples

### Frontend Fetch Example

```typescript
// List groups
const response = await fetch('/api/v1/groups?category=motivation&page=1')
const { data, meta } = await response.json()

// Get group detail
const group = await fetch('/api/v1/groups/30lu-yaslar-motivasyon')
const { data } = await group.json()

// Create group (authenticated)
const newGroup = await fetch('/api/v1/groups', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '30\'lu Yaşlar Motivasyon',
    description: '...',
    category: 'age_based',
    isPublic: true,
  }),
})

// Join group
const join = await fetch('/api/v1/groups/30lu-yaslar-motivasyon/join', {
  method: 'POST',
})

// Create post
const post = await fetch('/api/v1/groups/30lu-yaslar-motivasyon/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'İlk Haftam!',
    body: '2kg verdim! 🎉',
  }),
})
```

---

## ✅ Completed Features

- ✅ GET /api/v1/groups (list with filters)
- ✅ POST /api/v1/groups (create with approval)
- ✅ GET /api/v1/groups/:slug (detail)
- ✅ DELETE /api/v1/groups/:slug (delete)
- ✅ POST /api/v1/groups/:slug/join (join)
- ✅ DELETE /api/v1/groups/:slug/join (leave)
- ✅ GET /api/v1/groups/:slug/posts (list posts)
- ✅ POST /api/v1/groups/:slug/posts (create post)
- ✅ GET /api/v1/groups/my-groups (user's groups)
- ✅ PATCH /api/v1/admin/groups/:id/approve (approve)
- ✅ PATCH /api/v1/admin/groups/:id/reject (reject)

---

## 🎉 Group API is Complete!

Tüm CRUD operasyonları, moderasyon, üyelik yönetimi, gönderi sistemi hazır!

## 🔄 Grup Kategorileri

- **general:** Genel
- **motivation:** Motivasyon
- **recipes:** Tarifler
- **exercise:** Egzersiz
- **support:** Destek
- **age_based:** Yaş Grupları (20'ler, 30'lar, vb.)
- **goal_based:** Hedef Bazlı (10kg, 20kg, vb.)
- **lifestyle:** Yaşam Tarzı (Vegan, Keto, vb.)

## 🎯 Kullanım Senaryosu

1. Ayşe "30'lu Yaşlar Motivasyon" grubu oluşturur
2. Admin grubu onaylar
3. Mehmet gruba katılır
4. Mehmet "İlk haftam bitti, 2kg verdim!" diye gönderi paylaşır
5. Diğer üyeler beğenir ve yorum yapar
6. Topluluk desteği ile motivasyon artar
