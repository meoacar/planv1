# AI Features Kullanım Kılavuzu 🤖

## 🎯 Genel Bakış

AI özellikleri artık tamamen hazır ve kullanıma sunuldu! Bu kılavuz, AI recommendation ve smart reminder sistemlerinin nasıl kullanılacağını açıklar.

## ✅ Tamamlanan Özellikler

### 1. AI Recommendation System
- ✅ Veritabanı modeli (`AIRecommendation`)
- ✅ AI servis fonksiyonları (`src/lib/ai.ts`)
- ✅ API endpoints (`/api/v1/ai/recommendations`)
- ✅ BullMQ worker (`ai-recommendation.worker.ts`)
- ✅ React bileşeni (`AIRecommendations.tsx`)

### 2. Smart Reminder System
- ✅ Veritabanı modeli (`SmartReminder`)
- ✅ ML optimizasyon fonksiyonları
- ✅ API endpoints (`/api/v1/ai/smart-reminders`)
- ✅ BullMQ worker (`smart-reminder.worker.ts`)
- ✅ React bileşeni (`SmartReminders.tsx`)

### 3. Frontend
- ✅ AI Features sayfası (`/ai-features`)
- ✅ Kullanıcı arayüzü bileşenleri
- ✅ Real-time güncellemeler

---

## 🚀 Kurulum ve Başlatma

### 1. Gerekli Ortam Değişkenleri

`.env` dosyanıza ekleyin:

```env
# AI Provider (en az birini seçin - Gemini ÖNERİLİR)
GEMINI_API_KEY=your-gemini-api-key-here
# veya
OPENAI_API_KEY=sk-your-openai-key
# veya
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Redis (BullMQ için gerekli)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

**Gemini API Key Nasıl Alınır?**
1. https://makersuite.google.com/app/apikey adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. Ücretsiz! (Aylık 60 istek/dakika limiti)

### 2. Redis'i Başlatın

```bash
# Windows (XAMPP kullanıyorsanız)
# Redis'i manuel olarak başlatın veya:
redis-server
```

### 3. Worker'ları Başlatın

```bash
# AI worker'larını başlat
npm run worker:ai-features
```

Bu komut şunları yapar:
- AI Recommendation worker'ı başlatır
- Smart Reminder worker'ı başlatır
- Her saat otomatik job'lar planlar
- Aktif kullanıcılar için öneriler oluşturur

### 4. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcıda: `http://localhost:3000/ai-features`

---

## 📖 Kullanım

### AI Önerileri

#### Frontend'den Kullanım

1. `/ai-features` sayfasına gidin
2. Sol tarafta AI önerilerinizi görün
3. Önerilere tıklayarak ilgili içeriğe gidin
4. İstemediğiniz önerileri X ile kapatın
5. Yenile butonuyla yeni öneriler alın

#### API'den Kullanım

```typescript
// Önerileri getir
const response = await fetch('/api/v1/ai/recommendations?type=recipe&limit=5');
const data = await response.json();

// Yeni öneriler oluştur (cache'i atla)
const response = await fetch('/api/v1/ai/recommendations?refresh=true');

// Öneri tıklandı
await fetch('/api/v1/ai/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recommendationId: 'rec_123',
    action: 'clicked'
  })
});

// Öneriyi kapat
await fetch('/api/v1/ai/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recommendationId: 'rec_123',
    action: 'dismissed'
  })
});
```

#### Programatik Kullanım

```typescript
import { generateRecommendations } from '@/lib/ai';

const recommendations = await generateRecommendations({
  userId: 'user_123',
  userPreferences: {
    dietType: 'vegetarian',
    allergies: ['gluten'],
    goals: ['weight_loss'],
    activityLevel: 'medium'
  },
  userHistory: {
    completedPlans: ['plan_1', 'plan_2'],
    likedRecipes: ['recipe_1', 'recipe_2'],
    joinedGroups: ['group_1']
  },
  limit: 10
});
```

### Akıllı Hatırlatmalar

#### Frontend'den Kullanım

1. `/ai-features` sayfasına gidin
2. Sağ tarafta hatırlatmalarınızı görün
3. Switch ile hatırlatmaları aç/kapat
4. "Optimize Et" butonuyla zamanlamayı iyileştirin
5. Tıklama oranınızı görün

#### API'den Kullanım

```typescript
// Hatırlatmaları listele
const response = await fetch('/api/v1/ai/smart-reminders');
const data = await response.json();

// Yeni hatırlatma oluştur
await fetch('/api/v1/ai/smart-reminders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    reminderType: 'daily_checkin',
    frequency: 'daily',
    enabled: true
  })
});

// Hatırlatmayı optimize et
await fetch('/api/v1/ai/smart-reminders/optimize', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    reminderId: 'reminder_123'
  })
});

// Hatırlatmayı sil
await fetch('/api/v1/ai/smart-reminders?id=reminder_123', {
  method: 'DELETE'
});
```

#### Programatik Kullanım

```typescript
import { optimizeReminderTime } from '@/lib/ai';

const optimalTime = await optimizeReminderTime(
  'user_123',
  'daily_checkin',
  {
    activeHours: [8, 9, 10, 18, 19, 20],
    clickHistory: [
      { time: '08:00', clicked: true },
      { time: '20:00', clicked: true },
      { time: '14:00', clicked: false }
    ]
  }
);

console.log(`Optimal time: ${optimalTime}`); // "20:00"
```

---

## 🔧 Worker Yönetimi

### Manuel Job Planlama

```typescript
import { scheduleUserRecommendations } from '@/workers/ai-recommendation.worker';
import { scheduleReminderSend } from '@/workers/smart-reminder.worker';

// Belirli bir kullanıcı için öneri oluştur
await scheduleUserRecommendations('user_123');

// Hatırlatma gönder
await scheduleReminderSend('reminder_123');
```

### Toplu İşlemler

```typescript
import { scheduleBulkRecommendations } from '@/workers/ai-recommendation.worker';
import { schedulePendingReminders } from '@/workers/smart-reminder.worker';

// Tüm aktif kullanıcılar için öneriler oluştur
await scheduleBulkRecommendations();

// Bekleyen tüm hatırlatmaları gönder
await schedulePendingReminders();
```

### Cron Job Entegrasyonu

`src/workers/cron-jobs.ts` dosyasına ekleyin:

```typescript
import { scheduleBulkRecommendations } from './ai-recommendation.worker';
import { schedulePendingReminders } from './smart-reminder.worker';

// Her gün saat 02:00'de öneriler oluştur
cron.schedule('0 2 * * *', async () => {
  console.log('🤖 Günlük AI önerileri oluşturuluyor...');
  await scheduleBulkRecommendations();
});

// Her saat hatırlatmaları kontrol et
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Hatırlatmalar kontrol ediliyor...');
  await schedulePendingReminders();
});
```

---

## 🎨 Özelleştirme

### Öneri Türleri

`src/lib/ai.ts` dosyasında yeni öneri türleri ekleyebilirsiniz:

```typescript
export type RecommendationType = 
  | 'plan' 
  | 'recipe' 
  | 'group' 
  | 'guild' 
  | 'challenge'
  | 'blog_post'  // Yeni tür
  | 'event';     // Yeni tür
```

### Hatırlatma Türleri

`src/workers/smart-reminder.worker.ts` dosyasında yeni hatırlatma türleri:

```typescript
const reminderLabels: Record<string, { title: string; icon: string }> = {
  // Mevcut türler...
  custom_reminder: { title: 'Özel Hatırlatma', icon: '🔔' },
  medication: { title: 'İlaç Hatırlatması', icon: '💊' },
};
```

### AI Prompt'ları

`src/lib/ai.ts` dosyasında prompt'ları özelleştirin:

```typescript
function buildRecommendationPrompt(input: RecommendationInput): string {
  return `
Kullanıcı için kişiselleştirilmiş öneriler oluştur.

Kullanıcı Profili:
- Hedefler: ${input.userPreferences?.goals?.join(', ')}
- Aktivite Seviyesi: ${input.userPreferences?.activityLevel}
- Alerjiler: ${input.userPreferences?.allergies?.join(', ')}

Geçmiş:
- Tamamlanan Planlar: ${input.userHistory?.completedPlans?.length || 0}
- Beğenilen Tarifler: ${input.userHistory?.likedRecipes?.length || 0}

Lütfen ${input.limit} öneri oluştur...
  `.trim();
}
```

---

## 📊 Monitoring ve Analytics

### Worker Durumu

```bash
# Worker loglarını izle
npm run worker:ai-features

# Çıktı:
# ✅ AI Recommendation Worker hazır
# ✅ Smart Reminder Worker hazır
# 📋 İlk job'lar planlanıyor...
```

### Redis Queue Monitoring

```typescript
import { aiRecommendationQueue } from '@/workers/ai-recommendation.worker';

// Queue durumu
const jobCounts = await aiRecommendationQueue.getJobCounts();
console.log(jobCounts);
// { waiting: 5, active: 2, completed: 100, failed: 3 }

// Başarısız job'ları görüntüle
const failedJobs = await aiRecommendationQueue.getFailed();
failedJobs.forEach(job => {
  console.log(`Job ${job.id} failed:`, job.failedReason);
});
```

### Veritabanı İstatistikleri

```sql
-- Öneri istatistikleri
SELECT 
  recommendationType,
  COUNT(*) as total,
  SUM(CASE WHEN clicked THEN 1 ELSE 0 END) as clicked,
  AVG(score) as avg_score
FROM ai_recommendations
GROUP BY recommendationType;

-- Hatırlatma performansı
SELECT 
  reminderType,
  AVG(clickRate) as avg_click_rate,
  SUM(totalSent) as total_sent,
  SUM(totalClicked) as total_clicked
FROM smart_reminders
WHERE enabled = true
GROUP BY reminderType;
```

---

## 🐛 Troubleshooting

### AI Önerileri Gelmiyor

1. **API Key kontrolü:**
   ```bash
   # .env dosyasını kontrol edin
   echo $OPENAI_API_KEY
   ```

2. **Worker çalışıyor mu:**
   ```bash
   npm run worker:ai-features
   ```

3. **Redis bağlantısı:**
   ```bash
   redis-cli ping
   # PONG dönmeli
   ```

### Hatırlatmalar Optimize Edilemiyor

- En az 10 bildirim geçmişi gerekli
- Kullanıcının bildirim geçmişini kontrol edin:
  ```sql
  SELECT COUNT(*) FROM push_notifications WHERE userId = 'user_123';
  ```

### Worker Hataları

```bash
# Worker loglarını detaylı görmek için
DEBUG=bullmq:* npm run worker:ai-features
```

---

## 🔐 Güvenlik

### Rate Limiting

API endpoint'lerine rate limit ekleyin:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // maksimum 100 istek
});

app.use('/api/v1/ai/', limiter);
```

### API Key Güvenliği

- API key'leri asla client-side'da kullanmayın
- Environment variable'ları güvenli tutun
- Production'da farklı key'ler kullanın

---

## 📈 Performans İpuçları

1. **Cache kullanın:** Öneriler 7 gün geçerli, gereksiz yere yenilemeyin
2. **Batch işlemler:** Toplu öneri oluşturma için `scheduleBulkRecommendations` kullanın
3. **Queue önceliklendirme:** Önemli job'lara yüksek priority verin
4. **Redis optimizasyonu:** Redis'i production'da ayrı bir sunucuda çalıştırın

---

## 🎯 Sonraki Adımlar

- [ ] A/B testing için farklı AI modelleri deneyin
- [ ] Öneri kalitesini ölçmek için metrikler ekleyin
- [ ] Kullanıcı feedback sistemi ekleyin
- [ ] Email ile hatırlatma seçeneği ekleyin
- [ ] Öneri açıklamalarını Türkçeleştirin

---

## 📞 Destek

Sorun yaşarsanız:
1. Bu dokümandaki troubleshooting bölümünü kontrol edin
2. Worker loglarını inceleyin
3. Redis ve veritabanı bağlantılarını test edin

**AI Features artık tamamen hazır! 🎉**
