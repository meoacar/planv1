# Yeme Günahı İtiraf Duvarı - Requirements Document

## Introduction

"Yeme Günahı İtiraf Duvarı" (Confession Wall), kullanıcıların diyet sürecinde yaptıkları "hataları" anonim olarak paylaşabilecekleri, mizah ve empati odaklı bir sosyal özellik. Bu özellik, diyet yapan insanların yaşadığı suçluluk duygusunu normalleştirerek, topluluk bağını güçlendirir ve kullanıcı tutma oranını artırır. AI destekli esprili yanıtlar sayesinde kullanıcılar hem rahatlama hem de eğlence bulur.

## Glossary

- **Confession System**: Kullanıcıların anonim itiraflarını oluşturduğu, paylaştığı ve AI yanıtları aldığı sistem
- **AI Response Engine**: İtirafları analiz edip esprili, empatik yanıtlar üreten yapay zeka motoru
- **Confession Feed**: İtirafların kronolojik olarak listelendiği ana akış
- **Empathy Counter**: Diğer kullanıcıların "Benimki de vardı" butonuyla gösterdiği empati sayısı
- **Confession Category**: İtirafların otomatik kategorize edildiği gruplar (Gece Saldırıları, Özel Gün Bahaneleri, vb.)
- **Confession Badge**: İtiraf yapma ve empati gösterme ile kazanılan özel rozetler
- **Moderation Queue**: Admin panelinde itirafların moderasyonunun yapıldığı kuyruk
- **Telafi Planı**: AI'ın itiraf sonrası önerdiği pratik aksiyon önerileri

## Requirements

### Requirement 1: İtiraf Oluşturma ve Paylaşma

**User Story:** Kullanıcı olarak, diyet sürecimde yaptığım "hataları" anonim olarak paylaşmak istiyorum, böylece suçluluk duymadan rahatlamak ve topluluktan destek almak istiyorum.

#### Acceptance Criteria

1. WHEN kullanıcı itiraf oluşturma sayfasına eriştiğinde, THE Confession System SHALL kullanıcıya metin girişi alanı, kategori seçimi ve opsiyonel emoji seçimi sunmalıdır
2. WHEN kullanıcı itiraf metnini girip gönder butonuna tıkladığında, THE Confession System SHALL itirafı anonim olarak veritabanına kaydetmeli ve AI Response Engine'e analiz için göndermelidir
3. WHEN itiraf başarıyla kaydedildiğinde, THE Confession System SHALL kullanıcıya 10 XP ve 5 coin ödül vermelidir
4. THE Confession System SHALL kullanıcının günlük maksimum 3 itiraf yapmasına izin vermelidir
5. WHEN itiraf metni 10 karakterden az veya 500 karakterden fazla olduğunda, THE Confession System SHALL kullanıcıya uygun hata mesajı göstermelidir
6. THE Confession System SHALL itirafları otomatik olarak spam ve uygunsuz içerik için filtrelemelidir

### Requirement 2: AI Destekli Esprili Yanıtlar

**User Story:** Kullanıcı olarak, itirafıma AI tarafından üretilmiş esprili ve empatik bir yanıt almak istiyorum, böylece kendimi daha iyi hissedip gülümseyebilirim.

#### Acceptance Criteria

1. WHEN itiraf AI Response Engine'e gönderildiğinde, THE AI Response Engine SHALL itiraf metnini analiz ederek anahtar kelimeleri (tatlı, gece, pizza, vb.) tespit etmelidir
2. WHEN anahtar kelimeler tespit edildiğinde, THE AI Response Engine SHALL itirafın kategorisini otomatik olarak belirlemelidir
3. WHEN kategori belirlendikten sonra, THE AI Response Engine SHALL o kategoriye uygun ton ve stilde (empatik, mizahi, motivasyonel veya gerçekçi) bir yanıt üretmelidir
4. THE AI Response Engine SHALL yanıtı maksimum 5 saniye içinde üretmelidir
5. THE AI Response Engine SHALL yanıtlarda tetikleyici veya olumsuz dil kullanmamalıdır
6. WHEN AI yanıt üretemediğinde, THE Confession System SHALL önceden hazırlanmış genel bir empatik mesaj göstermelidir

### Requirement 3: Sosyal Etkileşim ve Empati Sistemi

**User Story:** Kullanıcı olarak, başkalarının itiraflarını görmek ve "Benimki de vardı" diyerek empati göstermek istiyorum, böylece yalnız olmadığımı hissedebilirim.

#### Acceptance Criteria

1. THE Confession Feed SHALL itirafları en yeniden en eskiye doğru kronolojik sırada listelemelidir
2. WHEN kullanıcı bir itirafın "Benimki de vardı" butonuna tıkladığında, THE Confession System SHALL empati sayacını 1 artırmalı ve kullanıcıya 2 XP vermelidir
3. THE Confession System SHALL her kullanıcının aynı itirafa sadece bir kez empati göstermesine izin vermelidir
4. WHEN kullanıcı Confession Feed'i görüntülediğinde, THE Confession System SHALL her itirafta kategori ikonu, AI yanıtı, empati sayısı ve gönderi zamanını göstermelidir
5. THE Confession System SHALL kullanıcının kendi itiraflarını profil sayfasında görüntülemesine izin vermelidir (anonim olarak paylaşılsa bile)
6. WHEN itiraf 100'den fazla empati aldığında, THE Confession System SHALL o itirafı "Popüler İtiraflar" bölümünde öne çıkarmalıdır

### Requirement 4: Kategori ve Filtreleme Sistemi

**User Story:** Kullanıcı olarak, itirafları kategorilere göre filtrelemek istiyorum, böylece ilgimi çeken veya benzer deneyimler yaşadığım itirafları kolayca bulabileyim.

#### Acceptance Criteria

1. THE Confession System SHALL itirafları şu kategorilere otomatik olarak ayırmalıdır: Gece Saldırıları, Özel Gün Bahaneleri, Stres Yeme, Sosyal Baskı, Pişman Değilim
2. WHEN kullanıcı kategori filtresi seçtiğinde, THE Confession Feed SHALL sadece seçilen kategorideki itirafları göstermelidir
3. THE Confession System SHALL her kategoriye özel bir emoji/ikon atamalıdır
4. WHEN kullanıcı "Tümü" filtresini seçtiğinde, THE Confession Feed SHALL tüm kategorilerden itirafları göstermelidir
5. THE Confession System SHALL kategori bazında istatistikler (toplam itiraf sayısı, en popüler kategori) tutmalıdır

### Requirement 5: Gamification ve Ödül Sistemi

**User Story:** Kullanıcı olarak, itiraf yaparak ve empati göstererek rozet ve ödüller kazanmak istiyorum, böylece sistemi kullanmaya devam etmek için motivasyon bulabilirim.

#### Acceptance Criteria

1. WHEN kullanıcı ilk itirafını yaptığında, THE Confession System SHALL kullanıcıya "Dürüst Ruh" rozetini vermelidir
2. WHEN kullanıcı 10 itiraf yaptığında, THE Confession System SHALL kullanıcıya "İtiraf Ustası" rozetini ve 50 coin bonus vermelidir
3. WHEN kullanıcı 50 kez empati gösterdiğinde, THE Confession System SHALL kullanıcıya "Empati Kahramanı" rozetini vermelidir
4. WHEN kullanıcı gece saatlerinde (23:00-06:00) itiraf yaptığında, THE Confession System SHALL kullanıcıya "Gece Savaşçısı" rozetini vermelidir
5. THE Confession System SHALL haftalık "En Çok Beğenilen İtiraf" sahibine 100 coin bonus vermelidir
6. THE Confession System SHALL kullanıcının profil sayfasında kazandığı itiraf rozetlerini göstermelidir

### Requirement 6: Telafi Planı Önerileri

**User Story:** Kullanıcı olarak, itiraf yaptıktan sonra AI'dan pratik telafi önerileri almak istiyorum, böylece suçluluktan aksiyona geçebilirim.

#### Acceptance Criteria

1. WHEN AI yanıt ürettiğinde, THE AI Response Engine SHALL itirafın içeriğine göre opsiyonel bir telafi planı önerisi de üretmelidir
2. THE AI Response Engine SHALL telafi önerilerini gerçekçi ve uygulanabilir tutmalıdır (örn: "Yarın 20 dk yürüyüş", "Bugün 2 litre su iç")
3. WHEN kullanıcı telafi önerisini kabul ettiğinde, THE Confession System SHALL bu öneriyi kullanıcının günlük görevlerine eklemeli ve tamamlandığında 15 XP bonus vermelidir
4. THE Confession System SHALL telafi önerilerinin tamamlanma oranını istatistik olarak tutmalıdır
5. WHEN kullanıcı telafi önerisini tamamladığında, THE Confession System SHALL kullanıcıya motivasyonel bir bildirim göndermelidir

### Requirement 7: Moderasyon ve Güvenlik

**User Story:** Admin olarak, uygunsuz itirafları moderasyon yapabilmek istiyorum, böylece topluluk güvenli ve destekleyici kalabilir.

#### Acceptance Criteria

1. THE Confession System SHALL tüm itirafları otomatik spam ve uygunsuz içerik filtresinden geçirmelidir
2. WHEN itiraf şüpheli içerik içerdiğinde, THE Confession System SHALL o itirafı moderasyon kuyruğuna almalı ve yayınlanmasını bekletmelidir
3. WHEN admin moderasyon panelinde itirafı incelediğinde, THE Confession System SHALL admin'e "Onayla", "Reddet" ve "Kullanıcıyı Uyar" seçenekleri sunmalıdır
4. WHEN itiraf reddedildiğinde, THE Confession System SHALL kullanıcıya neden reddedildiğini açıklayan bir bildirim göndermelidir
5. THE Confession System SHALL kullanıcıların diğer itirafları "Uygunsuz İçerik" olarak raporlamasına izin vermelidir
6. WHEN bir itiraf 5'ten fazla rapor aldığında, THE Confession System SHALL o itirafı otomatik olarak gizlemeli ve moderasyon kuyruğuna almalıdır

### Requirement 8: Sezonluk Temalar ve Özel Etkinlikler

**User Story:** Kullanıcı olarak, özel günlerde (Ramazan, Yılbaşı, Bayram) temaya uygun itiraf kategorileri görmek istiyorum, böylece deneyimim daha kişiselleştirilmiş ve eğlenceli olabilir.

#### Acceptance Criteria

1. WHEN Ramazan ayında olduğunda, THE Confession System SHALL "İftar Sonrası İtiraflar" özel kategorisini aktif etmelidir
2. WHEN Yılbaşı döneminde olduğunda, THE Confession System SHALL "Yılbaşı Sofrası Mağdurları" özel kategorisini aktif etmelidir
3. WHEN Bayram döneminde olduğunda, THE Confession System SHALL "Bayram Şekeri Kurbanları" özel kategorisini aktif etmelidir
4. THE Confession System SHALL sezonluk kategorilerde yapılan itiraflar için özel rozetler vermelidir
5. THE Confession System SHALL admin panelinden sezonluk temaların başlangıç ve bitiş tarihlerinin ayarlanmasına izin vermelidir

### Requirement 9: Performans ve Ölçeklenebilirlik

**User Story:** Sistem yöneticisi olarak, yüksek trafikte bile sistemin hızlı ve stabil çalışmasını istiyorum, böylece kullanıcı deneyimi kesintisiz olabilir.

#### Acceptance Criteria

1. THE Confession System SHALL Confession Feed'i sayfa başına 20 itiraf olacak şekilde sayfalandırmalıdır
2. THE Confession System SHALL AI yanıtlarını cache'lemeli ve aynı anahtar kelimeler için benzer yanıtları yeniden kullanmalıdır
3. THE Confession System SHALL veritabanı sorgularını optimize etmek için uygun indeksler kullanmalıdır
4. WHEN sistem yükü yüksek olduğunda, THE Confession System SHALL AI yanıt üretimini kuyruk sistemine almalıdır
5. THE Confession System SHALL günlük, haftalık ve aylık istatistikleri Redis cache'de tutmalıdır

### Requirement 10: Analitik ve Raporlama

**User Story:** Admin olarak, itiraf sistemi kullanım istatistiklerini görmek istiyorum, böylece özelliğin başarısını ölçebilir ve iyileştirmeler yapabilirim.

#### Acceptance Criteria

1. THE Confession System SHALL admin panelinde toplam itiraf sayısı, kategori dağılımı, ortalama empati sayısı metriklerini göstermelidir
2. THE Confession System SHALL günlük aktif itiraf yapan kullanıcı sayısını takip etmelidir
3. THE Confession System SHALL en popüler itiraf kategorilerini grafik olarak göstermelidir
4. THE Confession System SHALL AI yanıt üretim başarı oranını ve ortalama yanıt süresini raporlamalıdır
5. THE Confession System SHALL telafi planı kabul ve tamamlanma oranlarını göstermelidir
