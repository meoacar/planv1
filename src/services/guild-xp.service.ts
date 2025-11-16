import { db } from '@/lib/db';

export enum GuildXPAction {
  DAILY_WEIGH_IN = 'daily_weigh_in',
  QUEST_COMPLETE = 'quest_complete',
  COMMENT = 'comment',
  PLAN_SHARE = 'plan_share',
  RECIPE_SHARE = 'recipe_share',
  WEEKLY_GOAL = 'weekly_goal',
  STREAK_7 = 'streak_7',
  PROGRESS_PHOTO = 'progress_photo',
  GUILD_CHAT = 'guild_chat',
  SUPPORT_MEMBER = 'support_member',
}

const XP_VALUES: Record<GuildXPAction, number> = {
  [GuildXPAction.DAILY_WEIGH_IN]: 10,
  [GuildXPAction.QUEST_COMPLETE]: 15,
  [GuildXPAction.COMMENT]: 3,
  [GuildXPAction.PLAN_SHARE]: 50,
  [GuildXPAction.RECIPE_SHARE]: 50,
  [GuildXPAction.WEEKLY_GOAL]: 100,
  [GuildXPAction.STREAK_7]: 50,
  [GuildXPAction.PROGRESS_PHOTO]: 30,
  [GuildXPAction.GUILD_CHAT]: 5,
  [GuildXPAction.SUPPORT_MEMBER]: 10,
};

/**
 * Add XP to a guild member and update guild total XP
 */
export async function addGuildXP(
  userId: string,
  action: GuildXPAction,
  multiplier: number = 1
): Promise<{ memberXP: number; guildXP: number; levelUp: boolean } | null> {
  try {
    // Find user's guild membership
    const membership = await db.guildMember.findFirst({
      where: { userId },
      include: { guild: true },
    });

    if (!membership) {
      return null; // User not in a guild
    }

    const xpToAdd = XP_VALUES[action] * multiplier;

    // Update member XP
    const updatedMember = await db.guildMember.update({
      where: { id: membership.id },
      data: {
        xpEarned: {
          increment: xpToAdd,
        },
      },
    });

    // Update guild total XP
    const oldGuildXP = membership.guild.totalXP;
    const newGuildXP = oldGuildXP + xpToAdd;
    
    // Calculate level (1000 XP per level)
    const oldLevel = membership.guild.level;
    const newLevel = Math.floor(newGuildXP / 1000) + 1;
    const levelUp = newLevel > oldLevel;

    await db.guild.update({
      where: { id: membership.guildId },
      data: {
        totalXP: newGuildXP,
        level: newLevel,
      },
    });

    // If level up, create notification for all members
    if (levelUp) {
      const allMembers = await db.guildMember.findMany({
        where: { guildId: membership.guildId },
        select: { userId: true },
      });

      await db.notification.createMany({
        data: allMembers.map(m => ({
          userId: m.userId,
          type: 'plan_approved', // TODO: Add guild_level_up type
          title: `🎉 ${membership.guild.name} Seviye Atladı!`,
          body: `Loncanız ${newLevel}. seviyeye ulaştı! Tebrikler!`,
        })),
      });
    }

    return {
      memberXP: updatedMember.xpEarned,
      guildXP: newGuildXP,
      levelUp,
    };
  } catch (error) {
    console.error('Add guild XP error:', error);
    return null;
  }
}

/**
 * Get guild XP leaderboard
 */
export async function getGuildLeaderboard(limit: number = 10) {
  return await db.guild.findMany({
    orderBy: { totalXP: 'desc' },
    take: limit,
    include: {
      leader: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: { members: true },
      },
    },
  });
}

/**
 * Get member XP leaderboard within a guild
 */
export async function getGuildMemberLeaderboard(guildId: string, limit: number = 10) {
  return await db.guildMember.findMany({
    where: { guildId },
    orderBy: { xpEarned: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          level: true,
        },
      },
    },
  });
}
