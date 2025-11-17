# Blog Sistemi - Requirements Document

## Introduction

Blog sistemi, kullanıcılara diyet, sağlıklı yaşam, beslenme ve motivasyon konularında değerli içerikler sunan, SEO dostu ve yönetimi kolay bir içerik platformudur. Bu özellik, kullanıcı eğitimini artırarak platform otoritesini güçlendirir, organik trafik çeker ve kullanıcı bağlılığını artırır.

## Glossary

- **Blog Post**: Yayınlanan blog yazısı (başlık, içerik, kapak görseli, kategori, etiketler içerir)
- **Blog Category**: Blog yazılarının gruplandığı ana kategoriler (Beslenme, Egzersiz, Motivasyon, vb.)
- **Blog Tag**: Blog yazılarına eklenen anahtar kelimeler (protein, kilo verme, yoga, vb.)
- **Featured Post**: Ana sayfada veya blog listesinde öne çıkarılan yazı
- **Reading Time**: Yazının tahmini okuma süresi (kelime sayısına göre hesaplanır)
- **Blog Draft**: Henüz yayınlanmamış taslak yazı
- **Blog SEO**: Blog yazısının arama motorları için optimize edilmiş meta bilgileri
- **Related Posts**: Bir blog yazısıyla ilişkili diğer önerilen yazılar
- **Blog Comment**: Kullanıcıların blog yazılarına yaptığı yorumlar
- **Blog Author**: Blog yazısını yazan kişi (admin veya editör)

## Requirements

### Requirement 1: Blog Yazısı Oluşturma ve Yönetimi

**User Story:** Admin olarak, blog yazıları oluşturmak, düzenlemek ve yayınlamak istiyorum, böylece kullanıcılara değerli içerikler sunabilirim.

#### Acceptance Criteria

1. WHEN admin blog oluşturma sayfasına eriştiğinde, THE Blog System SHALL başlık, slug, içerik (rich text editor), kapak görseli, kategori, etiketler ve SEO meta bilgileri için alanlar sunmalıdır
2. WHEN admin blog yazısını kaydettiğinde, THE Blog System SHALL yazıyı "Taslak" veya "Yayınlandı" durumunda kaydetmelidir
3. THE Blog System SHALL blog içeriği için zengin metin editörü (başlıklar, listeler, bağlantılar, görseller, kod blokları) sunmalıdır
4. WHEN admin kapak görseli yüklediğinde, THE Blog System SHALL görseli otomatik olarak optimize etmeli ve farklı boyutlarda (thumbnail, medium, large) kaydetmelidir
5. THE Blog System SHALL blog slug'ını başlıktan otomatik oluşturmalı ancak manuel düzenlemeye izin vermelidir
6. WHEN admin blog yazısını sildiğinde, THE Blog System SHALL soft delete yapmalı ve geri yükleme imkanı sunmalıdır

### Requirement 2: Blog Kategorileri ve Etiketler

**User Story:** Admin olarak, blog yazılarını kategorilere ve etiketlere göre organize etmek istiyorum, böylece kullanıcılar ilgili içerikleri kolayca bulabilsin.

#### Acceptance Criteria

1. THE Blog System SHALL admin panelinde kategori oluşturma, düzenleme ve silme işlemlerine izin vermelidir
2. WHEN kategori oluşturulduğunda, THE Blog System SHALL kategori adı, slug, açıklama ve ikon/renk bilgilerini kaydetmelidir
3. THE Blog System SHALL her blog yazısının bir ana kategoriye ait olmasını zorunlu kılmalıdır
4. THE Blog System SHALL blog yazılarına çoklu etiket eklenmesine izin vermelidir
5. WHEN kullanıcı bir kategoriye tıkladığında, THE Blog System SHALL o kategorideki tüm yazıları listelemelidir
6. THE Blog System SHALL en çok kullanılan etiketleri sidebar'da "Popüler Etiketler" olarak göstermelidir

### Requirement 3: Blog Listeleme ve Filtreleme

**User Story:** Kullanıcı olarak, blog yazılarını görmek, kategorilere göre filtrelemek ve arama yapmak istiyorum, böylece ilgilendiğim içeriklere kolayca ulaşabilirim.

#### Acceptance Criteria

1. THE Blog System SHALL blog listesini sayfa başına 12 yazı olacak şekilde sayfalandırmalıdır
2. WHEN kullanıcı blog sayfasına eriştiğinde, THE Blog System SHALL yazıları en yeniden en eskiye doğru sıralamalıdır
3. THE Blog System SHALL her blog kartında kapak görseli, başlık, özet (ilk 150 karakter), kategori, yazar, tarih ve okuma süresini göstermelidir
4. WHEN kullanıcı kategori filtresi seçtiğinde, THE Blog System SHALL sadece o kategorideki yazıları göstermelidir
5. THE Blog System SHALL arama çubuğunda başlık, içerik ve etiketlerde arama yapmalıdır
6. THE Blog System SHALL "Öne Çıkan Yazılar" bölümünde en fazla 3 featured post göstermelidir

### Requirement 4: Blog Detay Sayfası

**User Story:** Kullanıcı olarak, blog yazısını okumak, ilgili yazıları görmek ve yorum yapmak istiyorum, böylece içerikle etkileşime geçebilirim.

#### Acceptance Criteria

1. WHEN kullanıcı blog detay sayfasına eriştiğinde, THE Blog System SHALL başlık, yazar bilgisi, yayın tarihi, okuma süresi, kapak görseli ve tam içeriği göstermelidir
2. THE Blog System SHALL blog içeriğinde başlıklar için otomatik içindekiler tablosu (table of contents) oluşturmalıdır
3. THE Blog System SHALL blog sonunda "İlgili Yazılar" bölümünde aynı kategoriden 3 yazı önermelidir
4. THE Blog System SHALL sosyal medya paylaşım butonları (Twitter, Facebook, WhatsApp, Link Kopyala) sunmalıdır
5. WHEN kullanıcı blog okurken scroll yaptığında, THE Blog System SHALL okuma ilerlemesini progress bar ile göstermelidir
6. THE Blog System SHALL blog görüntülenme sayısını takip etmeli ve admin panelinde göstermelidir

### Requirement 5: Yorum Sistemi

**User Story:** Kullanıcı olarak, blog yazılarına yorum yaparak fikirlerimi paylaşmak istiyorum, böylece toplulukla etkileşime geçebilirim.

#### Acceptance Criteria

1. WHEN kayıtlı kullanıcı blog detay sayfasında yorum alanına eriştiğinde, THE Blog System SHALL yorum yapma formunu göstermelidir
2. WHEN kullanıcı yorum gönderdiğinde, THE Blog System SHALL yorumu moderasyon kuyruğuna almalı ve admin onayından sonra yayınlamalıdır
3. THE Blog System SHALL yorumlarda kullanıcı adı, profil fotoğrafı ve yorum tarihini göstermelidir
4. THE Blog System SHALL kullanıcıların kendi yorumlarını düzenlemesine ve silmesine izin vermelidir
5. WHEN admin moderasyon panelinde yorumu incelediğinde, THE Blog System SHALL "Onayla", "Reddet" ve "Spam İşaretle" seçenekleri sunmalıdır
6. THE Blog System SHALL spam ve uygunsuz içerik için otomatik filtreleme yapmalıdır

### Requirement 6: SEO Optimizasyonu

**User Story:** Admin olarak, blog yazılarının arama motorlarında üst sıralarda çıkmasını istiyorum, böylece organik trafik artabilir.

#### Acceptance Criteria

1. THE Blog System SHALL her blog yazısı için özel meta title, meta description ve OG image ayarlanmasına izin vermelidir
2. THE Blog System SHALL otomatik olarak yapılandırılmış veri (JSON-LD schema) oluşturmalıdır (Article schema)
3. THE Blog System SHALL blog URL'lerini SEO dostu slug formatında oluşturmalıdır (örn: /blog/saglikli-beslenme-ipuclari)
4. THE Blog System SHALL otomatik sitemap.xml oluşturmalı ve her yeni blog eklendiğinde güncellemelidir
5. THE Blog System SHALL görsellere otomatik alt text eklenmesine izin vermelidir
6. THE Blog System SHALL canonical URL'leri doğru şekilde ayarlamalıdır

### Requirement 7: Okuma Süresi ve İstatistikler

**User Story:** Kullanıcı olarak, blog yazısını okumadan önce ne kadar süreceğini bilmek istiyorum, böylece zamanımı planlayabilirim.

#### Acceptance Criteria

1. THE Blog System SHALL blog içeriğindeki kelime sayısına göre tahmini okuma süresini hesaplamalıdır (dakika cinsinden, ortalama 200 kelime/dakika)
2. THE Blog System SHALL okuma süresini blog kartında ve detay sayfasında göstermelidir
3. THE Blog System SHALL her blog için görüntülenme sayısını, ortalama okuma süresini ve tamamlanma oranını takip etmelidir
4. THE Blog System SHALL admin panelinde en çok okunan, en az okunan ve en çok yorum alan yazıları göstermelidir
5. THE Blog System SHALL haftalık ve aylık blog performans raporları oluşturmalıdır

### Requirement 8: Featured Posts ve Öne Çıkarma

**User Story:** Admin olarak, önemli blog yazılarını öne çıkarmak istiyorum, böylece kullanıcılar öncelikli içerikleri görebilsin.

#### Acceptance Criteria

1. WHEN admin bir blog yazısını featured olarak işaretlediğinde, THE Blog System SHALL o yazıyı blog ana sayfasında üstte göstermelidir
2. THE Blog System SHALL aynı anda maksimum 3 featured post'a izin vermelidir
3. THE Blog System SHALL featured post'ları daha büyük kart tasarımıyla göstermelidir
4. THE Blog System SHALL ana sayfada "Editörün Seçtikleri" bölümünde featured post'ları göstermelidir
5. WHEN admin featured post sırasını değiştirdiğinde, THE Blog System SHALL yeni sıralamayı kaydetmelidir

### Requirement 9: Blog Arama ve Filtreleme

**User Story:** Kullanıcı olarak, blog yazılarında arama yaparak istediğim konuyu hızlıca bulmak istiyorum.

#### Acceptance Criteria

1. THE Blog System SHALL blog sayfasında arama çubuğu sunmalıdır
2. WHEN kullanıcı arama yaptığında, THE Blog System SHALL başlık, içerik, kategori ve etiketlerde arama yapmalıdır
3. THE Blog System SHALL arama sonuçlarını relevans skoruna göre sıralamalıdır
4. THE Blog System SHALL "Sonuç bulunamadı" durumunda alternatif öneriler sunmalıdır
5. THE Blog System SHALL popüler arama terimlerini takip etmeli ve admin panelinde göstermelidir

### Requirement 10: Responsive Tasarım ve Performans

**User Story:** Kullanıcı olarak, blog yazılarını mobil cihazımda da rahatça okumak istiyorum, böylece her yerden erişebilirim.

#### Acceptance Criteria

1. THE Blog System SHALL tüm blog sayfalarını mobil, tablet ve desktop için responsive tasarlamalıdır
2. THE Blog System SHALL görselleri lazy loading ile yüklemelidir
3. THE Blog System SHALL blog içeriğini okumaya optimize edilmiş tipografi (font boyutu, satır aralığı) ile göstermelidir
4. THE Blog System SHALL sayfa yükleme süresini 3 saniyenin altında tutmalıdır
5. THE Blog System SHALL blog içeriğini cache'lemeli ve CDN üzerinden sunmalıdır
