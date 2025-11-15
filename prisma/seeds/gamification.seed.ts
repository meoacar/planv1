import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedGamification() {
  console.log('🎮 Seeding gamification data...');

  // Badges
  const badges = [
    // Achievement badges
    {
      key: 'first_plan',
      name: 'İlk Plan',
      description: 'İlk planını oluşturdun!',
      icon: '📝',
      category: 'achievement' as const,
      rarity: 'common' as const,
      xpReward: 50,
      coinReward: 10,
      sortOrder: 1,
    },
    {
      key: 'first_recipe',
      name: 'İlk Tarif',
      description: 'İlk tarifini paylaştın!',
      icon: '👨‍🍳',
      category: 'achievement' as const,
      rarity: 'common' as const,
      xpReward: 50,
      coinReward: 10,
      sortOrder: 2,
    },
    {
      key: 'first_comment',
      name: 'İlk Yorum',
      description: 'İlk yorumunu yaptın!',
      icon: '💬',
      category: 'achievement' as const,
      rarity: 'common' as const,
      xpReward: 25,
      coinReward: 5,
      sortOrder: 3,
    },
    // Milestone badges
    {
      key: 'weight_loss_5kg',
      name: '5kg Kaybı',
      description: '5kg verdin, harikasın!',
      icon: '🎯',
      category: 'milestone' as const,
      rarity: 'rare' as const,
      xpReward: 100,
      coinReward: 25,
      sortOrder: 1,
    },
    {
      key: 'weight_loss_10kg',
      name: '10kg Kaybı',
      description: '10kg verdin, inanılmaz!',
      icon: '🏆',
      category: 'milestone' as const,
      rarity: 'epic' as const,
      xpReward: 200,
      coinReward: 50,
      sortOrder: 2,
    },
    {
      key: 'weight_loss_20kg',
      name: '20kg Kaybı',
      description: '20kg verdin, efsanesin!',
      icon: '👑',
      category: 'milestone' as const,
      rarity: 'legendary' as const,
      xpReward: 500,
      coinReward: 100,
      sortOrder: 3,
    },
    // Streak badges
    {
      key: 'streak_7',
      name: '7 Günlük Seri',
      description: '7 gün üst üste check-in yaptın!',
      icon: '🔥',
      category: 'milestone' as const,
      rarity: 'rare' as const,
      xpReward: 75,
      coinReward: 20,
      sortOrder: 4,
    },
    {
      key: 'streak_30',
      name: '30 Günlük Seri',
      description: '30 gün üst üste check-in yaptın!',
      icon: '⚡',
      category: 'milestone' as const,
      rarity: 'epic' as const,
      xpReward: 250,
      coinReward: 75,
      sortOrder: 5,
    },
    {
      key: 'streak_100',
      name: '100 Günlük Seri',
      description: '100 gün üst üste check-in yaptın!',
      icon: '💎',
      category: 'milestone' as const,
      rarity: 'legendary' as const,
      xpReward: 1000,
      coinReward: 250,
      sortOrder: 6,
    },
    // Social badges
    {
      key: 'social_10_followers',
      name: '10 Takipçi',
      description: '10 takipçiye ulaştın!',
      icon: '👥',
      category: 'social' as const,
      rarity: 'common' as const,
      xpReward: 50,
      coinReward: 10,
      sortOrder: 1,
    },
    {
      key: 'social_50_followers',
      name: '50 Takipçi',
      description: '50 takipçiye ulaştın!',
      icon: '🌟',
      category: 'social' as const,
      rarity: 'rare' as const,
      xpReward: 150,
      coinReward: 30,
      sortOrder: 2,
    },
    {
      key: 'social_100_likes',
      name: '100 Beğeni',
      description: 'İçeriklerine 100 beğeni aldın!',
      icon: '❤️',
      category: 'social' as const,
      rarity: 'rare' as const,
      xpReward: 100,
      coinReward: 25,
      sortOrder: 3,
    },
    // Special badges
    {
      key: 'early_adopter',
      name: 'Erken Katılan',
      description: 'Platformun ilk kullanıcılarındansın!',
      icon: '🚀',
      category: 'special' as const,
      rarity: 'legendary' as const,
      xpReward: 500,
      coinReward: 100,
      sortOrder: 1,
    },
    {
      key: 'guild_founder',
      name: 'Lonca Kurucusu',
      description: 'Bir lonca kurdun!',
      icon: '🏰',
      category: 'special' as const,
      rarity: 'epic' as const,
      xpReward: 200,
      coinReward: 50,
      sortOrder: 2,
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: badge,
      create: badge,
    });
  }

  console.log(`✅ Created ${badges.length} badges`);

  // Daily Quests
  const quests = [
    {
      key: 'daily_check_in',
      title: 'Günlük Check-in',
      description: 'Bugün check-in yap',
      icon: '✅',
      xpReward: 10,
      coinReward: 5,
      type: 'daily' as const,
      target: 1,
      sortOrder: 1,
    },
    {
      key: 'daily_weigh_in',
      title: 'Bugün Tartıl',
      description: 'Kilonu kaydet',
      icon: '⚖️',
      xpReward: 15,
      coinReward: 5,
      type: 'daily' as const,
      target: 1,
      sortOrder: 2,
    },
    {
      key: 'daily_water',
      title: 'Su İç',
      description: '8 bardak su iç',
      icon: '💧',
      xpReward: 10,
      coinReward: 5,
      type: 'daily' as const,
      target: 8,
      sortOrder: 3,
    },
    {
      key: 'daily_comment',
      title: 'Yorum Yap',
      description: 'Bir içeriğe yorum yap',
      icon: '💬',
      xpReward: 10,
      coinReward: 5,
      type: 'daily' as const,
      target: 1,
      sortOrder: 4,
    },
    {
      key: 'daily_like',
      title: 'Beğen',
      description: '3 içeriği beğen',
      icon: '❤️',
      xpReward: 10,
      coinReward: 5,
      type: 'daily' as const,
      target: 3,
      sortOrder: 5,
    },
  ];

  for (const quest of quests) {
    await prisma.dailyQuest.upsert({
      where: { key: quest.key },
      update: quest,
      create: quest,
    });
  }

  console.log(`✅ Created ${quests.length} quests`);

  // Shop Items
  const shopItems = [
    // Cosmetic items
    {
      key: 'avatar_frame_gold',
      name: 'Altın Çerçeve',
      description: 'Profiline altın çerçeve ekle',
      icon: '🖼️',
      category: 'cosmetic' as const,
      price: 100,
      stock: null,
      sortOrder: 1,
    },
    {
      key: 'profile_theme_dark',
      name: 'Karanlık Tema',
      description: 'Özel karanlık profil teması',
      icon: '🌙',
      category: 'cosmetic' as const,
      price: 50,
      stock: null,
      sortOrder: 2,
    },
    {
      key: 'badge_showcase',
      name: 'Rozet Vitrini',
      description: 'Profilinde 10 rozet göster',
      icon: '🏆',
      category: 'cosmetic' as const,
      price: 150,
      stock: null,
      sortOrder: 3,
    },
    // Boost items
    {
      key: 'xp_boost_2x',
      name: '2x XP Boost',
      description: '24 saat boyunca 2x XP kazan',
      icon: '⚡',
      category: 'boost' as const,
      price: 200,
      stock: null,
      sortOrder: 1,
    },
    {
      key: 'coin_boost_2x',
      name: '2x Coin Boost',
      description: '24 saat boyunca 2x coin kazan',
      icon: '💰',
      category: 'boost' as const,
      price: 200,
      stock: null,
      sortOrder: 2,
    },
    // Recovery items
    {
      key: 'streak_freeze',
      name: 'Seri Dondurma',
      description: '1 gün seri kaybını engelle',
      icon: '❄️',
      category: 'recovery' as const,
      price: 50,
      stock: null,
      sortOrder: 1,
    },
  ];

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { key: item.key },
      update: item,
      create: item,
    });
  }

  console.log(`✅ Created ${shopItems.length} shop items`);

  // Create a sample season
  const now = new Date();
  const seasonStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const seasonEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const season = await prisma.season.upsert({
    where: { id: 'season-2024-01' },
    update: {
      name: `${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
      startDate: seasonStart,
      endDate: seasonEnd,
      isActive: true,
    },
    create: {
      id: 'season-2024-01',
      name: `${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
      description: 'İlk sezon!',
      startDate: seasonStart,
      endDate: seasonEnd,
      isActive: true,
    },
  });

  console.log(`✅ Created season: ${season.name}`);

  // Create leagues for the season
  const leagues = [
    { tier: 'bronze' as const, name: 'Bronz Ligi', minPoints: 0, maxPoints: 999 },
    { tier: 'silver' as const, name: 'Gümüş Ligi', minPoints: 1000, maxPoints: 2499 },
    { tier: 'gold' as const, name: 'Altın Ligi', minPoints: 2500, maxPoints: 4999 },
    { tier: 'platinum' as const, name: 'Platin Ligi', minPoints: 5000, maxPoints: 9999 },
    { tier: 'diamond' as const, name: 'Elmas Ligi', minPoints: 10000, maxPoints: null },
  ];

  for (const league of leagues) {
    await prisma.league.upsert({
      where: {
        seasonId_tier: {
          seasonId: season.id,
          tier: league.tier as any,
        },
      },
      update: league,
      create: {
        ...league,
        seasonId: season.id,
      },
    });
  }

  console.log(`✅ Created ${leagues.length} leagues`);

  console.log('🎮 Gamification seeding completed!');
}

// Run if called directly
if (require.main === module) {
  seedGamification()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
