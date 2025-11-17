# İtiraf Duvarı - Dokümantasyon İndeksi

Bu klasör, İtiraf Duvarı özelliğinin tüm dokümantasyonunu içerir.

## 📚 Dokümantasyon Dosyaları

### 1. Planlama ve Tasarım

- **[requirements.md](./requirements.md)** - Detaylı gereksinimler ve kabul kriterleri
- **[design.md](./design.md)** - Sistem mimarisi ve teknik tasarım
- **[tasks.md](./tasks.md)** - İmplementasyon görev listesi

### 2. API Dokümantasyonu

- **[api-documentation.md](./api-documentation.md)** - Detaylı API endpoint dokümantasyonu
  - Tüm endpoint'lerin açıklamaları
  - Request/Response örnekleri
  - Hata kodları ve açıklamaları
  - cURL örnekleri

- **[openapi.yaml](./openapi.yaml)** - OpenAPI 3.0 spesifikasyonu
  - Swagger UI ile görüntülenebilir
  - API client'ları için kullanılabilir
  - Otomatik dokümantasyon üretimi için

- **[postman-collection.json](./postman-collection.json)** - Postman collection
  - Tüm endpoint'leri test etmek için
  - Environment variables ile kullanılabilir
  - Otomatik testler içerir

### 3. Admin Dokümantasyonu

- **[admin-guide.md](./admin-guide.md)** - Admin paneli kullanım kılavuzu
  - Moderasyon sistemi
  - Rapor yönetimi
  - Analitik dashboard
  - Sezonluk tema yönetimi
  - Sorun giderme

- **[moderation-best-practices.md](./moderation-best-practices.md)** - Moderasyon en iyi uygulamaları
  - Moderasyon felsefesi
  - Karar verme kriterleri
  - Örnek senaryolar
  - İletişim şablonları
  - Kalite kontrol

## 🚀 Hızlı Başlangıç

### Geliştiriciler İçin

1. **Gereksinimleri Okuyun:** [requirements.md](./requirements.md)
2. **Tasarımı İnceleyin:** [design.md](./design.md)
3. **API Dokümantasyonunu Kullanın:** [api-documentation.md](./api-documentation.md)
4. **Postman Collection'ı İmport Edin:** [postman-collection.json](./postman-collection.json)

### Admin/Moderatörler İçin

1. **Admin Kılavuzunu Okuyun:** [admin-guide.md](./admin-guide.md)
2. **Best Practices'i İnceleyin:** [moderation-best-practices.md](./moderation-best-practices.md)
3. **Moderasyon Eğitimini Tamamlayın**

## 📖 Dokümantasyon Kullanımı

### API Dokümantasyonu Nasıl Kullanılır?

#### 1. Markdown Dokümantasyonu

En hızlı başlangıç için [api-documentation.md](./api-documentation.md) dosyasını okuyun:
- Tüm endpoint'ler detaylı açıklanmış
- cURL örnekleri ile hemen test edebilirsiniz
- Hata kodları ve çözümleri mevcut

#### 2. OpenAPI/Swagger

OpenAPI spec'i kullanarak interaktif dokümantasyon oluşturun:

```bash
# Swagger UI ile görüntüleme
npx swagger-ui-watcher openapi.yaml
```

Veya online araçlar kullanın:
- [Swagger Editor](https://editor.swagger.io/) - openapi.yaml dosyasını yükleyin
- [Redoc](https://redocly.github.io/redoc/) - Güzel dokümantasyon görünümü

#### 3. Postman Collection

Postman'de test etmek için:

1. Postman'i açın
2. Import > File > [postman-collection.json](./postman-collection.json) seçin
3. Environment variables'ı ayarlayın:
   - `base_url`: API base URL (örn: http://localhost:3000/api/v1)
   - `session_token`: NextAuth session token
4. Request'leri çalıştırın

### Admin Dokümantasyonu Nasıl Kullanılır?

#### Yeni Admin/Moderatör

1. **İlk Adım:** [admin-guide.md](./admin-guide.md) dosyasını baştan sona okuyun
2. **Best Practices:** [moderation-best-practices.md](./moderation-best-practices.md) dosyasını inceleyin
3. **Pratik:** Deneyimli bir moderatör gözetiminde moderasyon yapın

#### Deneyimli Moderatör

- **Referans:** Belirsiz durumlarda best practices'e bakın
- **Şablonlar:** İletişim şablonlarını kullanın
- **Kalite:** Düzenli olarak kalite metriklerinizi kontrol edin

## 🔧 Teknik Detaylar

### API Versiyonlama

Mevcut API versiyonu: **v1**

Base URL: `/api/v1/`

### Authentication

Tüm endpoint'ler NextAuth session-based authentication kullanır:
- Cookie: `next-auth.session-token`
- Admin endpoint'leri için `ADMIN` rolü gerekli

### Rate Limiting

- İtiraf oluşturma: 3/gün per user
- Empati gösterme: 100/saat per user
- Rapor etme: 10/gün per user
- Genel API: 100 req/dakika per IP

### Hata Kodları

Tüm hata kodları ve açıklamaları [api-documentation.md](./api-documentation.md#hata-kodları) dosyasında mevcuttur.

## 📊 Metrikler ve Analitik

### Önemli Metrikler

- **Günlük Aktif Kullanıcı:** İtiraf yapan kullanıcı sayısı
- **AI Başarı Oranı:** AI yanıt üretim başarı yüzdesi
- **Moderasyon Süresi:** Ortalama moderasyon karar süresi
- **Telafi Kabul Oranı:** Telafi planı kabul eden kullanıcı yüzdesi

Detaylı metrikler için: [admin-guide.md](./admin-guide.md#analitik-dashboard)

## 🆘 Destek

### Teknik Destek

- **Email:** tech-support@yourdomain.com
- **GitHub Issues:** [github.com/yourorg/yourrepo/issues](https://github.com/yourorg/yourrepo/issues)

### Moderasyon Desteği

- **Email:** moderation-support@yourdomain.com
- **Slack:** #moderation-help kanalı

### Acil Durum

- **Telefon:** +90 XXX XXX XX XX
- **Email:** emergency@yourdomain.com

## 📝 Katkıda Bulunma

Dokümantasyonu geliştirmek için:

1. İlgili dosyayı düzenleyin
2. Pull request oluşturun
3. Açıklayıcı commit mesajı yazın

## 🔄 Güncelleme Geçmişi

### v1.0.0 (17 Kasım 2025)

**Eklenenler:**
- ✅ API dokümantasyonu (Markdown, OpenAPI, Postman)
- ✅ Admin paneli kullanım kılavuzu
- ✅ Moderasyon best practices
- ✅ Örnek senaryolar ve şablonlar

## 📋 Checklist: Dokümantasyon Tamamlandı mı?

### API Dokümantasyonu
- [x] Tüm endpoint'ler dokümante edildi
- [x] Request/Response örnekleri eklendi
- [x] Hata kodları açıklandı
- [x] OpenAPI spec oluşturuldu
- [x] Postman collection hazırlandı
- [x] cURL örnekleri eklendi

### Admin Dokümantasyonu
- [x] Admin paneli kullanım kılavuzu yazıldı
- [x] Moderasyon best practices oluşturuldu
- [x] Örnek senaryolar eklendi
- [x] İletişim şablonları hazırlandı
- [x] Sorun giderme bölümü eklendi
- [x] Kalite kontrol metrikleri tanımlandı

### Genel
- [x] README dosyası oluşturuldu
- [x] Tüm dosyalar birbirine referans veriyor
- [x] Tutarlı format kullanıldı
- [x] Örnekler gerçekçi ve anlaşılır

## 🎯 Sonraki Adımlar

1. **Geliştirme:** [tasks.md](./tasks.md) dosyasındaki görevleri implement edin
2. **Test:** Postman collection ile API'yi test edin
3. **Eğitim:** Admin/moderatörleri eğitin
4. **Launch:** Sistemi yayına alın

---

**Son Güncelleme:** 17 Kasım 2025
**Versiyon:** 1.0.0
**Hazırlayan:** İtiraf Duvarı Ekibi
