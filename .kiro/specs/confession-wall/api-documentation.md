# İtiraf Duvarı API Dokümantasyonu

## Genel Bilgiler

**Base URL:** `https://yourdomain.com/api`

**Authentication:** NextAuth session-based authentication (cookie)

**Content-Type:** `application/json`

**Rate Limiting:**
- İtiraf oluşturma: 3/gün per user
- Empati gösterme: 100/saat per user
- Rapor etme: 10/gün per user
- Genel API: 100 req/dakika per IP

---

## Public Endpoints

### 1. İtiraf Listesi (Feed)

**Endpoint:** `GET /api/v1/confessions`

**Açıklama:** İtirafları listeler, filtreleme ve sayfalama destekler.

**Authentication:** Required

**Query Parameters:**

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| page | number | Hayır | 1 | Sayfa numarası |
| limit | number | Hayır | 20 | Sayfa başına kayıt (max: 50) |
| category | string | Hayır | - | Kategori filtresi (night_attack, special_occasion, stress_eating, social_pressure, no_regrets, seasonal) |
| popular | boolean | Hayır | false | Sadece popüler itirafları göster (100+ empati) |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "clx123abc",
        "content": "Dün gece buzdolabına gittim ve yarım kilo dondurma bitirdim...",
        "category": "night_attack",
        "aiResponse": "Gece saldırıları hepimizin başına gelir! Önemli olan bunun bir alışkanlık haline gelmemesi. Yarın yeni bir gün! 💪",
        "aiTone": "empathetic",
        "telafiBudget": {
          "action": "Bugün 30 dakika tempolu yürüyüş yap",
          "xpReward": 15
        },
        "empathyCount": 42,
        "isPopular": false,
        "createdAt": "2025-11-17T23:45:00Z",
        "hasEmpathized": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasMore": true
    }
  }
}
```

**Hata Response (401):**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Bu işlem için giriş yapmalısınız"
  }
}
```

**Örnek Kullanım:**

```bash
# Tüm itirafları getir
curl -X GET "https://yourdomain.com/api/v1/confessions" \
  -H "Cookie: next-auth.session-token=..."

# Gece saldırıları kategorisini getir
curl -X GET "https://yourdomain.com/api/v1/confessions?category=night_attack&page=1&limit=10" \
  -H "Cookie: next-auth.session-token=..."

# Popüler itirafları getir
curl -X GET "https://yourdomain.com/api/v1/confessions?popular=true" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 2. Yeni İtiraf Oluştur

**Endpoint:** `POST /api/v1/confessions`

**Açıklama:** Yeni bir itiraf oluşturur. AI otomatik olarak yanıt üretir (async).

**Authentication:** Required

**Request Body:**

```json
{
  "content": "Bugün arkadaşlarla çıktık ve 3 dilim pizza yedim. Pişman değilim!",
  "category": "social_pressure"
}
```

**Body Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| content | string | Evet | İtiraf metni (10-500 karakter) |
| category | string | Hayır | Kategori (belirtilmezse AI otomatik tespit eder) |

**Başarılı Response (201):**

```json
{
  "success": true,
  "data": {
    "confession": {
      "id": "clx456def",
      "content": "Bugün arkadaşlarla çıktık ve 3 dilim pizza yedim. Pişman değilim!",
      "category": "social_pressure",
      "aiResponse": "Sosyal anlar yaşamın tadını çıkarmak için var! 3 dilim pizza seni mutlu ettiyse, bu da bir değer. Yarın dengeni kurarsın! 🍕",
      "aiTone": "humorous",
      "telafiBudget": {
        "action": "Yarın öğle yemeğinde salata tercih et",
        "xpReward": 15
      },
      "empathyCount": 0,
      "isPopular": false,
      "status": "published",
      "createdAt": "2025-11-17T14:30:00Z"
    },
    "rewards": {
      "xp": 10,
      "coins": 5,
      "badges": ["confession_first"]
    }
  }
}
```

**Hata Response (400 - Validasyon):**

```json
{
  "success": false,
  "error": {
    "code": "CONTENT_TOO_SHORT",
    "message": "İtiraf en az 10 karakter olmalı"
  }
}
```

**Hata Response (429 - Rate Limit):**

```json
{
  "success": false,
  "error": {
    "code": "DAILY_LIMIT_EXCEEDED",
    "message": "Günlük itiraf limitine ulaştınız (3/3). Yarın tekrar deneyin."
  }
}
```

**Hata Response (400 - Spam):**

```json
{
  "success": false,
  "error": {
    "code": "SPAM_DETECTED",
    "message": "Spam tespit edildi, lütfen daha sonra tekrar deneyin"
  }
}
```

**Örnek Kullanım:**

```bash
curl -X POST "https://yourdomain.com/api/v1/confessions" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "content": "Bugün arkadaşlarla çıktık ve 3 dilim pizza yedim. Pişman değilim!",
    "category": "social_pressure"
  }'
```

---

### 3. Tekil İtiraf Detayı

**Endpoint:** `GET /api/v1/confessions/[id]`

**Açıklama:** Belirli bir itirafın detaylarını getirir.

**Authentication:** Required

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| id | string | İtiraf ID'si |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "content": "Dün gece buzdolabına gittim ve yarım kilo dondurma bitirdim...",
    "category": "night_attack",
    "aiResponse": "Gece saldırıları hepimizin başına gelir! Önemli olan bunun bir alışkanlık haline gelmemesi. Yarın yeni bir gün! 💪",
    "aiTone": "empathetic",
    "telafiBudget": {
      "action": "Bugün 30 dakika tempolu yürüyüş yap",
      "xpReward": 15
    },
    "empathyCount": 42,
    "isPopular": false,
    "createdAt": "2025-11-17T23:45:00Z",
    "hasEmpathized": true
  }
}
```

**Hata Response (404):**

```json
{
  "success": false,
  "error": {
    "code": "CONFESSION_NOT_FOUND",
    "message": "İtiraf bulunamadı"
  }
}
```

**Örnek Kullanım:**

```bash
curl -X GET "https://yourdomain.com/api/v1/confessions/clx123abc" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 4. Empati Göster

**Endpoint:** `POST /api/v1/confessions/[id]/empathy`

**Açıklama:** Bir itirafa "Benimki de vardı" diyerek empati gösterir.

**Authentication:** Required

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| id | string | İtiraf ID'si |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "empathyCount": 43,
    "xpEarned": 2,
    "badges": []
  }
}
```

**Hata Response (400 - Duplicate):**

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_EMPATHIZED",
    "message": "Bu itirafa zaten empati gösterdiniz"
  }
}
```

**Örnek Kullanım:**

```bash
curl -X POST "https://yourdomain.com/api/v1/confessions/clx123abc/empathy" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 5. Empatiyi Geri Al

**Endpoint:** `DELETE /api/v1/confessions/[id]/empathy`

**Açıklama:** Daha önce gösterilen empatiyi geri alır.

**Authentication:** Required

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| id | string | İtiraf ID'si |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "empathyCount": 42
  }
}
```

**Örnek Kullanım:**

```bash
curl -X DELETE "https://yourdomain.com/api/v1/confessions/clx123abc/empathy" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 6. İtiraf Raporla

**Endpoint:** `POST /api/v1/confessions/[id]/report`

**Açıklama:** Uygunsuz içerik içeren bir itirafı raporlar.

**Authentication:** Required

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| id | string | İtiraf ID'si |

**Request Body:**

```json
{
  "reason": "Uygunsuz dil kullanımı"
}
```

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "Rapor alındı, inceleme yapılacak"
  }
}
```

**Örnek Kullanım:**

```bash
curl -X POST "https://yourdomain.com/api/v1/confessions/clx123abc/report" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "reason": "Uygunsuz dil kullanımı"
  }'
```

---

### 7. Kullanıcının İtirafları

**Endpoint:** `GET /api/v1/confessions/my`

**Açıklama:** Giriş yapan kullanıcının kendi itiraflarını listeler.

**Authentication:** Required

**Query Parameters:**

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| page | number | Hayır | 1 | Sayfa numarası |
| limit | number | Hayır | 20 | Sayfa başına kayıt |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "clx456def",
        "content": "Bugün arkadaşlarla çıktık ve 3 dilim pizza yedim.",
        "category": "social_pressure",
        "aiResponse": "Sosyal anlar yaşamın tadını çıkarmak için var!",
        "empathyCount": 15,
        "status": "published",
        "createdAt": "2025-11-17T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "totalPages": 1,
      "hasMore": false
    },
    "stats": {
      "totalConfessions": 8,
      "totalEmpathy": 127,
      "mostPopular": {
        "id": "clx789ghi",
        "empathyCount": 89
      }
    }
  }
}
```

**Örnek Kullanım:**

```bash
curl -X GET "https://yourdomain.com/api/v1/confessions/my" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 8. Telafi Planını Kabul Et

**Endpoint:** `POST /api/v1/confessions/[id]/telafi/accept`

**Açıklama:** AI'ın önerdiği telafi planını kabul eder ve günlük görevlere ekler.

**Authentication:** Required

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| id | string | İtiraf ID'si |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "questAdded": true,
    "quest": {
      "id": "clx999jkl",
      "title": "Bugün 30 dakika tempolu yürüyüş yap",
      "xpReward": 15,
      "type": "telafi"
    }
  }
}
```

**Örnek Kullanım:**

```bash
curl -X POST "https://yourdomain.com/api/v1/confessions/clx123abc/telafi/accept" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 9. Genel İstatistikler

**Endpoint:** `GET /api/v1/confessions/stats`

**Açıklama:** İtiraf sistemi hakkında genel istatistikler.

**Authentication:** Required

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "totalConfessions": 1547,
    "categoryBreakdown": {
      "night_attack": 423,
      "special_occasion": 312,
      "stress_eating": 289,
      "social_pressure": 267,
      "no_regrets": 178,
      "seasonal": 78
    },
    "averageEmpathy": 23.4,
    "popularConfessions": [
      {
        "id": "clx111aaa",
        "content": "Ramazan'da iftar sonrası 5 baklava yedim...",
        "empathyCount": 234,
        "category": "seasonal"
      }
    ]
  }
}
```

**Örnek Kullanım:**

```bash
curl -X GET "https://yourdomain.com/api/v1/confessions/stats" \
  -H "Cookie: next-auth.session-token=..."
```

---

## Admin Endpoints

### 10. Moderasyon Kuyruğu

**Endpoint:** `GET /api/admin/confessions/moderation`

**Açıklama:** Onay bekleyen itirafları listeler.

**Authentication:** Required (Admin role)

**Query Parameters:**

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| page | number | Hayır | 1 | Sayfa numarası |
| limit | number | Hayır | 20 | Sayfa başına kayıt |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "clx222bbb",
        "userId": "user123",
        "content": "Bu içerik şüpheli kelimeler içeriyor...",
        "category": "stress_eating",
        "status": "pending",
        "createdAt": "2025-11-17T10:00:00Z",
        "user": {
          "username": "user123",
          "email": "user@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1,
      "hasMore": false
    }
  }
}
```

**Örnek Kullanım:**

```bash
curl -X GET "https://yourdomain.com/api/admin/confessions/moderation" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 11. İtirafı Onayla

**Endpoint:** `POST /api/admin/confessions/[id]/approve`

**Açıklama:** Pending durumundaki bir itirafı onaylar ve yayınlar.

**Authentication:** Required (Admin role)

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| id | string | İtiraf ID'si |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "İtiraf onaylandı ve yayınlandı"
  }
}
```

**Örnek Kullanım:**

```bash
curl -X POST "https://yourdomain.com/api/admin/confessions/clx222bbb/approve" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 12. İtirafı Reddet

**Endpoint:** `POST /api/admin/confessions/[id]/reject`

**Açıklama:** Pending durumundaki bir itirafı reddeder.

**Authentication:** Required (Admin role)

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| id | string | İtiraf ID'si |

**Request Body:**

```json
{
  "reason": "Uygunsuz içerik - Topluluk kurallarına aykırı"
}
```

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "message": "İtiraf reddedildi, kullanıcıya bildirim gönderildi"
  }
}
```

**Örnek Kullanım:**

```bash
curl -X POST "https://yourdomain.com/api/admin/confessions/clx222bbb/reject" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "reason": "Uygunsuz içerik - Topluluk kurallarına aykırı"
  }'
```

---

### 13. Rapor Edilen İtiraflar

**Endpoint:** `GET /api/admin/confessions/reports`

**Açıklama:** Kullanıcılar tarafından rapor edilen itirafları listeler.

**Authentication:** Required (Admin role)

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "confession": {
        "id": "clx333ccc",
        "content": "Rapor edilen içerik...",
        "category": "no_regrets",
        "status": "published",
        "createdAt": "2025-11-16T18:00:00Z"
      },
      "reportCount": 7,
      "reports": [
        {
          "id": "rep001",
          "userId": "user456",
          "reason": "Uygunsuz dil",
          "createdAt": "2025-11-17T09:00:00Z"
        },
        {
          "id": "rep002",
          "userId": "user789",
          "reason": "Spam",
          "createdAt": "2025-11-17T09:15:00Z"
        }
      ]
    }
  ]
}
```

**Örnek Kullanım:**

```bash
curl -X GET "https://yourdomain.com/api/admin/confessions/reports" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 14. Analitik Dashboard

**Endpoint:** `GET /api/admin/confessions/analytics`

**Açıklama:** Detaylı analitik veriler.

**Authentication:** Required (Admin role)

**Query Parameters:**

| Parametre | Tip | Zorunlu | Varsayılan | Açıklama |
|-----------|-----|---------|------------|----------|
| startDate | string | Hayır | 30 gün önce | Başlangıç tarihi (ISO 8601) |
| endDate | string | Hayır | Bugün | Bitiş tarihi (ISO 8601) |

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "dailyStats": [
      {
        "date": "2025-11-17",
        "count": 47,
        "empathyCount": 312
      },
      {
        "date": "2025-11-16",
        "count": 52,
        "empathyCount": 289
      }
    ],
    "categoryDistribution": {
      "night_attack": 423,
      "special_occasion": 312,
      "stress_eating": 289,
      "social_pressure": 267,
      "no_regrets": 178,
      "seasonal": 78
    },
    "aiResponseSuccessRate": 97.3,
    "averageResponseTime": 3.2,
    "telafiAcceptanceRate": 42.5,
    "topConfessions": [
      {
        "id": "clx111aaa",
        "content": "Ramazan'da iftar sonrası 5 baklava yedim...",
        "empathyCount": 234
      }
    ]
  }
}
```

**Örnek Kullanım:**

```bash
curl -X GET "https://yourdomain.com/api/admin/confessions/analytics?startDate=2025-11-01&endDate=2025-11-17" \
  -H "Cookie: next-auth.session-token=..."
```

---

### 15. Sezonluk Tema Oluştur

**Endpoint:** `POST /api/admin/seasonal-themes`

**Açıklama:** Yeni bir sezonluk tema oluşturur.

**Authentication:** Required (Admin role)

**Request Body:**

```json
{
  "name": "Ramazan 2026",
  "category": "seasonal",
  "icon": "🌙",
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2026-03-30T23:59:59Z"
}
```

**Başarılı Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "theme001",
    "name": "Ramazan 2026",
    "category": "seasonal",
    "icon": "🌙",
    "startDate": "2026-03-01T00:00:00Z",
    "endDate": "2026-03-30T23:59:59Z",
    "isActive": true,
    "createdAt": "2025-11-17T12:00:00Z"
  }
}
```

**Örnek Kullanım:**

```bash
curl -X POST "https://yourdomain.com/api/admin/seasonal-themes" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Ramazan 2026",
    "category": "seasonal",
    "icon": "🌙",
    "startDate": "2026-03-01T00:00:00Z",
    "endDate": "2026-03-30T23:59:59Z"
  }'
```

---

### 16. Sezonluk Tema Güncelle

**Endpoint:** `PUT /api/admin/seasonal-themes/[id]`

**Açıklama:** Mevcut bir sezonluk temayı günceller.

**Authentication:** Required (Admin role)

**Path Parameters:**

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| id | string | Tema ID'si |

**Request Body:**

```json
{
  "name": "Ramazan 2026 (Güncellenmiş)",
  "isActive": false
}
```

**Başarılı Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "theme001",
    "name": "Ramazan 2026 (Güncellenmiş)",
    "category": "seasonal",
    "icon": "🌙",
    "startDate": "2026-03-01T00:00:00Z",
    "endDate": "2026-03-30T23:59:59Z",
    "isActive": false,
    "updatedAt": "2025-11-17T15:00:00Z"
  }
}
```

**Örnek Kullanım:**

```bash
curl -X PUT "https://yourdomain.com/api/admin/seasonal-themes/theme001" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "name": "Ramazan 2026 (Güncellenmiş)",
    "isActive": false
  }'
```

---

## Hata Kodları

| Kod | HTTP Status | Açıklama |
|-----|-------------|----------|
| UNAUTHORIZED | 401 | Kullanıcı giriş yapmamış |
| FORBIDDEN | 403 | Yetkisiz erişim (admin gerekli) |
| CONFESSION_NOT_FOUND | 404 | İtiraf bulunamadı |
| CONTENT_TOO_SHORT | 400 | İtiraf 10 karakterden kısa |
| CONTENT_TOO_LONG | 400 | İtiraf 500 karakterden uzun |
| DAILY_LIMIT_EXCEEDED | 429 | Günlük 3 itiraf limiti aşıldı |
| SPAM_DETECTED | 400 | Spam tespit edildi |
| INAPPROPRIATE_CONTENT | 400 | Uygunsuz içerik tespit edildi |
| ALREADY_EMPATHIZED | 400 | Kullanıcı zaten empati göstermiş |
| AI_TIMEOUT | 500 | AI yanıt üretimi zaman aşımına uğradı |
| VALIDATION_ERROR | 400 | Genel validasyon hatası |
| INTERNAL_ERROR | 500 | Sunucu hatası |

---

## Kategoriler

| Kategori | Açıklama | Emoji |
|----------|----------|-------|
| night_attack | Gece Saldırıları (23:00-06:00) | 🌙 |
| special_occasion | Özel Gün Bahaneleri | 🎉 |
| stress_eating | Stres Yeme | 😰 |
| social_pressure | Sosyal Baskı | 👥 |
| no_regrets | Pişman Değilim | 😎 |
| seasonal | Sezonluk (Ramazan, Bayram, vb.) | 🎊 |

---

## AI Ton Tipleri

| Ton | Açıklama |
|-----|----------|
| empathetic | Empatik ve destekleyici |
| humorous | Esprili ve neşeli |
| motivational | Motivasyonel ve ileriye dönük |
| realistic | Gerçekçi ve pratik |

---

## Webhook Events (Gelecek Özellik)

İleride webhook desteği eklendiğinde şu eventler tetiklenecek:

- `confession.created` - Yeni itiraf oluşturuldu
- `confession.published` - İtiraf yayınlandı (AI yanıtı ile)
- `confession.reported` - İtiraf rapor edildi
- `confession.popular` - İtiraf popüler oldu (100+ empati)
- `empathy.added` - Empati eklendi
- `telafi.accepted` - Telafi planı kabul edildi
- `telafi.completed` - Telafi planı tamamlandı

---

## Versiyonlama

API versiyonlaması URL path'inde belirtilir: `/api/v1/...`

Mevcut versiyon: **v1**

Breaking change'ler yeni versiyon numarası ile yayınlanır (v2, v3, vb.)

---

## Destek

API ile ilgili sorularınız için:
- Email: api-support@yourdomain.com
- Dokümantasyon: https://docs.yourdomain.com
- GitHub Issues: https://github.com/yourorg/yourrepo/issues
