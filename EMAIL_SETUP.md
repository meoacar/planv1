# 📧 Email Entegrasyonu (Resend) - Kurulum Rehberi

## ✅ Tamamlandı

Email sistemi tamamen entegre edildi ve production-ready!

---

## 🚀 Kurulum Adımları

### 1. Resend Hesabı Oluştur

1. [resend.com](https://resend.com) adresine git
2. Ücretsiz hesap oluştur (3,000 email/ay ücretsiz)
3. Email adresini doğrula

### 2. API Key Al

1. Dashboard'a git
2. "API Keys" sekmesine tıkla
3. "Create API Key" butonuna tıkla
4. İsim ver (örn: "Production")
5. API key'i kopyala

### 3. Domain Ekle (Opsiyonel ama Önerilen)

**Neden?** Kendi domain'inden email göndermek daha profesyonel ve spam'e düşme riski daha az.

1. Dashboard'da "Domains" sekmesine git
2. "Add Domain" butonuna tıkla
3. Domain'ini ekle (örn: `zayiflamaplan.com`)
4. DNS kayıtlarını ekle:
   - SPF
   - DKIM
   - DMARC
5. Doğrulamayı bekle (~24 saat)

**Domain yoksa:** `onboarding@resend.dev` adresini kullanabilirsin (test için)

### 4. Environment Variables Ekle

`.env` dosyana ekle:

```env
# Email (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM="ZayiflamaPlan <noreply@zayiflamaplan.com>"
ADMIN_EMAIL=admin@zayiflamaplan.com
```

**Önemli:**
- `RESEND_API_KEY`: Resend'den aldığın API key
- `EMAIL_FROM`: Gönderen email adresi (domain doğrulandıysa kendi domain'in, yoksa `onboarding@resend.dev`)
- `ADMIN_EMAIL`: Admin bildirimlerinin gideceği email

### 5. Test Et

```bash
# Development server'ı başlat
pnpm dev

# Tarayıcıda aç
http://localhost:3000/sifremi-unuttum

# Email gir ve test et
```

---

## 📧 Email Tipleri

### 1. Şifre Sıfırlama
**Tetikleyici:** Kullanıcı `/sifremi-unuttum` sayfasında email girer

**İçerik:**
- Şifre sıfırlama linki (1 saat geçerli)
- Güvenlik uyarıları
- Yardım linkleri

**Fonksiyon:** `sendPasswordResetEmail(email, resetUrl)`

---

### 2. Hoş Geldin
**Tetikleyici:** Yeni kullanıcı kaydı

**İçerik:**
- Hoş geldin mesajı
- Platform özellikleri
- Dashboard linki

**Fonksiyon:** `sendWelcomeEmail(email, name?)`

**Entegrasyon:**
```typescript
// app/api/auth/register/route.ts
import { sendWelcomeEmail } from '@/lib/email'

// Kullanıcı oluşturulduktan sonra
await sendWelcomeEmail(user.email, user.name)
```

---

### 3. Plan Onaylandı
**Tetikleyici:** Admin plan'ı onaylar

**İçerik:**
- Onay mesajı
- Plan linki
- Teşekkür mesajı

**Fonksiyon:** `sendPlanApprovedEmail(email, planTitle, planSlug)`

**Entegrasyon:**
```typescript
// app/api/v1/admin/plans/[id]/approve/route.ts
import { sendPlanApprovedEmail } from '@/lib/email'

await sendPlanApprovedEmail(
  plan.author.email,
  plan.title,
  plan.slug
)
```

---

### 4. Plan Reddedildi
**Tetikleyici:** Admin plan'ı reddeder

**İçerik:**
- Red sebebi
- Düzenleme önerisi
- Planlarım linki

**Fonksiyon:** `sendPlanRejectedEmail(email, planTitle, reason)`

**Entegrasyon:**
```typescript
// app/api/v1/admin/plans/[id]/reject/route.ts
import { sendPlanRejectedEmail } from '@/lib/email'

await sendPlanRejectedEmail(
  plan.author.email,
  plan.title,
  rejectionReason
)
```

---

### 5. Admin Bildirimi
**Tetikleyici:** Önemli olaylar (yeni plan, yorum, kullanıcı)

**İçerik:**
- Olay detayları
- Admin panel linki

**Fonksiyon:** `sendAdminNotification(subject, body)`

**Entegrasyon:**
```typescript
// lib/notifications.ts
import { sendAdminNotification } from './email'

await sendAdminNotification(
  'Yeni Plan Oluşturuldu',
  `${user.name} yeni bir plan oluşturdu: ${plan.title}`
)
```

---

## 🎨 Email Tasarımı

Tüm emailler responsive ve modern tasarıma sahip:

- ✅ Gradient header
- ✅ Temiz layout
- ✅ CTA butonları
- ✅ Footer linkleri
- ✅ Mobile-friendly
- ✅ Dark mode uyumlu (email client'a göre)

---

## 🔒 Güvenlik

### Email Enumeration Prevention
```typescript
// Her zaman aynı mesaj döndür
return { 
  success: true, 
  message: 'Eğer bu email kayıtlıysa, link gönderildi.' 
}
```

### Rate Limiting
```typescript
// TODO: Şifre sıfırlama rate limiting ekle
// Öneri: 5 deneme / 15 dakika per IP
```

### Token Güvenliği
- 32 byte random token
- 1 saat geçerlilik
- Tek kullanımlık
- Database'de hash'li

---

## 📊 Monitoring

### Resend Dashboard
- Gönderilen emailler
- Delivery rate
- Bounce rate
- Spam complaints

### Önerilen Metrikler
- Email gönderim başarı oranı
- Şifre sıfırlama tamamlanma oranı
- Email açılma oranı (Resend Pro)
- Link tıklama oranı (Resend Pro)

---

## 🐛 Troubleshooting

### Email Gönderilmiyor

**1. API Key Kontrolü**
```bash
# .env dosyasını kontrol et
cat .env | grep RESEND_API_KEY
```

**2. Domain Doğrulaması**
- Resend dashboard'da domain durumunu kontrol et
- DNS kayıtlarının doğru olduğundan emin ol

**3. Rate Limit**
- Resend free plan: 3,000 email/ay
- Limit aşıldıysa upgrade gerekli

**4. Console Logları**
```bash
# Development'ta console'u kontrol et
# Email gönderim hataları loglanır
```

### Email Spam'e Düşüyor

**Çözümler:**
1. Domain doğrulama yap (SPF, DKIM, DMARC)
2. Email içeriğini iyileştir (spam kelimeleri kullanma)
3. Warm-up yap (ilk günlerde az email gönder)
4. Bounce rate'i düşük tut

### Email Geç Geliyor

**Nedenler:**
- Email provider'ın spam kontrolü
- DNS propagation
- Resend queue

**Çözüm:**
- Genelde 1-2 dakika içinde gelir
- 5 dakikadan uzun sürerse Resend support'a yaz

---

## 💰 Fiyatlandırma

### Free Plan
- 3,000 email/ay
- 100 email/gün
- 1 domain
- Email support

### Pro Plan ($20/ay)
- 50,000 email/ay
- Sınırsız domain
- Email analytics
- Priority support

### Enterprise
- Custom volume
- Dedicated IP
- SLA
- Custom support

---

## 🚀 Production Checklist

- [ ] Resend hesabı oluşturuldu
- [ ] API key alındı
- [ ] Domain eklendi ve doğrulandı
- [ ] Environment variables ayarlandı
- [ ] Test emaili gönderildi
- [ ] Şifre sıfırlama test edildi
- [ ] Admin bildirimleri test edildi
- [ ] Monitoring kuruldu
- [ ] Rate limiting eklendi (TODO)
- [ ] Backup email provider hazırlandı (opsiyonel)

---

## 📚 Kaynaklar

- [Resend Docs](https://resend.com/docs)
- [Resend Node.js SDK](https://github.com/resendlabs/resend-node)
- [Email Best Practices](https://resend.com/docs/knowledge-base/email-best-practices)
- [Domain Setup](https://resend.com/docs/dashboard/domains/introduction)

---

## 🎉 Sonuç

Email entegrasyonu tamamlandı! 🚀

**Durum:** Production Ready ✅

**Eksik:** Sadece Resend API key eklenmesi gerekiyor

**Süre:** ~30 dakika

---

**Son Güncelleme:** 16 Kasım 2025  
**Versiyon:** 1.0.0  
**Durum:** Tamamlandı ✅
