# 💬 Mesajlaşma Sistemi

## Özellikler

✅ **Kullanıcılar arası direkt mesajlaşma**
✅ **Konuşma listesi** (inbox)
✅ **Okundu/okunmadı durumu**
✅ **Bildirim entegrasyonu**
✅ **Mesaj geçmişi**
✅ **Real-time görünüm**

## Kullanım

### 1. Mesaj Gönderme

**Profil sayfasından:**
1. Bir kullanıcının profiline git (`/profil/[username]`)
2. "💬 Mesaj Gönder" butonuna tıkla
3. Mesajlar sayfasına yönlendirilirsin

**Mesajlar sayfasından:**
1. `/mesajlar` sayfasına git
2. Sol taraftan bir konuşma seç
3. Alt kısımdaki input'a mesajını yaz
4. Send butonuna tıkla veya Enter'a bas

### 2. Mesajları Okuma

1. Navbar'dan "Mesajlar" linkine tıkla
2. Sol tarafta tüm konuşmaların listesini gör
3. Bir konuşmaya tıkla
4. Sağ tarafta mesaj geçmişini gör
5. Okunmamış mesajlar otomatik okundu olarak işaretlenir

### 3. Bildirimler

- Yeni mesaj geldiğinde bildirim oluşur
- Bildirim tipi: `message`
- Navbar'daki bildirim ikonunda görünür

## Teknik Detaylar

### Veritabanı Modelleri

#### Conversation
```prisma
model Conversation {
  id           String    @id @default(cuid())
  participants User[]    @relation("ConversationParticipants")
  messages     Message[]
  lastMessageAt DateTime @default(now())
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

#### Message
```prisma
model Message {
  id             String       @id @default(cuid())
  conversationId String
  senderId       String
  receiverId     String
  body           String       @db.Text
  read           Boolean      @default(false)
  readAt         DateTime?
  createdAt      DateTime     @default(now())
  conversation   Conversation @relation(...)
  sender         User         @relation("SentMessages", ...)
  receiver       User         @relation("ReceivedMessages", ...)
}
```

### API Endpoints

#### GET /api/messages
Kullanıcının tüm konuşmalarını getirir.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv_123",
      "otherUser": {
        "id": "user_456",
        "name": "Ahmet",
        "username": "ahmet",
        "image": "/maskot/1.png"
      },
      "lastMessage": {
        "id": "msg_789",
        "body": "Merhaba!",
        "senderId": "user_456",
        "read": false,
        "createdAt": "2024-11-14T13:45:00Z"
      },
      "unreadCount": 2,
      "lastMessageAt": "2024-11-14T13:45:00Z"
    }
  ]
}
```

#### POST /api/messages
Yeni mesaj gönderir.

**Request:**
```json
{
  "receiverId": "user_456",
  "body": "Merhaba, nasılsın?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg_789",
    "conversationId": "conv_123",
    "senderId": "user_123",
    "receiverId": "user_456",
    "body": "Merhaba, nasılsın?",
    "read": false,
    "createdAt": "2024-11-14T13:45:00Z",
    "sender": {
      "id": "user_123",
      "name": "Mehmet",
      "username": "mehmet",
      "image": null
    }
  }
}
```

#### GET /api/messages/[conversationId]
Bir konuşmadaki tüm mesajları getirir.

**Response:**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv_123",
      "otherUser": {
        "id": "user_456",
        "name": "Ahmet",
        "username": "ahmet",
        "image": "/maskot/1.png"
      }
    },
    "messages": [
      {
        "id": "msg_789",
        "body": "Merhaba!",
        "senderId": "user_456",
        "read": true,
        "readAt": "2024-11-14T13:46:00Z",
        "createdAt": "2024-11-14T13:45:00Z",
        "sender": {
          "id": "user_456",
          "name": "Ahmet",
          "username": "ahmet",
          "image": "/maskot/1.png"
        }
      }
    ]
  }
}
```

### Sayfa Yapısı

```
/mesajlar
  ├── page.tsx              # Server component (auth check)
  └── messages-client.tsx   # Client component (UI logic)
```

### Özellikler

#### 1. Otomatik Konuşma Oluşturma
- İlk mesaj gönderildiğinde konuşma otomatik oluşur
- Aynı iki kullanıcı arasında sadece bir konuşma olur

#### 2. Okundu İşaretleme
- Mesajlar açıldığında otomatik okundu olarak işaretlenir
- `read` ve `readAt` alanları güncellenir

#### 3. Bildirim Sistemi
- Her yeni mesajda alıcıya bildirim gönderilir
- Bildirim tipi: `message`
- Bildirim içeriği: "X size mesaj gönderdi"

#### 4. UI/UX
- **Sol panel:** Konuşma listesi
  - Avatar
  - Kullanıcı adı
  - Son mesaj önizlemesi
  - Okunmamış mesaj sayısı (badge)
  - Zaman damgası
  
- **Sağ panel:** Mesaj geçmişi
  - Mesajlar (kendi mesajları sağda, diğerleri solda)
  - Zaman damgaları
  - Mesaj input alanı
  - Gönder butonu

#### 5. Responsive Tasarım
- Mobilde tek sütun
- Desktop'ta iki sütun (3:2 oranı)
- Scroll area ile uzun mesaj listesi

## Güvenlik

✅ **Authentication:** Tüm endpoint'ler auth gerektirir
✅ **Authorization:** Kullanıcı sadece kendi konuşmalarını görebilir
✅ **Validation:** Mesaj içeriği ve alıcı ID kontrolü
✅ **Sanitization:** XSS koruması (gelecekte eklenecek)

## Gelecek İyileştirmeler

- [ ] Real-time mesajlaşma (WebSocket/Pusher)
- [ ] Mesaj silme
- [ ] Mesaj düzenleme
- [ ] Dosya/resim gönderme
- [ ] Emoji picker
- [ ] Yazıyor... göstergesi
- [ ] Sesli mesaj
- [ ] Grup mesajlaşması
- [ ] Mesaj arama
- [ ] Mesaj bildirimleri (push notification)
- [ ] Okundu bilgisi gösterimi (✓✓)
- [ ] Mesaj iletme
- [ ] Mesaj alıntılama

## Test

1. İki farklı kullanıcı hesabı oluştur
2. Birinci kullanıcıyla giriş yap
3. İkinci kullanıcının profiline git
4. "Mesaj Gönder" butonuna tıkla
5. Mesaj yaz ve gönder
6. İkinci kullanıcıyla giriş yap
7. Navbar'dan "Mesajlar"a git
8. Mesajı gör ve cevapla
9. Birinci kullanıcıya geri dön
10. Yeni mesajı gör

## Sorun Giderme

**Mesajlar görünmüyor:**
- Prisma Client'ı yeniden generate et: `npx prisma generate`
- Server'ı yeniden başlat
- Tarayıcı cache'ini temizle

**Konuşma oluşturulmuyor:**
- Migration'ın doğru uygulandığını kontrol et
- Database'de `conversations` ve `messages` tablolarını kontrol et

**Bildirimler gelmiyor:**
- `NotificationType` enum'unda `message` değerinin olduğunu kontrol et
- Bildirim sistemi çalışıyor mu kontrol et

## Performans

- Konuşma listesi: Son mesaj zamanına göre sıralı
- Mesajlar: Conversation ID'ye göre indexed
- Okunmamış sayısı: Efficient count query
- Pagination: Gelecekte eklenecek (şu an tüm mesajlar yükleniyor)
