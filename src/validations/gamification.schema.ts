import { z } from 'zod';

// Badge schemas
export const createBadgeSchema = z.object({
  key: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  icon: z.string().min(1).max(100),
  category: z.enum(['achievement', 'milestone', 'social', 'special']),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
  xpReward: z.number().int().min(0).default(0),
  coinReward: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateBadgeSchema = createBadgeSchema.partial();

// Quest schemas
export const createQuestSchema = z.object({
  key: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  icon: z.string().min(1).max(100),
  xpReward: z.number().int().min(0).default(10),
  coinReward: z.number().int().min(0).default(5),
  type: z.enum(['daily', 'weekly', 'special']),
  target: z.number().int().min(1).default(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateQuestSchema = createQuestSchema.partial();

export const updateQuestProgressSchema = z.object({
  questKey: z.string().min(1),
  increment: z.number().int().min(1).default(1),
});

// Shop schemas
export const createShopItemSchema = z.object({
  key: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  icon: z.string().min(1).max(100),
  category: z.enum(['cosmetic', 'boost', 'recovery', 'special']),
  price: z.number().int().min(0),
  stock: z.number().int().min(0).nullable().default(null),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  metadata: z.record(z.any()).optional(),
});

export const updateShopItemSchema = createShopItemSchema.partial();

export const purchaseItemSchema = z.object({
  itemKey: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});

// Season schemas
export const createSeasonSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  isActive: z.boolean().default(false),
});

export const updateSeasonSchema = createSeasonSchema.partial();

// League schemas
export const createLeagueSchema = z.object({
  seasonId: z.string().cuid(),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond']),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  minPoints: z.number().int().min(0).default(0),
  maxPoints: z.number().int().min(0).nullable().optional(),
  icon: z.string().max(100).optional(),
  rewards: z.array(z.any()).optional(),
});

export const updateLeagueSchema = createLeagueSchema.partial();

// Guild schemas
export const createGuildSchema = z.object({
  name: z.string().min(3).max(50),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  icon: z.string().max(100).optional(),
  color: z.string().max(20).optional(),
  category: z.string().max(50).optional(),
  isPublic: z.boolean().default(true),
  maxMembers: z.number().int().min(5).max(100).default(50),
  rules: z.string().max(1000).optional(),
  monthlyGoal: z.string().max(100).optional(),
});

export const updateGuildSchema = createGuildSchema.partial();

export const joinGuildSchema = z.object({
  guildId: z.string().cuid(),
});

export const updateGuildMemberRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(['leader', 'officer', 'member']),
});

// Battle Pass schemas
export const createBattlePassSchema = z.object({
  seasonId: z.string().cuid(),
  tier: z.enum(['free', 'premium']),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  price: z.number().int().min(0).default(0),
  maxLevel: z.number().int().min(1).default(50),
});

export const updateBattlePassSchema = createBattlePassSchema.partial();

export const createBattlePassRewardSchema = z.object({
  passId: z.string().cuid(),
  level: z.number().int().min(1),
  rewardType: z.enum(['badge', 'coins', 'xp', 'item']),
  rewardId: z.string().cuid().optional(),
  rewardValue: z.number().int().optional(),
  description: z.string().min(1).max(500),
  icon: z.string().max(100).optional(),
});

export const updateBattlePassRewardSchema = createBattlePassRewardSchema.partial();

// Streak schemas
export const recoverStreakSchema = z.object({
  daysLost: z.number().int().min(1).max(30),
});

// Referral schemas
export const applyReferralCodeSchema = z.object({
  code: z.string().length(6).toUpperCase(),
});

// Coin transaction schemas
export const grantCoinsSchema = z.object({
  userId: z.string().cuid(),
  amount: z.number().int(),
  description: z.string().min(1).max(500),
});

// XP schemas
export const grantXPSchema = z.object({
  userId: z.string().cuid(),
  amount: z.number().int().min(1),
  reason: z.string().min(1).max(500),
});

// Award badge schema
export const awardBadgeSchema = z.object({
  userId: z.string().cuid(),
  badgeKey: z.string().min(1),
});

// Types
export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;
export type CreateQuestInput = z.infer<typeof createQuestSchema>;
export type UpdateQuestInput = z.infer<typeof updateQuestSchema>;
export type UpdateQuestProgressInput = z.infer<typeof updateQuestProgressSchema>;
export type CreateShopItemInput = z.infer<typeof createShopItemSchema>;
export type UpdateShopItemInput = z.infer<typeof updateShopItemSchema>;
export type PurchaseItemInput = z.infer<typeof purchaseItemSchema>;
export type CreateSeasonInput = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonInput = z.infer<typeof updateSeasonSchema>;
export type CreateLeagueInput = z.infer<typeof createLeagueSchema>;
export type UpdateLeagueInput = z.infer<typeof updateLeagueSchema>;
export type CreateGuildInput = z.infer<typeof createGuildSchema>;
export type UpdateGuildInput = z.infer<typeof updateGuildSchema>;
export type JoinGuildInput = z.infer<typeof joinGuildSchema>;
export type UpdateGuildMemberRoleInput = z.infer<typeof updateGuildMemberRoleSchema>;
export type CreateBattlePassInput = z.infer<typeof createBattlePassSchema>;
export type UpdateBattlePassInput = z.infer<typeof updateBattlePassSchema>;
export type CreateBattlePassRewardInput = z.infer<typeof createBattlePassRewardSchema>;
export type UpdateBattlePassRewardInput = z.infer<typeof updateBattlePassRewardSchema>;
export type RecoverStreakInput = z.infer<typeof recoverStreakSchema>;
export type ApplyReferralCodeInput = z.infer<typeof applyReferralCodeSchema>;
export type GrantCoinsInput = z.infer<typeof grantCoinsSchema>;
export type GrantXPInput = z.infer<typeof grantXPSchema>;
export type AwardBadgeInput = z.infer<typeof awardBadgeSchema>;
