# 🔥 Günah Sayacı - Admin Panel Dokümantasyonu

**Durum:** ✅ Tamamlandı  
**Tarih:** 18 Kasım 2025  
**Versiyon:** 1.0

---

## 📋 Genel Bakış

Günah Sayacı Admin Panel'i, sistemdeki tüm içerikleri (mizahi yanıtlar, rozetler, challenge'lar) yönetmek için tam özellikli bir CRUD arayüzü sunar.

### Özellikler

- ✅ **Mizahi Yanıt Yönetimi** - Günah eklendiğinde gösterilen mesajları yönet
- ✅ **Rozet Yönetimi** - Kullanıcıların kazanabileceği başarı rozetlerini yönet
- ✅ **Challenge Yönetimi** - Kullanıcıların katılabileceği hedefleri oluştur ve yönet
- ✅ **İstatistik Dashboard'u** - Sistem genelinde istatistikler ve analizler
- ✅ **Real-time Güncelleme** - Değişiklikler anında yansır

---

## 🗺️ Sayfa Yapısı

### 1. Ana Dashboard
**URL:** `/admin/gunah-sayaci`

**Özellikler:**
- Toplam günah sayısı
- Aktif kullanıcı sayısı
- Kazanılan rozet sayısı
- Challenge katılımcı sayısı
- Günah türü dağılımı (grafik)
- En aktif kullanıcılar (top 5)
- Hızlı erişim butonları

### 2. Mizahi Yanıtlar
**URL:** `/admin/gunah-sayaci/reactions`

**Özellikler:**
- Tüm yanıtları listele
- Türe göre filtrele (Tatlı, Fast Food, Gazlı, Alkol, Diğer)
- Yeni yanıt ekle
- Mevcut yanıtı düzenle
- Yanıt sil
- Responsive grid görünümü

**Form Alanları:**
- Günah Türü (dropdown)
- Mesaj (text input, min 5 karakter)

### 3. Rozetler
**URL:** `/admin/gunah-sayaci/badges`

**Özellikler:**
- Tüm rozetleri listele
- Kaç kullanıcının kazandığını göster
- Yeni rozet ekle
- Mevcut rozeti düzenle
- Rozet sil (kullanıcı ilişkileri de silinir)
- XP ve Coin ödüllerini göster

**Form Alanları:**
- Rozet Adı (text, min 3 karakter)
- Icon (emoji)
- Açıklama (textarea, min 10 karakter)
- XP Ödülü (number, min 0)
- Coin Ödülü (number, min 0)

**Not:** Rozet kazanma koşulları `src/lib/badge-checker.ts` dosyasında kod olarak tanımlanır.

### 4. Challenge'lar
**URL:** `/admin/gunah-sayaci/challenges`

**Özellikler:**
- Tüm challenge'ları listele
- Aktif/Pasif durumu göster
- Katılımcı sayısını göster
- Yeni challenge ekle
- Mevcut challenge'ı düzenle
- Challenge sil (katılımcı verileri de silinir)
- Tarih aralığı belirleme

**Form Alanları:**
- Challenge Başlığı (text, min 5 karakter)
- Açıklama (textarea, min 10 karakter)
- Günah Türü (dropdown)
- Hedef Gün Sayısı (number, min 1)
- Başlangıç Tarihi (date)
- Bitiş Tarihi (date)
- XP Ödülü (number, min 0)
- Coin Ödülü (number, min 0)

**Challenge Durumu:**
- 🔥 **Aktif:** Başlangıç ve bitiş tarihleri arasında
- ⏸️ **Pasif:** Henüz başlamamış veya bitmiş

---

## 🔌 API Endpoints

### İstatistikler

```typescript
GET /api/admin/sin-stats
```

**Response:**
```json
{
  "totalSins": 150,
  "totalUsers": 45,
  "totalBadgesEarned": 23,
  "totalChallengeParticipants": 12,
  "sinsByType": [
    { "sinType": "tatli", "_count": 60 },
    { "sinType": "fastfood", "_count": 40 }
  ],
  "recentSins": [...],
  "topUsers": [...]
}
```

### Mizahi Yanıtlar

```typescript
// Listele
GET /api/admin/sin-reactions
GET /api/admin/sin-reactions?sinType=tatli

// Ekle
POST /api/admin/sin-reactions
Body: { message: string, sinType: SinType }

// Güncelle
PUT /api/admin/sin-reactions/[id]
Body: { message?: string, sinType?: SinType }

// Sil
DELETE /api/admin/sin-reactions/[id]
```

### Rozetler

```typescript
// Listele
GET /api/admin/sin-badges

// Ekle
POST /api/admin/sin-badges
Body: {
  name: string,
  description: string,
  icon: string,
  xpReward: number,
  coinReward: number
}

// Güncelle
PUT /api/admin/sin-badges/[id]
Body: { name?: string, description?: string, ... }

// Sil
DELETE /api/admin/sin-badges/[id]
```

### Challenge'lar

```typescript
// Listele
GET /api/admin/sin-challenges

// Ekle
POST /api/admin/sin-challenges
Body: {
  title: string,
  description: string,
  targetDays: number,
  sinType: SinType,
  xpReward: number,
  coinReward: number,
  startDate: string,
  endDate: string
}

// Güncelle
PUT /api/admin/sin-challenges/[id]
Body: { title?: string, description?: string, ... }

// Sil
DELETE /api/admin/sin-challenges/[id]
```

---

## 🔐 Güvenlik

### Yetkilendirme
Tüm admin endpoint'leri şu kontrollerden geçer:

```typescript
const session = await auth()
if (!session?.user || session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
}
```

### Validasyon
Tüm form verileri Zod ile validate edilir:

```typescript
const createSchema = z.object({
  name: z.string().min(3, 'İsim en az 3 karakter olmalı'),
  // ...
})
```

---

## 🎨 UI/UX Özellikleri

### Tasarım
- Modern gradient kartlar
- Responsive grid layout
- Hover efektleri
- Icon'larla görsel zenginlik
- Badge'lerle durum gösterimi

### Kullanıcı Deneyimi
- Toast bildirimleri (başarı/hata)
- Onay dialog'ları (silme işlemleri)
- Loading state'leri
- Boş durum mesajları
- Form validasyonu

### Renkler
- **Turuncu/Kırmızı:** Günah teması
- **Mavi:** Kullanıcı istatistikleri
- **Sarı:** Rozetler
- **Mor:** Challenge'lar
- **Yeşil:** Başarı durumları

---

## 📊 İstatistik Kartları

### Dashboard Metrikleri

1. **Toplam Günah** 🔥
   - Tüm kullanıcıların eklediği günah sayısı
   - Turuncu gradient

2. **Aktif Kullanıcı** 👥
   - En az 1 günah ekleyen kullanıcı sayısı
   - Mavi gradient

3. **Kazanılan Rozet** 🏆
   - Tüm kullanıcıların kazandığı rozet sayısı
   - Sarı gradient

4. **Challenge Katılımı** 🎯
   - Aktif challenge'lara katılan kullanıcı sayısı
   - Mor gradient

### Günah Türü Dağılımı
- Progress bar'larla görselleştirme
- Yüzdelik oranlar
- Emoji'lerle tür gösterimi
- Toplam sayılar

### En Aktif Kullanıcılar
- Top 5 kullanıcı
- Günah sayıları
- Sıralama numaraları
- Kullanıcı profil bilgileri

---

## 🚀 Kullanım Örnekleri

### Yeni Mizahi Yanıt Ekleme

1. `/admin/gunah-sayaci/reactions` sayfasına git
2. "Yeni Yanıt Ekle" butonuna tıkla
3. Günah türünü seç (örn: Tatlı 🍰)
4. Mesajı yaz (örn: "Tatlı mı? Hayat zaten yeterince acı! 😄")
5. "Ekle" butonuna tıkla
6. Toast bildirimi ile onay al

### Yeni Challenge Oluşturma

1. `/admin/gunah-sayaci/challenges` sayfasına git
2. "Yeni Challenge Ekle" butonuna tıkla
3. Formu doldur:
   - Başlık: "7 Günlük Tatlı Detoksu"
   - Açıklama: "Bir hafta boyunca tatlıdan uzak dur!"
   - Günah Türü: Tatlı
   - Hedef Gün: 7
   - Tarih aralığı seç
   - Ödülleri belirle (XP: 100, Coin: 50)
4. "Ekle" butonuna tıkla
5. Challenge aktif olur ve kullanıcılar katılabilir

### Rozet Düzenleme

1. `/admin/gunah-sayaci/badges` sayfasına git
2. Düzenlemek istediğin rozetin üzerindeki kalem ikonuna tıkla
3. Bilgileri güncelle
4. "Güncelle" butonuna tıkla
5. Değişiklikler anında yansır

---

## 🔄 Veri Akışı

### Mizahi Yanıt Sistemi
```
Kullanıcı günah ekler
  ↓
API random bir reaction seçer
  ↓
Toast ile kullanıcıya gösterilir
  ↓
Admin panelden yönetilebilir
```

### Rozet Sistemi
```
Kullanıcı günah ekler
  ↓
badge-checker.ts otomatik kontrol yapar
  ↓
Koşul sağlanırsa rozet verilir
  ↓
XP ve Coin ödülü eklenir
  ↓
Admin panelden rozet tanımları yönetilebilir
```

### Challenge Sistemi
```
Admin challenge oluşturur
  ↓
Kullanıcı challenge'a katılır
  ↓
challenge-checker.ts ilerlemeyi takip eder
  ↓
Hedef tamamlanırsa ödül verilir
  ↓
Admin panelden challenge'lar yönetilebilir
```

---

## 📝 Notlar

### Rozet Kazanma Koşulları
Rozet kazanma mantığı `src/lib/badge-checker.ts` dosyasında kod olarak tanımlanır. Admin panelden sadece rozet bilgileri (isim, açıklama, ödüller) yönetilir.

**Mevcut Rozetler:**
- 🥇 Glukozsuz Kahraman (7 gün tatlı yok)
- 🥈 Yağsavar (30 gün fast food yok)
- 🥉 Dengeli Dahi (3 gün telafi)
- 🍩 Gizli Tatlıcı (aynı gün 2 tatlı)
- 😇 Motivasyon Meleği (10 gün temiz)

### Challenge Durumu
Challenge'lar tarih aralığına göre otomatik olarak aktif/pasif duruma geçer. Manuel olarak aktif/pasif yapma özelliği yoktur.

### Silme İşlemleri
- **Reaction silme:** Sadece reaction silinir
- **Badge silme:** Badge + UserSinBadge ilişkileri silinir
- **Challenge silme:** Challenge + UserSinChallenge ilişkileri silinir

### Performans
- API'ler cache kullanmaz (real-time veri)
- İstatistikler her sayfa yüklendiğinde hesaplanır
- Büyük veri setlerinde pagination eklenebilir

---

## 🎯 Gelecek Geliştirmeler

- [ ] Pagination (büyük veri setleri için)
- [ ] Arama ve filtreleme (gelişmiş)
- [ ] Toplu işlemler (bulk delete, bulk edit)
- [ ] Export/Import (CSV, JSON)
- [ ] Rozet kazanma koşullarını UI'dan düzenleme
- [ ] Challenge şablonları
- [ ] Analitik grafikler (Chart.js)
- [ ] Audit log (kim ne değiştirdi)

---

**Hazırlayan:** Kiro AI  
**Son Güncelleme:** 18 Kasım 2025  
**Durum:** ✅ Production Ready
