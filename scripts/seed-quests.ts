import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedQuests() {
  console.log('🎯 Seeding quests...');

  const quests = [
    {
      key: 'daily_water',
      title: 'Günlük Su İçme',
      description: 'Günde 8 bardak su iç',
      icon: '💧',
      type: 'daily' as const,
      target: 8,
      xpReward: 50,
      coinReward: 20,
      isActive: true,
      sortOrder: 1,
    },
    {
      key: 'daily_checkin',
      title: 'Günlük Check-in',
      description: 'Her gün check-in yap',
      icon: '✅',
      type: 'daily' as const,
      target: 1,
      xpReward: 30,
      coinReward: 10,
      isActive: true,
      sortOrder: 2,
    },
    {
      key: 'daily_weight_log',
      title: 'Kilo Takibi',
      description: 'Kilonu kaydet',
      icon: '⚖️',
      type: 'daily' as const,
      target: 1,
      xpReward: 40,
      coinReward: 15,
      isActive: true,
      sortOrder: 3,
    },
    {
      key: 'daily_food_sin',
      title: 'Günah Kaydı',
      description: 'Yediğin bir şeyi kaydet',
      icon: '🍕',
      type: 'daily' as const,
      target: 1,
      xpReward: 30,
      coinReward: 10,
      isActive: true,
      sortOrder: 4,
    },
    {
      key: 'weekly_plan_create',
      title: 'Haftalık Plan',
      description: 'Bir plan oluştur',
      icon: '📋',
      type: 'weekly' as const,
      target: 1,
      xpReward: 100,
      coinReward: 50,
      isActive: true,
      sortOrder: 5,
    },
    {
      key: 'weekly_recipe_share',
      title: 'Tarif Paylaş',
      description: 'Bir tarif paylaş',
      icon: '🍳',
      type: 'weekly' as const,
      target: 1,
      xpReward: 80,
      coinReward: 40,
      isActive: true,
      sortOrder: 6,
    },
  ];

  for (const quest of quests) {
    await prisma.dailyQuest.upsert({
      where: { key: quest.key },
      update: quest,
      create: quest,
    });
    console.log(`✅ Quest created: ${quest.title}`);
  }

  console.log('🎉 Quests seeded successfully!');
}

seedQuests()
  .catch((e) => {
    console.error('❌ Error seeding quests:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
