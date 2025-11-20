# 🚀 ZayiflamaPlan.com - Canlı Ortam Deployment Rehberi

> **Son Güncelleme:** 20 Kasım 2025  
> **Hedef Sunucu:** Frankfurt VPS (Ubuntu 22.04)  
> **Sunucu IP:** 31.97.34.163  
> **Deployment Süresi:** ~2-3 saat

---

## ⚡ HIZLI DURUM

### ✅ HAZIR OLANLAR
- ✅ Sunucu IP: **31.97.34.163**
- ✅ MySQL 8 (Sunucuda kurulu)
- ✅ Gemini API Key: **AIzaSyC24B5flx2C-OLJvfEQbTpJH89FSq27eF4**
- ✅ Resend API Key: **re_PqEV9qWg_MGa1VcgoogGTJhwcUfFXXeWe**
- ✅ VAPID Keys (Push Notifications)

### ⚠️ EKSİK OLANLAR (ALINMALI!)
- ❌ **OpenAI API Key** - KRİTİK! Confession AI için gerekli
- ❌ **Google OAuth** - Client ID ve Secret
- ❌ **Domain DNS** - zayiflamaplanim.com → 31.97.34.163

### 🎯 İLK ADIM
```bash
ssh root@31.97.34.163
```

---

## 📋 İÇİNDEKİLER

1. [Ön Hazırlık](#1-ön-hazırlık)
2. [Sunucu Kurulumu](#2-sunucu-kurulumu)
3. [Veritabanı Kurulumu](#3-veritabanı-kurulumu)
4. [Redis Kurulumu](#4-redis-kurulumu)
5. [Node.js ve Proje Kurulumu](#5-nodejs-ve-proje-kurulumu)
6. [Environment Variables](#6-environment-variables)
7. [Database Migration](#7-database-migration)
8. [Production Build](#8-production-build)
9. [PM2 ile Process Management](#9-pm2-ile-process-management)
10. [Nginx Reverse Proxy](#10-nginx-reverse-proxy)
11. [SSL Sertifikası](#11-ssl-sertifikası)
12. [Cron Jobs](#12-cron-jobs)
13. [Monitoring ve Logging](#13-monitoring-ve-logging)
14. [Backup Stratejisi](#14-backup-stratejisi)
15. [Güvenlik Ayarları](#15-güvenlik-ayarları)
16. [Test ve Doğrulama](#16-test-ve-doğrulama)
17. [Sorun Giderme](#17-sorun-giderme)

---

## 1. ÖN HAZIRLIK

### 1.1 Gerekli Bilgiler

Aşağıdaki bilgileri hazır bulundurun:

```bash
# Sunucu Bilgileri
SUNUCU_IP: 31.97.34.163
SSH_PORT: 22
SSH_USER: root

# Domain Bilgileri
DOMAIN: zayiflamaplanim.com
WWW_DOMAIN: www.zayiflamaplanim.com

# API Keys (HAZIR!)
OPENAI_API_KEY: [OpenAI'dan alınacak - HENÜZ YOK!]
GEMINI_API_KEY: AIzaSyC24B5flx2C-OLJvfEQbTpJH89FSq27eF4 ✅
RESEND_API_KEY: re_PqEV9qWg_MGa1VcgoogGTJhwcUfFXXeWe ✅
GOOGLE_CLIENT_ID: [Google OAuth - Alınacak]
GOOGLE_CLIENT_SECRET: [Google OAuth - Alınacak]

# VAPID Keys (Push Notifications) ✅
NEXT_PUBLIC_VAPID_PUBLIC_KEY: BO7e_gsvY0lZS5-vT7u42Xq7QoWh9duilgThgp3cKHCZj3LltCayQsiXpiDwPtzUCaToaweI6e44YOYb3zkpUcQ
VAPID_PRIVATE_KEY: YcyUxWNgzUFq-93xCwBum4G3k_wHqT5NBELQy0Ouejc
```

### 1.2 API Key'leri Alma

#### OpenAI API Key (KRİTİK!)

```bash
# 1. https://platform.openai.com/api-keys adresine git
# 2. "Create new secret key" tıkla
# 3. İsim ver: "ZayiflamaPlan Production"
# 4. Key'i kopyala ve güvenli bir yere kaydet
# Format: sk-proj-...
```

**Maliyet:** ~$5-10/ay (confession AI yanıtları için)

#### Google Gemini API Key
```bash
# 1. https://makersuite.google.com/app/apikey adresine git
# 2. "Create API Key" tıkla
# 3. Key'i kopyala
# Format: AIza...
```

**Ücretsiz:** 60 request/dakika

#### Resend API Key
```bash
# 1. https://resend.com/api-keys adresine git
# 2. "Create API Key" tıkla
# 3. Domain ekle: zayiflamaplanim.com
# 4. DNS kayıtlarını ekle (SPF, DKIM, DMARC)
```

#### Google OAuth
```bash
# 1. https://console.cloud.google.com/ adresine git
# 2. Yeni proje oluştur: "ZayiflamaPlan"
# 3. APIs & Services > Credentials
# 4. "Create Credentials" > "OAuth 2.0 Client ID"
# 5. Authorized redirect URIs:
#    - https://zayiflamaplanim.com/api/auth/callback/google
#    - https://www.zayiflamaplanim.com/api/auth/callback/google
```

---

## 2. SUNUCU KURULUMU

### 2.1 SSH Bağlantısı

```bash
# Windows'tan bağlanma (PowerShell veya CMD)
ssh root@31.97.34.163

# İlk giriş sonrası şifre değiştir
passwd
```

### 2.2 Sistem Güncellemesi
```bash
# Sistem paketlerini güncelle
apt update && apt upgrade -y

# Gerekli araçları kur
apt install -y curl wget git build-essential ufw fail2ban
```

### 2.3 Yeni Kullanıcı Oluştur (Güvenlik)
```bash
# Yeni kullanıcı oluştur
adduser deploy
usermod -aG sudo deploy

# SSH key ile giriş ayarla (opsiyonel ama önerilen)
su - deploy
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# Public key'inizi ~/.ssh/authorized_keys dosyasına ekleyin
```

---

## 3. VERİTABANI KURULUMU

### 3.1 MySQL Durumunu Kontrol Et
```bash
# MySQL çalışıyor mu?
systemctl status mysql

# MySQL versiyonu
mysql --version

# Eğer çalışmıyorsa başlat
systemctl start mysql
systemctl enable mysql
```

### 3.2 Production Database Oluştur
```bash
# MySQL'e bağlan
mysql -u root -p

# Database oluştur
CREATE DATABASE zayiflamaplan_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Güvenli kullanıcı oluştur
CREATE USER 'zayiflamaplan_user'@'localhost' IDENTIFIED BY 'GÜÇLÜ_ŞİFRE_BURAYA';

# Yetkileri ver
GRANT ALL PRIVILEGES ON zayiflamaplan_prod.* TO 'zayiflamaplan_user'@'localhost';
FLUSH PRIVILEGES;

# Test et
SHOW DATABASES;
EXIT;
```

### 3.3 MySQL Performans Ayarları
```bash
# MySQL config düzenle
nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Ekle veya düzenle:
[mysqld]
max_connections = 200
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
query_cache_size = 0
query_cache_type = 0

# MySQL'i yeniden başlat
systemctl restart mysql
```

---

## 4. REDIS KURULUMU

### 4.1 Redis Server Kurulumu

```bash
# Redis kur
apt install -y redis-server

# Redis config düzenle
nano /etc/redis/redis.conf

# Şu satırları bul ve değiştir:
supervised no  →  supervised systemd
# requirepass foobared  →  requirepass GÜÇLÜ_REDIS_ŞİFRESİ
maxmemory 512mb
maxmemory-policy allkeys-lru

# Redis'i başlat
systemctl restart redis-server
systemctl enable redis-server

# Test et
redis-cli
AUTH GÜÇLÜ_REDIS_ŞİFRESİ
PING
# Yanıt: PONG
EXIT
```

---

## 5. NODE.JS VE PROJE KURULUMU

### 5.1 Node.js 20 Kurulumu
```bash
# NodeSource repository ekle
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Node.js kur
apt install -y nodejs

# Versiyonu kontrol et
node --version  # v20.x.x
npm --version   # 10.x.x
```

### 5.2 pnpm Kurulumu
```bash
npm install -g pnpm
pnpm --version
```

### 5.3 PM2 Kurulumu
```bash
npm install -g pm2
pm2 --version
```

### 5.4 Proje Klasörü Oluştur
```bash
# Proje dizini oluştur
mkdir -p /var/www/zayiflamaplan
cd /var/www/zayiflamaplan

# Git clone (veya dosyaları upload et)
git clone https://github.com/YOUR_USERNAME/zayiflamaplan.git .

# Veya dosyaları FTP/SFTP ile yükle
```

### 5.5 Bağımlılıkları Yükle
```bash
cd /var/www/zayiflamaplan
pnpm install --prod
```

---

## 6. ENVIRONMENT VARIABLES

### 6.1 .env.production Dosyası Oluştur
```bash
nano /var/www/zayiflamaplan/.env.production
```

### 6.2 Tüm Değişkenleri Ekle
```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://zayiflamaplanim.com
NODE_ENV=production

# Database
DATABASE_URL="mysql://zayiflamaplan_user:MYSQL_ŞİFRESİ@localhost:3306/zayiflamaplan_prod?connection_limit=20&pool_timeout=120&connect_timeout=60"

# NextAuth - KRİTİK!
NEXTAUTH_URL=https://zayiflamaplanim.com
NEXTAUTH_SECRET=BURAYA_OPENSSL_RAND_BASE64_32_ÇIKTISI

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Redis - KRİTİK!
REDIS_URL=redis://:REDIS_ŞİFRESİ@localhost:6379

# OpenAI - KRİTİK! ⚠️ HENÜZ YOK - ALINMALI!
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=200
OPENAI_TEMPERATURE=0.7

# Google Gemini ✅ HAZIR
GEMINI_API_KEY=AIzaSyC24B5flx2C-OLJvfEQbTpJH89FSq27eF4

# Email (Resend) ✅ HAZIR
RESEND_API_KEY=re_PqEV9qWg_MGa1VcgoogGTJhwcUfFXXeWe
EMAIL_FROM="ZayiflamaPlan <noreply@zayiflamaplanim.com>"
ADMIN_EMAIL=admin@zayiflamaplanim.com

# Web Push (VAPID) ✅ HAZIR
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BO7e_gsvY0lZS5-vT7u42Xq7QoWh9duilgThgp3cKHCZj3LltCayQsiXpiDwPtzUCaToaweI6e44YOYb3zkpUcQ
VAPID_PRIVATE_KEY=YcyUxWNgzUFq-93xCwBum4G3k_wHqT5NBELQy0Ouejc
VAPID_SUBJECT=mailto:admin@zayiflamaplanim.com

# Cron Secret
CRON_SECRET=BURAYA_OPENSSL_RAND_BASE64_32_ÇIKTISI

# Rate Limiting
RATE_LIMIT_ENABLED=true
CONFESSION_DAILY_LIMIT=3
EMPATHY_HOURLY_LIMIT=100

# Queue Configuration
QUEUE_CONCURRENCY=5
QUEUE_MAX_RETRIES=3

# Feature Flags
FEATURE_CONFESSION_WALL=true
FEATURE_AI_RESPONSES=true
```

### 6.3 Secret'ları Üret
```bash
# NEXTAUTH_SECRET için
openssl rand -base64 32

# CRON_SECRET için
openssl rand -base64 32

# Çıktıları .env.production'a ekle
```

---

## 7. DATABASE MIGRATION

### 7.1 Prisma Client Oluştur
```bash
cd /var/www/zayiflamaplan
pnpm db:generate
```

### 7.2 Migration Çalıştır
```bash
# ⚠️ DİKKAT: Bu adım veritabanını değiştirir!

# Production migration
pnpm db:migrate:deploy

# Veya development'tan kopyala
pnpm db:migrate
```

### 7.3 Seed Data (Opsiyonel)
```bash
# İlk admin kullanıcı ve temel verileri ekle
pnpm db:seed
```

---

## 8. PRODUCTION BUILD

### 8.1 Build Oluştur
```bash
cd /var/www/zayiflamaplan

# Production build
pnpm build

# Build başarılı mı kontrol et
ls -la .next
```

### 8.2 Build Sorunları
```bash
# Eğer build hatası alırsan:

# 1. Memory hatası
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build

# 2. TypeScript hatası
pnpm lint
# Hataları düzelt ve tekrar build et
```

---

## 9. PM2 İLE PROCESS MANAGEMENT

### 9.1 PM2 Ecosystem Dosyası
```bash
nano /var/www/zayiflamaplan/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: 'zayiflamaplan',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/zayiflamaplan',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/zayiflamaplan/error.log',
      out_file: '/var/log/zayiflamaplan/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G'
    }
  ]
};
```

### 9.2 Log Klasörü Oluştur
```bash
mkdir -p /var/log/zayiflamaplan
chown -R deploy:deploy /var/log/zayiflamaplan
```

### 9.3 PM2 ile Başlat
```bash
cd /var/www/zayiflamaplan

# Başlat
pm2 start ecosystem.config.js

# Durumu kontrol et
pm2 status
pm2 logs zayiflamaplan

# Otomatik başlatma
pm2 startup
pm2 save
```

### 9.4 PM2 Komutları
```bash
# Yeniden başlat
pm2 restart zayiflamaplan

# Durdur
pm2 stop zayiflamaplan

# Logları izle
pm2 logs zayiflamaplan --lines 100

# Monitoring
pm2 monit
```

---

## 10. NGINX REVERSE PROXY

### 10.1 Nginx Kurulumu
```bash
apt install -y nginx
```

### 10.2 Nginx Config
```bash
nano /etc/nginx/sites-available/zayiflamaplan
```

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

# Upstream
upstream nextjs_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name zayiflamaplanim.com www.zayiflamaplanim.com;

    # Redirect to HTTPS (SSL kurulumundan sonra)
    # return 301 https://$server_name$request_uri;

    # Client body size
    client_max_body_size 10M;

    # Logging
    access_log /var/log/nginx/zayiflamaplan_access.log;
    error_log /var/log/nginx/zayiflamaplan_error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Static files
    location /_next/static {
        alias /var/www/zayiflamaplan/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        alias /var/www/zayiflamaplan/public/uploads;
        expires 30d;
        add_header Cache-Control "public";
    }

    # API rate limiting
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Main app
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 10.3 Nginx'i Aktif Et
```bash
# Symlink oluştur
ln -s /etc/nginx/sites-available/zayiflamaplan /etc/nginx/sites-enabled/

# Test et
nginx -t

# Başlat
systemctl restart nginx
systemctl enable nginx
```

---

## 11. SSL SERTİFİKASI

### 11.1 Certbot Kurulumu
```bash
apt install -y certbot python3-certbot-nginx
```

### 11.2 SSL Sertifikası Al
```bash
# Domain'in DNS kayıtlarının sunucuya yönlendirildiğinden emin ol!

certbot --nginx -d zayiflamaplanim.com -d www.zayiflamaplanim.com

# Email adresi gir
# Terms of Service: Agree
# Share email: No (opsiyonel)
# Redirect HTTP to HTTPS: Yes
```

### 11.3 Otomatik Yenileme
```bash
# Test et
certbot renew --dry-run

# Cron job otomatik eklenir
systemctl status certbot.timer
```

### 11.4 SSL Config Kontrol
```bash
# Nginx config'i kontrol et
cat /etc/nginx/sites-available/zayiflamaplan

# SSL satırları otomatik eklenmiş olmalı
```

---

## 12. CRON JOBS

### 12.1 Cron Jobs Listesi

Projenizde 3 önemli cron job var:

1. **Weekly Sin Summary** - Her Pazar 23:00
2. **Daily Reminders** - Her saat başı
3. **Streak Warnings** - Her gün 21:00

### 12.2 Vercel Cron'dan Webhook'a Geçiş

Vercel cron'ları kendi sunucunuzda çalışmaz. Webhook veya sistem cron kullanmalısınız.

**Seçenek 1: Sistem Cron (Önerilen)**
```bash
crontab -e

# Ekle:
# Weekly sin summary (Her Pazar 23:00)
0 23 * * 0 curl -X POST https://zayiflamaplanim.com/api/cron/weekly-sin-summary -H "Authorization: Bearer CRON_SECRET_BURAYA"

# Daily reminders (Her saat başı)
0 * * * * curl -X POST https://zayiflamaplanim.com/api/cron/daily-reminders -H "Authorization: Bearer CRON_SECRET_BURAYA"

# Streak warnings (Her gün 21:00)
0 21 * * * curl -X POST https://zayiflamaplanim.com/api/cron/streak-warnings -H "Authorization: Bearer CRON_SECRET_BURAYA"
```

**Seçenek 2: External Cron Service**
- [cron-job.org](https://cron-job.org) (Ücretsiz)
- [EasyCron](https://www.easycron.com) (Ücretsiz plan)

---

## 13. MONITORING VE LOGGING

### 13.1 PM2 Monitoring
```bash
# Gerçek zamanlı monitoring
pm2 monit

# Web dashboard (opsiyonel)
pm2 plus
```

### 13.2 Log Rotation
```bash
nano /etc/logrotate.d/zayiflamaplan
```

```
/var/log/zayiflamaplan/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 13.3 Disk Kullanımı İzleme
```bash
# Disk durumu
df -h

# Klasör boyutları
du -sh /var/www/zayiflamaplan/*
du -sh /var/log/*
```

---

## 14. BACKUP STRATEJİSİ

### 14.1 Otomatik Backup Script
```bash
nano /usr/local/bin/backup-zayiflamaplan.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/zayiflamaplan"
DB_USER="zayiflamaplan_user"
DB_PASS="MYSQL_ŞİFRESİ"
DB_NAME="zayiflamaplan_prod"

# Backup klasörü oluştur
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Uploads backup
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/zayiflamaplan/public/uploads

# .env backup
cp /var/www/zayiflamaplan/.env.production $BACKUP_DIR/env_$DATE.txt

# 30 günden eski backupları sil
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

### 14.2 Script'i Çalıştırılabilir Yap
```bash
chmod +x /usr/local/bin/backup-zayiflamaplan.sh

# Test et
/usr/local/bin/backup-zayiflamaplan.sh
```

### 14.3 Cron Job Ekle
```bash
crontab -e

# Her gün saat 02:00'de backup al
0 2 * * * /usr/local/bin/backup-zayiflamaplan.sh >> /var/log/backup.log 2>&1
```

---

## 15. GÜVENLİK AYARLARI

### 15.1 UFW Firewall
```bash
# UFW'yi aktif et
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Durumu kontrol et
ufw status
```

### 15.2 Fail2Ban (Brute Force Koruması)
```bash
# Fail2ban config
nano /etc/fail2ban/jail.local
```

```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/zayiflamaplan_error.log
maxretry = 5
bantime = 600
```

```bash
# Fail2ban'ı başlat
systemctl restart fail2ban
systemctl enable fail2ban

# Durumu kontrol et
fail2ban-client status
```

### 15.3 Dosya İzinleri
```bash
# Proje dosyaları
chown -R deploy:deploy /var/www/zayiflamaplan
chmod -R 755 /var/www/zayiflamaplan

# .env dosyası
chmod 600 /var/www/zayiflamaplan/.env.production

# Uploads klasörü
chmod -R 775 /var/www/zayiflamaplan/public/uploads
```

---

## 16. TEST VE DOĞRULAMA

### 16.1 Health Check
```bash
# API health check
curl https://zayiflamaplanim.com/api/health

# Database check
curl https://zayiflamaplanim.com/api/health/db

# Redis check
curl https://zayiflamaplanim.com/api/health/redis

# OpenAI check
curl https://zayiflamaplanim.com/api/health/openai
```

### 16.2 Fonksiyonel Testler
```bash
# 1. Anasayfa yükleniyor mu?
curl -I https://zayiflamaplanim.com

# 2. Kayıt olma çalışıyor mu?
# Tarayıcıdan test et: https://zayiflamaplanim.com/kayit

# 3. Giriş yapma çalışıyor mu?
# Tarayıcıdan test et: https://zayiflamaplanim.com/giris

# 4. Confession sistemi çalışıyor mu?
# Tarayıcıdan test et: https://zayiflamaplanim.com/confessions

# 5. Admin panel erişilebilir mi?
# Tarayıcıdan test et: https://zayiflamaplanim.com/admin
```

### 16.3 Performance Test
```bash
# Response time
curl -w "@curl-format.txt" -o /dev/null -s https://zayiflamaplanim.com

# curl-format.txt içeriği:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

---

## 17. SORUN GİDERME

### 17.1 Uygulama Başlamıyor
```bash
# PM2 loglarını kontrol et
pm2 logs zayiflamaplan --lines 100

# Port kullanımda mı?
lsof -i :3000

# Environment variables doğru mu?
cat /var/www/zayiflamaplan/.env.production
```

### 17.2 Database Bağlantı Hatası
```bash
# MySQL çalışıyor mu?
systemctl status mysql

# Kullanıcı yetkisi var mı?
mysql -u zayiflamaplan_user -p
SHOW GRANTS;

# Connection string doğru mu?
# DATABASE_URL'i kontrol et
```

### 17.3 Redis Bağlantı Hatası
```bash
# Redis çalışıyor mu?
systemctl status redis-server

# Redis'e bağlanabiliyor musun?
redis-cli
AUTH ŞİFRE
PING

# REDIS_URL doğru mu?
```

### 17.4 SSL Sertifikası Hatası
```bash
# Sertifika durumu
certbot certificates

# Yenileme testi
certbot renew --dry-run

# Nginx config testi
nginx -t
```

### 17.5 Yüksek Memory Kullanımı
```bash
# Memory durumu
free -h

# PM2 memory limiti
pm2 restart zayiflamaplan --max-memory-restart 1G

# Node.js memory limiti
export NODE_OPTIONS="--max-old-space-size=2048"
```

---

## ✅ DEPLOYMENT CHECKLIST

Tamamlandıkça işaretle:

### Sunucu Hazırlığı
- [ ] VPS satın alındı (Frankfurt)
- [ ] SSH bağlantısı kuruldu
- [ ] Sistem güncellendi
- [ ] Güvenli kullanıcı oluşturuldu

### API Keys
- [ ] OpenAI API key alındı
- [ ] Gemini API key alındı
- [ ] Resend API key alındı
- [ ] Google OAuth ayarlandı

### Veritabanı
- [x] MySQL 8 kuruldu (Sunucuda mevcut)
- [ ] Production database oluşturuldu
- [ ] Güvenli kullanıcı oluşturuldu
- [ ] Performans ayarları yapıldı

### Redis
- [ ] Redis kuruldu
- [ ] Şifre ayarlandı
- [ ] Test edildi

### Uygulama
- [ ] Node.js 20 kuruldu
- [ ] pnpm kuruldu
- [ ] Proje dosyaları yüklendi
- [ ] Bağımlılıklar yüklendi
- [ ] .env.production oluşturuldu
- [ ] Secret'lar üretildi
- [ ] Prisma migration çalıştırıldı
- [ ] Production build oluşturuldu

### Process Management
- [ ] PM2 kuruldu
- [ ] Ecosystem config oluşturuldu
- [ ] Uygulama başlatıldı
- [ ] Otomatik başlatma ayarlandı

### Web Server
- [ ] Nginx kuruldu
- [ ] Reverse proxy ayarlandı
- [ ] SSL sertifikası alındı
- [ ] HTTPS redirect aktif

### Otomasyon
- [ ] Cron jobs ayarlandı
- [ ] Backup script oluşturuldu
- [ ] Log rotation ayarlandı

### Güvenlik
- [ ] UFW firewall aktif
- [ ] Fail2ban kuruldu
- [ ] Dosya izinleri ayarlandı
- [ ] SSH key authentication (opsiyonel)

### Test
- [ ] Health check API'leri test edildi
- [ ] Kayıt/Giriş test edildi
- [ ] Confession sistemi test edildi
- [ ] Admin panel test edildi
- [ ] Performance test yapıldı

---

## 🎯 HIZLI BAŞLANGIÇ (Minimum Adımlar)

Sadece çalışır hale getirmek için:

```bash
# 1. Sunucuya bağlan
ssh root@31.97.34.163

# 2. Hızlı kurulum (MySQL zaten kurulu!)
apt update && apt upgrade -y
apt install -y redis-server nginx curl git

# 3. Node.js kur
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pnpm pm2

# 4. MySQL ayarla (zaten kurulu, sadece database oluştur)
mysql -u root -p
CREATE DATABASE zayiflamaplan_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'zayiflamaplan_user'@'localhost' IDENTIFIED BY 'ŞİFRE';
GRANT ALL PRIVILEGES ON zayiflamaplan_prod.* TO 'zayiflamaplan_user'@'localhost';
EXIT;

# 5. Redis ayarla
systemctl start redis-server
systemctl enable redis-server

# 6. Projeyi yükle
mkdir -p /var/www/zayiflamaplan
cd /var/www/zayiflamaplan
# Dosyaları buraya yükle

# 7. .env.production oluştur
nano .env.production
# Tüm değişkenleri ekle

# 8. Build ve başlat
pnpm install
pnpm db:generate
pnpm db:migrate:deploy
pnpm build
pm2 start npm --name "zayiflamaplan" -- start
pm2 startup
pm2 save

# 9. Nginx ayarla
# Config dosyasını oluştur ve aktif et

# 10. SSL al
certbot --nginx -d zayiflamaplanim.com -d www.zayiflamaplanim.com
```

---

## 📞 DESTEK VE KAYNAKLAR

### Dokümantasyon
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- PM2: https://pm2.keymetrics.io/docs
- Nginx: https://nginx.org/en/docs

### Monitoring Tools
- PM2 Plus: https://pm2.io
- Uptime Robot: https://uptimerobot.com (Ücretsiz)
- Better Uptime: https://betteruptime.com

### Backup Solutions
- Backblaze B2: https://www.backblaze.com/b2
- AWS S3: https://aws.amazon.com/s3

---

## 🚀 SONRAKI ADIMLAR

1. ✅ Deployment'ı tamamla
2. 📊 Monitoring kur (PM2 Plus, Sentry)
3. 🔄 CI/CD pipeline kur (GitHub Actions)
4. 📈 Analytics ekle (Google Analytics, Plausible)
5. 🎨 CDN kullan (Cloudflare)
6. 💾 Offsite backup kur (S3, Backblaze)
7. 📧 Email deliverability test et
8. 🧪 Load testing yap
9. 📱 Mobile responsive test et
10. 🔍 SEO optimizasyonu yap

---

**Başarılar! 🎉**

Sorularınız için: admin@zayiflamaplanim.com
