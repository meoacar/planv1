#!/usr/bin/env node

/**
 * Clean Streak Badges Script
 * Yanlışlıkla verilen streak rozetlerini temizler
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Yanlış verilen streak rozetleri temizleniyor...\n');

  // Streak rozet key'lerini bul
  const streakBadges = await prisma.sinBadge.findMany({
    where: {
      key: {
        startsWith: 'streak_'
      }
    },
    select: {
      id: true,
      key: true,
      name: true
    }
  });

  console.log(`📋 ${streakBadges.length} streak rozeti bulundu:`);
  streakBadges.forEach(b => console.log(`  - ${b.name} (${b.key})`));

  const badgeIds = streakBadges.map(b => b.id);

  // Kullanıcılara verilmiş streak rozetlerini sil
  const deleted = await prisma.userSinBadge.deleteMany({
    where: {
      badgeId: {
        in: badgeIds
      }
    }
  });

  console.log(`\n✅ ${deleted.count} adet yanlış verilen rozet temizlendi!`);
  console.log('\n💡 Not: Streak rozetleri artık sadece gerçekten kazanıldığında verilecek.');
  console.log('   (Otomatik kontrol sistemi henüz eklenmedi)\n');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
