// src/workers/cron-jobs.ts

import cron from 'node-cron';
import { updatePopularConfessions } from '@/services/confession.service';

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
  
  // Gelecekte eklenecek diğer cron job'lar buraya eklenebilir
}

/**
 * Tüm cron job'ları durdurur
 */
export function stopCronJobs() {
  console.log('🛑 Stopping cron jobs...');
  
  popularConfessionsJob.stop();
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
};
