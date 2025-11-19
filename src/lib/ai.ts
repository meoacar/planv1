import { GoogleGenerativeAI } from '@google/generative-ai';

// Google Gemini Client
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// AI kütüphaneleri opsiyonel - yoksa mock kullan
let OpenAI: any = null;
let Anthropic: any = null;

try {
  OpenAI = require('openai').default;
} catch (e) {
  console.warn('OpenAI SDK not installed');
}

try {
  Anthropic = require('@anthropic-ai/sdk').default;
} catch (e) {
  console.warn('Anthropic SDK not installed');
}

// OpenAI Client
const openai = OpenAI && process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Anthropic Client
const anthropic = Anthropic && process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export interface RecommendationInput {
  userId: string;
  userPreferences?: {
    dietType?: string;
    allergies?: string[];
    goals?: string[];
    activityLevel?: string;
  };
  userHistory?: {
    completedPlans?: string[];
    likedRecipes?: string[];
    joinedGroups?: string[];
  };
  limit?: number;
}

export interface RecommendationResult {
  type: 'plan' | 'recipe' | 'group' | 'guild' | 'challenge';
  targetId: string;
  targetTitle: string;
  score: number;
  reason: string;
  metadata?: Record<string, any>;
}

/**
 * Generate personalized recommendations using AI
 */
export async function generateRecommendations(
  input: RecommendationInput
): Promise<RecommendationResult[]> {
  if (!gemini && !openai && !anthropic) {
    console.warn('No AI provider configured, returning mock recommendations');
    return generateMockRecommendations(input);
  }

  try {
    const prompt = buildRecommendationPrompt(input);
    
    let response: string;
    
    // Öncelik sırası: Gemini > OpenAI > Anthropic
    if (gemini) {
      const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      response = result.response.text() || '[]';
    } else if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful weight loss and nutrition assistant. Generate personalized recommendations based on user data.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      response = completion.choices[0]?.message?.content || '[]';
    } else if (anthropic) {
      const completion = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
      
      response = completion.content[0].type === 'text' ? completion.content[0].text : '[]';
    } else {
      return [];
    }

    // Parse AI response
    const recommendations = parseRecommendationResponse(response);
    return recommendations.slice(0, input.limit || 10);
  } catch (error) {
    console.error('AI recommendation error:', error);
    return generateMockRecommendations(input);
  }
}

function buildRecommendationPrompt(input: RecommendationInput): string {
  return `
Generate personalized recommendations for a weight loss app user.

User Preferences:
${JSON.stringify(input.userPreferences || {}, null, 2)}

User History:
${JSON.stringify(input.userHistory || {}, null, 2)}

Please provide ${input.limit || 10} recommendations in the following JSON format:
[
  {
    "type": "plan|recipe|group|guild|challenge",
    "targetId": "unique-id",
    "targetTitle": "Title of the recommendation",
    "score": 0.0-1.0,
    "reason": "Why this is recommended",
    "metadata": {}
  }
]

Focus on:
1. User's dietary preferences and restrictions
2. Past successful plans/recipes
3. Activity level and goals
4. Social engagement patterns

Return ONLY valid JSON array, no additional text.
  `.trim();
}

function parseRecommendationResponse(response: string): RecommendationResult[] {
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    
    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return [];
  }
}

/**
 * Mock recommendations when AI is not available
 */
function generateMockRecommendations(input: RecommendationInput): RecommendationResult[] {
  const mockRecommendations: RecommendationResult[] = [
    {
      type: 'plan',
      targetId: 'mock-plan-1',
      targetTitle: 'Başlangıç Seviye Zayıflama Planı',
      score: 0.85,
      reason: 'Aktivite seviyenize ve hedeflerinize uygun bir plan',
      metadata: { difficulty: 'easy' }
    },
    {
      type: 'recipe',
      targetId: 'mock-recipe-1',
      targetTitle: 'Sağlıklı Kahvaltı Tarifleri',
      score: 0.78,
      reason: 'Düşük kalorili ve besleyici tarifler',
      metadata: { category: 'breakfast' }
    },
    {
      type: 'group',
      targetId: 'mock-group-1',
      targetTitle: 'Motivasyon Grubu',
      score: 0.72,
      reason: 'Benzer hedeflere sahip kişilerle tanışın',
      metadata: { memberCount: 150 }
    }
  ];

  return mockRecommendations.slice(0, input.limit || 10);
}

/**
 * Optimize reminder timing using ML
 */
export async function optimizeReminderTime(
  userId: string,
  reminderType: string,
  userActivity: {
    activeHours: number[];
    clickHistory: Array<{ time: string; clicked: boolean }>;
  }
): Promise<string> {
  // Simple ML: Find the hour with highest click rate
  const hourStats = new Map<number, { sent: number; clicked: number }>();
  
  userActivity.clickHistory.forEach((entry) => {
    const hour = parseInt(entry.time.split(':')[0]);
    const stats = hourStats.get(hour) || { sent: 0, clicked: 0 };
    stats.sent++;
    if (entry.clicked) stats.clicked++;
    hourStats.set(hour, stats);
  });

  let bestHour = 20; // Default: 8 PM
  let bestRate = 0;

  hourStats.forEach((stats, hour) => {
    const rate = stats.clicked / stats.sent;
    if (rate > bestRate && stats.sent >= 3) {
      bestRate = rate;
      bestHour = hour;
    }
  });

  // If no data, use active hours
  if (bestRate === 0 && userActivity.activeHours.length > 0) {
    bestHour = userActivity.activeHours[Math.floor(userActivity.activeHours.length / 2)];
  }

  return `${bestHour.toString().padStart(2, '0')}:00`;
}

/**
 * Moderate content using OpenAI Moderation API
 */
export async function moderateContent(content: string): Promise<{
  flagged: boolean;
  categories: string[];
  confidence: number;
}> {
  if (!openai) {
    console.warn('OpenAI not available, skipping moderation');
    return { flagged: false, categories: [], confidence: 0 };
  }

  try {
    const moderation = await openai.moderations.create({
      input: content,
    });

    const result = moderation.results[0];
    const flaggedCategories = Object.entries(result.categories)
      .filter(([_, flagged]) => flagged)
      .map(([category]) => category);

    const maxScore = Math.max(...Object.values(result.category_scores));

    return {
      flagged: result.flagged,
      categories: flaggedCategories,
      confidence: maxScore,
    };
  } catch (error) {
    console.error('Content moderation error:', error);
    return { flagged: false, categories: [], confidence: 0 };
  }
}

/**
 * Transcribe audio using Whisper API
 */
export async function transcribeAudio(audioFile: File): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI SDK not installed or API key not configured');
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'tr', // Turkish
    });

    return transcription.text;
  } catch (error) {
    console.error('Audio transcription error:', error);
    throw error;
  }
}

/**
 * Generate AI response for confession
 */
export async function generateConfessionResponse(
  confession: string,
  tone: 'empathetic' | 'humorous' | 'motivational' | 'realistic'
): Promise<string> {
  if (!gemini && !openai && !anthropic) {
    console.warn('No AI provider available, using default response');
    return 'Anlıyorum, bu zor bir durum. Devam et, başarabilirsin! 💪';
  }

  try {
    const tonePrompts = {
      empathetic: 'Empatik ve anlayışlı bir ton kullan',
      humorous: 'Hafif mizahi ama destekleyici bir ton kullan',
      motivational: 'Motive edici ve cesaret verici bir ton kullan',
      realistic: 'Gerçekçi ve pratik bir ton kullan',
    };

    const prompt = `
Bir kullanıcı diyet günah itirafında bulundu: "${confession}"

${tonePrompts[tone]}. Türkçe olarak 2-3 cümlelik destekleyici bir yanıt yaz.
Emoji kullan ama abartma. Kullanıcıyı suçlama, sadece destekle ve ileriye bak.
    `.trim();

    let response: string;

    if (gemini) {
      const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      response = result.response.text() || '';
    } else if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 150,
      });
      response = completion.choices[0]?.message?.content || '';
    } else if (anthropic) {
      const completion = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      });
      response = completion.content[0].type === 'text' ? completion.content[0].text : '';
    } else {
      response = '';
    }

    return response || 'Anlıyorum, bu zor bir durum. Devam et, başarabilirsin! 💪';
  } catch (error) {
    console.error('AI confession response error:', error);
    return 'Anlıyorum, bu zor bir durum. Devam et, başarabilirsin! 💪';
  }
}
