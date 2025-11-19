import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});

// Gemini Client
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * POST /api/v1/ai/chat
 * AI Chatbot endpoint for nutrition coaching
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { messages } = chatSchema.parse(body);

    if (!gemini) {
      // Fallback response when Gemini is not configured
      return NextResponse.json({
        success: true,
        response: getMockResponse(messages[messages.length - 1]?.content || ''),
      });
    }

    // Build conversation history for Gemini
    const conversationHistory = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'user' : 'model';
        return `${role}: ${msg.content}`;
      })
      .join('\n\n');

    const systemPrompt = `Sen bir beslenme ve diyet koçusun. Türkçe konuşuyorsun. 
Kullanıcılara sağlıklı beslenme, kilo verme ve motivasyon konularında yardımcı oluyorsun.
Samimi, destekleyici ve motive edici bir dil kullan. Emoji kullanabilirsin ama abartma.
Kısa ve öz yanıtlar ver (2-3 cümle). Kullanıcıyı suçlama, sadece destekle.`;

    const prompt = `${systemPrompt}\n\n${conversationHistory}\n\nmodel:`;

    // Generate response with Gemini
    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return NextResponse.json({
        success: true,
        response: response || 'Üzgünüm, bir şeyler ters gitti. Tekrar dener misin?',
      });
    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      
      // Gemini hatası varsa mock response döndür
      return NextResponse.json({
        success: true,
        response: getMockResponse(messages[messages.length - 1]?.content || ''),
      });
    }
  } catch (error) {
    console.error('AI chat error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    // Return a friendly error message
    return NextResponse.json({
      success: true,
      response: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen biraz sonra tekrar dene. 🙏',
    });
  }
}

/**
 * Mock response when Gemini is not available
 */
function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('başla') || lowerMessage.includes('nasıl')) {
    return 'Harika! Küçük adımlarla başla. Önce su tüketimini artır ve günde 30 dakika yürüyüş yap. Sen yaparsın! 💪';
  }

  if (lowerMessage.includes('motivasyon') || lowerMessage.includes('pes')) {
    return 'Hatırla, her gün yeni bir başlangıç! Küçük kazanımlar büyük değişimlere yol açar. Devam et, seninle gurur duyuyorum! 🌟';
  }

  if (lowerMessage.includes('tatlı') || lowerMessage.includes('şeker')) {
    return 'Tatlı isteği geldiğinde meyve ye veya 2-3 yudum su iç. 10 dakika bekle, çoğu zaman istek geçer. Denemeye değer! 🍎';
  }

  if (lowerMessage.includes('fast food') || lowerMessage.includes('hamburger')) {
    return 'Evde tavuk ızgara + salata harika bir alternatif! Hem doyurucu hem sağlıklı. Sosları kendin hazırlarsan daha da iyi! 🥗';
  }

  if (lowerMessage.includes('streak') || lowerMessage.includes('kırıl')) {
    return 'Streak kırılması normal! Önemli olan tekrar başlamak. Bugün yeni bir streak başlat, geçmişi unut. İleriye bak! 🔥';
  }

  return 'Anlıyorum. Sağlıklı beslenme bir yolculuk ve sen harika gidiyorsun! Her gün biraz daha iyiye gidiyorsun. Devam et! 💚';
}
