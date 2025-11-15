# 🚀 Hızlı Başlangıç

## 1️⃣ Gereksinimler

- Node.js 20+
- pnpm 8+
- XAMPP (MySQL + phpMyAdmin)

## 2️⃣ Kurulum (5 Dakika)

### XAMPP'i Başlat
1. XAMPP Control Panel'i aç
2. **Apache** ve **MySQL**'i başlat

### Projeyi Kur

```bash
# 1. Bağımlılıkları yükle
pnpm install

# 2. .env dosyası oluştur
cp .env.example .env

# 3. .env'i düzenle (XAMPP için)
# DATABASE_URL="mysql://root@localhost:3306/zayiflamaplan?connection_limit=10&pool_timeout=30"
# NEXTAUTH_SECRET="your-secret-key-here"

# 4. Database oluştur
# http://localhost/phpmyadmin açın
# "zayiflamaplan" adında database oluşturun

# 5. Prisma setup
pnpm db:generate
pnpm db:migrate

# 6. Dev server başlat
pnpm dev
```

## 3️⃣ Tarayıcıda Aç

**http://localhost:3000**

## ✅ Çalışıyor mu Kontrol

- Landing page görünüyor mu? ✓
- /kayit sayfası açılıyor mu? ✓
- /giris sayfası açılıyor mu? ✓
- /kesfet sayfası açılıyor mu? ✓

## 🎯 İlk Adımlar

1. **Kayıt Ol:** http://localhost:3000/kayit
2. **Dashboard'a Git:** http://localhost:3000/dashboard
3. **Planları Keşfet:** http://localhost:3000/kesfet

## 📊 Mevcut Özellikler

### ✅ Çalışan
- Landing page
- Kayıt/Giriş sayfaları (UI)
- Dashboard (UI)
- Plan keşfet (UI)
- Plan detay (UI)
- API endpoints (backend hazır)

### 🚧 Yapım Aşamasında
- Auth entegrasyonu (NextAuth)
- Plan oluşturma formu
- Kilo takibi
- Profil sayfası
- Admin panel

## 🐛 Sorun mu Yaşıyorsun?

### MySQL bağlanamıyor
```bash
# XAMPP'te MySQL çalışıyor mu kontrol et
# http://localhost/phpmyadmin açılıyor mu?
```

### Port 3000 kullanımda
```bash
# Farklı port kullan
PORT=3001 pnpm dev
```

### Prisma hatası
```bash
# Prisma'yı yeniden oluştur
pnpm db:generate
pnpm db:push
```

## 📚 Daha Fazla Bilgi

- **Detaylı Kurulum:** KURULUM.md
- **Proje Vizyonu:** GERCEK_VIZYON.md
- **MVP Spec:** MVP_SPEC.md
- **İlerleme:** ILERLEME.md

## 🎉 Başarılı!

Proje çalışıyorsa, artık geliştirmeye başlayabilirsin! 🚀
