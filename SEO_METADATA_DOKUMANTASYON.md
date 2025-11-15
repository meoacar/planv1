# 🎯 SEO & Metadata Dokümantasyonu

## ✅ Tamamlanan Özellikler

### 1. robots.txt (Dinamik)
**Konum:** `src/app/robots.txt/route.ts`

- ✅ Dinamik route handler
- ✅ Admin panelden düzenlenebilir
- ✅ Sitemap linkini otomatik içerir
- ✅ Redis cache desteği

**Erişim:** `https://zayiflamaplan.com/robots.txt`

**Admin Ayarı:** 
- Ayar Adı: `robotsTxt`
- Varsayılan: User-agent: * Allow: / + Sitemap linki

---

### 2. sitemap.xml (Dinamik)
**Konum:** `src/app/sitemap.xml/route.ts`

- ✅ Dinamik XML generation
- ✅ Tüm published planları otomatik ekler
- ✅ Cache'li (1 saat)
- ✅ Sayfalar:
  - Ana sayfa (priority: 1.0)
  - Keşfet (priority: 0.9)
  - Kayıt/Giriş (priority: 0.8)
  - Tüm planlar (priority: 0.7)

**Erişim:** `https://zayiflamaplan.com/sitemap.xml`

**Özellikler:**
- `lastmod`: Her sayfa için güncelleme tarihi
- `changefreq`: Güncelleme sıklığı
- `priority`: Sayfa önceliği

---

### 3. Metadata & OpenGraph Tags
**Konum:** `src/app/layout.tsx`

#### Ana Sayfa Metadata
- ✅ Dinamik title & description
- ✅ Keywords
- ✅ OpenGraph tags (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Google Analytics entegrasyonu
- ✅ Google Site Verification
- ✅ Favicon desteği
- ✅ Robots meta tags

**Admin Ayarları:**
- `seoTitle`: Site başlığı
- `seoDescription`: Site açıklaması
- `seoKeywords`: Anahtar kelimeler (virgülle ayrılmış)
- `ogImage`: OpenGraph görseli
- `twitterHandle`: Twitter kullanıcı adı
- `siteUrl`: Site URL'i
- `googleSiteVerification`: Google doğrulama kodu
- `siteFavicon`: Favicon yolu
- `googleAnalytics`: GA tracking ID

---

### 4. Plan Sayfası Metadata
**Konum:** `src/app/plan/[slug]/page.tsx`

- ✅ Her plan için özel metadata
- ✅ Dinamik title: Plan başlığı
- ✅ Dinamik description: Plan açıklaması + sonuç + yazar
- ✅ Keywords: Plan etiketleri
- ✅ OpenGraph Article tags
- ✅ Yazar bilgisi
- ✅ Yayın/güncelleme tarihleri
- ✅ Canonical URL

**Örnek:**
```
Title: "30 Günde 5 Kilo Verdim"
Description: "Kahvaltıda yumurta, öğlende salata... | 5kg verdi | @ahmet"
Keywords: ["diyet", "kahvaltı", "protein"]
```

---

### 5. Profil Sayfası Metadata
**Konum:** `src/app/profil/[username]/page.tsx`

- ✅ Her kullanıcı için özel metadata
- ✅ Dinamik title: İsim + kullanıcı adı
- ✅ Dinamik description: Bio + istatistikler
- ✅ OpenGraph Profile tags
- ✅ Profil fotoğrafı
- ✅ Canonical URL

**Örnek:**
```
Title: "Ahmet Yılmaz (@ahmet)"
Description: "Sağlıklı yaşam tutkunu | 12 plan, 45 takipçi"
```

---

### 6. Dinamik OG Image Generation 🆕
**SVG tabanlı dinamik görsel oluşturma**

#### Ana Sayfa OG Image
**Konum:** `public/og-default.svg`

- ✅ Gradient arka plan (mor-pembe)
- ✅ Site başlığı
- ✅ Site açıklaması
- ✅ Modern tasarım
- ✅ 1200x630px (optimal boyut)
- ✅ SVG format (hafif ve hızlı)

**Erişim:** `https://zayiflamaplan.com/og-default.svg`

#### Plan OG Image API
**Konum:** `src/app/api/og/route.tsx`

- ✅ Dinamik SVG generation
- ✅ Plan başlığı
- ✅ Yazar bilgisi
- ✅ Sonuç bilgisi (kg verdi/hedef)
- ✅ ZayiflamaPlan branding
- ✅ 1200x630px
- ✅ Cache'li (1 saat)

**Erişim:** `https://zayiflamaplan.com/api/og?title=Plan&author=Kullanıcı&result=5kg`

**Query Parameters:**
- `title`: Plan başlığı
- `author`: Yazar kullanıcı adı
- `result`: Sonuç metni (örn: "5kg verdi")

**Özellikler:**
- SVG format (Windows uyumlu)
- URL encode desteği
- XSS koruması
- Otomatik cache

---

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Primary Gradient:** `#667eea → #764ba2` (Mor-Pembe)
- **Success Gradient:** `#10b981 → #059669` (Yeşil)
- **Background:** Beyaz kart + gradient arka plan
- **Text:** `#1e293b` (koyu), `#64748b` (orta), `#94a3b8` (açık)

### Tipografi
- **Başlık:** 56-72px, bold
- **Alt başlık:** 28-36px, bold
- **Metin:** 22-32px, normal
- **Font:** system-ui, sans-serif

### Layout
- **Padding:** 50-80px
- **Border Radius:** 24px
- **Shadow:** 0 20px 60px rgba(0,0,0,0.3)
- **Max Width:** 900-1000px

---

## 🔧 Teknik Detaylar

### SVG Tabanlı Çözüm
OG image'lar SVG formatında oluşturulur (Windows uyumluluğu için):

**Avantajlar:**
- ✅ Windows path sorunları yok
- ✅ Hafif ve hızlı
- ✅ Dinamik içerik
- ✅ Cache desteği
- ✅ Production'da sorunsuz çalışır

### Cache Stratejisi
- **Sitemap:** 1 saat cache
- **OG Images:** Otomatik Next.js cache
- **Metadata:** Her request'te dinamik

### SEO Best Practices
- ✅ Canonical URLs
- ✅ Structured data hazır (gelecekte eklenebilir)
- ✅ Mobile-friendly
- ✅ Fast loading
- ✅ Unique titles & descriptions
- ✅ Alt texts
- ✅ Semantic HTML

---

## 📊 Test Etme

### 1. robots.txt Test
```bash
curl https://zayiflamaplan.com/robots.txt
```

### 2. sitemap.xml Test
```bash
curl https://zayiflamaplan.com/sitemap.xml
```

### 3. OG Image Test
Tarayıcıda aç:
- `https://zayiflamaplan.com/opengraph-image`
- `https://zayiflamaplan.com/plan/[slug]/opengraph-image`

### 4. Metadata Test
**Facebook Debugger:**
https://developers.facebook.com/tools/debug/

**Twitter Card Validator:**
https://cards-dev.twitter.com/validator

**LinkedIn Post Inspector:**
https://www.linkedin.com/post-inspector/

**Google Rich Results Test:**
https://search.google.com/test/rich-results

---

## 🚀 Gelecek İyileştirmeler

### Öncelikli
- [ ] JSON-LD Structured Data (Article, Person, Organization)
- [ ] Breadcrumb schema
- [ ] FAQ schema (plan sayfalarında)
- [ ] Review/Rating schema

### İsteğe Bağlı
- [ ] AMP sayfaları
- [ ] RSS feed
- [ ] Hreflang tags (çoklu dil desteği)
- [ ] Video schema (gelecekte video içerik için)
- [ ] Image sitemap

---

## 📝 Admin Panel Ayarları

Tüm SEO ayarları Admin Panel > Ayarlar > SEO sekmesinden düzenlenebilir:

### Hızlı Erişim Linkleri
Admin panelde SEO sekmesinin en üstünde şu dosyalara direkt erişim var:
- 🗺️ **sitemap.xml** - Tüm sayfaların listesi
- 🤖 **robots.txt** - Arama motoru kuralları  
- 🖼️ **OG Image** - Ana sayfa sosyal medya görseli

### Düzenlenebilir Ayarlar

1. **Genel SEO**
   - Site başlığı (60 karakter max)
   - Site açıklaması (160 karakter max)
   - Anahtar kelimeler (virgülle ayrılmış)
   - Site URL

2. **Sosyal Medya**
   - OG image URL
   - Twitter handle (@kullaniciadi)

3. **Analytics**
   - Google Analytics ID (G-XXXXXXXXXX)
   - Google Site Verification kodu

4. **Robots.txt**
   - robots.txt içeriği (manuel düzenlenebilir)
   - Sitemap otomatik eklenir

---

## ✨ Sonuç

Tüm SEO ve metadata özellikleri başarıyla tamamlandı! Sistem:

- ✅ Google'da iyi sıralama için optimize edildi
- ✅ Sosyal medyada güzel görünüyor
- ✅ Admin panelden kolayca yönetilebilir
- ✅ Dinamik ve otomatik
- ✅ Modern ve profesyonel tasarım

**Sistem hazır! 🎉**
