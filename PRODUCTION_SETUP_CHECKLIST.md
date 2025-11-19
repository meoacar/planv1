# 🚀 PRODUCTION SETUP CHECKLIST - Frankfurt Server

## 📋 ÖNCELİK SIRASI

### 🔴 KRİTİK - HEMEN YAPILMALI (Sistem çalışmaz!)

#### 1. OpenAI API Key Al ⚠️
```bash
# Adım 1: https://platform.openai.com/api-keys adresine git
# Adım 2: "Create new secret key" tıkla
# Adım 3: Key'i kopyala ve .env.production'a ekle

# .env.production dosyasında değiştir:
OPENAI_API_KEY=sk-proj-GERÇEK_KEY_BURAYA
```
**Neden kritik?** Confession sistemi AI yanıtları için gerekli!

---

#### 2. Redis Kur (Ubuntu Server'da) ⚠️
```bash
# Ubuntu server'da Redis kurulumu
sudo apt update
sudo apt install redis-server -y

# Redis'i başlat
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test et
redis-cli ping
# Yanıt: PONG

# Şifre ayarla (önerilen)
sudo nano /etc/redis/redis.conf
# Bul: # requirepass foobared
# Değiştir: requirepass GÜÇLÜ_ŞİFRE_BURAYA

# Redis'i yeniden başlat
sudo systemctl restart redis-server

# .env.production'da güncelle:
# Şifresiz:
REDIS_URL=redis://localhost:6379
# Şifreli:
REDIS_URL=redis://:GÜÇLÜ_ŞİFRE@localhost:6379
```
**Neden kritik?** Confession queue, cache, rate limiting için gerekli!

---

#### 3. Güçlü Secret'lar Üret ⚠️
```bash
# Ubuntu server'da çalıştır:

# NEXTAUTH_SECRET için:
openssl rand -base64 32

# CRON_SECRET için:
openssl rand -base64 32

# Her ikisini de .env.production'a ekle
```

---

#### 4. Production MySQL Database Oluştur ⚠️
```bash
# XAMPP MySQL'e bağlan
mysql -u root -p

# Production database oluştur
CREATE DATABASE zayiflamaplan_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Güvenli kullanıcı oluştur (root kullanma!)
CREATE USER 'zayiflamaplan_user'@'localhost' IDENTIFIED BY 'GÜÇLÜ_ŞİFRE_BURAYA';

# Yetkileri ver
GRANT ALL PRIVILEGES ON zayiflamaplan_prod.* TO 'zayiflamaplan_user'@'localhost';
FLUSH PRIVILEGES;

# Çıkış
EXIT;

# .env.production'da güncelle:
DATABASE_URL="mysql://zayiflamaplan_user:GÜÇLÜ_ŞİFRE@localhost:3306/zayiflamaplan_prod?connection_limit=20&pool_timeout=120&connect_timeout=60&socket_timeout=60"
```

---

### 🟡 ÖNEMLİ - YAPMALISIN (Güvenlik ve performans)

#### 5. API Key'leri Doğrula
```bash
# Gemini API test et
curl -X POST \
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyC24B5flx2C-OLJvfEQbTpJH89FSq27eF4' \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'

# Resend API test et
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_PqEV9qWg_MGa1VcgoogGTJhwcUfFXXeWe' \
  -H 'Content-Type: application/json' \
  -d '{"from":"onboarding@resend.dev","to":"test@example.com","subject":"Test","html":"Test"}'
```

---

#### 6. Prisma Migration Çalıştır
```bash
# ⚠️ DİKKAT: Bu adımı yapmadan önce yedek al!

# Development'tan production'a schema kopyala
npx prisma migrate deploy

# Veya yeni migration oluştur
npx prisma migrate dev --name production_init
```

---

#### 7. PM2 ile Production Başlat
```bash
# PM2 kur (yoksa)
sudo npm install -g pm2

# Production build
npm run build

# PM2 ile başlat
pm2 start npm --name "zayiflamaplan" -- start

# Otomatik başlatma
pm2 startup
pm2 save

# Logları izle
pm2 logs zayiflamaplan
```

---

### 🟢 İYİ OLUR - YAPILMALI (Monitoring ve backup)

#### 8. Nginx Reverse Proxy Kur
```bash
# Nginx kur
sudo apt install nginx -y

# Config oluştur
sudo nano /etc/nginx/sites-available/zayiflamaplan

# İçerik:
server {
    listen 80;
    server_name zayiflamaplanim.com www.zayiflamaplanim.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Aktif et
sudo ln -s /etc/nginx/sites-available/zayiflamaplan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

#### 9. SSL Sertifikası (Let's Encrypt)
```bash
# Certbot kur
sudo apt install certbot python3-certbot-nginx -y

# SSL al
sudo certbot --nginx -d zayiflamaplanim.com -d www.zayiflamaplanim.com

# Otomatik yenileme test et
sudo certbot renew --dry-run
```

---

#### 10. Otomatik Backup Kur
```bash
# Backup scripti oluştur
sudo nano /usr/local/bin/backup-zayiflamaplan.sh

# İçerik:
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/zayiflamaplan"
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u zayiflamaplan_user -p'ŞİFRE' zayiflamaplan_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Uploads backup
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /path/to/public/uploads

# 30 günden eski backupları sil
find $BACKUP_DIR -type f -mtime +30 -delete

# Çalıştırılabilir yap
sudo chmod +x /usr/local/bin/backup-zayiflamaplan.sh

# Cron job ekle (her gün saat 02:00)
sudo crontab -e
# Ekle: 0 2 * * * /usr/local/bin/backup-zayiflamaplan.sh
```

---

## ✅ KONTROL LİSTESİ

Tamamlandıkça işaretle:

- [ ] OpenAI API Key alındı ve eklendi
- [ ] Redis kuruldu ve çalışıyor
- [ ] NEXTAUTH_SECRET üretildi
- [ ] CRON_SECRET üretildi
- [ ] Production MySQL database oluşturuldu
- [ ] Güvenli MySQL kullanıcısı oluşturuldu
- [ ] Gemini API key test edildi
- [ ] Resend API key test edildi
- [ ] Prisma migration çalıştırıldı
- [ ] PM2 ile uygulama başlatıldı
- [ ] Nginx reverse proxy kuruldu
- [ ] SSL sertifikası alındı
- [ ] Otomatik backup kuruldu
- [ ] Firewall ayarlandı (UFW)
- [ ] Monitoring kuruldu (opsiyonel)

---

## 🔥 HIZLI BAŞLANGIÇ (Minimum)

Sadece çalışır hale getirmek için:

```bash
# 1. Redis kur
sudo apt install redis-server -y
sudo systemctl start redis-server

# 2. Secret'ları üret
openssl rand -base64 32  # NEXTAUTH_SECRET
openssl rand -base64 32  # CRON_SECRET

# 3. .env.production'ı düzenle
nano .env.production
# - OpenAI API key ekle
# - Secret'ları ekle
# - Database şifresini ayarla

# 4. Build ve başlat
npm run build
npm start
```

---

## 📞 SORUN ÇÖZME

### Redis bağlanamıyor?
```bash
sudo systemctl status redis-server
redis-cli ping
```

### Database bağlanamıyor?
```bash
mysql -u zayiflamaplan_user -p
# Şifreyi test et
```

### Port 3000 kullanımda?
```bash
sudo lsof -i :3000
# Veya farklı port kullan:
PORT=3001 npm start
```

---

## 🎯 SONRAKİ ADIMLAR

1. ✅ Kritik değişkenleri tamamla
2. 🧪 Test ortamında dene
3. 🚀 Production'a deploy et
4. 📊 Monitoring kur
5. 🔄 Backup'ları kontrol et

**Başarılar! 🎉**
