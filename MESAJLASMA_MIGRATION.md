# 💬 Mesajlaşma Sistemi Migration

## ⚠️ ÖNEMLİ: Migration Öncesi

Bu migration yeni tablolar ekleyecek:
- `conversations` - Konuşmalar
- `messages` - Mesajlar

**Mevcut verilere DOKUNMAZ**, sadece yeni tablolar ekler.

## Migration Komutu

```bash
npx prisma migrate dev --name add_messaging_system
```

## Yeni Özellikler

### 1. Conversation (Konuşma)
- İki kullanıcı arasında konuşma
- Son mesaj zamanı takibi
- Otomatik güncelleme

### 2. Message (Mesaj)
- Gönderen/alıcı bilgisi
- Okundu/okunmadı durumu
- Okunma zamanı
- Mesaj içeriği

### 3. Notification Tipi
- `message` tipi eklendi (yeni mesaj bildirimi)

## Veritabanı Değişiklikleri

✅ Yeni tablolar:
- `conversations`
- `messages`

✅ User tablosuna yeni ilişkiler:
- `sentMessages`
- `receivedMessages`
- `conversations`

✅ NotificationType enum'a ekleme:
- `message`

## Güvenli mi?

✅ Evet! Bu migration:
- Mevcut verileri değiştirmez
- Sadece yeni tablolar ekler
- Geri alınabilir (rollback mümkün)

## Migration Sonrası

1. Prisma Client'ı yeniden oluştur:
   ```bash
   npx prisma generate
   ```

2. Sunucuyu yeniden başlat

## Hazır mısın?

Migration'ı çalıştırmak için onay ver!
