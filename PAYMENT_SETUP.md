# Ödeme Sistemi Kurulum Rehberi

Bu proje **Stripe**, **iyzico** ve **PayTR** ödeme entegrasyonlarını desteklemektedir.

## 📦 Gerekli Paketler

Ödeme sistemlerini aktif etmek için aşağıdaki paketleri yüklemeniz gerekir:

```bash
npm install stripe iyzipay
```

## 🔧 Kurulum

### 1. Stripe Kurulumu

1. [Stripe Dashboard](https://dashboard.stripe.com/) hesabınıza giriş yapın
2. API anahtarlarınızı alın (Developers > API keys)
3. `.env` dosyanıza ekleyin:

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

### 2. iyzico Kurulumu

1. [iyzico Panel](https://merchant.iyzipay.com/) hesabınıza giriş yapın
2. Ayarlar > API Anahtarları bölümünden anahtarlarınızı alın
3. `.env` dosyanıza ekleyin:

```env
IYZICO_API_KEY=your_api_key
IYZICO_SECRET_KEY=your_secret_key
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com  # Test için
# IYZICO_BASE_URL=https://api.iyzipay.com  # Canlı için
```

### 3. PayTR Kurulumu

1. [PayTR Panel](https://www.paytr.com/) hesabınıza giriş yapın
2. Ayarlar > API Bilgileri bölümünden bilgilerinizi alın
3. `.env` dosyanıza ekleyin:

```env
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt
PAYTR_TEST_MODE=true  # Test modu için true, canlı için false
```

## 🚀 Kullanım

### Ödeme Akışı

1. Kullanıcı premium ürün sayfasında "Satın Al" butonuna tıklar
2. Ödeme yöntemi seçim modalı açılır (Stripe, iyzico, PayTR)
3. Kullanıcı bir yöntem seçer
4. Sistem sipariş oluşturur ve ödeme sayfasına yönlendirir
5. Kullanıcı ödemeyi tamamlar
6. Callback endpoint'i ödemeyi doğrular
7. Sipariş durumu güncellenir
8. Kullanıcı başarı/başarısız sayfasına yönlendirilir

### API Endpoint'leri

- **POST** `/api/payment/create` - Ödeme oluşturma
- **POST** `/api/payment/callback/stripe` - Stripe callback
- **POST** `/api/payment/callback/iyzico` - iyzico callback
- **POST** `/api/payment/callback/paytr` - PayTR callback

### Sayfalar

- `/magaza/premium` - Premium ürünler listesi
- `/payment/success` - Ödeme başarılı sayfası
- `/payment/fail` - Ödeme başarısız sayfası

## 🔒 Güvenlik

- Tüm API anahtarları `.env` dosyasında saklanmalıdır
- `.env` dosyası asla git'e commit edilmemelidir
- Callback endpoint'leri hash doğrulaması yapar
- Ödeme bilgileri asla veritabanında saklanmaz

## 🧪 Test Kartları

### Stripe Test Kartları
- Başarılı: `4242 4242 4242 4242`
- CVV: Herhangi 3 rakam
- Tarih: Gelecek bir tarih

### iyzico Test Kartları
- Başarılı: `5528 7900 0000 0001`
- CVV: `123`
- Tarih: `12/30`

### PayTR Test Kartları
- Test modunda herhangi bir kart çalışır
- Başarılı: `4355 0840 0000 0001`
- CVV: `000`
- Tarih: `12/30`

## 📝 Notlar

- Canlı ortama geçmeden önce test modunda tüm senaryoları test edin
- Webhook URL'lerini ödeme sağlayıcı panellerinde ayarlayın
- SSL sertifikası zorunludur (HTTPS)
- Callback URL'leri public olmalıdır

## 🐛 Sorun Giderme

### Ödeme oluşturulamıyor
- API anahtarlarını kontrol edin
- `.env` dosyasının doğru yüklendiğinden emin olun
- Paketlerin yüklü olduğunu kontrol edin: `npm list stripe iyzipay`

### Callback çalışmıyor
- Webhook URL'lerinin doğru ayarlandığından emin olun
- Sunucunun public erişilebilir olduğunu kontrol edin
- Log'ları kontrol edin

### Test kartları çalışmıyor
- Test modunda olduğunuzdan emin olun
- Doğru test kartlarını kullandığınızdan emin olun
- API anahtarlarının test anahtarları olduğunu kontrol edin

## 📞 Destek

Sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Ödeme sağlayıcı dokümantasyonunu inceleyin
3. Destek ekibiyle iletişime geçin
