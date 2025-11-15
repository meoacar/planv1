# 🚀 ZayiflamaPlan - Adım Adım Kurulum

## ✅ Gereksinimler

- ✅ Node.js 20+
- ✅ pnpm 8+
- ✅ XAMPP (MySQL + phpMyAdmin)
- ✅ Git (opsiyonel)

---

## 📦 Adım 1: XAMPP'i Başlat

1. XAMPP Control Panel'i aç
2. **Apache** butonuna tıkla → Start
3. **MySQL** butonuna tıkla → Start
4. Her ikisi de yeşil olmalı ✅

---

## 💾 Adım 2: Database Oluştur

1. Tarayıcıda aç: **http://localhost/phpmyadmin**
2. Sol tarafta "New" butonuna tıkla
3. Database adı: **zayiflamaplan**
4. Collation: **utf8mb4_unicode_ci**
5. "Create" butonuna tıkla ✅

---

## 📁 Adım 3: Projeyi Hazırla

### Terminal'i Aç (Proje klasöründe)

```bash
# Bağımlılıkları yükle
pnpm install
```

**Beklenen süre:** 2-3 dakika

---

## ⚙️ Adım 4: Environment Variables

```bash
# .env dosyası oluştur
cp .env.example .env
```

### .env Dosyasını Düzenle

Notepad veya VS Code ile `.env` dosyasını aç ve düzenle:

```env
# Database (XAMPP - şifre yok)
DATABASE_URL="mysql://root@localhost:3306/zayiflamaplan?connection_limit=10&pool_timeout=30"

# NextAuth Secret (önemli!)
NEXTAUTH_SECRET="super-secret-key-change-this-in-production"

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Redis (opsiyonel - yoksa skip)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Google OAuth (opsiyonel - sonra eklenebilir)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**NEXTAUTH_SECRET oluşturmak için:**

```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# veya basitçe
openssl rand -base64 32
```

---

## 🗄️ Adım 5: Prisma Setup

```bash
# 1. Prisma client oluştur
pnpm db:generate

# 2. Database migration
pnpm db:migrate
```

**Migration adı sorarsa:** `init` yaz ve Enter

**Beklenen çıktı:**
```
✔ Generated Prisma Client
✔ Migration applied successfully
```

---

## 🔴 Adım 6: Redis (Opsiyonel)

### Redis Yoksa:
Proje çalışır ama rate limiting olmaz. Sorun değil!

### Redis Varsa:
```bash
# Yeni terminal aç
redis-server
```

---

## 🚀 Adım 7: Development Server

```bash
pnpm dev
```

**Beklenen çıktı:**
```
▲ Next.js 15.0.3
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 2.5s
```

---

## 🌐 Adım 8: Tarayıcıda Test Et

### Ana Sayfa
**http://localhost:3000**

Görmelisin:
- 🌟 ZayiflamaPlan başlığı
- "Hemen Başla" ve "Planları Keşfet" butonları
- İstatistikler (15,234 kullanıcı vb.)

### Diğer Sayfalar
- **http://localhost:3000/kayit** - Kayıt sayfası
- **http://localhost:3000/giris** - Giriş sayfası
- **http://localhost:3000/kesfet** - Planları keşfet
- **http://localhost:3000/dashboard** - Dashboard (giriş gerekli)

---

## ✅ Başarı Kontrolü

### Çalışıyor mu?
- [ ] Landing page açılıyor
- [ ] Kayıt sayfası açılıyor
- [ ] Keşfet sayfası açılıyor
- [ ] Console'da hata yok

### Hepsi ✅ ise: **BAŞARILI!** 🎉

---

## 🐛 Sorun Giderme

### 1. "Cannot connect to database"

**Çözüm:**
- XAMPP'te MySQL çalışıyor mu kontrol et
- phpMyAdmin açılıyor mu: http://localhost/phpmyadmin
- .env dosyasındaki DATABASE_URL doğru mu kontrol et

### 2. "Port 3000 already in use"

**Çözüm:**
```bash
# Farklı port kullan
PORT=3001 pnpm dev
```

### 3. "Prisma Client not generated"

**Çözüm:**
```bash
pnpm db:generate
```

### 4. "Module not found"

**Çözüm:**
```bash
# node_modules'u sil ve yeniden yükle
rm -rf node_modules
pnpm install
```

### 5. "Redis connection failed"

**Çözüm:**
Redis opsiyonel. .env'den REDIS satırlarını kaldır veya Redis'i yükle.

---

## 📝 İlk Kullanıcı Oluşturma

### 1. Kayıt Ol
- http://localhost:3000/kayit
- Email: test@test.com
- Şifre: 123456
- Kayıt Ol butonuna tıkla

### 2. Database'de Kontrol
- phpMyAdmin aç
- `zayiflamaplan` database'i seç
- `users` tablosuna bak
- Kullanıcı oluştu mu? ✅

### 3. Admin Yap (Opsiyonel)
phpMyAdmin'de SQL çalıştır:

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'test@test.com';
```

Artık admin paneline erişebilirsin: http://localhost:3000/admin

---

## 🎯 Sonraki Adımlar

1. ✅ Proje çalışıyor
2. ✅ Kullanıcı oluşturdun
3. ✅ Admin oldun

**Şimdi ne yapabilirsin:**
- Plan oluştur: http://localhost:3000/plan-ekle
- Kilo kaydet: http://localhost:3000/kilo-takibi
- Profili düzenle: http://localhost:3000/ayarlar
- Admin panel: http://localhost:3000/admin

---

## 📚 Daha Fazla Bilgi

- **Detaylı Dokümantasyon:** README.md
- **Proje Vizyonu:** GERCEK_VIZYON.md
- **MVP Spec:** MVP_SPEC.md
- **İlerleme:** ILERLEME.md

---

## 🎉 Tebrikler!

Proje başarıyla kuruldu ve çalışıyor! 🚀

**Sorun mu yaşıyorsun?**
- ILERLEME.md dosyasına bak
- README.md'yi oku
- Hata mesajını Google'da ara

**İyi geliştirmeler!** 💪
