// src/lib/queue.ts

import Bull from 'bull';
import { redis } from './redis';

// ====================================================
// QUEUE CONFIGURATION
// ====================================================

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

// Bull queue options
const queueOptions: Bull.QueueOptions = {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3, // 3 retry
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s, 4s, 8s
    },
    removeOnComplete: 100, // Son 100 başarılı job'ı sakla
    removeOnFail: 500, // Son 500 başarısız job'ı sakla
  },
};

// ====================================================
// AI RESPONSE GENERATION QUEUE
// ====================================================

export const aiResponseQueue = new Bull('ai-response-generation', queueOptions);

// Queue event listeners
aiResponseQueue.on('error', (error) => {
  // Only log non-connection errors in development
  if (!error.message.includes('ECONNREFUSED') || process.env.NODE_ENV === 'production') {
    console.error('❌ AI Response Queue Error:', error.message);
  }
});

aiResponseQueue.on('failed', (job, error) => {
  console.error(`❌ Job ${job.id} failed:`, error.message);
});

aiResponseQueue.on('completed', (job) => {
  console.log(`✓ Job ${job.id} completed successfully`);
});

aiResponseQueue.on('stalled', (job) => {
  console.warn(`⚠️ Job ${job.id} stalled`);
});

// ====================================================
// JOB TYPES
// ====================================================

export interface AIResponseJobData {
  confessionId: string;
  content: string;
  category?: string;
  userId: string;
}

// ====================================================
// QUEUE HELPER FUNCTIONS
// ====================================================

/**
 * AI yanıt üretimi job'ı ekler
 */
export async function addAIResponseJob(data: AIResponseJobData): Promise<Bull.Job> {
  return aiResponseQueue.add(data, {
    timeout: 10000, // 10s timeout
    priority: 1, // Normal priority
  });
}

/**
 * Queue istatistiklerini getirir
 */
export async function getQueueStats() {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    aiResponseQueue.getWaitingCount(),
    aiResponseQueue.getActiveCount(),
    aiResponseQueue.getCompletedCount(),
    aiResponseQueue.getFailedCount(),
    aiResponseQueue.getDelayedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
}

/**
 * Queue'yu temizler (admin fonksiyonu)
 */
export async function cleanQueue() {
  await aiResponseQueue.clean(0, 'completed');
  await aiResponseQueue.clean(0, 'failed');
  console.log('✓ Queue cleaned');
}

/**
 * Queue'yu durdurur (graceful shutdown)
 */
export async function closeQueue() {
  await aiResponseQueue.close();
  console.log('✓ Queue closed');
}

// ====================================================
// EXPORTS
// ====================================================

export default aiResponseQueue;
