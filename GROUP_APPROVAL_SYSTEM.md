# 🎯 Grup ve Lonca Onay Sistemi

## ✅ Yapılanlar

### 1. Database (Schema)
- `Group` modeline `status`, `rejectionReason`, `publishedAt` alanları eklendi
- `Guild` modeline `status`, `rejectionReason`, `publishedAt` alanları eklendi
- `GroupStatus` enum'u oluşturuldu: `pending`, `published`, `rejected`
- Index eklendi: `status + createdAt` (performans için)

### 2. API Endpoints

#### Kullanıcı Tarafı - Gruplar
- **POST /api/v1/groups** → Grup oluşturma (otomatik `pending` status)
- **GET /api/v1/groups** → Sadece `published` grupları listeler

#### Kullanıcı Tarafı - Loncalar
- **POST /api/v1/guilds** → Lonca oluşturma (otomatik `pending` status)
- **GET /api/v1/guilds** → Sadece `published` loncaları listeler

#### Admin Tarafı - Gruplar
- **GET /api/admin/groups** → Tüm grupları listeler (status filtreleme ile)
- **POST /api/admin/groups/[id]/approve** → Grubu onayla
- **POST /api/admin/groups/[id]/reject** → Grubu reddet (sebep gerekli)

#### Admin Tarafı - Loncalar
- **GET /api/admin/guilds** → Tüm loncaları listeler (status filtreleme ile)
- **POST /api/admin/guilds/[id]/approve** → Loncayı onayla
- **POST /api/admin/guilds/[id]/reject** → Loncayı reddet (sebep gerekli)

### 3. Bildirimler
- Grup onaylandığında → Kullanıcıya bildirim
- Grup reddedildiğinde → Kullanıcıya sebep ile bildirim

### 4. Migration
- ✅ Mevcut veriler korundu
- ✅ Eski gruplar ve loncalar otomatik `published` yapıldı
- ✅ Yeni gruplar ve loncalar `pending` olarak oluşturulacak
- ⚠️ **Dev server'ı yeniden başlatman gerekiyor** (Prisma client güncellemesi için)

---

## 📋 Kullanım

### Kullanıcı Akışı
1. Kullanıcı grup oluşturur
2. "Grubunuz oluşturuldu ve admin onayı bekliyor" mesajı alır
3. Admin onayladığında bildirim gelir
4. Grup yayınlanır

### Admin Akışı
1. Admin panelinde bekleyen grupları görür
2. Grup detaylarını inceler
3. Onaylar veya reddeder (red için sebep yazar)

---

## 🔧 API Örnekleri

### Grup Oluşturma
```bash
POST /api/v1/groups
{
  "name": "30'lu Yaşlar Motivasyon",
  "description": "30'lu yaşlarda zayıflama yolculuğu",
  "category": "age_based",
  "isPublic": true
}

# Response:
{
  "success": true,
  "data": { ... },
  "message": "Grubunuz oluşturuldu ve admin onayı bekliyor."
}
```

### Admin - Bekleyen Gruplar
```bash
GET /api/admin/groups?status=pending

# Response:
{
  "success": true,
  "data": [...],
  "meta": {
    "pendingCount": 5
  }
}
```

### Admin - Grup Onaylama
```bash
POST /api/admin/groups/[id]/approve

# Response:
{
  "success": true,
  "data": { ... }
}
```

### Admin - Grup Reddetme
```bash
POST /api/admin/groups/[id]/reject
{
  "reason": "Grup adı uygunsuz içerik barındırıyor"
}
```

---

## 🎨 Frontend Entegrasyonu (Yapılacak)

### Kullanıcı Tarafı
- [ ] Grup oluşturma formunda bilgilendirme mesajı
- [ ] "Onay bekleyen gruplarım" sayfası
- [ ] Bildirim sistemi entegrasyonu

### Admin Paneli
- [ ] Bekleyen gruplar listesi
- [ ] Grup detay sayfası
- [ ] Onay/Red butonları
- [ ] Red sebep formu

---

## 🚀 Sonraki Adımlar (Opsiyonel)

1. **Akıllı Onay Sistemi**
   - Yüksek reputasyonlu kullanıcılar → Otomatik onay
   - Yeni kullanıcılar → Manuel onay

2. **Otomatik Filtreler**
   - Küfür/spam tespiti
   - Uygunsuz içerik kontrolü

3. **İstatistikler**
   - Onaylanan/reddedilen grup sayıları
   - Ortalama onay süresi
