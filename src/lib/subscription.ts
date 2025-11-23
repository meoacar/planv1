// Abonelik yönetimi fonksiyonları
import { db } from '@/lib/db'
import { PremiumType, SubscriptionStatus } from '@prisma/client'

export interface SubscriptionPlan {
  type: PremiumType
  name: string
  price: number
  duration: number // gün cinsinden
  features: string[]
}

export const SUBSCRIPTION_PLANS: Record<PremiumType, SubscriptionPlan> = {
  monthly: {
    type: 'monthly',
    name: 'Aylık Premium',
    price: 49.99,
    duration: 30,
    features: [
      '2x XP Kazancı',
      'Reklamsız Deneyim',
      'Özel Rozetler',
      'Öncelikli Destek',
      'Özel Profil Teması',
      'Gelişmiş İstatistikler'
    ]
  },
  yearly: {
    type: 'yearly',
    name: 'Yıllık Premium',
    price: 399.99,
    duration: 365,
    features: [
      '2x XP Kazancı',
      'Reklamsız Deneyim',
      'Özel Rozetler',
      'Öncelikli Destek',
      'Özel Profil Teması',
      'Gelişmiş İstatistikler',
      '%33 İndirim'
    ]
  },
  lifetime: {
    type: 'lifetime',
    name: 'Ömür Boyu Premium',
    price: 999.99,
    duration: 36500, // 100 yıl
    features: [
      '2x XP Kazancı',
      'Reklamsız Deneyim',
      'Özel Rozetler',
      'Öncelikli Destek',
      'Özel Profil Teması',
      'Gelişmiş İstatistikler',
      'Ömür Boyu Erişim'
    ]
  }
}

// Kullanıcının premium durumunu kontrol et
export async function checkUserPremiumStatus(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      isPremium: true,
      premiumUntil: true,
      premiumType: true
    }
  })

  if (!user) return { isPremium: false }

  // Premium süresi dolmuş mu kontrol et
  if (user.isPremium && user.premiumUntil) {
    if (new Date() > user.premiumUntil) {
      // Premium süresi dolmuş, güncelle
      await db.user.update({
        where: { id: userId },
        data: {
          isPremium: false,
          premiumType: null
        }
      })
      return { isPremium: false }
    }
  }

  return {
    isPremium: user.isPremium,
    premiumUntil: user.premiumUntil,
    premiumType: user.premiumType
  }
}

// Kullanıcıya premium ver
export async function grantPremium(
  userId: string,
  premiumType: PremiumType,
  subscriptionId?: string
) {
  const plan = SUBSCRIPTION_PLANS[premiumType]
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + plan.duration)

  await db.user.update({
    where: { id: userId },
    data: {
      isPremium: true,
      premiumUntil: endDate,
      premiumType: premiumType,
      xpBoostUntil: endDate // XP boost'u da aktif et
    }
  })

  // Abonelik kaydını güncelle
  if (subscriptionId) {
    await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'active',
        startDate,
        endDate
      }
    })
  }

  return { startDate, endDate }
}

// Premium'u iptal et
export async function cancelPremium(userId: string) {
  const subscription = await db.subscription.findFirst({
    where: {
      userId,
      status: 'active'
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (subscription) {
    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        autoRenew: false
      }
    })
  }

  // Premium'u hemen kaldırma, süre bitene kadar devam etsin
  return subscription
}

// Kullanıcının aktif aboneliğini getir
export async function getUserActiveSubscription(userId: string) {
  return await db.subscription.findFirst({
    where: {
      userId,
      status: 'active'
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Kullanıcının tüm aboneliklerini getir
export async function getUserSubscriptions(userId: string) {
  return await db.subscription.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      payments: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })
}

// XP kazancını hesapla (premium kullanıcılar için 2x)
export function calculateXP(baseXP: number, isPremium: boolean, hasXPBoost: boolean = false): number {
  let xp = baseXP
  
  if (isPremium || hasXPBoost) {
    xp *= 2
  }
  
  return Math.floor(xp)
}

// Premium özellikleri getir
export async function getPremiumFeatures() {
  return await db.premiumFeature.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  })
}
