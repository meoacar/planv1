/**
 * AI Blog Content Generator
 * Günlük blog içeriği üretir - şablon + AI zenginleştirme
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Blog şablonları havuzu
const BLOG_TEMPLATES = [
  {
    topic: 'motivasyon',
    title: 'Bugün Yeni Bir Başlangıç',
    excerpt: 'Her gün yeni bir fırsat. Hedeflerinize ulaşmak için bugün atacağınız küçük adımlar yarın büyük değişimler yaratacak.',
    baseContent: `
# Bugün Yeni Bir Başlangıç

Her sabah uyandığınızda, yeni bir sayfa açılır. Dün ne olursa olsun, bugün yeni bir fırsat.

## Küçük Adımlar, Büyük Değişimler

Hedeflerinize ulaşmak için dev adımlar atmanıza gerek yok. Her gün küçük, tutarlı adımlar atmak yeterli.

### Bugün Yapabilecekleriniz:
- Bir bardak daha su için
- 10 dakika yürüyüş yapın
- Sağlıklı bir öğün hazırlayın
- Kendinize güzel bir şey söyleyin

## Unutmayın

Başarı bir gece gelmez. Ama her gün biraz daha yaklaşırsınız. 💪
    `
  },
  {
    topic: 'beslenme',
    title: 'Sağlıklı Beslenmenin Püf Noktaları: Kilo Vermenin Sırrı',
    excerpt: 'Sağlıklı beslenme karmaşık olmak zorunda değil. Kilo vermek ve sağlıklı yaşamak için bilmeniz gereken her şey bu rehberde.',
    baseContent: `
Sağlıklı beslenme, kilo verme yolculuğunuzun en önemli parçasıdır. Peki, gerçekten sağlıklı beslenmenin püf noktaları nelerdir? Bu yazıda, bilimsel araştırmalarla desteklenmiş, uygulaması kolay beslenme ipuçlarını sizlerle paylaşacağım.

## Sağlıklı Beslenme Nedir?

Sağlıklı beslenme, vücudunuzun ihtiyaç duyduğu tüm besin öğelerini dengeli bir şekilde almanız demektir. Bu sadece kilo vermek için değil, genel sağlığınız için de kritik öneme sahiptir.

### Dengeli Beslenmenin Temel İlkeleri

**1. Makro Besin Dengesi**

Vücudunuz üç ana makro besine ihtiyaç duyar:
- **Karbonhidratlar:** Enerjinizin ana kaynağı (günlük kalorinin %45-65'i)
- **Proteinler:** Kas yapımı ve onarımı için (günlük kalorinin %10-35'i)
- **Yağlar:** Hormon üretimi ve vitamin emilimi için (günlük kalorinin %20-35'i)

**2. Mikro Besinler**

Vitaminler ve mineraller, metabolizmanızın düzgün çalışması için şarttır. Renkli sebze ve meyveler, bu mikro besinlerin en iyi kaynaklarıdır.

## Kilo Vermek İçin Beslenme Stratejileri

### Kalori Açığı Oluşturma

Kilo vermek için harcadığınızdan daha az kalori almanız gerekir. Ancak bu açık çok büyük olmamalı:
- Kadınlar için minimum 1200 kalori
- Erkekler için minimum 1500 kalori
- Günlük 500 kalori açık = haftada 0.5 kg kayıp

### Öğün Zamanlaması

Araştırmalar gösteriyor ki, ne zaman yediğiniz de önemli:
- **Kahvaltı:** Metabolizmanızı başlatır
- **Öğle:** En büyük öğününüz olabilir
- **Akşam:** Hafif ve erken yiyin (uyumadan 3 saat önce)

### Porsiyon Kontrolü

Sağlıklı yiyecekler bile fazla tüketilirse kilo aldırır:
- Tabak yöntemi: 1/2 sebze, 1/4 protein, 1/4 karbonhidrat
- Avuç ölçüsü: Protein porsiyonunuz avucunuz kadar olmalı
- Küçük tabaklar kullanın: Gözünüzü aldatır, daha az yersiniz

## Pratik Beslenme İpuçları

### Alışveriş Listesi Hazırlama

Sağlıklı beslenmenin ilk adımı doğru alışveriştir:

**Sebze ve Meyveler:**
- Yeşil yapraklılar (ıspanak, roka, marul)
- Çarmıh sebzeler (brokoli, karnabahar)
- Renkli sebzeler (domates, biber, havuç)
- Mevsim meyveleri

**Protein Kaynakları:**
- Tavuk göğsü (yağsız)
- Balık (omega-3 açısından zengin)
- Yumurta
- Baklagiller (nohut, mercimek, fasulye)
- Yoğurt ve peynir (az yağlı)

**Sağlıklı Karbonhidratlar:**
- Tam tahıllı ekmek
- Esmer pirinç
- Kinoa
- Yulaf
- Tatlı patates

**Sağlıklı Yağlar:**
- Zeytinyağı
- Avokado
- Fındık, badem, ceviz
- Chia tohumu

### Yemek Hazırlama Teknikleri

Nasıl pişirdiğiniz de önemli:
- **Haşlama:** En sağlıklı yöntem
- **Fırında pişirme:** Yağsız ve lezzetli
- **Buharda pişirme:** Besin değerini korur
- **Izgara:** Az yağla lezzetli sonuçlar
- **Kaçının:** Kızartma ve aşırı yağlı yöntemler

### Su Tüketimi

Su, metabolizmanızın en iyi arkadaşıdır:
- Günde en az 2-3 litre su için
- Her öğünden önce 1 bardak su içmek tokluk hissi verir
- Susuzluk bazen açlık hissi olarak algılanır
- Yeşil çay ve bitki çayları da sayılır

## Kaçınılması Gereken Hatalar

### 1. Aşırı Kısıtlama

Çok sıkı diyet yapmak:
- Metabolizmanızı yavaşlatır
- Kas kaybına neden olur
- Uzun vadede sürdürülemez
- Yo-yo etkisi yaratır

### 2. Öğün Atlamak

Özellikle kahvaltı atlamak:
- Metabolizmanızı yavaşlatır
- Öğlen aşırı yemeye neden olur
- Kan şekerinizi düşürür

### 3. İşlenmiş Gıdalar

Hazır gıdalar:
- Yüksek kalori, düşük besin değeri
- Gizli şeker ve tuz içerir
- Katkı maddeleri sağlığa zararlı
- Tokluk hissi vermez

### 4. Duygusal Yeme

Stres, üzüntü veya can sıkıntısıyla yemek:
- Gerçek açlık değildir
- Sağlıksız seçimlere yönlendirir
- Suçluluk hissi yaratır

## Başarı İçin Stratejiler

### Meal Prep (Öğün Hazırlığı)

Hafta sonu 2-3 saatinizi ayırın:
- Haftanın öğünlerini planlayın
- Toplu pişirin ve porsiyonlayın
- Buzdolabında saklayın
- Hazır olunca sağlıklı seçim yapmak kolay

### Günlük Takip

Yediklerinizi kaydetmek:
- Farkındalık yaratır
- Gizli kalorileri ortaya çıkarır
- İlerlemenizi gösterir
- Motivasyon sağlar

### Esnek Olun

%80-20 kuralı:
- Haftanın %80'i sağlıklı beslenin
- %20'si için kendinize esneklik tanıyın
- Sosyal hayatınızdan vazgeçmeyin
- Sürdürülebilir olmalı

## Sonuç

Sağlıklı beslenme bir maraton, sprint değil. Küçük, sürdürülebilir değişikliklerle başlayın. Her gün biraz daha iyi seçimler yapın. Unutmayın, mükemmel olmak zorunda değilsiniz, sadece dünden daha iyi olmaya çalışın.

Kilo verme yolculuğunuzda sabırlı olun. Vücudunuz zaman ister. Hızlı sonuçlar yerine, kalıcı değişikliklere odaklanın. Sağlıklı beslenme bir diyet değil, yaşam tarzıdır.

**Önemli Not:** Bu yazıdaki bilgiler genel sağlık önerileridir. Özel sağlık durumunuz varsa, mutlaka bir diyetisyen veya doktorla görüşün.
    `
  },
  {
    topic: 'egzersiz',
    title: 'Hareket Et, Mutlu Ol',
    excerpt: 'Egzersiz sadece kilo vermek için değil, ruh sağlığınız için de önemli. İşte başlamanız için ipuçları.',
    baseContent: `
# Hareket Et, Mutlu Ol

Egzersiz denince aklınıza spor salonu gelmesine gerek yok. Hareket etmenin binlerce yolu var.

## Neden Egzersiz?

Egzersiz sadece kilo vermenize yardımcı olmaz:
- Ruh halinizi iyileştirir
- Enerji seviyenizi artırır
- Uykununuzu düzenler
- Özgüveninizi yükseltir

## Başlangıç İçin

### Evde Yapabilecekleriniz:
- 20 dakika yürüyüş
- Merdiven çıkma
- Dans etme
- Yoga veya esneme

### Motivasyon İpuçları:
- Sevdiğiniz bir aktivite seçin
- Arkadaşınızla birlikte yapın
- Küçük hedefler koyun
- İlerlemenizi takip edin

En önemli şey: Başlamak! 🏃‍♀️
    `
  },
  {
    topic: 'uyku',
    title: 'Kaliteli Uykunun Önemi',
    excerpt: 'İyi bir uyku, sağlıklı yaşamın temelidir. Uyku kalitenizi artırmak için yapabilecekleriniz.',
    baseContent: `
# Kaliteli Uykunun Önemi

Kilo verme yolculuğunuzda en çok göz ardı edilen faktör: Uyku.

## Uyku ve Kilo İlişkisi

Yetersiz uyku:
- Açlık hormonlarını artırır
- Metabolizmayı yavaşlatır
- İrade gücünüzü azaltır
- Stres seviyenizi yükseltir

## Daha İyi Uyku İçin

### Gece Rutini:
- Aynı saatte yatın
- Ekranlardan uzak durun (son 1 saat)
- Oda sıcaklığını düşük tutun
- Rahatlatıcı aktiviteler yapın

### Kaçınılması Gerekenler:
- Geç saatte kafein
- Ağır yemekler
- Yoğun egzersiz (akşam)
- Stresli düşünceler

Kaliteli uyku = Sağlıklı vücut 😴
    `
  },
  {
    topic: 'stres',
    title: 'Stres Yönetimi ve Kilo',
    excerpt: 'Stres, kilo vermenin gizli düşmanı. Stresi yönetmek için pratik yöntemler.',
    baseContent: `
# Stres Yönetimi ve Kilo

Stres, vücudunuzda kortizol hormonu salgılatır ve bu da kilo almanıza neden olabilir.

## Stresin Etkileri

- Duygusal yeme
- Metabolizma yavaşlaması
- Karın bölgesinde yağ birikimi
- Uyku problemleri

## Stresle Başa Çıkma

### Günlük Pratikler:
- Derin nefes egzersizleri
- Meditasyon (5-10 dakika)
- Doğada zaman geçirme
- Sevdiklerinizle konuşma

### Uzun Vadeli Çözümler:
- Düzenli egzersiz
- Hobi edinme
- Sınırlar koyma
- Profesyonel destek

Stresinizi yönetin, kilolarınız da yönetilsin! 🧘‍♀️
    `
  }
];

let currentTemplateIndex = 0;

export async function generateDailyBlogContent() {
  try {
    // Sıradaki şablonu al
    const template = BLOG_TEMPLATES[currentTemplateIndex];
    currentTemplateIndex = (currentTemplateIndex + 1) % BLOG_TEMPLATES.length;

    // Bugünün tarihini al
    const today = new Date();
    const dateStr = today.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    // AI ile zenginleştir
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Aşağıdaki blog yazısını bugünün tarihi (${dateStr}) ve mevsim göz önünde bulundurarak zenginleştir.
Türkiye'deki okuyucular için güncel, mevsimsel ve pratik bir ipucu ekle.
SEO-friendly, doğal ve samimi bir dil kullan.
Sadece eklenen paragrafı döndür, maksimum 3-4 cümle.

Konu: ${template.topic}
Başlık: ${template.title}
Hedef Kitle: Sağlıklı yaşam ve kilo verme hedefi olan Türk okuyucular

Zenginleştirme:`;

    const result = await model.generateContent(prompt);
    const aiEnrichment = result.response.text();

    // İçeriği birleştir
    const enrichedContent = `${template.baseContent}\n\n## Bugün İçin Özel\n\n${aiEnrichment}\n\n---\n*${dateStr} tarihinde otomatik olarak oluşturulmuştur.*`;

    // Slug oluştur
    const slug = `${template.topic}-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    // Unsplash'ten ücretsiz görseller
    const coverImages = {
      motivasyon: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=630&fit=crop',
      beslenme: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=630&fit=crop',
      egzersiz: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=630&fit=crop',
      uyku: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=630&fit=crop',
      stres: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    };

    return {
      title: template.title,
      slug,
      content: enrichedContent,
      excerpt: template.excerpt,
      coverImage: coverImages[template.topic as keyof typeof coverImages],
      coverImageAlt: `${template.title} - Sağlıklı yaşam ve zayıflama ipuçları`,
    };

  } catch (error) {
    console.error('[Blog Generator] AI enrichment failed, using template only:', error);
    
    // AI başarısız olursa sadece şablon kullan
    const template = BLOG_TEMPLATES[currentTemplateIndex];
    const today = new Date();
    const dateStr = today.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    const slug = `${template.topic}-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    // Unsplash'ten ücretsiz görseller
    const coverImages = {
      motivasyon: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=630&fit=crop',
      beslenme: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=630&fit=crop',
      egzersiz: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=630&fit=crop',
      uyku: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=630&fit=crop',
      stres: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop',
    };

    return {
      title: template.title,
      slug,
      content: `${template.baseContent}\n\n---\n*${dateStr} tarihinde yayınlanmıştır.*`,
      excerpt: template.excerpt,
      coverImage: coverImages[template.topic as keyof typeof coverImages],
      coverImageAlt: `${template.title} - Sağlıklı yaşam ve zayıflama ipuçları`,
    };
  }
}
