// src/workers/cron-jobs.ts

import cron from 'node-cron';
import { updatePopularConfessions } from '@/services/confession.service';
import { scheduleBulkRecommendations } from './ai-recommendation.worker';
import { schedulePendingReminders } from './smart-reminder.worker';

// ====================================================
// CRON JOB DEFINITIONS
// ====================================================

/**
 * Popüler itirafları günceller
 * Her 6 saatte bir çalışır: 00:00, 06:00, 12:00, 18:00
 */
export const popularConfessionsJob = cron.schedule(
  '0 */6 * * *',
  async () => {
    console.log('🔄 Running popular confessions update job...');
    
    try {
      await updatePopularConfessions();
      console.log('✓ Popular confessions updated successfully');
    } catch (error) {
      console.error('❌ Error updating popular confessions:', error);
    }
  },
  {
    scheduled: false, // Manuel başlatılacak
    timezone: 'Europe/Istanbul', // Türkiye saati
  }
);

/**
 * AI önerilerini günceller
 * Her gün saat 03:00'te çalışır
 */
export const aiRecommendationsJob = cron.schedule(
  '0 3 * * *',
  async () => {
    console.log('🤖 Running AI recommendations generation job...');
    
    try {
      await scheduleBulkRecommendations();
      console.log('✓ AI recommendations scheduled successfully');
    } catch (error) {
      console.error('❌ Error scheduling AI recommendations:', error);
    }
  },
  {
    scheduled: false,
    timezone: 'Europe/Istanbul',
  }
);

/**
 * Akıllı hatırlatıcıları gönderir
 * Her saat başı çalışır
 */
export const smartRemindersJob = cron.schedule(
  '0 * * * *',
  async () => {
    console.log('⏰ Running smart reminders job...');
    
    try {
      await schedulePendingReminders();
      console.log('✓ Smart reminders scheduled successfully');
    } catch (error) {
      console.error('❌ Error scheduling smart reminders:', error);
    }
  },
  {
    scheduled: false,
    timezone: 'Europe/Istanbul',
  }
);

// ====================================================
// CRON JOB MANAGER
// ====================================================

/**
 * Tüm cron job'ları başlatır
 */
export function startCronJobs() {
  console.log('🚀 Starting cron jobs...');
  
  popularConfessionsJob.start();
  console.log('✓ Popular confessions job started (runs every 6 hours)');
  
  aiRecommendationsJob.start();
  console.log('✓ AI recommendations job started (runs daily at 3 AM)');
  
  smartRemindersJob.start();
  console.log('✓ Smart reminders job started (runs every hour)');
}

/**
 * Tüm cron job'ları durdurur
 */
export function stopCronJobs() {
  console.log('🛑 Stopping cron jobs...');
  
  popularConfessionsJob.stop();
  aiRecommendationsJob.stop();
  smartRemindersJob.stop();
  console.log('✓ All cron jobs stopped');
}

// ====================================================
// GRACEFUL SHUTDOWN
// ====================================================

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, stopping cron jobs...');
  stopCronJobs();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, stopping cron jobs...');
  stopCronJobs();
  process.exit(0);
});

// ====================================================
// AUTO-START (if run directly)
// ====================================================

if (require.main === module) {
  startCronJobs();
  console.log('✓ Cron jobs worker is running...');
  console.log('Press Ctrl+C to stop');
}

// ====================================================
// EXPORTS
// ====================================================

export default {
  startCronJobs,
  stopCronJobs,
  popularConfessionsJob,
  aiRecommendationsJob,
  smartRemindersJob,
};
