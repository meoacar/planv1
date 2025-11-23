# 📰 Günlük Blog Bot Sistemi

## Genel Bakış

Her gün sabah saat 09:00'da otomatik olarak blog yazısı paylaşan bot sistemi kuruldu.

## Nasıl Çalışıyor?

### 1. Vercel Cron Job
- **Zamanlama:** Her gün 09:00 (UTC)
- **Endpoint:** `/api/cron/daily-blog`
- **Güvenlik:** CRON_SECRET ile korumalı

### 2. İçerik Stratejisi: Hibrit Yaklaşım

**Şablon Havuzu (5 adet):**
- Motivasyon
- Beslenme
- Egzersiz
- Uyku
- Stres Yönetimi

**AI Zenginleştirme:**
- Gemini AI ile güncel bilgi ekleme
- Mevsimsel ipuçları
- Tarih bazlı kişiselleştirme

### 3. Bildirim Sistemi
- Sadece aktif kullanıcılara (son 7 günde aktif)
- Push notification ile
- Maksimum 1000 kullanıcı/batch

## Teknik Detaylar

### Dosya Yapısı
```
src/
├── app/api/cron/daily-blog/
│   └── route.ts              # Cron endpoint
├── lib/ai/
│   └── blog-generator.ts     # İçerik üretici
└── lib/
    └── push-service.ts       # Bildirim servisi (güncellendi)
```

### Bot Kullanıcısı
- Email: `bot@zayiflamaplan.com`
- Username: `zayiflamaplan_bot`
- Role: `ADMIN`
- İlk çalışmada otomatik oluşturulur

### Blog Kategorisi
- Slug: `gunluk-motivasyon`
- İsim: `Günlük Motivasyon`
- Icon: 🌟
- İlk çalışmada otomatik oluşturulur

## Özellikler

### ✅ Avantajlar
- Tam otomatik çalışma
- AI ile zenginleştirilmiş içerik
- Kontrollü şablon sistemi
- Akıllı bildirim (sadece aktif kullanıcılar)
- Düşük maliyet (günde 1 AI çağrısı)
- Kolay bakım

### 🔄 İçerik Döngüsü
Şablonlar sırayla kullanılır:
1. Gün 1: Motivasyon
2. Gün 2: Beslenme
3. Gün 3: Egzersiz
4. Gün 4: Uyku
5. Gün 5: Stres
6. Gün 6: Motivasyon (tekrar başlar)

## Kurulum

### 1. Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key
CRON_SECRET=your_cron_secret
```

### 2. Deploy
```bash
git add .
git commit -m "Add daily blog bot"
git push
```

Vercel otomatik olarak cron job'u algılayacak ve aktif edecek.

## Test Etme

### Manuel Test (Local)
```bash
curl -X GET http://localhost:3000/api/cron/daily-blog \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Vercel'de Test
Vercel Dashboard → Cron Jobs → "daily-blog" → "Run Now"

## Monitoring

### Log Kontrolü
```bash
# Vercel Dashboard'da
Functions → /api/cron/daily-blog → Logs
```

### Başarı Metrikleri
- Blog oluşturuldu mu?
- Kaç kullanıcıya bildirim gönderildi?
- AI zenginleştirme başarılı mı?

## Özelleştirme

### Yeni Şablon Ekleme
`src/lib/ai/blog-generator.ts` dosyasında `BLOG_TEMPLATES` dizisine ekle:

```typescript
{
  topic: 'yeni-konu',
  title: 'Başlık',
  excerpt: 'Özet',
  baseContent: `Markdown içerik`
}
```

### Saat Değiştirme
`vercel.json` dosyasında schedule değiştir:
```json
"schedule": "0 9 * * *"  // Her gün 09:00
```

### Bildirim Ayarları
`src/app/api/cron/daily-blog/route.ts` dosyasında:
- Aktif kullanıcı tanımı (şu an: son 7 gün)
- Maksimum kullanıcı sayısı (şu an: 1000)

## Sorun Giderme

### Blog Oluşturulmadı
- CRON_SECRET doğru mu?
- Bot kullanıcısı oluşturuldu mu?
- Kategori var mı?

### Bildirim Gönderilmedi
- Kullanıcıların push subscription'ı var mı?
- VAPID keys ayarlı mı?
- Notification settings aktif mi?

### AI Zenginleştirme Başarısız
- GEMINI_API_KEY doğru mu?
- API limiti aşıldı mı?
- Fallback: Sadece şablon kullanılır

## Gelecek İyileştirmeler

- [ ] Kullanıcı tercihlerine göre konu seçimi
- [ ] Haftalık/aylık özet blog'ları
- [ ] Kullanıcı istatistiklerine dayalı içerik
- [ ] Çoklu dil desteği
- [ ] A/B testing için farklı başlıklar
- [ ] Görsel otomatik oluşturma

## Notlar

- İlk çalışmada bot kullanıcısı ve kategori otomatik oluşturulur
- AI başarısız olursa sadece şablon kullanılır (fallback)
- Slug formatı: `{topic}-YYYY-MM-DD`
- Bildirimler batch olarak gönderilir (performans)

---

**Durum:** ✅ Aktif ve Çalışıyor
**Son Güncelleme:** 23 Kasım 2025
