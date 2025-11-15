# Redis Kurulum (Opsiyonel)

Redis şu anda **opsiyonel** - olmasa da uygulama çalışır.

## Windows'ta Redis Kurulumu

### Seçenek 1: Memurai (Önerilen)
1. https://www.memurai.com/get-memurai adresine git
2. Memurai Developer Edition'ı indir (ücretsiz)
3. Kur ve başlat
4. Port: 6379 (varsayılan)

### Seçenek 2: Docker
```bash
docker run -d -p 6379:6379 redis:alpine
```

### Seçenek 3: WSL2 + Redis
```bash
# WSL2'de
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

## Redis Olmadan Çalıştırma

Uygulama Redis olmadan da çalışır:
- ⚠️ Rate limiting devre dışı
- ⚠️ Cache devre dışı
- ✅ Tüm diğer özellikler çalışır

## Redis Durumunu Kontrol

```bash
# Redis çalışıyor mu?
redis-cli ping
# Yanıt: PONG
```

## .env Ayarları

```env
# Redis (opsiyonel)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

Redis yoksa bu satırları boş bırakabilirsiniz.
