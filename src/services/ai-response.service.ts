// src/services/ai-response.service.ts

import { redis } from '@/lib/redis';
import crypto from 'crypto';

// ====================================================
// TYPES & INTERFACES
// ====================================================

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export type ConfessionCategory =
  | 'night_attack'
  | 'special_occasion'
  | 'stress_eating'
  | 'social_pressure'
  | 'no_regrets'
  | 'seasonal';

export type AITone = 'empathetic' | 'humorous' | 'motivational' | 'realistic';

export interface AIResponseInput {
  content: string;
  category?: ConfessionCategory;
  userId: string;
}

export interface AIResponseOutput {
  response: string;
  tone: AITone;
  category: ConfessionCategory;
  telafiBudget?: {
    action: string;
    xpReward: number;
  };
}

// ====================================================
// KEYWORD MAPPING
// ====================================================

const CATEGORY_KEYWORDS: Record<ConfessionCategory, string[]> = {
  night_attack: [
    'gece',
    'uyuyamadım',
    'uykudan',
    'sabaha karşı',
    'gece yarısı',
    'uyku',
    'yatarken',
    'uyumadan önce',
  ],
  special_occasion: [
    'doğum günü',
    'düğün',
    'bayram',
    'yılbaşı',
    'kutlama',
    'parti',
    'davet',
    'özel gün',
    'misafir',
  ],
  stress_eating: [
    'stres',
    'sinir',
    'üzgün',
    'kötü',
    'mutsuz',
    'sıkıntı',
    'endişe',
    'kaygı',
    'gergin',
  ],
  social_pressure: [
    'arkadaş',
    'aile',
    'zorladı',
    'ısrar',
    'ikna',
    'baskı',
    'mecbur',
    'reddedemedim',
    'ayıp olmasın',
  ],
  no_regrets: [
    'pişman değilim',
    'değdi',
    'harika',
    'muhteşem',
    'mükemmel',
    'kesinlikle',
    'hak ettim',
    'yaşasın',
  ],
  seasonal: [
    'ramazan',
    'iftar',
    'sahur',
    'oruç',
    'kurban',
    'şeker bayramı',
    'kandil',
  ],
};

const FOOD_KEYWORDS = [
  'tatlı',
  'çikolata',
  'pasta',
  'dondurma',
  'pizza',
  'hamburger',
  'patates',
  'kızartma',
  'börek',
  'poğaça',
  'kurabiye',
  'kek',
  'baklava',
  'künefe',
  'lahmacun',
  'pide',
  'döner',
  'kokoreç',
  'cips',
  'çekirdek',
];

// ====================================================
// PROMPT TEMPLATES
// ====================================================

const PROMPT_TEMPLATES: Record<AITone, string> = {
  empathetic: `Sen bir diyet koçusun. Kullanıcı şu itirafı yaptı: "{content}"

Empatik ve destekleyici bir yanıt ver. Maksimum 2 cümle. Suçluluk hissettirme, normalleştir. Kullanıcının kendini daha iyi hissetmesini sağla.`,

  humorous: `Sen esprili bir diyet arkadaşısın. Kullanıcı şu itirafı yaptı: "{content}"

Esprili ama kırıcı olmayan bir yanıt ver. Maksimum 2 cümle. Gülümsetmeyi hedefle. Hafif mizah kullan ama asla alay etme.`,

  motivational: `Sen motivasyonel bir koçsun. Kullanıcı şu itirafı yaptı: "{content}"

Motivasyonel ve ileriye dönük bir yanıt ver. Maksimum 2 cümle. "Yarın yeni bir gün" vurgusu yap. Umut ver.`,

  realistic: `Sen gerçekçi bir danışmansın. Kullanıcı şu itirafı yaptı: "{content}"

Gerçekçi ve pratik bir yanıt ver. Maksimum 2 cümle. Kalori/egzersiz dengesi kur. Somut öneriler sun.`,
};

// ====================================================
// FALLBACK RESPONSES
// ====================================================

const FALLBACK_RESPONSES: Record<ConfessionCategory, string> = {
  night_attack:
    'Gece saldırıları hepimizin başına gelir! Yarın yeni bir gün, kendini kötü hissetme. 💪',
  special_occasion:
    'Özel günlerde biraz kaçamak yapmak çok normal! Önemli olan genel dengeni koruman. 🎉',
  stress_eating:
    'Stresli anlarda yemeğe yönelmek insani bir tepki. Kendine karşı nazik ol, yarın daha iyi olacak. 💙',
  social_pressure:
    'Sosyal ortamlarda hayır demek zor olabilir. Önemli olan bu durumdan ders çıkarman. 🤝',
  no_regrets:
    'Bazen kendimize izin vermek gerekir! Önemli olan dengeyi korumak. Keyfini çıkarmışsın! 🌟',
  seasonal:
    'Sezonluk lezzetlere karşı koymak zor! Önemli olan genel disiplini koruman. 🎊',
};

// ====================================================
// TELAFI PLAN TEMPLATES
// ====================================================

const TELAFI_TEMPLATES: Record<ConfessionCategory, Array<{ action: string; xpReward: number }>> = {
  night_attack: [
    { action: 'Yarın sabah 20 dakika yürüyüş yap', xpReward: 15 },
    { action: 'Bugün 2 litre su iç', xpReward: 10 },
    { action: 'Bir sonraki öğünde porsiyon kontrolü yap', xpReward: 12 },
  ],
  special_occasion: [
    { action: 'Yarın hafif bir öğün tercih et', xpReward: 12 },
    { action: 'Bugün 30 dakika tempolu yürüyüş', xpReward: 18 },
    { action: 'Bir sonraki 2 öğünde sebze ağırlıklı beslen', xpReward: 15 },
  ],
  stress_eating: [
    { action: '10 dakika nefes egzersizi yap', xpReward: 10 },
    { action: 'Yarın sağlıklı bir atıştırmalık hazırla', xpReward: 12 },
    { action: 'Bugün 15 dakika meditasyon veya yoga', xpReward: 15 },
  ],
  social_pressure: [
    { action: 'Bir sonraki sosyal ortamda porsiyon kontrolü yap', xpReward: 12 },
    { action: 'Yarın protein ağırlıklı beslen', xpReward: 15 },
    { action: 'Bugün ekstra 1 litre su iç', xpReward: 10 },
  ],
  no_regrets: [
    { action: 'Yarın normal rutinine dön', xpReward: 10 },
    { action: 'Bugün hafif bir egzersiz yap', xpReward: 15 },
    { action: 'Bir sonraki öğünde dengeli beslen', xpReward: 12 },
  ],
  seasonal: [
    { action: 'Yarın hafif öğünler tercih et', xpReward: 12 },
    { action: 'Bugün 25 dakika yürüyüş', xpReward: 15 },
    { action: 'Bir sonraki 2 gün dengeli beslen', xpReward: 18 },
  ],
};

// ====================================================
// CACHE CONSTANTS
// ====================================================

const CACHE_TTL = 7 * 24 * 60 * 60; // 1 hafta (saniye cinsinden)
const CACHE_PREFIX = 'ai:response:';

// ====================================================
// CORE AI RESPONSE SERVICE
// ====================================================

/**
 * Ana AI yanıt üretim fonksiyonu
 */
export async function generateResponse(
  input: AIResponseInput
): Promise<AIResponseOutput> {
  const { content, userId } = input;

  // 1. Anahtar kelimeleri analiz et
  const keywords = analyzeKeywords(content);

  // 2. Kategori tespit et (verilmemişse otomatik)
  const category = input.category || detectCategory(content, keywords);

  // 3. Ton belirle
  const tone = determineTone(category, keywords, content);

  // 4. Cache kontrolü
  const cacheKey = generateCacheKey(keywords, category, tone);
  const cachedResponse = await getCachedResponse(cacheKey);

  if (cachedResponse) {
    console.log('✓ AI response served from cache');
    return cachedResponse;
  }

  // 5. Prompt oluştur
  const prompt = buildPrompt(content, category, tone);

  // 6. AI yanıtı üret
  let response: string;
  try {
    response = await callOpenAI(prompt);
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback yanıt kullan
    response = getFallbackResponse(category);
  }

  // 7. Telafi planı üret (opsiyonel)
  const telafiBudget = generateTelafi(category, keywords, content);

  // 8. Sonucu oluştur
  const result: AIResponseOutput = {
    response,
    tone,
    category,
    telafiBudget,
  };

  // 9. Cache'e kaydet
  await cacheResponse(cacheKey, result);

  return result;
}

/**
 * Prompt oluşturur (4 farklı ton için)
 */
export function buildPrompt(
  content: string,
  category: ConfessionCategory,
  tone: AITone
): string {
  const template = PROMPT_TEMPLATES[tone];
  return template.replace('{content}', content);
}

/**
 * OpenAI API çağrısı yapar (5s timeout)
 */
export async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Sen Türkçe konuşan, empatik ve destekleyici bir diyet asistanısın. Kısa ve öz yanıtlar verirsin.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as OpenAIResponse;
    const aiResponse = data.choices[0]?.message?.content?.trim();

    if (!aiResponse) {
      throw new Error('Empty response from OpenAI');
    }

    return aiResponse;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('OpenAI API timeout (5s)');
    }

    throw error;
  }
}

/**
 * AI başarısız olursa kategori bazlı hazır yanıt döner
 */
export function getFallbackResponse(category: ConfessionCategory): string {
  return FALLBACK_RESPONSES[category];
}

/**
 * İçerikteki anahtar kelimeleri tespit eder
 */
export function analyzeKeywords(content: string): string[] {
  const lowerContent = content.toLowerCase();
  const foundKeywords: string[] = [];

  // Tüm kategorilerdeki anahtar kelimeleri kontrol et
  Object.values(CATEGORY_KEYWORDS)
    .flat()
    .forEach((keyword) => {
      if (lowerContent.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });

  // Yiyecek anahtar kelimelerini kontrol et
  FOOD_KEYWORDS.forEach((keyword) => {
    if (lowerContent.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  });

  return foundKeywords;
}

/**
 * İçerikten kategori tespit eder
 */
export function detectCategory(
  content: string,
  keywords?: string[]
): ConfessionCategory {
  const lowerContent = content.toLowerCase();
  const detectedKeywords = keywords || analyzeKeywords(content);

  // Her kategori için skor hesapla
  const categoryScores: Record<ConfessionCategory, number> = {
    night_attack: 0,
    special_occasion: 0,
    stress_eating: 0,
    social_pressure: 0,
    no_regrets: 0,
    seasonal: 0,
  };

  // Anahtar kelimelere göre skor ver
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, categoryKeywords]) => {
    categoryKeywords.forEach((keyword) => {
      if (lowerContent.includes(keyword)) {
        categoryScores[category as ConfessionCategory]++;
      }
    });
  });

  // En yüksek skora sahip kategoriyi bul
  let maxScore = 0;
  let detectedCategory: ConfessionCategory = 'stress_eating'; // Default

  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = category as ConfessionCategory;
    }
  });

  // Eğer hiçbir kategori tespit edilmediyse, içerik analizine göre karar ver
  if (maxScore === 0) {
    // Pişmanlık ifadeleri varsa
    if (
      lowerContent.includes('pişman') ||
      lowerContent.includes('üzgün') ||
      lowerContent.includes('kötü hissediyorum')
    ) {
      return 'stress_eating';
    }

    // Mutluluk ifadeleri varsa
    if (
      lowerContent.includes('mutlu') ||
      lowerContent.includes('harika') ||
      lowerContent.includes('değdi')
    ) {
      return 'no_regrets';
    }

    // Sosyal bağlam varsa
    if (
      lowerContent.includes('beraber') ||
      lowerContent.includes('birlikte') ||
      lowerContent.includes('toplantı')
    ) {
      return 'social_pressure';
    }
  }

  return detectedCategory;
}

/**
 * Kategori ve anahtar kelimelere göre ton belirler
 */
export function determineTone(
  category: ConfessionCategory,
  keywords: string[],
  content: string
): AITone {
  const lowerContent = content.toLowerCase();

  // Kategori bazlı ton tercihleri
  const categoryToneMap: Record<ConfessionCategory, AITone> = {
    night_attack: 'humorous', // Gece saldırıları için mizahi
    special_occasion: 'empathetic', // Özel günler için empatik
    stress_eating: 'empathetic', // Stres yeme için empatik
    social_pressure: 'realistic', // Sosyal baskı için gerçekçi
    no_regrets: 'motivational', // Pişman değilim için motivasyonel
    seasonal: 'humorous', // Sezonluk için mizahi
  };

  // Default ton
  let tone = categoryToneMap[category];

  // İçerik analizine göre ton ayarlaması
  // Çok üzgün/kötü hissediyorsa empatik ol
  if (
    lowerContent.includes('çok üzgün') ||
    lowerContent.includes('berbat') ||
    lowerContent.includes('kendimden nefret')
  ) {
    tone = 'empathetic';
  }

  // Eğlenceli/komik bir anlatım varsa mizahi ol
  if (
    lowerContent.includes('😂') ||
    lowerContent.includes('😅') ||
    lowerContent.includes('haha') ||
    lowerContent.includes('komik')
  ) {
    tone = 'humorous';
  }

  // Motivasyon arıyorsa motivasyonel ol
  if (
    lowerContent.includes('ne yapmalıyım') ||
    lowerContent.includes('nasıl devam') ||
    lowerContent.includes('yardım')
  ) {
    tone = 'motivational';
  }

  // Gerçekçi tavsiye istiyorsa gerçekçi ol
  if (
    lowerContent.includes('kalori') ||
    lowerContent.includes('kilo') ||
    lowerContent.includes('telafi')
  ) {
    tone = 'realistic';
  }

  return tone;
}


// ====================================================
// TELAFI PLAN FUNCTIONS
// ====================================================

/**
 * Pratik telafi planı önerileri üretir
 */
export function generateTelafi(
  category: ConfessionCategory,
  keywords: string[],
  content: string
): { action: string; xpReward: number } | undefined {
  // %70 ihtimalle telafi planı öner (her zaman değil)
  if (Math.random() > 0.7) {
    return undefined;
  }

  // Kategori bazlı telafi planları
  const templates = TELAFI_TEMPLATES[category];

  if (!templates || templates.length === 0) {
    return undefined;
  }

  // Rastgele bir telafi planı seç
  const randomIndex = Math.floor(Math.random() * templates.length);
  const selectedPlan = templates[randomIndex];

  // İçeriğe göre özelleştir
  let action = selectedPlan.action;

  // Eğer içerikte spesifik yiyecek varsa, ona göre özelleştir
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes('tatlı') || lowerContent.includes('çikolata')) {
    action = 'Yarın şekersiz atıştırmalıklar tercih et';
  } else if (lowerContent.includes('pizza') || lowerContent.includes('hamburger')) {
    action = 'Yarın protein ve sebze ağırlıklı beslen';
  } else if (lowerContent.includes('gece')) {
    action = 'Yarın sabah hafif bir kahvaltı yap';
  }

  return {
    action,
    xpReward: selectedPlan.xpReward,
  };
}

// ====================================================
// CACHE FUNCTIONS
// ====================================================

/**
 * Cache key oluşturur (keywords + category + tone hash)
 */
function generateCacheKey(
  keywords: string[],
  category: ConfessionCategory,
  tone: AITone
): string {
  // Anahtar kelimeleri sırala ve birleştir
  const sortedKeywords = keywords.sort().join(',');
  const dataToHash = `${sortedKeywords}:${category}:${tone}`;

  // Hash oluştur
  const hash = crypto.createHash('md5').update(dataToHash).digest('hex');

  return `${CACHE_PREFIX}${hash}`;
}

/**
 * Cache'den AI yanıtı getirir
 */
export async function getCachedResponse(
  cacheKey: string
): Promise<AIResponseOutput | null> {
  try {
    if (!redis || !redis.isOpen) {
      return null;
    }

    const cached = await redis.get(cacheKey);

    if (!cached) {
      return null;
    }

    return JSON.parse(cached) as AIResponseOutput;
  } catch (error) {
    console.error('Redis cache get error:', error);
    return null;
  }
}

/**
 * AI yanıtını cache'e kaydeder (1 hafta TTL)
 */
export async function cacheResponse(
  cacheKey: string,
  response: AIResponseOutput
): Promise<void> {
  try {
    if (!redis || !redis.isOpen) {
      return;
    }

    await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(response));
    console.log('✓ AI response cached for 1 week');
  } catch (error) {
    console.error('Redis cache set error:', error);
  }
}

/**
 * Cache'i temizler (admin fonksiyonu)
 */
export async function clearAIResponseCache(): Promise<void> {
  try {
    if (!redis || !redis.isOpen) {
      return;
    }

    // CACHE_PREFIX ile başlayan tüm key'leri bul
    const keys = await redis.keys(`${CACHE_PREFIX}*`);

    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`✓ Cleared ${keys.length} AI response cache entries`);
    }
  } catch (error) {
    console.error('Redis cache clear error:', error);
  }
}
