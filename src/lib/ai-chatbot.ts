/**
 * AI Chatbot Service
 * Google Gemini ile beslenme koçu chatbot
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UserContext {
  name?: string;
  level: number;
  streak: number;
  totalSins: number;
  recentSins: Array<{
    sinType: string;
    note?: string;
    createdAt: Date;
  }>;
  badges: Array<{
    name: string;
    icon: string;
  }>;
}

/**
 * AI Chatbot ile sohbet et
 */
export async function chatWithAI(
  messages: ChatMessage[],
  userContext?: UserContext
): Promise<string> {
  try {
    // API key kontrolü
    if (!process.env.GEMINI_API_KEY) {
      console.log('[AI] No API key, using fallback');
      return getFallbackResponse(messages[messages.length - 1]?.content);
    }

    console.log('[AI] Using model: gemini-2.0-flash-exp');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // System prompt
    const systemPrompt = `Sen profesyonel bir beslenme koçu ve motivasyon uzmanısın. "Yemek Günah Sayacı" uygulamasında kullanıcılara yardımcı oluyorsun.

🎯 GÖREV:
Kullanıcıların sağlıklı beslenme hedeflerine ulaşmasına yardımcı ol. Onları motive et, pratik öneriler ver ve destekle.

👤 KULLANICI BİLGİLERİ:
${userContext ? `
• İsim: ${userContext.name || 'Kullanıcı'}
• Level: ${userContext.level}
• Streak: ${userContext.streak} gün 🔥
• Toplam Kaçamak: ${userContext.totalSins}
• Rozetler: ${userContext.badges.map((b) => b.name).join(', ') || 'Henüz yok'}
${
  userContext.recentSins.length > 0
    ? `• Son Kaçamak: ${userContext.recentSins[0].sinType} ${userContext.recentSins[0].note ? `(${userContext.recentSins[0].note})` : ''}`
    : '• Son kaçamak yok - harika gidiyor! 🎉'
}
` : ''}

📋 KURALLAR:
1. TÜRKÇE konuş, samimi ve arkadaşça ol
2. KISA cevaplar ver (2-3 cümle, max 50 kelime)
3. PRATIK öneriler ver, teorik bilgi değil
4. EMOJİ kullan ama abartma (max 2-3 emoji)
5. POZİTİF ol, yargılama, suçlama
6. BAŞARILARI kutla, hataları normalleştir
7. SOMUT adımlar öner, genel konuşma

✅ İYİ CEVAP ÖRNEKLERİ:
• "Harika! ${userContext?.streak || 0} günlük streak'in süper! 🔥 Devam et, çok iyi gidiyorsun!"
• "Tatlı isteği geldiğinde 10 dakika bekle ve bol su iç. Genelde geçiyor. 💧"
• "Kaçamak yaptın ama önemli değil! Yarın yeni bir gün. Şimdi yürüyüşe çık, kafanı dağıt. 💪"

❌ KÖTÜ CEVAP ÖRNEKLERİ:
• Uzun paragraflar
• Genel sağlık bilgileri
• "Sağlıklı beslenmenin önemi..." gibi teorik konuşmalar
• Çok fazla emoji 🎉🎊🎈🎁
• Yargılayıcı dil

ŞİMDİ KULLANICIYA YARDIM ET!`;

    // Konuşma geçmişini hazırla
    const conversationHistory = messages
      .map((msg) => `${msg.role === 'user' ? 'Kullanıcı' : 'Koç'}: ${msg.content}`)
      .join('\n');

    const prompt = `${systemPrompt}

Konuşma Geçmişi:
${conversationHistory}

Lütfen son mesaja uygun, yardımcı ve motive edici bir cevap ver.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('AI Chatbot error:', error);
    return getFallbackResponse();
  }
}

/**
 * Hızlı soru cevapları
 */
export async function getQuickAnswer(
  question: string,
  userContext?: UserContext
): Promise<string> {
  const quickAnswers: Record<string, string> = {
    'nasıl başlarım': `Harika! Başlamak için:
1. İlk hedefini belirle (örn: 7 gün tatlı yememe)
2. Günlük kaçamakları kaydet
3. Streak'ini koru
4. Rozetleri topla! 🏆`,

    'motivasyon': `Sen harikasın! 💪
- ${userContext?.streak || 0} günlük streak'in var
- ${userContext?.badges.length || 0} rozet kazandın
- Level ${userContext?.level || 1}'desin
Devam et, başarıyorsun! 🌟`,

    'tatlı isteği': `Tatlı isteğini yenmek için:
1. Bol su iç 💧
2. Meyve ye 🍎
3. 10 dakika bekle
4. Yürüyüşe çık 🚶
Genelde 10 dakika sonra istek geçer!`,

    'fast food': `Fast food yerine:
- Evde burger yap 🍔
- Fırında patates 🥔
- Izgara tavuk 🍗
Hem sağlıklı hem lezzetli!`,

    'streak kırıldı': `Üzülme! 😊
Streak kırılması normal. Önemli olan:
- Tekrar başlamak
- Hatadan ders çıkarmak
- Kendini affetmek
Yarın yeni bir gün! 🌅`,
  };

  // Anahtar kelime eşleştir
  const lowerQuestion = question.toLowerCase();
  for (const [key, answer] of Object.entries(quickAnswers)) {
    if (lowerQuestion.includes(key)) {
      return answer;
    }
  }

  // Bulunamazsa AI'ya sor
  return chatWithAI([{ role: 'user', content: question }], userContext);
}

/**
 * Günlük motivasyon mesajı
 */
export async function getDailyMotivation(
  userContext: UserContext
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Sen bir motivasyon koçusun. Kullanıcıya günlük motivasyon mesajı ver.

Kullanıcı Bilgileri:
- Streak: ${userContext.streak} gün
- Level: ${userContext.level}
- Toplam Günah: ${userContext.totalSins}

Kurallar:
- Türkçe yaz
- Kısa ve güçlü (1-2 cümle)
- Emoji kullan
- Pozitif ve motive edici
- Kullanıcının başarılarına vurgu yap

Örnek:
"Bugün ${userContext.streak + 1}. günün! Her gün daha güçlüsün! 💪🔥"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Daily motivation error:', error);
    return `Bugün harika bir gün! ${userContext.streak} günlük streak'ini korumaya devam et! 🔥`;
  }
}

/**
 * Hedef önerisi
 */
export async function suggestGoal(userContext: UserContext): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Sen bir beslenme koçusun. Kullanıcıya uygun bir hedef öner.

Kullanıcı Bilgileri:
- Streak: ${userContext.streak} gün
- Level: ${userContext.level}
- Toplam Günah: ${userContext.totalSins}
- Son Günah Türleri: ${userContext.recentSins.map((s) => s.sinType).join(', ')}

Kurallar:
- Türkçe yaz
- Gerçekçi ve ulaşılabilir hedef
- Kullanıcının mevcut durumuna uygun
- Kısa ve net (1-2 cümle)
- Emoji kullan

Örnek:
"7 gün boyunca tatlı yememeye ne dersin? Bunu başarabilirsin! 🎯"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Suggest goal error:', error);
    return '7 gün boyunca tatlı yememeye ne dersin? 🎯';
  }
}

/**
 * Fallback cevap (AI çalışmazsa)
 */
function getFallbackResponse(): string {
  const responses = [
    'Anlıyorum. Sağlıklı beslenme yolculuğunda yanındayım! 💪',
    'Harika soru! Hedeflerine ulaşman için buradayım. 🌟',
    'Her gün yeni bir fırsat! Devam et! 🔥',
    'Başarıların beni gururlandırıyor! 🏆',
    'Birlikte başaracağız! 💚',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Konuşma geçmişini özetle
 */
export async function summarizeConversation(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const conversation = messages
      .map((msg) => `${msg.role === 'user' ? 'Kullanıcı' : 'Koç'}: ${msg.content}`)
      .join('\n');

    const prompt = `Aşağıdaki konuşmayı özetle. Kısa ve öz (2-3 cümle):

${conversation}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Summarize conversation error:', error);
    return 'Konuşma özeti oluşturulamadı.';
  }
}



