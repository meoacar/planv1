# 📚 Admin Panel Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### Admin Paneline Erişim

1. **Giriş Yapın**
   ```
   http://localhost:3000/giris
   ```

2. **Admin Rolü Gerekli**
   - Database'de `role = 'ADMIN'` olmalı
   - Yoksa otomatik `/dashboard`'a yönlendirilir

3. **Admin Panel**
   ```
   http://localhost:3000/admin
   ```

---

## ⌨️ Klavye Kısayolları

### Navigasyon
- `G` + `D` → Dashboard
- `G` + `P` → Planlar
- `G` + `U` → Kullanıcılar
- `G` + `C` → Yorumlar
- `G` + `S` → Ayarlar

### Genel
- `Ctrl` + `K` → Arama odakla
- `?` → Kısayolları göster
- `Esc` → Dialog kapat

**Not:** Input/textarea içindeyken kısayollar devre dışıdır.

---

## 🎨 Arayüz Özellikleri

### Sidebar (Yan Menü)
- **Daralt/Genişlet:** Sağ üstteki ok butonuna tıkla
- **Daraltıldığında:** Sadece iconlar görünür
- **Tooltip:** Icon'ların üzerine gel, isim görünür

### Dark Mode
- **Toggle:** Sağ üst köşedeki ay/güneş iconuna tıkla
- **Otomatik:** Sistem temasını takip eder
- **Kalıcı:** Seçim localStorage'da saklanır

### Arama
- **Odaklanma:** `Ctrl+K` veya arama kutusuna tıkla
- **Kapsam:** Kullanıcı, plan, yorum ara
- **Real-time:** Yazarken arar (gelecek özellik)

---

## 📊 Tablo Özellikleri

### Sıralama
1. Sütun başlığındaki ok iconuna tıkla
2. İlk tıklama: Artan (↑)
3. İkinci tıklama: Azalan (↓)
4. Üçüncü tıklama: Sıfırla

### Seçim
- **Tek seçim:** Satır başındaki checkbox'a tıkla
- **Tümünü seç:** Başlıktaki checkbox'a tıkla
- **Seçimi temizle:** Bulk actions'daki "Seçimi Temizle" butonu

### Toplu İşlemler
1. Satırları seç (checkbox)
2. Üstte "X öğe seçildi" mesajı görünür
3. Dropdown'dan işlem seç (Onayla, Sil, vb.)
4. "Uygula" butonuna tıkla
5. Onay dialogu çıkarsa onayla

---

## 📄 Sayfa Kullanımları

### 1. Dashboard (`/admin`)

**Özellikler:**
- Genel istatistikler (kullanıcı, plan, yorum)
- Hızlı işlemler (bekleyen planlar, yorumlar)
- Sistem durumu (Database, Redis, Email)
- Son aktiviteler

**Kullanım:**
- Hızlı işlemler kartlarına tıkla → İlgili sayfaya git
- Sistem durumu kartlarını kontrol et
- Aktivite loglarını incele

---

### 2. Plan Yönetimi (`/admin/planlar`)

**Özellikler:**
- Plan listesi (tablo)
- Durum filtreleme (bekleyen, yayında, reddedilen)
- Arama (başlık, açıklama)
- Sıralama (tarih, görüntülenme, beğeni)
- Toplu işlemler

**İşlemler:**
1. **Onaylama:**
   - Tek: Satırdaki ✓ butonuna tıkla
   - Toplu: Seç → "Onayla" → Uygula

2. **Reddetme:**
   - Tek: Satırdaki ✗ butonuna tıkla
   - Toplu: Seç → "Reddet" → Uygula

3. **Silme:**
   - Tek: Satırdaki çöp kutusu iconuna tıkla → Onayla
   - Toplu: Seç → "Sil" → Uygula → Onayla

4. **Görüntüleme:**
   - Göz iconuna tıkla → Plan detay sayfası

---

### 3. Kullanıcı Yönetimi (`/admin/kullanicilar`)

**Özellikler:**
- Kullanıcı listesi
- Rol filtreleme (Admin, User)
- Arama (isim, email, username)
- Sıralama (kayıt tarihi, plan sayısı)
- Toplu işlemler

**İşlemler:**
1. **Düzenleme:**
   - Kalem iconuna tıkla
   - Form açılır
   - Bilgileri güncelle
   - Kaydet

2. **Admin Yap/Kaldır:**
   - "Admin Yap" butonuna tıkla
   - Onay dialogu
   - Onayla

3. **Yasakla/Yasağı Kaldır:**
   - "Yasakla" butonuna tıkla
   - Onay dialogu
   - Onayla
   - Yasaklı kullanıcı giriş yapamaz

4. **Silme:**
   - Çöp kutusu iconuna tıkla
   - Onay dialogu
   - Onayla
   - **DİKKAT:** Tüm verileri silinir!

5. **Profil Görüntüleme:**
   - Kullanıcı adına tıkla
   - Profil sayfası açılır

---

### 4. Yorum Moderasyonu (`/admin/yorumlar`)

**Özellikler:**
- Yorum listesi
- Durum göstergeleri (görünür, bekleyen, gizli)
- Hedef içerik bilgisi
- Yazar bilgileri

**İşlemler:**
1. **Onaylama:**
   - ✓ butonuna tıkla
   - Yorum görünür olur

2. **Gizleme:**
   - Göz iconuna tıkla
   - Yorum gizlenir (silinmez)

3. **Silme:**
   - Çöp kutusu iconuna tıkla
   - Onay dialogu
   - Kalıcı olarak silinir

---

### 5. Roller & İzinler (`/admin/roller`)

**Özellikler:**
- Rol istatistikleri
- İzin karşılaştırma tablosu
- Admin kullanıcılar listesi
- Yeni rol oluşturma

**İşlemler:**
1. **Yeni Rol Oluşturma:**
   - "Yeni Rol" butonuna tıkla
   - Rol adını gir (örn: MODERATOR)
   - "Rol Oluştur"
   - İzin düzenleme sayfasına yönlendirilir

2. **İzin Düzenleme:**
   - "İzinleri Düzenle" butonuna tıkla
   - Rol seç (dropdown)
   - İzinleri tıklayarak seç/kaldır
   - Kaydet

**28 İzin Türü:**
- **Plan:** create, read, update_own, update_any, delete_own, delete_any, approve, reject
- **Yorum:** create, read, update_own, delete_own, delete_any, moderate
- **Kullanıcı:** read, update_own, update_any, delete, ban, change_role
- **Ayar:** read, update
- **İstatistik:** read, export
- **Log:** read, delete
- **Sistem:** manage, backup

---

### 6. API Keys (`/admin/api-keys`)

**Özellikler:**
- API key listesi
- İzin yönetimi
- Aktif/Pasif durumu
- Son kullanım tarihi

**İşlemler:**
1. **Yeni API Key Oluşturma:**
   - "Yeni API Key" butonuna tıkla
   - İsim gir
   - Geçerlilik süresi (opsiyonel)
   - İzinleri seç
   - "API Key Oluştur"
   - **ÖNEMLİ:** Key'i kopyala (bir daha göremezsin!)

2. **Kopyalama:**
   - Kopyala iconuna tıkla
   - Key panoya kopyalanır

3. **Aktif/Pasif:**
   - Power iconuna tıkla
   - Key aktif/pasif olur

4. **Silme:**
   - Çöp kutusu iconuna tıkla
   - Onay dialogu
   - Kalıcı olarak silinir

**API Kullanımı:**
```javascript
fetch('https://api.zayiflamaplan.com/v1/plans', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
```

---

### 7. Ayarlar (`/admin/ayarlar`)

**7 Kategori:**

#### 1. Genel
- Site adı, açıklama
- İletişim email
- Site URL

#### 2. Görünüm
- Logo URL
- Favicon URL
- Renk şeması

#### 3. Sosyal Medya
- Facebook, Twitter, Instagram
- YouTube, LinkedIn URL'leri

#### 4. SEO
- SEO başlık (60 karakter)
- SEO açıklama (160 karakter)
- Anahtar kelimeler
- Open Graph resim
- Twitter kullanıcı adı
- Google Analytics ID
- Google Site Verification
- robots.txt

**SEO Otomatik Aktif:**
- Google Analytics script eklenir
- Site verification meta tag eklenir
- `/sitemap.xml` otomatik oluşturulur
- `/robots.txt` özelleştirilebilir

#### 5. Moderasyon
- Yasaklı kelimeler (virgülle ayır)
- Otomatik moderasyon (açık/kapalı)

#### 6. Email
- Gönderen email
- Gönderen adı

#### 7. Güvenlik
- Rate limiting (açık/kapalı)
- XSS koruması (açık/kapalı)

**Kullanım:**
1. Sekmeyi seç
2. Alanları doldur
3. "Kaydet" butonuna tıkla
4. Toast bildirimi
5. Anında aktif olur!

---

### 8. İstatistikler (`/admin/istatistikler`)

**4 Sekme:**

#### 1. Genel Bakış
- Toplam kullanıcı, plan, görüntülenme, etkileşim
- Haftalık büyüme metrikleri

#### 2. Kullanıcılar
- Yeni kayıtlar
- Aktif kullanıcılar
- Retention oranı

#### 3. İçerik
- Yeni planlar
- Popüler planlar (top 10)
- Ortalama görüntülenme

#### 4. Etkileşim
- Toplam beğeni, yorum
- Ortalama etkileşim oranı

---

### 9. Aktivite Logları (`/admin/aktiviteler`)

**Özellikler:**
- Tüm platform aktiviteleri
- Aktivite tipleri (plan, kullanıcı, yorum)
- Filtreleme ve arama
- Zaman damgaları
- Durum göstergeleri

**Aktivite Tipleri:**
- Plan oluşturuldu
- Plan onaylandı
- Plan reddedildi
- Kullanıcı kaydoldu
- Kullanıcı yasaklandı
- Yorum eklendi
- Yorum silindi

---

### 10. Moderasyon (`/admin/moderasyon`)

**Özellikler:**
- Bekleyen içerik sayısı
- Raporlanan içerikler
- Engellenen kullanıcılar
- Onaylanan içerik istatistikleri
- Moderasyon kuralları

**Kullanım:**
- Bekleyen içeriklere tıkla → İlgili sayfaya git
- Raporları incele
- Engellenen kullanıcıları gör

---

### 11. Sistem (`/admin/sistem`)

**Özellikler:**
- CPU, RAM, Disk kullanımı
- Servis durumu (Database, Redis, Email)
- Yedekleme yönetimi
- Cache yönetimi
- Sistem logları
- Redis key'leri

**İşlemler:**

#### 1. Export (Veri Dışa Aktarma)
- "Export" dropdown'ına tıkla
- Veri tipi seç:
  - Tüm Veriler (JSON)
  - Kullanıcılar (JSON/CSV)
  - Planlar (JSON/CSV)
  - Yorumlar (JSON)
  - Ayarlar (JSON)
- Otomatik indirilir
- Dosya adı: `export-{type}-{timestamp}.{format}`

#### 2. Cache Temizle
- "Cache Temizle" butonuna tıkla
- Next.js cache temizlenir
- Toast bildirimi

#### 3. Redis Temizle
- "Redis Temizle" butonuna tıkla
- Onay dialogu
- Tüm Redis cache silinir
- Rate limiting sayaçları sıfırlanır

#### 4. Servisleri Yenile
- "Servisleri Yenile" butonuna tıkla
- Servisler yeniden başlatılır
- Toast bildirimi

---

## 🔧 Bakım Modu

### Aktif Etme
1. `.env` dosyasını aç
2. Ekle: `MAINTENANCE_MODE=true`
3. Sunucuyu yeniden başlat

### Devre Dışı Bırakma
1. `.env` dosyasını aç
2. Değiştir: `MAINTENANCE_MODE=false`
3. Sunucuyu yeniden başlat

### Özellikler
- Admin bypass (admin erişebilir)
- Özelleştirilebilir mesaj (Ayarlar'dan)
- Animasyonlu loading
- Dark mode desteği

**Mesaj Özelleştirme:**
1. `/admin/ayarlar` → Genel
2. "Bakım Modu Başlığı" ve "Bakım Modu Mesajı" alanlarını doldur
3. Kaydet
4. Bakım modunda bu mesajlar görünür

---

## 💡 İpuçları

### Performans
- Pagination kullan (gelecek özellik)
- Filtreleri kullan (gereksiz veri yükleme)
- Cache'i düzenli temizle

### Güvenlik
- API key'leri güvenli sakla
- Düzenli yedekleme yap
- Şüpheli aktiviteleri kontrol et
- Rate limiting'i aktif tut

### UX
- Keyboard shortcuts kullan (hızlı navigasyon)
- Dark mode kullan (göz yorgunluğu)
- Sidebar'ı daralt (daha fazla alan)
- Bulk actions kullan (toplu işlem)

### Veri Yönetimi
- Düzenli export al (yedekleme)
- Eski logları temizle
- Redis'i düzenli temizle
- Database'i optimize et

---

## 🚨 Sık Sorulan Sorular

### Admin paneline erişemiyorum?
- Giriş yaptınız mı?
- Role'ünüz ADMIN mi? (Database'de kontrol edin)
- Session geçerli mi? (Çıkış yapıp tekrar girin)

### Değişiklikler görünmüyor?
- Cache'i temizleyin
- Sayfayı yenileyin (F5)
- Browser cache'ini temizleyin

### API key çalışmıyor?
- Key aktif mi?
- Süresi dolmamış mı?
- İzinler doğru mu?
- Rate limit aşılmamış mı?

### Export çalışmıyor?
- Admin misiniz?
- Browser popup blocker kapalı mı?
- Veri var mı?

### Bulk actions çalışmıyor?
- Öğe seçtiniz mi?
- İşlem seçtiniz mi?
- İzniniz var mı?

---

## 📞 Destek

Sorun yaşıyorsanız:
1. Aktivite loglarını kontrol edin
2. Browser console'u kontrol edin
3. Server loglarını kontrol edin
4. Redis bağlantısını kontrol edin
5. Database bağlantısını kontrol edin

---

**Son Güncelleme:** 13 Kasım 2024  
**Versiyon:** 3.0  
**Durum:** Production Ready
