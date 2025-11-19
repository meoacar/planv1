/**
 * AI Trend Analyzer
 * 4 haftalık veri analizi ve trend tespiti
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { subWeeks, startOfWeek, endOfWeek, format } from 'date-fns';
import { tr } from 'date-fns/locale';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface WeeklyData {
  week: number;
  startDate: Date;
  endDate: Date;
  totalSins: number;
  sinsByType: Record<string, number>;
  cleanDays: number;
  averagePerDay: number;
}

interface TrendAnalysis {
  summary: string;
  trends: string[];
  insights: string[];
  recommendations: string[];
  prediction: string;
  weeklyData: WeeklyData[];
}

/**
 * 4 haftalık trend analizi yap
 */
export async function analyzeTrends(userId: string): Promise<TrendAnalysis> {
  try {
    // Son 4 haftanın verilerini al
    const weeklyData = await getLast4WeeksData(userId);

    // AI ile analiz yap
    const aiAnalysis = await analyzeWithAI(weeklyData);

    return {
      ...aiAnalysis,
      weeklyData,
    };
  } catch (error) {
    console.error('Trend analysis error:', error);
    return getFallbackAnalysis(await getLast4WeeksData(userId));
  }
}

/**
 * Son 4 haftanın verilerini getir
 */
async function getLast4WeeksData(userId: string): Promise<WeeklyData[]> {
  const now = new Date();
  const weeks: WeeklyData[] = [];

  for (let i = 0; i < 4; i++) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

    // Haftalık günahları al
    const sins = await prisma.foodSin.findMany({
      where: {
        userId,
        sinDate: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      select: {
        sinType: true,
        sinDate: true,
      },
    });

    // Günah türlerine göre grupla
    const sinsByType: Record<string, number> = {};
    sins.forEach((sin) => {
      sinsByType[sin.sinType] = (sinsByType[sin.sinType] || 0) + 1;
    });

    // Temiz günleri hesapla
    const uniqueDays = new Set(
      sins.map((sin) => format(sin.sinDate, 'yyyy-MM-dd'))
    );
    const totalDays = 7;
    const cleanDays = totalDays - uniqueDays.size;

    weeks.push({
      week: i + 1,
      startDate: weekStart,
      endDate: weekEnd,
      totalSins: sins.length,
      sinsByType,
      cleanDays,
      averagePerDay: sins.length / totalDays,
    });
  }

  return weeks.reverse(); // En eskiden en yeniye
}

/**
 * AI ile veri analizi
 */
async function analyzeWithAI(weeklyData: WeeklyData[]): Promise<Omit<TrendAnalysis, 'weeklyData'>> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const dataText = weeklyData
      .map(
        (week, index) => `
Hafta ${index + 1} (${format(week.startDate, 'dd MMM', { locale: tr })} - ${format(week.endDate, 'dd MMM', { locale: tr })}):
- Toplam Günah: ${week.totalSins}
- Temiz Gün: ${week.cleanDays}
- Günlük Ortalama: ${week.averagePerDay.toFixed(1)}
- Türler: ${Object.entries(week.sinsByType)
          .map(([type, count]) => `${type}(${count})`)
          .join(', ') || 'Yok'}
`
      )
      .join('\n');

    const prompt = `Sen bir veri analisti ve beslenme koçusun. Aşağıdaki 4 haftalık veriyi analiz et:

${dataText}

Lütfen şunları yap:
1. ÖZET: Genel durumu 2-3 cümle ile özetle
2. TRENDLER: 3-4 önemli trend belirle (artış/azalış/değişim)
3. İÇGÖRÜLER: 3-4 derin içgörü ver (neden, nasıl, ne zaman)
4. ÖNERİLER: 3-4 pratik öneri ver
5. TAHMİN: Gelecek hafta için tahmin (1-2 cümle)

Format:
ÖZET: [özet metni]
TRENDLER:
- [trend 1]
- [trend 2]
- [trend 3]
İÇGÖRÜLER:
- [içgörü 1]
- [içgörü 2]
- [içgörü 3]
ÖNERİLER:
- [öneri 1]
- [öneri 2]
- [öneri 3]
TAHMİN: [tahmin metni]

Kurallar:
- Türkçe yaz
- Pozitif ve motive edici ol
- Sayısal verilere dayanarak analiz yap
- Emoji kullan ama abartma
- Pratik ve uygulanabilir öneriler ver`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Metni parse et
    return parseAIResponse(text);
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
}

/**
 * AI cevabını parse et
 */
function parseAIResponse(text: string): Omit<TrendAnalysis, 'weeklyData'> {
  const lines = text.split('\n').filter((line) => line.trim());

  let summary = '';
  const trends: string[] = [];
  const insights: string[] = [];
  const recommendations: string[] = [];
  let prediction = '';

  let currentSection = '';

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('ÖZET:')) {
      currentSection = 'summary';
      summary = trimmed.replace('ÖZET:', '').trim();
    } else if (trimmed.startsWith('TRENDLER:')) {
      currentSection = 'trends';
    } else if (trimmed.startsWith('İÇGÖRÜLER:')) {
      currentSection = 'insights';
    } else if (trimmed.startsWith('ÖNERİLER:')) {
      currentSection = 'recommendations';
    } else if (trimmed.startsWith('TAHMİN:')) {
      currentSection = 'prediction';
      prediction = trimmed.replace('TAHMİN:', '').trim();
    } else if (trimmed.startsWith('-')) {
      const item = trimmed.replace(/^-\s*/, '');
      if (currentSection === 'trends') trends.push(item);
      else if (currentSection === 'insights') insights.push(item);
      else if (currentSection === 'recommendations') recommendations.push(item);
    } else if (currentSection === 'summary' && trimmed) {
      summary += ' ' + trimmed;
    } else if (currentSection === 'prediction' && trimmed) {
      prediction += ' ' + trimmed;
    }
  });

  return {
    summary: summary || 'Analiz tamamlandı.',
    trends: trends.length > 0 ? trends : ['Trend bulunamadı'],
    insights: insights.length > 0 ? insights : ['İçgörü bulunamadı'],
    recommendations:
      recommendations.length > 0 ? recommendations : ['Öneri bulunamadı'],
    prediction: prediction || 'Tahmin yapılamadı.',
  };
}

/**
 * Fallback analiz (AI çalışmazsa)
 */
function getFallbackAnalysis(weeklyData: WeeklyData[]): TrendAnalysis {
  const latestWeek = weeklyData[weeklyData.length - 1];
  const previousWeek = weeklyData[weeklyData.length - 2];

  const change = latestWeek.totalSins - previousWeek.totalSins;
  const changePercent = previousWeek.totalSins > 0
    ? ((change / previousWeek.totalSins) * 100).toFixed(0)
    : '0';

  return {
    summary: `Son hafta ${latestWeek.totalSins} günah kaydettiniz. ${
      change > 0
        ? `Önceki haftaya göre %${changePercent} artış var.`
        : change < 0
        ? `Önceki haftaya göre %${Math.abs(Number(changePercent))} azalma var! 🎉`
        : 'Önceki hafta ile aynı seviyedesiniz.'
    }`,
    trends: [
      change > 0
        ? '📈 Günah sayısında artış trendi'
        : change < 0
        ? '📉 Günah sayısında azalma trendi (harika!)'
        : '➡️ Stabil seyir',
      `🗓️ Haftalık ortalama: ${latestWeek.averagePerDay.toFixed(1)} günah/gün`,
      `✅ Temiz gün sayısı: ${latestWeek.cleanDays}`,
    ],
    insights: [
      latestWeek.cleanDays > 3
        ? '💚 Temiz gün sayınız iyi seviyede'
        : '⚠️ Temiz gün sayısını artırmaya çalışın',
      Object.keys(latestWeek.sinsByType).length > 0
        ? `🍪 En çok ${Object.entries(latestWeek.sinsByType).sort((a, b) => b[1] - a[1])[0][0]} tüketiyorsunuz`
        : '✨ Hiç günah kaydı yok',
      latestWeek.averagePerDay < 1
        ? '🌟 Günlük ortalamanız çok iyi!'
        : '💪 Günlük ortalamayı düşürmeye çalışın',
    ],
    recommendations: [
      '🎯 Haftalık hedef belirleyin',
      '📝 Günlük kayıt tutmaya devam edin',
      '🏆 Rozetleri toplamaya çalışın',
      '🔥 Streak\'inizi koruyun',
    ],
    prediction: change > 0
      ? 'Gelecek hafta daha dikkatli olursanız, günah sayısını azaltabilirsiniz.'
      : 'Bu gidişle gelecek hafta daha da iyi olacaksınız! 🌟',
    weeklyData,
  };
}

/**
 * Hızlı trend özeti
 */
export async function getQuickTrendSummary(userId: string): Promise<string> {
  try {
    const weeklyData = await getLast4WeeksData(userId);
    const latest = weeklyData[weeklyData.length - 1];
    const previous = weeklyData[weeklyData.length - 2];

    const change = latest.totalSins - previous.totalSins;

    if (change > 0) {
      return `📈 Son hafta ${change} daha fazla günah kaydettiniz. Dikkatli olun!`;
    } else if (change < 0) {
      return `📉 Harika! Son hafta ${Math.abs(change)} daha az günah! 🎉`;
    } else {
      return `➡️ Son hafta önceki hafta ile aynı seviyedesiniz.`;
    }
  } catch (error) {
    console.error('Quick trend summary error:', error);
    return '📊 Trend analizi yapılamadı.';
  }
}
