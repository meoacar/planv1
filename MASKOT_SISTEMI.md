# 🎭 Maskot Sistemi

## Özellik Özeti

Kullanıcılar artık profil resmi olarak:
1. ✅ Kendi resimlerini yükleyebilir (bilgisayardan)
2. ✅ URL ile resim ekleyebilir
3. ✅ **Hazır maskotlardan birini seçebilir** (YENİ!)

## Nasıl Çalışır?

### 1. Kayıt Sırasında
- Kullanıcı kayıt olurken `/kayit` sayfasında maskot seçebilir
- 7 farklı maskot seçeneği sunulur
- Seçim opsiyoneldir, kullanıcı isterse boş bırakabilir

### 2. Ayarlar Sayfasında
- `/ayarlar` sayfasında kullanıcı istediği zaman profil resmini değiştirebilir
- 3 seçenek:
  - Bilgisayardan resim yükle (max 2MB)
  - URL ile resim ekle
  - Hazır maskotlardan seç

### Teknik Detaylar

#### Dosya Yapısı
```
public/
  maskot/
    1.png
    2.png
    3.png
    4.png
    5.png
    6.png
    7.png

src/
  components/
    ui/
      maskot-selector.tsx    # Maskot seçici component
  app/
    api/
      maskotlar/
        route.ts             # Maskot listesi API
    kayit/
      register-form.tsx      # Kayıt formu (maskot seçimi ile)
      actions.ts             # Kayıt action (image desteği)
    ayarlar/
      settings-client.tsx    # Ayarlar sayfası (maskot seçimi ile)
```

#### API Endpoint
```
GET /api/maskotlar
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "url": "/maskot/1.png",
      "name": "Maskot 1"
    },
    ...
  ]
}
```

#### Component Kullanımı

```tsx
import { MaskotSelector } from '@/components/ui/maskot-selector'

<MaskotSelector
  selectedMaskot={selectedMaskot}
  onSelect={(url) => setSelectedMaskot(url)}
/>
```

### Veritabanı

Maskot URL'leri `User.image` alanında saklanır:
- Maskot seçilirse: `/maskot/1.png`
- Kendi resmi yüklerse: base64 string
- URL girilirse: tam URL

### Özellikler

✅ Responsive tasarım (mobil uyumlu)
✅ Seçili maskot görsel geri bildirimi
✅ Hover efektleri
✅ Loading state
✅ Error handling
✅ Dosya yükleme ile uyumlu (birini seçince diğeri devre dışı)

### Yeni Maskot Ekleme

1. Resmi `public/maskot/` klasörüne ekle
2. Dosya adı: `8.png`, `9.png`, vb.
3. Otomatik olarak API'de görünür
4. Yeniden build gerekmez

### Kullanıcı Deneyimi

**Kayıt:**
1. Email, şifre, kullanıcı adı gir
2. İstersen maskot seç (opsiyonel)
3. Kayıt ol

**Ayarlar:**
1. Profil fotoğrafı bölümüne git
2. 3 seçenekten birini kullan:
   - Bilgisayardan yükle
   - URL gir
   - Maskot seç
3. Kaydet

### Avantajlar

- 🚀 Hızlı profil oluşturma
- 🎨 Tutarlı görsel kimlik
- 💾 Sunucu depolama tasarrufu
- 🔒 Güvenli (kendi sunucumuzdan)
- 📱 Mobil uyumlu
- ♿ Erişilebilir

## Test

1. Kayıt sayfasını aç: `http://localhost:3000/kayit`
2. Maskot seçici görünmeli
3. Bir maskot seç
4. Kayıt ol
5. Dashboard'da profil resmini kontrol et
6. Ayarlar'a git ve maskotu değiştir

## Gelecek İyileştirmeler

- [ ] Maskot kategorileri (hayvanlar, karakterler, vb.)
- [ ] Maskot arama/filtreleme
- [ ] Kullanıcı favori maskotları
- [ ] Sezonluk/özel maskotlar
- [ ] Animasyonlu maskotlar
- [ ] Kullanıcı özel maskot yükleme (moderasyon ile)
