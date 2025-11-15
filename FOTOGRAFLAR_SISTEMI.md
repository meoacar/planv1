# 📸 Fotoğraf Yükleme Sistemi

## ✅ Tamamlanan Özellikler

### 1. API Endpoint'leri
- **GET** `/api/v1/progress-photos` - Fotoğrafları listele
- **POST** `/api/v1/progress-photos` - Yeni fotoğraf yükle
- **PATCH** `/api/v1/progress-photos/[id]` - Fotoğraf bilgilerini güncelle
- **DELETE** `/api/v1/progress-photos/[id]` - Fotoğraf sil

### 2. Sayfalar
- `/fotograflar` - Ana fotoğraf galerisi sayfası
  - Fotoğraf yükleme
  - Fotoğraf düzenleme
  - Fotoğraf silme
  - Tip bazlı filtreleme (Başlangıç, İlerleme, Sonuç)

### 3. Component'ler
- `PhotoGallery` - Ana galeri component'i
- `PhotoUploadDialog` - Drag & drop destekli upload formu
- `PhotoEditDialog` - Fotoğraf bilgilerini düzenleme formu

### 4. Özellikler
- ✅ Drag & drop ile fotoğraf yükleme
- ✅ Dosya boyutu kontrolü (Max 5MB)
- ✅ Dosya tipi kontrolü (JPG, PNG, WebP)
- ✅ Fotoğraf tipleri (before, after, progress)
- ✅ Kilo bilgisi ekleme
- ✅ Açıklama ekleme
- ✅ Fotoğraf düzenleme
- ✅ Fotoğraf silme
- ✅ Responsive galeri görünümü
- ✅ Image preview

### 5. Entegrasyonlar
- ✅ Navbar'a "Fotoğraflarım" linki eklendi
- ✅ Dashboard'a fotoğraf widget'ı eklendi
- ✅ Profil sayfasına fotoğraf sekmesi eklendi
- ✅ Hızlı işlemler menüsüne eklendi

## 📁 Dosya Yapısı

```
src/
├── app/
│   ├── fotograflar/
│   │   ├── page.tsx                    # Ana sayfa
│   │   ├── photo-gallery.tsx           # Galeri component
│   │   ├── photo-upload-dialog.tsx     # Upload formu
│   │   └── edit-dialog.tsx             # Düzenleme formu
│   ├── api/
│   │   └── v1/
│   │       └── progress-photos/
│   │           ├── route.ts            # GET, POST
│   │           └── [id]/
│   │               └── route.ts        # PATCH, DELETE
│   ├── dashboard/page.tsx              # Fotoğraf widget eklendi
│   └── profil/[username]/page.tsx      # Fotoğraf sekmesi eklendi
├── lib/
│   └── upload.ts                       # Upload utility
├── components/
│   └── navbar.tsx                      # Fotoğraflarım linki eklendi
└── public/
    └── uploads/
        └── progress-photos/            # Yüklenen fotoğraflar
```

## 🎯 Kullanım

### Fotoğraf Yükleme
1. `/fotograflar` sayfasına git
2. "Fotoğraf Yükle" butonuna tıkla
3. Fotoğrafı sürükle-bırak veya seç
4. Fotoğraf tipini seç (Başlangıç/İlerleme/Sonuç)
5. Kilo ve açıklama ekle (opsiyonel)
6. "Yükle" butonuna tıkla

### Fotoğraf Düzenleme
1. Galeri'de fotoğrafın üzerine gel
2. "Düzenle" butonuna tıkla
3. Bilgileri güncelle
4. "Kaydet" butonuna tıkla

### Fotoğraf Silme
1. Galeri'de fotoğrafın üzerine gel
2. "Sil" butonuna tıkla
3. Onay ver

## 🔒 Güvenlik
- ✅ Sadece giriş yapmış kullanıcılar fotoğraf yükleyebilir
- ✅ Kullanıcılar sadece kendi fotoğraflarını düzenleyebilir/silebilir
- ✅ Dosya boyutu ve tip kontrolü
- ✅ Server-side validation

## 📊 Veritabanı
Prisma'da `ProgressPhoto` modeli zaten mevcut:
- `id` - Unique ID
- `userId` - Kullanıcı ID
- `photoUrl` - Fotoğraf URL'i
- `weight` - Kilo bilgisi (opsiyonel)
- `type` - Fotoğraf tipi (before/after/progress)
- `caption` - Açıklama (opsiyonel)
- `likesCount` - Beğeni sayısı (gelecek özellik)
- `commentsCount` - Yorum sayısı (gelecek özellik)
- `createdAt` - Oluşturulma tarihi

## 🚀 Gelecek Özellikler (Opsiyonel)
- [ ] Fotoğraflara beğeni/yorum
- [ ] Before/After karşılaştırma slider'ı
- [ ] Fotoğraf timeline görünümü
- [ ] Fotoğraf paylaşma (sosyal feed)
- [ ] Fotoğraf filtreleri/düzenleme
- [ ] Toplu fotoğraf yükleme
- [ ] Fotoğraf sıralama/düzenleme

## 📝 Notlar
- Fotoğraflar `public/uploads/progress-photos/` klasörüne kaydedilir
- Bu klasör `.gitignore`'da (versiyon kontrolüne dahil değil)
- Production'da S3 veya Cloudinary gibi bir servis kullanılabilir
- Dosya isimleri timestamp + random string ile unique yapılır
