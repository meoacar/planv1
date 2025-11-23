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
    title: 'Sağlıklı Beslenmenin Püf Noktaları',
    excerpt: 'Sağlıklı beslenme karmaşık olmak zorunda değil. İşte size kolaylaştıracak pratik ipuçları.',
    baseContent: `
# Sağlıklı Beslenmenin Püf Noktaları

Sağlıklı beslenme düşündüğünüz kadar zor değil. Birkaç basit kural ile hayatınızı değiştirebilirsiniz.

## Temel Kurallar

### 1. Renkli Tabak
Tabaklarınızı farklı renklerde sebze ve meyvelerle doldurun. Her renk farklı besin değeri demek.

### 2. Su İçin
Günde en az 2 litre su içmeyi hedefleyin. Su, metabolizmanızın en iyi arkadaşı.

### 3. Porsiyon Kontrolü
Büyük tabaklardan küçük tabaklara geçin. Gözünüz doymasa da mideniz doyar.

## Pratik İpuçları
- Öğünleri atlamayın
- Yavaş yiyin, tadını çıkarın
- Hazır gıdalardan uzak durun
- Kendinize hile günü tanıyın

Sağlıklı beslenme bir yaşam tarzıdır, diyet değil! 🥗
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
      title: `${template.title} - ${dateStr}`,
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
      title: `${template.title} - ${dateStr}`,
      slug,
      content: `${template.baseContent}\n\n---\n*${dateStr} tarihinde otomatik olarak oluşturulmuştur.*`,
      excerpt: template.excerpt,
      coverImage: coverImages[template.topic as keyof typeof coverImages],
      coverImageAlt: `${template.title} - Sağlıklı yaşam ve zayıflama ipuçları`,
    };
  }
}
