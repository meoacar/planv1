# 🤖 Gelişmiş AI Özellikleri - Kullanım Kılavuzu

**Durum:** ✅ Tamamlandı  
**Tarih:** 18 Kasım 2025

---

## 📋 Genel Bakış

Gelişmiş AI özellikleri, Google Gemini Pro kullanarak kullanıcılara kişiselleştirilmiş destek sağlar.

### Özellikler

✅ **AI Chatbot** - Beslenme koçu (7/24 destek)  
✅ **Trend Analizi** - 4 haftalık veri analizi  
✅ **Günlük Motivasyon** - AI motivasyon mesajları  
✅ **Hedef Önerisi** - Kişiselleştirilmiş hedefler  
✅ **Hızlı Sorular** - Önceden hazırlanmış cevaplar  
✅ **Konuşma Geçmişi** - Bağlam korumalı sohbet

---

## 🚀 Özellikler

### 1. AI Chatbot 🤖

**Yetenekler:**
- Beslenme tavsiyeleri
- Motivasyon desteği
- Soru-cevap
- Empati ve anlayış
- Pratik öneriler

**Kullanıcı Context:**
- İsim, level, streak
- Son günah kayıtları
- Kazanılan rozetler
- Toplam günah sayısı

**Hızlı Sorular:**
- "Nasıl başlarım?"
- "Motivasyon lazım"
- "Tatlı isteği nasıl bastırırım?"
- "Fast food yerine ne yiyebilirim?"
- "Streak kırıldı ne yapmalıyım?"

### 2. Trend Analizi 📊

**4 Haftalık Analiz:**
- Haftalık günah sayıları
- Temiz gün sayıları
- Günlük ortalamalar
- Günah türü dağılımı

**AI Analiz Çıktıları:**
- **Özet:** Genel durum (2-3 cümle)
- **Trendler:** Artış/azalış/değişim (3-4 trend)
- **İçgörüler:** Derin analizler (3-4 içgörü)
- **Öneriler:** Pratik tavsiyeler (3-4 öneri)
- **Tahmin:** Gelecek hafta tahmini

### 3. Günlük Motivasyon 💪

**Özellikler:**
- Kişiselleştirilmiş mesajlar
- Kullanıcı başarılarına vurgu
- Pozitif ve motive edici
- Günlük yenileme

**Örnek Mesajlar:**
- "Bugün 7. günün! Her gün daha güçlüsün! 💪🔥"
- "5 rozet kazandın! Harikasın! 🏆"
- "Streak'ini korumaya devam et! 🌟"

### 4. Hedef Önerisi 🎯

**AI Hedef Belirleme:**
- Kullanıcı durumuna uygun
- Gerçekçi ve ulaşılabilir
- Mevcut verilere dayalı
- Kişiselleştirilmiş

**Örnek Hedefler:**
- "7 gün boyunca tatlı yememeye ne dersin? 🎯"
- "Bu hafta 5 temiz gün hedefle! 💚"
- "Fast food'u 2 haftaya azalt! 🍔"

---

## 🔧 API Endpoints

### AI Chatbot

**POST /api/v1/ai/chat**
```typescript
// Normal sohbet
{
  "messages": [
    { "role": "user", "content": "Tatlı isteği nasıl bastırırım?" },
    { "role": "assistant", "content": "..." }
  ]
}

// Hızlı soru
{
  "quickQuestion": "Nasıl başlarım?"
}
```

**Response:**
```typescript
{
  "success": true,
  "response": "AI cevabı...",
  "userContext": {
    "level": 5,
    "streak": 7,
    "badgeCount": 3
  }
}
```

### Trend Analizi

**GET /api/v1/ai/trends**
```typescript
// Detaylı analiz
GET /api/v1/ai/trends

// Hızlı özet
GET /api/v1/ai/trends?quick=true
```

**Response:**
```typescript
{
  "success": true,
  "analysis": {
    "summary": "Son hafta...",
    "trends": ["Trend 1", "Trend 2"],
    "insights": ["İçgörü 1", "İçgörü 2"],
    "recommendations": ["Öneri 1", "Öneri 2"],
    "prediction": "Gelecek hafta...",
    "weeklyData": [...]
  }
}
```

### Motivasyon

**GET /api/v1/ai/motivation**
```typescript
// Günlük motivasyon
GET /api/v1/ai/motivation
```

**POST /api/v1/ai/motivation/goal**
```typescript
// Hedef önerisi
POST /api/v1/ai/motivation/goal
```

---

## 🎨 Frontend Bileşenleri

### 1. AIChatbot
```typescript
import { AIChatbot } from '@/components/ai/ai-chatbot';

<AIChatbot />
```

**Özellikler:**
- Mesaj geçmişi
- Hızlı sorular
- Gerçek zamanlı cevaplar
- Loading state'leri
- Otomatik scroll

### 2. TrendAnalysis
```typescript
import { TrendAnalysis } from '@/components/ai/trend-analysis';

<TrendAnalysis />
```

**Özellikler:**
- 4 haftalık veri görselleştirme
- AI analiz sonuçları
- Trendler, içgörüler, öneriler
- Yenileme butonu

### 3. DailyMotivation
```typescript
import { DailyMotivation } from '@/components/ai/daily-motivation';

<DailyMotivation />
```

**Özellikler:**
- Günlük motivasyon mesajı
- Hedef önerisi
- Yenileme butonları
- Loading state'leri

---

## 🧠 AI Servisler

### ai-chatbot.ts

**Fonksiyonlar:**
```typescript
// Ana sohbet
await chatWithAI(messages, userContext);

// Hızlı cevap
await getQuickAnswer(question, userContext);

// Günlük motivasyon
await getDailyMotivation(userContext);

// Hedef önerisi
await suggestGoal(userContext);

// Konuşma özeti
await summarizeConversation(messages);
```

### ai-trend-analyzer.ts

**Fonksiyonlar:**
```typescript
// 4 haftalık analiz
await analyzeTrends(userId);

// Hızlı özet
await getQuickTrendSummary(userId);

// Haftalık veri
await getLast4WeeksData(userId);
```

---

## 💡 Kullanım Örnekleri

### Chatbot Kullanımı

```typescript
// 1. Kullanıcı mesaj gönderir
const userMessage = "Tatlı isteği nasıl bastırırım?";

// 2. API'ye gönder
const response = await fetch('/api/v1/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: userMessage }]
  })
});

// 3. AI cevabı al
const data = await response.json();
console.log(data.response);
// "Tatlı isteğini bastırmak için:
// 1. Bol su iç 💧
// 2. Meyve ye 🍎
// 3. 10 dakika bekle..."
```

### Trend Analizi

```typescript
// 1. Analiz iste
const response = await fetch('/api/v1/ai/trends');
const data = await response.json();

// 2. Sonuçları göster
console.log(data.analysis.summary);
// "Son hafta 5 günah kaydettiniz. Önceki haftaya göre %20 azalma var! 🎉"

console.log(data.analysis.trends);
// ["📉 Günah sayısında azalma trendi", "✅ Temiz gün sayısı arttı"]
```

### Motivasyon Mesajı

```typescript
// 1. Günlük motivasyon al
const response = await fetch('/api/v1/ai/motivation');
const data = await response.json();

console.log(data.motivation);
// "Bugün 8. günün! Her gün daha güçlüsün! 💪🔥"
```

---

## 🔒 Güvenlik ve Gizlilik

### API Key Güvenliği
- GEMINI_API_KEY environment variable'da
- Backend'de saklanır, frontend'e açılmaz
- Rate limiting uygulanmalı

### Kullanıcı Verisi
- Sadece gerekli veriler AI'ya gönderilir
- Hassas bilgiler filtrelenir
- Konuşma geçmişi kullanıcıya özel

### Fallback Mekanizması
- AI çalışmazsa önceden hazırlanmış cevaplar
- Hata durumunda kullanıcı bilgilendirilir
- Graceful degradation

---

## 📊 AI Prompt Stratejisi

### System Prompt
```
Sen bir beslenme ve sağlıklı yaşam koçusun.

Görevin:
- Kullanıcılara yardımcı olmak
- Motivasyon sağlamak
- Pratik öneriler vermek
- Empati kurmak
- Yargılamamak

Kurallar:
- Türkçe konuş
- Kısa ve öz cevaplar (max 3-4 cümle)
- Emoji kullan ama abartma
- Pratik öneriler ver
- Başarıları kutla
```

### User Context
```
Kullanıcı Bilgileri:
- İsim: [name]
- Level: [level]
- Streak: [streak] gün
- Toplam Günah: [totalSins]
- Kazanılan Rozetler: [badges]
- Son Günah: [recentSins]
```

### Response Format
```
Kısa ve öz (1-3 cümle)
Emoji kullan (1-2 adet)
Pozitif ve motive edici
Pratik ve uygulanabilir
```

---

## 🧪 Test Senaryoları

### 1. Chatbot Testi
```typescript
// Hızlı soru
const response = await fetch('/api/v1/ai/chat', {
  method: 'POST',
  body: JSON.stringify({
    quickQuestion: "Nasıl başlarım?"
  })
});

// Cevap alınmalı
expect(response.ok).toBe(true);
```

### 2. Trend Analizi Testi
```typescript
// Analiz iste
const response = await fetch('/api/v1/ai/trends');
const data = await response.json();

// Tüm alanlar dolu olmalı
expect(data.analysis.summary).toBeTruthy();
expect(data.analysis.trends.length).toBeGreaterThan(0);
```

### 3. Motivasyon Testi
```typescript
// Motivasyon al
const response = await fetch('/api/v1/ai/motivation');
const data = await response.json();

// Mesaj alınmalı
expect(data.motivation).toBeTruthy();
expect(data.motivation.length).toBeGreaterThan(0);
```

---

## 🐛 Sorun Giderme

### AI Cevap Vermiyor

**1. API Key Kontrolü**
```bash
# .env dosyasında kontrol et
GEMINI_API_KEY=your_key_here
```

**2. Fallback Kontrolü**
```typescript
// Fallback cevap dönmeli
if (!aiResponse) {
  return getFallbackResponse();
}
```

### Yavaş Cevaplar

**1. Timeout Ayarı**
```typescript
const response = await fetch('/api/v1/ai/chat', {
  signal: AbortSignal.timeout(10000) // 10 saniye
});
```

**2. Loading State**
```typescript
setIsLoading(true);
// API call
setIsLoading(false);
```

### Hatalı Analiz

**1. Veri Kontrolü**
```typescript
// Yeterli veri var mı?
const sins = await prisma.foodSin.count({ where: { userId } });
if (sins < 5) {
  return "Daha fazla veri gerekli";
}
```

---

## 📈 Performans Optimizasyonu

### Caching
```typescript
// Günlük motivasyon cache'le (24 saat)
const cacheKey = `motivation:${userId}:${today}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;

const motivation = await getDailyMotivation(userContext);
await redis.set(cacheKey, motivation, 'EX', 86400);
```

### Rate Limiting
```typescript
// Kullanıcı başına limit
const limit = await rateLimit.check(userId, {
  max: 20, // 20 istek
  window: '1h' // 1 saat
});
```

---

## 🎯 Gelecek Geliştirmeler

### Öncelik 1: Ses Desteği
- [ ] Text-to-speech (AI cevapları sesli)
- [ ] Speech-to-text (sesli soru)
- [ ] Ses tonu ayarları

### Öncelik 2: Gelişmiş Analiz
- [ ] Aylık trend analizi
- [ ] Yıllık özet
- [ ] Karşılaştırmalı analiz

### Öncelik 3: Kişiselleştirme
- [ ] AI öğrenme (kullanıcı tercihleri)
- [ ] Özel hedef planları
- [ ] Adaptif öneriler

---

## ✅ Checklist

### Backend
- [x] AI chatbot servisi
- [x] Trend analyzer servisi
- [x] Chat API endpoint
- [x] Trends API endpoint
- [x] Motivation API endpoint
- [x] Fallback mekanizması

### Frontend
- [x] Chatbot component
- [x] Trend analysis component
- [x] Daily motivation component
- [x] Loading states
- [x] Error handling

### AI
- [x] System prompt
- [x] User context
- [x] Quick answers
- [x] Trend analysis
- [x] Motivation messages
- [x] Goal suggestions

### Dokümantasyon
- [x] Kullanım kılavuzu
- [x] API dokümantasyonu
- [x] Test senaryoları

---

**Hazırlayan:** Kiro AI  
**Tarih:** 18 Kasım 2025  
**Durum:** ✅ Production Ready
