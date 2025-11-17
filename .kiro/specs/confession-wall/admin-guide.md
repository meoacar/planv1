# İtiraf Duvarı - Admin Paneli Kullanım Kılavuzu

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Admin Paneline Erişim](#admin-paneline-erişim)
3. [Moderasyon Sistemi](#moderasyon-sistemi)
4. [Rapor Yönetimi](#rapor-yönetimi)
5. [Analitik Dashboard](#analitik-dashboard)
6. [Sezonluk Tema Yönetimi](#sezonluk-tema-yönetimi)
7. [Best Practices](#best-practices)
8. [Sorun Giderme](#sorun-giderme)

---

## Genel Bakış

İtiraf Duvarı admin paneli, itirafların moderasyonu, raporların yönetimi ve sistem analitiğinin takibi için kullanılır. Admin olarak şu işlemleri yapabilirsiniz:

- ✅ Pending itirafları onaylama/reddetme
- 📊 Rapor edilen itirafları inceleme
- 📈 Detaylı analitik verileri görüntüleme
- 🎊 Sezonluk temaları yönetme
- 👥 Kullanıcı davranışlarını izleme

---

## Admin Paneline Erişim

### Gereksinimler

Admin paneline erişmek için:
1. Geçerli bir kullanıcı hesabı
2. `ADMIN` rolü (User.role = "ADMIN")
3. Aktif session

### Erişim URL'leri

```
Moderasyon Kuyruğu: /admin/confessions/moderation
Raporlar: /admin/confessions/reports
Analitik: /admin/confessions/analytics
Sezonluk Temalar: /admin/confessions/themes
```

### İlk Giriş

1. Admin hesabınızla giriş yapın
2. Sol menüden "Admin Paneli" seçeneğine tıklayın
3. "İtiraf Yönetimi" alt menüsünü açın
4. İlgili sayfaya gidin

---

## Moderasyon Sistemi

### Moderasyon Kuyruğu

Moderasyon kuyruğu, otomatik filtreler tarafından şüpheli bulunan veya manuel inceleme gerektiren itirafları listeler.

#### Kuyruk Sayfası

**URL:** `/admin/confessions/moderation`

**Görüntülenen Bilgiler:**
- İtiraf metni
- Kategori
- Kullanıcı bilgisi (username, email)
- Oluşturulma tarihi
- Otomatik moderasyon skoru (varsa)

#### İtiraf Onaylama

**Adımlar:**
1. İtirafı okuyun ve içeriği değerlendirin
2. "Onayla" butonuna tıklayın
3. İtiraf otomatik olarak yayınlanır
4. Kullanıcıya bildirim gönderilmez (normal akış)

**Ne Zaman Onaylanmalı:**
- ✅ İçerik topluluk kurallarına uygun
- ✅ Spam değil
- ✅ Uygunsuz dil/içerik yok
- ✅ Diğer kullanıcılara zarar vermez

**Örnek Onaylanabilir İtiraflar:**
```
"Dün gece buzdolabına gittim ve yarım kilo dondurma bitirdim..."
"Arkadaşlarla çıktık ve 3 dilim pizza yedim. Pişman değilim!"
"Ramazan'da iftar sonrası 5 baklava yedim, suçluluk hissediyorum."
```

#### İtiraf Reddetme

**Adımlar:**
1. İtirafı okuyun ve red nedenini belirleyin
2. "Reddet" butonuna tıklayın
3. Açılan modal'da red nedenini yazın (zorunlu)
4. "Reddet ve Bildir" butonuna tıklayın
5. Kullanıcıya otomatik bildirim gönderilir

**Ne Zaman Reddedilmeli:**
- ❌ Uygunsuz dil/küfür içeriyor
- ❌ Spam veya tekrarlayan içerik
- ❌ URL/link içeriyor (reklam)
- ❌ Diğer kullanıcılara hakaret
- ❌ Topluluk kurallarına aykırı
- ❌ Diyet/yeme ile ilgisiz

**Red Nedeni Örnekleri:**
```
"Uygunsuz dil kullanımı - Topluluk kurallarına aykırı"
"Spam içerik - Tekrarlayan mesaj"
"Reklam/link içeriyor - İzin verilmiyor"
"Konu dışı içerik - Diyet/yeme ile ilgisiz"
```

**Kullanıcıya Gönderilen Bildirim:**
```
Başlık: İtirafınız Reddedildi
Mesaj: İtirafınız "{red_nedeni}" nedeniyle reddedildi. 
       Lütfen topluluk kurallarına uygun içerik paylaşın.
```

#### Toplu İşlemler

Birden fazla itirafı aynı anda işlemek için:
1. İtirafların yanındaki checkbox'ları seçin
2. Üst menüden "Toplu Onayla" veya "Toplu Reddet" seçin
3. Toplu reddetme için tek bir red nedeni tüm itiraflar için kullanılır

**Dikkat:** Toplu işlemler geri alınamaz!

---

## Rapor Yönetimi

### Rapor Edilen İtiraflar

**URL:** `/admin/confessions/reports`

Kullanıcılar tarafından "Uygunsuz İçerik" olarak rapor edilen itirafları görüntüler.

#### Rapor Listesi

**Görüntülenen Bilgiler:**
- İtiraf metni ve kategorisi
- Toplam rapor sayısı
- Rapor nedenleri (kullanıcıların yazdığı)
- Rapor eden kullanıcılar
- İtirafın mevcut durumu (published/hidden)

#### Otomatik Gizleme

**Kural:** Bir itiraf 5 veya daha fazla rapor aldığında otomatik olarak gizlenir.

**Otomatik Gizleme Sonrası:**
- İtiraf status: `hidden` olur
- Feed'de görünmez
- Admin panelinde "Rapor Edilen İtiraflar" listesinde görünür
- Admin manuel inceleme yapmalı

#### Rapor İnceleme Süreci

1. **Raporları Oku:** Kullanıcıların rapor nedenlerini incele
2. **İtirafı Değerlendir:** İçeriğin gerçekten uygunsuz olup olmadığını kontrol et
3. **Karar Ver:**
   - **Gizli Tut:** İtiraf uygunsuzsa, gizli kalır
   - **Yeniden Yayınla:** İtiraf uygunsa, "Yeniden Yayınla" butonuna tıkla
   - **Kalıcı Sil:** Çok ciddi ihlal varsa, "Kalıcı Sil" butonuna tıkla

#### Yanlış Raporlar

Bazen kullanıcılar yanlış veya kötü niyetli raporlar yapabilir.

**Yanlış Rapor Örnekleri:**
- Kullanıcı sadece içeriği beğenmemiş
- Kişisel anlaşmazlık
- Trollük/kötü niyet

**Yanlış Rapor Durumunda:**
1. İtirafı "Yeniden Yayınla" ile aktif et
2. Rapor eden kullanıcıları not al (tekrar ederse uyarı)
3. Gerekirse rapor eden kullanıcıya uyarı gönder

---

## Analitik Dashboard

### Genel Bakış

**URL:** `/admin/confessions/analytics`

Detaylı analitik veriler ve grafikler sunar.

### Metrikler

#### 1. Günlük İstatistikler

**Grafik:** Çizgi grafik (son 30 gün)

**Veriler:**
- Günlük itiraf sayısı
- Günlük empati sayısı
- Günlük aktif kullanıcı

**Kullanım:**
- Trend analizi yapın
- Düşüş/artış nedenlerini araştırın
- Özel günlerdeki (bayram, vb.) aktiviteyi gözlemleyin

#### 2. Kategori Dağılımı

**Grafik:** Pasta grafik

**Veriler:**
- Her kategorinin toplam itiraf sayısı
- Yüzdelik dağılım

**Kullanım:**
- En popüler kategorileri belirleyin
- Sezonluk tema planlaması yapın
- İçerik stratejisi geliştirin

**Örnek Dağılım:**
```
Gece Saldırıları: 27% (423 itiraf)
Özel Gün Bahaneleri: 20% (312 itiraf)
Stres Yeme: 19% (289 itiraf)
Sosyal Baskı: 17% (267 itiraf)
Pişman Değilim: 12% (178 itiraf)
Sezonluk: 5% (78 itiraf)
```

#### 3. AI Performans Metrikleri

**Veriler:**
- AI yanıt başarı oranı (%)
- Ortalama yanıt süresi (saniye)
- Fallback kullanım oranı (%)

**Hedef Değerler:**
- Başarı oranı: > 95%
- Ortalama süre: < 5 saniye
- Fallback: < 5%

**Düşük Performans Durumunda:**
1. OpenAI API durumunu kontrol edin
2. Rate limit aşılmış olabilir
3. Prompt'ları optimize edin
4. Fallback yanıtları güncelleyin

#### 4. Telafi Planı Metrikleri

**Veriler:**
- Telafi planı kabul oranı (%)
- Telafi planı tamamlanma oranı (%)
- En çok kabul edilen telafi tipleri

**Kullanım:**
- Telafi önerilerini optimize edin
- Kullanıcı motivasyonunu ölçün
- XP ödüllerini ayarlayın

**Örnek:**
```
Kabul Oranı: 42.5%
Tamamlanma Oranı: 68.3%

En Popüler Telafi Tipleri:
1. Yürüyüş (35%)
2. Su içme (28%)
3. Salata yeme (22%)
4. Egzersiz (15%)
```

#### 5. Moderasyon İstatistikleri

**Veriler:**
- Pending itiraf sayısı
- Ortalama moderasyon süresi
- Onay/red oranı
- Spam tespit oranı

**Kullanım:**
- Moderasyon yükünü takip edin
- Otomatik filtreleri optimize edin
- Admin kaynak planlaması yapın

### Tarih Aralığı Filtreleme

Dashboard'da tarih aralığı seçebilirsiniz:
- Son 7 gün
- Son 30 gün
- Son 3 ay
- Özel tarih aralığı

### Veri Export

Analitik verileri CSV veya Excel formatında export edebilirsiniz:
1. "Export" butonuna tıklayın
2. Format seçin (CSV/Excel)
3. Tarih aralığı belirleyin
4. "İndir" butonuna tıklayın

---

## Sezonluk Tema Yönetimi

### Tema Nedir?

Sezonluk temalar, özel günlerde (Ramazan, Bayram, Yılbaşı) aktif olan özel itiraf kategorileridir.

**Örnek Temalar:**
- 🌙 Ramazan: "İftar Sonrası İtiraflar"
- 🎄 Yılbaşı: "Yılbaşı Sofrası Mağdurları"
- 🎊 Bayram: "Bayram Şekeri Kurbanları"

### Tema Oluşturma

**URL:** `/admin/confessions/themes`

**Adımlar:**
1. "Yeni Tema Oluştur" butonuna tıklayın
2. Formu doldurun:
   - **İsim:** Tema adı (örn: "Ramazan 2026")
   - **Kategori:** "seasonal" (sabit)
   - **İkon:** Emoji (örn: 🌙)
   - **Başlangıç Tarihi:** Temanın aktif olacağı ilk gün
   - **Bitiş Tarihi:** Temanın pasif olacağı son gün
3. "Oluştur" butonuna tıklayın

**Örnek Form:**
```
İsim: Ramazan 2026
Kategori: seasonal
İkon: 🌙
Başlangıç: 01.03.2026 00:00
Bitiş: 30.03.2026 23:59
```

### Tema Düzenleme

Mevcut bir temayı düzenlemek için:
1. Tema listesinde "Düzenle" butonuna tıklayın
2. İsim, ikon veya tarihleri değiştirin
3. "Kaydet" butonuna tıklayın

### Tema Aktif/Pasif Etme

Temayı manuel olarak aktif/pasif edebilirsiniz:
1. Tema listesinde toggle switch'e tıklayın
2. Aktif temalar yeşil, pasif temalar gri görünür

**Not:** Tarih aralığı dışında olan temalar otomatik olarak pasif olur.

### Tema Silme

Bir temayı kalıcı olarak silmek için:
1. Tema listesinde "Sil" butonuna tıklayın
2. Onay modal'ında "Evet, Sil" butonuna tıklayın

**Dikkat:** Silinen tema geri getirilemez!

### Tema Planlama Önerileri

**Ramazan:**
- Başlangıç: Ramazan'ın ilk günü
- Bitiş: Ramazan'ın son günü
- İkon: 🌙
- Kategori önerisi: "İftar sonrası itiraflar"

**Yılbaşı:**
- Başlangıç: 25 Aralık
- Bitiş: 2 Ocak
- İkon: 🎄
- Kategori önerisi: "Yılbaşı sofrası mağdurları"

**Bayram:**
- Başlangıç: Bayramın 1. günü
- Bitiş: Bayramın son günü
- İkon: 🎊
- Kategori önerisi: "Bayram şekeri kurbanları"

---

## Best Practices

### Moderasyon Best Practices

#### 1. Hızlı Yanıt

- ⏱️ Pending itirafları 24 saat içinde inceleyin
- 🚀 Kullanıcı deneyimi için hız önemli
- 📊 Moderasyon kuyruğunu günde 2-3 kez kontrol edin

#### 2. Tutarlı Kararlar

- 📋 Topluluk kurallarına sıkı sıkıya bağlı kalın
- ⚖️ Benzer itiraflar için benzer kararlar verin
- 📝 Red nedenlerini net ve açık yazın

#### 3. Empatik Yaklaşım

- ❤️ Kullanıcılar hassas içerik paylaşıyor
- 🤝 Red nedenlerini kırıcı olmayan dille yazın
- 💬 Yapıcı geri bildirim verin

**İyi Red Nedeni:**
```
"İçeriğiniz topluluk kurallarımıza uygun değil. 
Lütfen uygunsuz dil kullanmadan tekrar deneyin."
```

**Kötü Red Nedeni:**
```
"Çok kötü bir itiraf, kabul edilemez!"
```

#### 4. Spam Tespiti

**Spam İşaretleri:**
- Aynı kullanıcıdan kısa sürede çok sayıda itiraf
- Tekrarlayan içerik
- URL/link içeriyor
- Anlamsız/rastgele karakterler

**Spam Durumunda:**
1. İtirafı reddedin
2. Kullanıcıyı "Spam" olarak işaretleyin
3. 3+ spam itirafı olan kullanıcıları geçici ban'leyin

### Rapor Yönetimi Best Practices

#### 1. Öncelik Sıralaması

**Yüksek Öncelik:**
- 10+ rapor alan itiraflar
- Uygunsuz dil/hakaret içeren
- Spam/reklam içeren

**Orta Öncelik:**
- 5-9 rapor alan itiraflar
- Konu dışı içerik

**Düşük Öncelik:**
- 1-4 rapor alan itiraflar
- Muhtemelen yanlış raporlar

#### 2. Objektif Değerlendirme

- 🎯 Kişisel görüşlerinizi bir kenara bırakın
- 📜 Sadece topluluk kurallarına göre karar verin
- 🔍 Rapor nedenlerini dikkatlice okuyun

#### 3. Yanlış Rapor Takibi

- 📊 Sık sık yanlış rapor yapan kullanıcıları takip edin
- ⚠️ 5+ yanlış rapor yapana uyarı gönderin
- 🚫 Kötü niyetli raporlama yapanları ban'leyin

### Analitik Kullanımı Best Practices

#### 1. Düzenli Takip

- 📅 Haftalık analitik raporu oluşturun
- 📈 Trend değişikliklerini not edin
- 🎯 Hedef metrikler belirleyin

#### 2. Veri Odaklı Kararlar

- 📊 Kategori dağılımına göre içerik stratejisi geliştirin
- 🤖 AI performansını optimize edin
- 🎁 Telafi önerilerini iyileştirin

#### 3. Raporlama

- 📄 Aylık yönetim raporu hazırlayın
- 💡 İyileştirme önerileri sunun
- 🎯 KPI'ları takip edin

**Örnek KPI'lar:**
```
- Günlük aktif itiraf yapan kullanıcı: > 50
- AI başarı oranı: > 95%
- Ortalama moderasyon süresi: < 12 saat
- Telafi kabul oranı: > 40%
- Kullanıcı memnuniyeti: > 4.5/5
```

---

## Sorun Giderme

### Sık Karşılaşılan Sorunlar

#### 1. Moderasyon Kuyruğu Boş Görünüyor

**Olası Nedenler:**
- Tüm itiraflar zaten işlenmiş
- Otomatik filtreler çok agresif (hiçbir itiraf kuyruğa gelmiyor)
- Kullanıcılar itiraf yapmıyor

**Çözüm:**
1. Genel istatistikleri kontrol edin
2. Otomatik filtre ayarlarını gözden geçirin
3. Son 24 saatteki itiraf sayısını kontrol edin

#### 2. AI Yanıtları Üretilmiyor

**Olası Nedenler:**
- OpenAI API key geçersiz/süresi dolmuş
- Rate limit aşıldı
- API timeout

**Çözüm:**
1. `.env` dosyasında `OPENAI_API_KEY` kontrol edin
2. OpenAI dashboard'da kullanım limitlerini kontrol edin
3. Fallback yanıtların çalıştığından emin olun
4. Queue worker'ın çalıştığından emin olun

#### 3. Raporlar Görünmüyor

**Olası Nedenler:**
- Henüz rapor edilmiş itiraf yok
- Database bağlantı sorunu

**Çözüm:**
1. Test amaçlı bir itirafı kendiniz raporlayın
2. Database bağlantısını kontrol edin
3. Browser console'da hata var mı kontrol edin

#### 4. Sezonluk Tema Aktif Olmuyor

**Olası Nedenler:**
- Tarih aralığı yanlış ayarlanmış
- Tema manuel olarak pasif edilmiş
- Timezone farkı

**Çözüm:**
1. Tema tarihlerini kontrol edin (UTC timezone)
2. `isActive` toggle'ını kontrol edin
3. Server saatini kontrol edin

#### 5. Analitik Verileri Yüklenmiyor

**Olası Nedenler:**
- Tarih aralığı çok geniş
- Cache sorunu
- Database query timeout

**Çözüm:**
1. Daha kısa tarih aralığı seçin
2. Browser cache'i temizleyin
3. Sayfayı yenileyin
4. Server loglarını kontrol edin

### Acil Durum Prosedürleri

#### Uygunsuz İçerik Krizi

Eğer çok sayıda uygunsuz itiraf yayınlanmışsa:

1. **Hızlı Aksiyon:**
   - Tüm pending itirafları geçici olarak durdur
   - Otomatik filtreleri en sıkı seviyeye çek
   - Yayındaki uygunsuz itirafları toplu gizle

2. **İnceleme:**
   - Son 24 saatteki tüm itirafları manuel incele
   - Sorumlu kullanıcıları belirle
   - Gerekirse ban uygula

3. **Önlem:**
   - Otomatik filtre kurallarını güncelle
   - Moderasyon sürecini gözden geçir
   - Topluluk kurallarını netleştir

#### Spam Saldırısı

Eğer bot/spam saldırısı varsa:

1. **Tespit:**
   - Aynı IP'den gelen istekleri kontrol et
   - Benzer içerikli itirafları tespit et
   - Şüpheli kullanıcıları listele

2. **Engelleme:**
   - Rate limiting'i artır
   - Şüpheli IP'leri ban'le
   - CAPTCHA ekle (gerekirse)

3. **Temizlik:**
   - Spam itirafları toplu sil
   - Spam kullanıcıları ban'le
   - Database'i temizle

#### AI Sistemi Çöktü

Eğer AI yanıt üretimi tamamen durmuşsa:

1. **Fallback Aktif Et:**
   - Tüm yeni itiraflar fallback yanıt alsın
   - Kullanıcılara bilgilendirme göster

2. **Sorun Giderme:**
   - OpenAI API durumunu kontrol et
   - Queue worker'ı restart et
   - Error loglarını incele

3. **İletişim:**
   - Kullanıcılara duyuru yap
   - Tahmini çözüm süresini bildir
   - Düzelince tekrar duyuru yap

---

## İletişim ve Destek

### Teknik Destek

**Email:** tech-support@yourdomain.com
**Slack:** #admin-support kanalı
**Acil Durum:** +90 XXX XXX XX XX

### Dokümantasyon

- API Dokümantasyonu: `/docs/api`
- Geliştirici Kılavuzu: `/docs/developer`
- Topluluk Kuralları: `/docs/community-rules`

### Geri Bildirim

Admin paneli ile ilgili önerilerinizi:
- Email: admin-feedback@yourdomain.com
- GitHub Issues: github.com/yourorg/yourrepo/issues

---

## Versiyon Geçmişi

**v1.0.0** (17 Kasım 2025)
- İlk versiyon
- Temel moderasyon özellikleri
- Rapor yönetimi
- Analitik dashboard
- Sezonluk tema yönetimi

---

## Ek Kaynaklar

### Video Eğitimler

1. **Moderasyon 101** (10 dk) - Temel moderasyon işlemleri
2. **Rapor Yönetimi** (8 dk) - Raporları nasıl değerlendirirsiniz
3. **Analitik Dashboard** (12 dk) - Metrikleri nasıl okursunuz
4. **Sezonluk Temalar** (6 dk) - Tema oluşturma ve yönetme

### Cheat Sheet

**Hızlı Kısayollar:**
```
Moderasyon Kuyruğu: Alt + M
Raporlar: Alt + R
Analitik: Alt + A
Yeni Tema: Alt + T
```

**Hızlı Kararlar:**
```
Onayla: Ctrl + Enter
Reddet: Ctrl + Delete
Gizle: Ctrl + H
```

### Topluluk Kuralları Özeti

1. ✅ Diyet/yeme ile ilgili itiraflar
2. ✅ Anonim ve saygılı içerik
3. ❌ Uygunsuz dil/küfür
4. ❌ Spam/reklam
5. ❌ Hakaret/aşağılama
6. ❌ Konu dışı içerik

---

**Son Güncelleme:** 17 Kasım 2025
**Versiyon:** 1.0.0
**Hazırlayan:** İtiraf Duvarı Ekibi
