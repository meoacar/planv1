import { db as prisma } from '@/lib/db';
import { redis } from '@/lib/redis';
import type {
  Badge,
  UserBadge,
  DailyQuest,
  UserDailyQuest,
  CoinTransaction,
  ShopItem,
  UserPurchase,
  Season,
  League,
  UserLeague,
  Guild,
  GuildMember,
  BattlePass,
  UserBattlePass,
  StreakRecovery,
  ReferralCode,
  Referral,
} from '@prisma/client';

// ====================================================
// XP & LEVEL SYSTEM
// ====================================================

const XP_PER_LEVEL = 100; // Base XP needed for level 2
const XP_MULTIPLIER = 1.5; // Each level requires 1.5x more XP

export function calculateLevelFromXP(xp: number): number {
  let level = 1;
  let xpNeeded = XP_PER_LEVEL;
  let totalXP = 0;

  while (totalXP + xpNeeded <= xp) {
    totalXP += xpNeeded;
    level++;
    xpNeeded = Math.floor(xpNeeded * XP_MULTIPLIER);
  }

  return level;
}

export function calculateXPForNextLevel(currentLevel: number): number {
  let xpNeeded = XP_PER_LEVEL;
  for (let i = 1; i < currentLevel; i++) {
    xpNeeded = Math.floor(xpNeeded * XP_MULTIPLIER);
  }
  return xpNeeded;
}

export async function addXP(userId: string, amount: number, reason: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true },
  });

  if (!user) throw new Error('User not found');

  const newXP = user.xp + amount;
  const newLevel = calculateLevelFromXP(newXP);
  const leveledUp = newLevel > user.level;

  await prisma.user.update({
    where: { id: userId },
    data: { xp: newXP, level: newLevel },
  });

  // Clear cache (optional - skip if Redis not available)
  try {
    await redis?.del(`user:stats:${userId}`);
  } catch (e) {
    // Redis not available, skip cache clear
  }

  // If leveled up, grant bonus coins
  if (leveledUp) {
    const bonusCoins = newLevel * 10;
    await addCoins(userId, bonusCoins, 'level_up', `Seviye ${newLevel}'e ulaştın!`);
  }

  return { newXP, newLevel, leveledUp };
}

// ====================================================
// COIN SYSTEM
// ====================================================

export async function addCoins(
  userId: string,
  amount: number,
  type: CoinTransaction['type'],
  description: string,
  metadata?: Record<string, any>
) {
  const [user, transaction] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { coins: { increment: amount } },
    }),
    prisma.coinTransaction.create({
      data: {
        userId,
        amount,
        type,
        description,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    }),
  ]);

  // Clear cache (optional)
  try {
    await redis?.del(`user:stats:${userId}`);
  } catch (e) {
    // Redis not available
  }
  return { newBalance: user.coins, transaction };
}

export async function spendCoins(
  userId: string,
  amount: number,
  type: CoinTransaction['type'],
  description: string,
  metadata?: Record<string, any>
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { coins: true },
  });

  if (!user) throw new Error('User not found');
  if (user.coins < amount) throw new Error('Insufficient coins');

  return addCoins(userId, -amount, type, description, metadata);
}

export async function getCoinTransactions(userId: string, limit = 50) {
  return prisma.coinTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// ====================================================
// BADGE SYSTEM
// ====================================================

export async function awardBadge(userId: string, badgeKey: string) {
  const badge = await prisma.badge.findUnique({
    where: { key: badgeKey, isActive: true },
  });

  if (!badge) throw new Error('Badge not found');

  // Check if user already has this badge
  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });

  if (existing) return null; // Already has badge

  const userBadge = await prisma.userBadge.create({
    data: { userId, badgeId: badge.id },
    include: { badge: true },
  });

  // Grant rewards
  if (badge.xpReward > 0) {
    await addXP(userId, badge.xpReward, `Rozet kazandın: ${badge.name}`);
  }
  if (badge.coinReward > 0) {
    await addCoins(userId, badge.coinReward, 'badge_reward', `Rozet kazandın: ${badge.name}`);
  }

  // Clear cache (optional)
  try {
    await redis?.del(`user:badges:${userId}`);
  } catch (e) {
    // Redis not available
  }

  return userBadge;
}

export async function getUserBadges(userId: string) {
  // Try cache first (optional)
  try {
    const cached = await redis?.get(`user:badges:${userId}`);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    // Redis not available, skip cache
  }

  const badges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  });

  // Try to cache (optional)
  try {
    await redis?.setEx(`user:badges:${userId}`, 3600, JSON.stringify(badges));
  } catch (e) {
    // Redis not available
  }
  
  return badges;
}

export async function getAllBadges() {
  return prisma.badge.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });
}

// ====================================================
// QUEST SYSTEM
// ====================================================

export async function getQuestById(questId: string) {
  return prisma.dailyQuest.findUnique({
    where: { id: questId },
  });
}

export async function getDailyQuests(userId: string, date: Date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const quests = await prisma.dailyQuest.findMany({
    where: { isActive: true, type: 'daily' },
    orderBy: { sortOrder: 'asc' },
  });

  const userQuests = await prisma.userDailyQuest.findMany({
    where: {
      userId,
      date: { gte: startOfDay },
    },
  });

  const userQuestMap = new Map(userQuests.map((uq) => [uq.questId, uq]));

  return quests.map((quest) => ({
    ...quest,
    userProgress: userQuestMap.get(quest.id) || null,
  }));
}

export async function updateQuestProgress(
  userId: string,
  questKey: string,
  increment: number = 1
) {
  const quest = await prisma.dailyQuest.findUnique({
    where: { key: questKey, isActive: true },
  });

  if (!quest) throw new Error('Quest not found');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userQuest = await prisma.userDailyQuest.upsert({
    where: {
      userId_questId_date: {
        userId,
        questId: quest.id,
        date: today,
      },
    },
    create: {
      userId,
      questId: quest.id,
      progress: increment,
      date: today,
    },
    update: {
      progress: { increment },
    },
  });

  // Auto-complete quest if target reached (but don't grant rewards yet)
  // completedAt will be set when user claims the reward
  if (!userQuest.completed && userQuest.progress >= quest.target) {
    await prisma.userDailyQuest.updateMany({
      where: {
        userId,
        questId: quest.id,
        date: { gte: today },
        completed: false,
      },
      data: {
        completed: true,
        // Don't set completedAt here - it will be set when rewards are claimed
      },
    });
  }

  return userQuest;
}

export async function completeQuest(userId: string, questId: string) {
  const quest = await prisma.dailyQuest.findUnique({ where: { id: questId } });
  if (!quest) throw new Error('Quest not found');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userQuest = await prisma.userDailyQuest.findFirst({
    where: {
      userId,
      questId,
      date: { gte: today },
    },
  });

  if (!userQuest) throw new Error('Quest progress not found');
  if (userQuest.progress < quest.target) throw new Error('Quest not completed yet');
  if (userQuest.completedAt) return null; // Already claimed

  // Mark as completed and set completedAt
  await prisma.userDailyQuest.updateMany({
    where: {
      userId,
      questId,
      date: { gte: today },
    },
    data: {
      completed: true,
      completedAt: new Date(),
    },
  });

  // Grant rewards
  if (quest.xpReward > 0) {
    await addXP(userId, quest.xpReward, `Görev tamamlandı: ${quest.title}`);
  }
  if (quest.coinReward > 0) {
    await addCoins(userId, quest.coinReward, 'quest_reward', `Görev tamamlandı: ${quest.title}`);
  }

  // Grant league points (XP reward = league points)
  if (quest.xpReward > 0) {
    await addLeaguePoints(userId, quest.xpReward);
  }

  return { quest, userQuest };
}

// ====================================================
// STREAK SYSTEM
// ====================================================

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true, lastCheckIn: true },
  });

  if (!user) throw new Error('User not found');

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (!user.lastCheckIn) {
    // First check-in
    await prisma.user.update({
      where: { id: userId },
      data: { streak: 1, lastCheckIn: now },
    });
    return { streak: 1, continued: false };
  }

  const lastCheckIn = new Date(user.lastCheckIn);
  lastCheckIn.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Already checked in today
    return { streak: user.streak, continued: false };
  } else if (daysDiff === 1) {
    // Consecutive day
    const newStreak = user.streak + 1;
    await prisma.user.update({
      where: { id: userId },
      data: { streak: newStreak, lastCheckIn: now },
    });

    // Award streak milestone badges
    if (newStreak === 7) await awardBadge(userId, 'streak_7');
    if (newStreak === 30) await awardBadge(userId, 'streak_30');
    if (newStreak === 100) await awardBadge(userId, 'streak_100');

    // Grant league points for daily check-in
    await addLeaguePoints(userId, 10); // 10 puan günlük check-in için

    return { streak: newStreak, continued: true };
  } else {
    // Streak broken
    await prisma.user.update({
      where: { id: userId },
      data: { streak: 1, lastCheckIn: now },
    });
    return { streak: 1, continued: false, broken: true };
  }
}

export async function recoverStreak(userId: string, daysLost: number) {
  const costPerDay = 50; // 50 coins per day
  const totalCost = daysLost * costPerDay;

  await spendCoins(userId, totalCost, 'streak_recovery', `${daysLost} günlük seri kurtarıldı`);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true },
  });

  if (!user) throw new Error('User not found');

  const newStreak = user.streak + daysLost;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { streak: newStreak },
    }),
    prisma.streakRecovery.create({
      data: {
        userId,
        streakLost: daysLost,
        coinsCost: totalCost,
      },
    }),
  ]);

  return { newStreak, cost: totalCost };
}

// ====================================================
// SHOP SYSTEM
// ====================================================

export async function getShopItems(category?: ShopItem['category']) {
  return prisma.shopItem.findMany({
    where: {
      isActive: true,
      ...(category && { category }),
    },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });
}

export async function purchaseItem(userId: string, itemKey: string, quantity: number = 1) {
  const item = await prisma.shopItem.findUnique({
    where: { key: itemKey, isActive: true },
  });

  if (!item) throw new Error('Item not found');
  if (item.stock !== null && item.stock < quantity) throw new Error('Insufficient stock');

  const totalPrice = item.price * quantity;

  await spendCoins(userId, totalPrice, 'purchase', `${item.name} satın alındı (${quantity}x)`);

  const purchase = await prisma.userPurchase.create({
    data: {
      userId,
      itemId: item.id,
      quantity,
      totalPrice,
    },
    include: { item: true },
  });

  // Update stock if limited
  if (item.stock !== null) {
    await prisma.shopItem.update({
      where: { id: item.id },
      data: { stock: { decrement: quantity } },
    });
  }

  // Apply item effects to user profile
  await applyItemEffect(userId, itemKey, quantity);

  return purchase;
}

// Ürün efektlerini kullanıcıya uygula
async function applyItemEffect(userId: string, itemKey: string, quantity: number = 1) {
  const updateData: any = {};

  // Profil çerçeveleri
  if (itemKey === 'profile_frame_gold') {
    updateData.profileFrame = 'gold';
  } else if (itemKey === 'profile_frame_silver') {
    updateData.profileFrame = 'silver';
  } else if (itemKey === 'profile_frame_diamond') {
    updateData.profileFrame = 'diamond';
  } else if (itemKey === 'profile_frame_rainbow') {
    updateData.profileFrame = 'rainbow';
  } else if (itemKey === 'profile_frame_fire') {
    updateData.profileFrame = 'fire';
  } else if (itemKey === 'profile_frame_ice') {
    updateData.profileFrame = 'ice';
  }

  // İsim renkleri
  else if (itemKey === 'name_color_rainbow') {
    updateData.nameColor = 'rainbow';
  } else if (itemKey === 'name_color_gold') {
    updateData.nameColor = 'gold';
  } else if (itemKey === 'name_color_red') {
    updateData.nameColor = 'red';
  } else if (itemKey === 'name_color_blue') {
    updateData.nameColor = 'blue';
  } else if (itemKey === 'name_color_purple') {
    updateData.nameColor = 'purple';
  }

  // XP Boost
  else if (itemKey === 'xp_boost_2x') {
    const boostEnd = new Date();
    boostEnd.setHours(boostEnd.getHours() + 24 * quantity);
    updateData.xpBoostUntil = boostEnd;
  } else if (itemKey === 'xp_boost_3x') {
    const boostEnd = new Date();
    boostEnd.setHours(boostEnd.getHours() + 12 * quantity);
    updateData.xpBoostUntil = boostEnd;
  }

  // Coin Boost
  else if (itemKey === 'coin_boost_2x') {
    const boostEnd = new Date();
    boostEnd.setHours(boostEnd.getHours() + 24 * quantity);
    updateData.coinBoostUntil = boostEnd;
  }

  // Seri Dondurma
  else if (itemKey === 'streak_freeze' || itemKey === 'streak_freeze_3') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (user) {
      const freezeCount = itemKey === 'streak_freeze_3' ? 3 : 1;
      await prisma.user.update({
        where: { id: userId },
        data: { streakFreezeCount: { increment: freezeCount * quantity } },
      });
    }
  }

  // Özel Rozet
  else if (itemKey === 'custom_badge') {
    updateData.profileBadge = 'custom';
  }

  // Unvanlar
  else if (itemKey === 'title_champion') {
    updateData.activeTitle = 'Şampiyon';
  } else if (itemKey === 'title_legend') {
    updateData.activeTitle = 'Efsane';
  } else if (itemKey === 'title_master') {
    updateData.activeTitle = 'Usta';
  } else if (itemKey === 'title_warrior') {
    updateData.activeTitle = 'Savaşçı';
  }

  // Özel Emoji
  else if (itemKey === 'custom_emoji') {
    updateData.customEmoji = '⭐';
  }

  // Profil Temaları
  else if (itemKey === 'theme_dark') {
    updateData.profileTheme = 'dark';
  } else if (itemKey === 'theme_ocean') {
    updateData.profileTheme = 'ocean';
  } else if (itemKey === 'theme_sunset') {
    updateData.profileTheme = 'sunset';
  } else if (itemKey === 'theme_forest') {
    updateData.profileTheme = 'forest';
  }

  // Eğer güncelleme varsa uygula
  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}

export async function getUserPurchases(userId: string) {
  return prisma.userPurchase.findMany({
    where: { userId },
    include: { item: true },
    orderBy: { purchasedAt: 'desc' },
  });
}

// ====================================================
// SEASON & LEAGUE SYSTEM
// ====================================================

export async function getCurrentSeason() {
  const now = new Date();
  return prisma.season.findFirst({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: { leagues: { orderBy: { minPoints: 'asc' } } },
  });
}

export async function getUserLeague(userId: string, seasonId: string) {
  return prisma.userLeague.findUnique({
    where: { userId_seasonId: { userId, seasonId } },
    include: { league: true, season: true },
  });
}

export async function addLeaguePoints(userId: string, points: number) {
  const season = await getCurrentSeason();
  if (!season) return null;

  // Önce kullanıcının mevcut lig bilgisini al
  let userLeague = await prisma.userLeague.findUnique({
    where: { userId_seasonId: { userId, seasonId: season.id } },
  });

  // Eğer yoksa, başlangıç ligine yerleştir
  if (!userLeague) {
    userLeague = await prisma.userLeague.create({
      data: {
        userId,
        seasonId: season.id,
        leagueId: season.leagues[0].id, // Bronz ligden başla
        points: 0,
      },
    });
  }

  // Puanı güncelle
  const newPoints = userLeague.points + points;
  
  // Kullanıcının hangi lige girmesi gerektiğini bul
  const appropriateLeague = [...season.leagues]
    .reverse() // En yüksek ligden başla
    .find((league) => newPoints >= league.minPoints);

  if (!appropriateLeague) return null;

  // Lig değişti mi kontrol et
  const promoted = appropriateLeague.id !== userLeague.leagueId;

  // Güncelle
  const updatedUserLeague = await prisma.userLeague.update({
    where: { id: userLeague.id },
    data: {
      points: newPoints,
      leagueId: appropriateLeague.id,
    },
    include: {
      league: true,
    },
  });

  // Eğer lig yükseldiyse bonus ver
  if (promoted) {
    const bonusCoins = 100;
    await addCoins(
      userId,
      bonusCoins,
      'league_promotion',
      `${appropriateLeague.name}'e yükseldin! 🎉`
    );
  }

  return { ...updatedUserLeague, promoted };
}

export async function getLeagueLeaderboard(leagueId: string, limit: number = 100) {
  return prisma.userLeague.findMany({
    where: { leagueId },
    include: { user: { select: { id: true, username: true, name: true, image: true } } },
    orderBy: { points: 'desc' },
    take: limit,
  });
}

// ====================================================
// GUILD SYSTEM
// ====================================================

export async function createGuild(
  name: string,
  slug: string,
  leaderId: string,
  description?: string
) {
  const guild = await prisma.guild.create({
    data: {
      name,
      slug,
      leaderId,
      description,
    },
  });

  await prisma.guildMember.create({
    data: {
      guildId: guild.id,
      userId: leaderId,
      role: 'leader',
    },
  });

  return guild;
}

export async function joinGuild(guildId: string, userId: string) {
  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    select: { memberCount: true, maxMembers: true, isPublic: true },
  });

  if (!guild) throw new Error('Guild not found');
  if (!guild.isPublic) throw new Error('Guild is private');
  if (guild.memberCount >= guild.maxMembers) throw new Error('Guild is full');

  const member = await prisma.guildMember.create({
    data: {
      guildId,
      userId,
      role: 'member',
    },
  });

  await prisma.guild.update({
    where: { id: guildId },
    data: { memberCount: { increment: 1 } },
  });

  return member;
}

export async function leaveGuild(guildId: string, userId: string) {
  const member = await prisma.guildMember.findUnique({
    where: { guildId_userId: { guildId, userId } },
  });

  if (!member) throw new Error('Not a member');
  if (member.role === 'leader') throw new Error('Leader cannot leave guild');

  await prisma.guildMember.delete({
    where: { id: member.id },
  });

  await prisma.guild.update({
    where: { id: guildId },
    data: { memberCount: { decrement: 1 } },
  });
}

export async function getGuildMembers(guildId: string) {
  return prisma.guildMember.findMany({
    where: { guildId },
    include: { user: { select: { id: true, username: true, name: true, image: true, level: true } } },
    orderBy: [{ role: 'asc' }, { xpEarned: 'desc' }],
  });
}

// ====================================================
// BATTLE PASS SYSTEM
// ====================================================

export async function getUserBattlePass(userId: string, seasonId: string) {
  const season = await prisma.season.findUnique({
    where: { id: seasonId },
    include: { battlePasses: { include: { rewards: { orderBy: { level: 'asc' } } } } },
  });

  if (!season) throw new Error('Season not found');

  const freeBattlePass = season.battlePasses.find((bp) => bp.tier === 'free');
  if (!freeBattlePass) throw new Error('Free battle pass not found');

  const userBattlePass = await prisma.userBattlePass.findUnique({
    where: { userId_passId: { userId, passId: freeBattlePass.id } },
  });

  if (!userBattlePass) {
    // Auto-enroll in free battle pass
    return prisma.userBattlePass.create({
      data: {
        userId,
        passId: freeBattlePass.id,
        currentLevel: 1,
        xpEarned: 0,
        isPremium: false,
      },
    });
  }

  return userBattlePass;
}

export async function addBattlePassXP(userId: string, seasonId: string, xp: number) {
  const userBattlePass = await getUserBattlePass(userId, seasonId);
  const newXP = userBattlePass.xpEarned + xp;
  const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP per level

  await prisma.userBattlePass.update({
    where: { id: userBattlePass.id },
    data: {
      xpEarned: newXP,
      currentLevel: newLevel,
    },
  });

  return { newXP, newLevel, leveledUp: newLevel > userBattlePass.currentLevel };
}

// ====================================================
// REFERRAL SYSTEM
// ====================================================

export async function createReferralCode(userId: string) {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  return prisma.referralCode.create({
    data: { userId, code },
  });
}

export async function applyReferralCode(referredUserId: string, code: string) {
  const referralCode = await prisma.referralCode.findUnique({
    where: { code },
  });

  if (!referralCode) throw new Error('Invalid referral code');
  if (referralCode.userId === referredUserId) throw new Error('Cannot refer yourself');

  const existing = await prisma.referral.findUnique({
    where: {
      referrerId_referredId: {
        referrerId: referralCode.userId,
        referredId: referredUserId,
      },
    },
  });

  if (existing) throw new Error('Referral already applied');

  const referral = await prisma.referral.create({
    data: {
      referrerId: referralCode.userId,
      referredId: referredUserId,
      bonusCoins: 50,
      status: 'pending',
    },
  });

  await prisma.referralCode.update({
    where: { id: referralCode.id },
    data: { usedCount: { increment: 1 } },
  });

  return referral;
}

export async function completeReferral(referralId: string) {
  const referral = await prisma.referral.findUnique({
    where: { id: referralId },
  });

  if (!referral || referral.status !== 'pending') return null;

  await prisma.referral.update({
    where: { id: referralId },
    data: { status: 'completed', completedAt: new Date() },
  });

  // Grant bonus coins to both users
  await addCoins(referral.referrerId, referral.bonusCoins, 'referral_bonus', 'Arkadaşını davet ettin!');
  await addCoins(referral.referredId, referral.bonusCoins, 'referral_bonus', 'Davet kodunu kullandın!');

  return referral;
}

export async function getReferralStats(userId: string) {
  const [referralCode, referrals] = await Promise.all([
    prisma.referralCode.findUnique({ where: { userId } }),
    prisma.referral.findMany({
      where: { referrerId: userId },
      include: { referred: { select: { username: true, name: true, createdAt: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const completed = referrals.filter((r) => r.status === 'completed').length;
  const pending = referrals.filter((r) => r.status === 'pending').length;
  const totalEarned = completed * 50;

  return {
    code: referralCode?.code,
    totalReferrals: referrals.length,
    completed,
    pending,
    totalEarned,
    referrals,
  };
}
