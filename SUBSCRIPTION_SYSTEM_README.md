# Abonelik Sistemi Dokümantasyonu

## ✅ Tamamlanan Özellikler

### 1. Veritabanı Yapısı
- ✅ User tablosuna premium alanları eklendi (`isPremium`, `premiumUntil`, `premiumType`)
- ✅ `subscriptions` tablosu oluşturuldu
- ✅ `payments` tablosu oluşturuldu
- ✅ `premium_features` tablosu oluşturuldu

### 2. Premium Paketleri
- **Aylık Premium**: 49.99 TL (30 gün)
- **Yıllık Premium**: 399.99 TL (365 gün, %33 indirim)
- **Ömür Boyu Premium**: 999.99 TL

### 3. Premium Özellikler
- ⚡ 2x XP Kazancı
- 🚫 Reklamsız Deneyim
- 🏆 Özel Rozetler
- 💬 Öncelikli Destek
- 🎨 Özel Profil Teması
- 📊 Gelişmiş İstatistikler

### 4. Ödeme Entegrasyonları
- ✅ Stripe
- ✅ iyzico
- ✅ PayTR

### 5. API Endpoint'leri

#### Kullanıcı API'leri
- `GET /api/subscription/status` - Premium durumu sorgula
- `POST /api/subscription/create` - Yeni abonelik oluştur
- `POST /api/subscription/cancel` - Aboneliği iptal et

#### Admin API'leri
- `GET /api/admin/subscriptions` - Tüm abonelikleri listele
- `GET /api/admin/subscriptions/[id]` - Abonelik detayı
- `PATCH /api/admin/subscriptions/[id]` - Abonelik güncelle
- `GET /api/admin/payments` - Tüm ödemeleri listele
- `POST /api/admin/users/[id]/grant-premium` - Kullanıcıya premium ver

#### Ödeme Callback'leri
- `POST /api/payment/callback/stripe` - Stripe webhook
- `POST /api/payment/callback/iyzico` - iyzico callback
- `POST /api/payment/callback/paytr` - PayTR callback

## 📦 Kurulum Adımları

### 1. SQL Migration'ı Çalıştır
```bash
# MySQL'e bağlan ve add-subscription-system.sql dosyasını çalıştır
mysql -u root -p zayiflamaplan < add-subscription-system.sql
```

### 2. Prisma Client'ı Generate Et
```bash
npx prisma generate
```

### 3. Environment Variables
`.env` dosyanıza ekleyin:
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# iyzico
IYZICO_API_KEY=your_api_key
IYZICO_SECRET_KEY=your_secret_key

# PayTR
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt
```

## 🔧 Kullanım

### Premium Durumu Kontrol Etme
```typescript
import { checkUserPremiumStatus } from '@/lib/subscription'

const status = await checkUserPremiumStatus(userId)
console.log(status.isPremium) // true/false
```

### Kullanıcıya Premium Verme
```typescript
import { grantPremium } from '@/lib/subscription'

await grantPremium(userId, 'monthly')
```

### XP Hesaplama (Premium Boost ile)
```typescript
import { calculateXP } from '@/lib/subscription'

const xp = calculateXP(10, isPremium, hasXPBoost)
// Normal: 10 XP
// Premium: 20 XP
```

## 🎯 Admin Panel Özellikleri

### Abonelik Yönetimi
- Tüm abonelikleri görüntüleme
- Abonelik durumunu güncelleme (aktif, iptal, süresi dolmuş)
- Abonelik süresini uzatma
- Kullanıcıya manuel premium verme

### Sipariş Yönetimi
- Tüm ödemeleri görüntüleme
- Ödeme durumlarını filtreleme
- Ödeme sağlayıcısına göre filtreleme
- Ödeme istatistikleri

### Kullanıcı Yönetimi
- Kullanıcıya premium verme
- Premium süresini görüntüleme
- Premium geçmişini görüntüleme

## 🚀 Deployment

### 1. GitHub'a Push
```bash
git add .
git commit -m "feat: abonelik sistemi eklendi"
git push origin main
```

### 2. Sunucuda Migration Çalıştır
```bash
ssh root@31.97.34.163
cd /path/to/project
mysql -u root -p zayiflamaplan < add-subscription-system.sql
npx prisma generate
pm2 restart all
```

### 3. Webhook URL'lerini Ayarla

#### Stripe
Dashboard > Developers > Webhooks
```
https://yourdomain.com/api/payment/callback/stripe
```
Events: `checkout.session.completed`

#### iyzico
Panel > Ayarlar > Callback URL
```
https://yourdomain.com/api/payment/callback/iyzico
```

#### PayTR
Panel > Ayarlar > Bildirim URL
```
https://yourdomain.com/api/payment/callback/paytr
```

## 🧪 Test

### Test Kartları

**Stripe:**
- Kart: 4242 4242 4242 4242
- CVV: 123
- Tarih: 12/30

**iyzico:**
- Kart: 5528 7900 0000 0001
- CVV: 123
- Tarih: 12/30

**PayTR:**
- Kart: 4355 0840 0000 0001
- CVV: 000
- Tarih: 12/30

## 📝 Notlar

- Premium süresi dolduğunda otomatik olarak `isPremium` false olur
- Abonelik iptal edildiğinde süre bitene kadar premium devam eder
- XP boost premium ile otomatik aktif olur
- Admin panelden manuel premium verilebilir

## 🐛 Sorun Giderme

### Ödeme callback çalışmıyor
1. Webhook URL'lerini kontrol edin
2. SSL sertifikası aktif olmalı (HTTPS)
3. Sunucu public erişilebilir olmalı

### Premium verilmiyor
1. Payment kaydının `completed` olduğunu kontrol edin
2. Subscription kaydının `active` olduğunu kontrol edin
3. User tablosunda `isPremium` ve `premiumUntil` kontrol edin

### XP boost çalışmıyor
1. `xpBoostUntil` tarihini kontrol edin
2. `calculateXP` fonksiyonunu kullandığınızdan emin olun
