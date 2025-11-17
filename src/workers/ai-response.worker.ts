// src/workers/ai-response.worker.ts

import Bull from 'bull';
import { aiResponseQueue, type AIResponseJobData } from '@/lib/queue';
import { generateResponse, getFallbackResponse } from '@/services/ai-response.service';
import { db as prisma } from '@/lib/db';
import type { ConfessionCategory } from '@/services/ai-response.service';

// ====================================================
// WORKER CONFIGURATION
// ====================================================

const CONCURRENCY = 5; // 5 job aynı anda işlenebilir

// ====================================================
// WORKER PROCESSOR
// ====================================================

/**
 * AI yanıt üretimi worker fonksiyonu
 */
aiResponseQueue.process(CONCURRENCY, async (job: Bull.Job<AIResponseJobData>) => {
  const { confessionId, content, category, userId } = job.data;

  console.log(`🔄 Processing AI response for confession ${confessionId}...`);

  try {
    // 1. AI yanıt üret
    const aiResponse = await generateResponse({
      content,
      category: category as ConfessionCategory | undefined,
      userId,
    });

    // 2. Confession'ı güncelle
    await prisma.confession.update({
      where: { id: confessionId },
      data: {
        aiResponse: aiResponse.response,
        aiTone: aiResponse.tone,
        category: aiResponse.category,
        telafiBudget: aiResponse.telafiBudget
          ? JSON.stringify(aiResponse.telafiBudget)
          : null,
        status: 'published', // Yayınla
        publishedAt: new Date(),
      },
    });

    console.log(`✓ AI response generated and saved for confession ${confessionId}`);

    return {
      success: true,
      confessionId,
      aiResponse: aiResponse.response,
    };
  } catch (error) {
    console.error(`❌ Error processing confession ${confessionId}:`, error);

    // Fallback yanıt kullan
    try {
      const fallbackCategory = (category as ConfessionCategory) || 'stress_eating';
      const fallbackResponse = getFallbackResponse(fallbackCategory);

      await prisma.confession.update({
        where: { id: confessionId },
        data: {
          aiResponse: fallbackResponse,
          aiTone: 'empathetic',
          category: fallbackCategory,
          status: 'published',
          publishedAt: new Date(),
        },
      });

      console.log(`✓ Fallback response used for confession ${confessionId}`);

      return {
        success: true,
        confessionId,
        aiResponse: fallbackResponse,
        fallback: true,
      };
    } catch (fallbackError) {
      console.error(`❌ Fallback also failed for confession ${confessionId}:`, fallbackError);
      throw fallbackError;
    }
  }
});

// ====================================================
// WORKER EVENT HANDLERS
// ====================================================

aiResponseQueue.on('completed', (job, result) => {
  console.log(`✓ Job ${job.id} completed:`, result);
});

aiResponseQueue.on('failed', (job, error) => {
  console.error(`❌ Job ${job.id} failed after ${job.attemptsMade} attempts:`, error.message);
  
  // Son deneme başarısız olduysa, confession'ı fallback ile yayınla
  if (job && job.attemptsMade >= 3) {
    const { confessionId, category } = job.data;
    
    prisma.confession.update({
      where: { id: confessionId },
      data: {
        aiResponse: getFallbackResponse((category as ConfessionCategory) || 'stress_eating'),
        aiTone: 'empathetic',
        status: 'published',
        publishedAt: new Date(),
      },
    }).then(() => {
      console.log(`✓ Confession ${confessionId} published with fallback after all retries failed`);
    }).catch((err: Error) => {
      console.error(`❌ Failed to publish confession ${confessionId} with fallback:`, err);
    });
  }
});

aiResponseQueue.on('stalled', (job) => {
  console.warn(`⚠️ Job ${job.id} stalled (timeout or worker crash)`);
});

aiResponseQueue.on('progress', (job, progress) => {
  console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

// ====================================================
// GRACEFUL SHUTDOWN
// ====================================================

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, closing worker gracefully...');
  await aiResponseQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, closing worker gracefully...');
  await aiResponseQueue.close();
  process.exit(0);
});

// ====================================================
// EXPORTS
// ====================================================

export default aiResponseQueue;

console.log('✓ AI Response Worker started with concurrency:', CONCURRENCY);
