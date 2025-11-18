'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function getStatistics() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [
    totalUsers,
    totalPlans,
    totalComments,
    totalLikes,
    totalRecipes,
    totalGuilds,
    totalGroups,
    totalBadges,
    totalShopItems,
    newUsersThisWeek,
    newPlansThisWeek,
    topPlans,
  ] = await Promise.all([
    db.user.count(),
    db.plan.count(),
    db.comment.count(),
    db.like.count(),
    db.recipe.count(),
    db.guild.count(),
    db.group.count(),
    db.badge.count(),
    db.shopItem.count(),
    db.user.count({ where: { createdAt: { gte: weekAgo } } }),
    db.plan.count({ where: { createdAt: { gte: weekAgo } } }),
    db.plan.findMany({
      take: 10,
      orderBy: { views: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    }),
  ])

  const allPlans = await db.plan.findMany({ select: { views: true } })
  const totalViews = allPlans.reduce((sum, plan) => sum + plan.views, 0)
  const totalEngagement = totalLikes + totalComments

  return {
    totalUsers,
    totalPlans,
    totalComments,
    totalLikes,
    totalRecipes,
    totalGuilds,
    totalGroups,
    totalBadges,
    totalShopItems,
    totalViews,
    totalEngagement,
    newUsersThisWeek,
    newPlansThisWeek,
    topPlans,
  }
}


export async function getUserStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [activeUsers, newUsersThisMonth, totalUsers, totalPlans, topUsers] = await Promise.all([
    db.user.count({ where: { updatedAt: { gte: sevenDaysAgo } } }),
    db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.user.count(),
    db.plan.count(),
    db.user.findMany({
      take: 10,
      include: {
        _count: { select: { plans: true } },
        plans: {
          select: { views: true, likesCount: true },
        },
      },
      orderBy: { plans: { _count: 'desc' } },
    }),
  ])

  const topUsersWithStats = topUsers.map(user => ({
    ...user,
    totalViews: user.plans.reduce((sum, plan) => sum + plan.views, 0),
    totalLikes: user.plans.reduce((sum, plan) => sum + plan.likesCount, 0),
  }))

  return {
    activeUsers,
    newUsersThisMonth,
    avgPlansPerUser: totalPlans / totalUsers,
    topUsers: topUsersWithStats,
  }
}

export async function getContentStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [publishedPlans, pendingPlans, plansByDifficulty, allPlans] = await Promise.all([
    db.plan.count({ where: { status: 'published' } }),
    db.plan.count({ where: { status: 'pending' } }),
    db.plan.groupBy({
      by: ['difficulty'],
      _count: true,
    }),
    db.plan.findMany({ select: { days: true } }),
  ])

  const avgPlanDuration = allPlans.length > 0
    ? Math.round(allPlans.reduce((sum, plan) => sum + plan.days.length, 0) / allPlans.length)
    : 0

  return {
    publishedPlans,
    pendingPlans,
    avgPlanDuration,
    plansByDifficulty,
  }
}

export async function getEngagementStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalLikes, totalComments, topEngagedPlans] = await Promise.all([
    db.like.count(),
    db.comment.count(),
    db.plan.findMany({
      take: 10,
      orderBy: { likesCount: 'desc' },
      include: {
        _count: { select: { comments: true } },
        author: {
          select: { id: true, name: true, username: true },
        },
      },
    }),
  ])

  return {
    totalLikes,
    totalComments,
    topEngagedPlans,
  }
}


export async function getRecipeStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [totalRecipes, publishedRecipes, newRecipesThisWeek, totalRecipeLikes, totalRecipeComments, topRecipes] = await Promise.all([
    db.recipe.count(),
    db.recipe.count({ where: { status: 'published' } }),
    db.recipe.count({ where: { createdAt: { gte: weekAgo } } }),
    db.recipeLike.count(),
    db.recipeComment.count(),
    db.recipe.findMany({
      take: 10,
      orderBy: { views: 'desc' },
      where: { status: 'published' },
      include: {
        author: { select: { name: true, username: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
  ])

  return {
    totalRecipes,
    publishedRecipes,
    newRecipesThisWeek,
    totalRecipeLikes,
    totalRecipeComments,
    topRecipes,
  }
}

export async function getGamificationStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [
    totalBadges,
    totalUserBadges,
    totalQuests,
    completedQuests,
    totalCoins,
    totalShopItems,
    totalPurchases,
    topBadges,
  ] = await Promise.all([
    db.badge.count(),
    db.userBadge.count(),
    db.dailyQuest.count(),
    db.userDailyQuest.count({ where: { completed: true } }),
    db.coinTransaction.aggregate({ _sum: { amount: true } }),
    db.shopItem.count(),
    db.userPurchase.count(),
    db.badge.findMany({
      take: 10,
      include: {
        _count: { select: { users: true } },
      },
      orderBy: {
        users: { _count: 'desc' },
      },
    }),
  ])

  return {
    totalBadges,
    totalUserBadges,
    totalQuests,
    completedQuests,
    totalCoins: totalCoins._sum.amount || 0,
    totalShopItems,
    totalPurchases,
    topBadges,
  }
}

export async function getGuildStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalGuilds, totalMembers, pendingRequests, topGuilds] = await Promise.all([
    db.guild.count(),
    db.guildMember.count(),
    db.guildJoinRequest.count({ where: { status: 'pending' } }),
    db.guild.findMany({
      take: 10,
      include: {
        _count: { select: { members: true } },
      },
      orderBy: {
        members: { _count: 'desc' },
      },
    }),
  ])

  return {
    totalGuilds,
    totalMembers,
    pendingRequests,
    topGuilds,
  }
}

export async function getGroupStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalGroups, totalGroupMembers, totalGroupPosts, pendingGroups, topGroups] = await Promise.all([
    db.group.count(),
    db.groupMember.count(),
    db.groupPost.count(),
    db.group.count({ where: { status: 'pending' } }),
    db.group.findMany({
      take: 10,
      include: {
        _count: { select: { members: true, posts: true } },
      },
      orderBy: {
        members: { _count: 'desc' },
      },
    }),
  ])

  return {
    totalGroups,
    totalGroupMembers,
    totalGroupPosts,
    pendingGroups,
    topGroups,
  }
}

export async function getMessagingStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [totalConversations, totalMessages, messagesThisWeek, activeConversations] = await Promise.all([
    db.conversation.count(),
    db.message.count(),
    db.message.count({ where: { createdAt: { gte: weekAgo } } }),
    db.conversation.count({ where: { lastMessageAt: { gte: weekAgo } } }),
  ])

  return {
    totalConversations,
    totalMessages,
    messagesThisWeek,
    activeConversations,
  }
}

export async function getSeasonStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalSeasons, activeSeasons, totalLeagues, totalBattlePasses, activeBattlePasses] = await Promise.all([
    db.season.count(),
    db.season.count({ where: { isActive: true } }),
    db.league.count(),
    db.battlePass.count(),
    db.userBattlePass.count({ where: { isPremium: true } }),
  ])

  return {
    totalSeasons,
    activeSeasons,
    totalLeagues,
    totalBattlePasses,
    activeBattlePasses,
  }
}

export async function getAppealStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalAppeals, pendingAppeals, approvedAppeals, rejectedAppeals] = await Promise.all([
    db.contentAppeal.count(),
    db.contentAppeal.count({ where: { status: 'pending' } }),
    db.contentAppeal.count({ where: { status: 'approved' } }),
    db.contentAppeal.count({ where: { status: 'rejected' } }),
  ])

  return {
    totalAppeals,
    pendingAppeals,
    approvedAppeals,
    rejectedAppeals,
  }
}

export async function getReferralStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalReferralCodes, totalReferrals, successfulReferrals] = await Promise.all([
    db.referralCode.count(),
    db.referral.count(),
    db.referral.count({ where: { status: 'completed' } }),
  ])

  // Get top referrers by counting their referrals
  const topReferrersData = await db.referral.groupBy({
    by: ['referrerId'],
    _count: { referrerId: true },
    orderBy: { _count: { referrerId: 'desc' } },
    take: 10,
  })

  // Get user details for top referrers
  const topReferrers = await Promise.all(
    topReferrersData.map(async (item) => {
      const user = await db.user.findUnique({
        where: { id: item.referrerId },
        select: { id: true, name: true, username: true, email: true },
      })
      return {
        ...user!,
        _count: { referrals: item._count.referrerId },
      }
    })
  )

  return {
    totalReferralCodes,
    totalReferrals,
    successfulReferrals,
    topReferrers,
  }
}
