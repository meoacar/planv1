# 👥 Grup Sistemi (Groups)

## 📋 Özet

Guild (Lonca) sisteminden **bağımsız** sosyal grup sistemi eklendi. İkisi birlikte çalışır.

## 🎯 Farklar

### Guild (Lonca) - Gamification Odaklı
- ✅ Zaten mevcut
- Rekabetçi, XP bazlı
- Guild challenges
- Lider/officer/member rolleri
- Maksimum 50 üye

### Group (Grup) - Sosyal Destek Odaklı
- ✅ Yeni eklendi
- Rahat, destekleyici
- Forum tarzı post paylaşımı
- Creator/admin/moderator/member rolleri
- Esnek üye limiti
- **Chat sistemi YOK** (sadece post paylaşımı)

## 📊 Eklenen Modeller

```prisma
model Group {
  id          String
  name        String
  slug        String @unique
  description String?
  category    GroupCategory
  creatorId   String
  memberCount Int
  postCount   Int
  isPublic    Boolean
  maxMembers  Int?
  tags        String? // JSON
  rules       String?
  members     GroupMember[]
  posts       GroupPost[]
}

model GroupMember {
  id       String
  groupId  String
  userId   String
  role     GroupMemberRole // creator, admin, moderator, member
  joinedAt DateTime
}

model GroupPost {
  id         String
  groupId    String
  authorId   String
  title      String?
  body       String
  images     String? // JSON array (max 4)
  likesCount Int
  status     CommentStatus
  isPinned   Boolean
}
```

## 🎨 Kategoriler

- 👥 Genel
- 💪 Motivasyon
- 🍽️ Tarifler
- 🏃 Egzersiz
- 🤝 Destek
- 👨‍👩‍👧‍👦 Yaş Grupları (20'ler, 30'lar, vb.)
- 🎯 Hedef Bazlı (10kg, 20kg, vb.)
- 🌱 Yaşam Tarzı (Vegan, Keto, vb.)

## 🔌 API Endpoints

```
GET    /api/v1/groups              - Grup listesi
POST   /api/v1/groups              - Grup oluştur
GET    /api/v1/groups/:slug        - Grup detayı
DELETE /api/v1/groups/:slug        - Grup sil (creator only)
POST   /api/v1/groups/:slug/join   - Gruba katıl
DELETE /api/v1/groups/:slug/join   - Gruptan ayrıl
GET    /api/v1/groups/:slug/posts  - Grup gönderileri
POST   /api/v1/groups/:slug/posts  - Gönderi paylaş (members only)
```

## 📄 Sayfalar

- `/gruplar` - Grup listesi
- `/gruplar/[slug]` - Grup detay sayfası
- `/gruplar/olustur` - Yeni grup oluştur (TODO)
- `/gruplar/[slug]/yeni-gonderi` - Gönderi paylaş (TODO)

## ⚠️ Önemli Notlar

1. **Chat sistemi YOK** - Sadece forum tarzı post paylaşımı var
2. **Guild ile karıştırma** - İkisi farklı sistemler, birlikte çalışır
3. **Migration gerekli** - `npx prisma migrate dev --name add_groups_system`
4. **Creator ayrılamaz** - Grup kurucusu gruptan ayrılamaz (önce başka birine devretmeli)

## ✅ Tamamlanan Entegrasyonlar

1. ✅ Migration çalıştırıldı
2. ✅ Navbar'a "Gruplar" linki eklendi
3. ✅ Admin sidebar'a "Gruplar" menüsü eklendi
4. ✅ Admin gruplar yönetim sayfası oluşturuldu
5. ✅ Ana sayfaya "Topluluk Gücü" bölümü eklendi
6. ✅ Dashboard'a "Gruplara Katıl" butonu eklendi

## ✅ Yeni Eklenenler

- ✅ `/gruplar/olustur` - Grup oluşturma sayfası (form, validasyon, kategori seçimi)
- ✅ Navbar "Ekle" menüsüne "Grup Oluştur" eklendi
- ✅ Switch UI component'i eklendi (@radix-ui/react-switch)
- ✅ **Grup Resmi Yükleme** - Bilgisayardan resim yükleme (preview, validasyon)
- ✅ Upload API endpoint'i (`/api/upload`)
- ✅ Grup listesi ve detay sayfalarında resim gösterimi

## 🚀 Sonraki Adımlar

1. ✅ ~~Grup oluşturma sayfası ekle~~ TAMAMLANDI
2. Gönderi paylaşma sayfası ekle (`/gruplar/[slug]/yeni-gonderi`)
3. Like/unlike özelliği ekle
4. Admin moderasyon paneli ekle
5. Bildirim sistemi entegre et
6. Grup arama ve filtreleme geliştir
7. Grup üye yönetimi (admin/moderator atama)

## 💡 Kullanım Örnekleri

**Guild Örneği:**
- "Kış Savaşçıları" loncası
- Haftalık challenge'larda yarışıyorlar
- XP kazanıyorlar

**Group Örneği:**
- "30'lu Anneler Zayıflama Grubu"
- Günlük motivasyon paylaşımları
- Tarif önerileri
- Destek mesajları
