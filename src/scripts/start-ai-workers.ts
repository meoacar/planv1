#!/usr/bin/env node

/**
 * AI Workers Starter Script
 * 
 * Bu script AI recommendation ve smart reminder worker'larını başlatır.
 * 
 * Kullanım:
 *   npm run workers:ai
 *   veya
 *   node --loader ts-node/esm src/scripts/start-ai-workers.ts
 */

import { aiRecommendationWorker, scheduleBulkRecommendations } from '../workers/ai-recommendation.worker';
import { smartReminderWorker, schedulePendingReminders } from '../workers/smart-reminder.worker';

console.log('🤖 AI Workers başlatılıyor...\n');

// Worker event listeners
aiRecommendationWorker.on('ready', () => {
  console.log('✅ AI Recommendation Worker hazır');
});

smartReminderWorker.on('ready', () => {
  console.log('✅ Smart Reminder Worker hazır');
});

// Schedule initial jobs
setTimeout(async () => {
  console.log('\n📋 İlk joblar planlanıyor...');
  
  try {
    await scheduleBulkRecommendations();
    console.log('✅ Recommendation jobları planlandı');
  } catch (error) {
    console.error('❌ Recommendation job hatası:', error);
  }

  try {
    await schedulePendingReminders();
    console.log('✅ Reminder jobları planlandı');
  } catch (error) {
    console.error('❌ Reminder job hatası:', error);
  }
}, 2000);

// Schedule periodic jobs
setInterval(async () => {
  console.log('\n🔄 Periyodik joblar çalıştırılıyor...');
  
  try {
    await scheduleBulkRecommendations();
    await schedulePendingReminders();
    console.log('✅ Periyodik joblar tamamlandı');
  } catch (error) {
    console.error('❌ Periyodik job hatası:', error);
  }
}, 60 * 60 * 1000); // Her saat

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n⏹️  Workerlar kapatılıyor...');
  await aiRecommendationWorker.close();
  await smartReminderWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⏹️  Workerlar kapatılıyor...');
  await aiRecommendationWorker.close();
  await smartReminderWorker.close();
  process.exit(0);
});

console.log('\n✨ AI Workers çalışıyor! Durdurmak için Ctrl+C basın.\n');
