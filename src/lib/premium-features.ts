import { db } from '@/lib/db'

// Premium özellik limitleri
export const LIMITS = {
  FREE: {
    PLANS_PER_MONTH: 3,
    PHOTOS_PER_MONTH: 10,
    RECIPES_PER_MONTH: 5,
  },
  PREMIUM: {
    PLANS_PER_MONTH: -1, // Sınırsız
    PHOTOS_PER_MONTH: -1, // Sınırsız
    RECIPES_PER_MONTH: -1, // Sınırsız
  }
}

// Kullanıcının premium durumunu kontrol et
export async function checkUserPremiumStatus(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      isPremium: true,
      premiumUntil: true,
      premiumType: true,
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
          premiumType: null,
        }
      })
      return { isPremium: false }
    }
  }

  return {
    isPremium: user.isPremium || false,
    premiumUntil: user.premiumUntil,
    premiumType: user.premiumType,
  }
}

// Plan oluşturma limitini kontrol et
export async function checkPlanLimit(userId: string): Promise<{ allowed: boolean; remaining: number; message?: string }> {
  const premiumStatus = await checkUserPremiumStatus(userId)
  
  if (premiumStatus.isPremium) {
    return { allowed: true, remaining: -1 } // Sınırsız
  }

  // Son 30 gün içinde oluşturulan planları say
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const planCount = await db.plan.count({
    where: {
      authorId: userId,
      createdAt: { gte: thirtyDaysAgo }
    }
  })

  const limit = LIMITS.FREE.PLANS_PER_MONTH
  const remaining = Math.max(0, limit - planCount)

  return {
    allowed: planCount < limit,
    remaining,
    message: planCount >= limit 
      ? `Ücretsiz üyelikte ayda ${limit} plan oluşturabilirsiniz. Premium'a geçin!` 
      : undefined
  }
}

// Fotoğraf yükleme limitini kontrol et
export async function checkPhotoLimit(userId: string): Promise<{ allowed: boolean; remaining: number; message?: string }> {
  const premiumStatus = await checkUserPremiumStatus(userId)
  
  if (premiumStatus.isPremium) {
    return { allowed: true, remaining: -1 } // Sınırsız
  }

  // Son 30 gün içinde yüklenen fotoğrafları say
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const photoCount = await db.progressPhoto.count({
    where: {
      userId: userId,
      createdAt: { gte: thirtyDaysAgo }
    }
  })

  const limit = LIMITS.FREE.PHOTOS_PER_MONTH
  const remaining = Math.max(0, limit - photoCount)

  return {
    allowed: photoCount < limit,
    remaining,
    message: photoCount >= limit 
      ? `Ücretsiz üyelikte ayda ${limit} fotoğraf yükleyebilirsiniz. Premium'a geçin!` 
      : undefined
  }
}

// Tarif oluşturma limitini kontrol et
export async function checkRecipeLimit(userId: string): Promise<{ allowed: boolean; remaining: number; message?: string }> {
  const premiumStatus = await checkUserPremiumStatus(userId)
  
  if (premiumStatus.isPremium) {
    return { allowed: true, remaining: -1 } // Sınırsız
  }

  // Son 30 gün içinde oluşturulan tarifleri say
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recipeCount = await db.recipe.count({
    where: {
      authorId: userId,
      createdAt: { gte: thirtyDaysAgo }
    }
  })

  const limit = LIMITS.FREE.RECIPES_PER_MONTH
  const remaining = Math.max(0, limit - recipeCount)

  return {
    allowed: recipeCount < limit,
    remaining,
    message: recipeCount >= limit 
      ? `Ücretsiz üyelikte ayda ${limit} tarif oluşturabilirsiniz. Premium'a geçin!` 
      : undefined
  }
}

// Reklam gösterilmeli mi kontrol et
export async function shouldShowAds(userId: string): Promise<boolean> {
  const premiumStatus = await checkUserPremiumStatus(userId)
  return !premiumStatus.isPremium
}

// Premium özelliklere erişim kontrolü
export async function hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
  const premiumStatus = await checkUserPremiumStatus(userId)
  
  if (!premiumStatus.isPremium) return false

  // Tüm premium özellikler
  const premiumFeatures = [
    'unlimited_plans',
    'unlimited_photos',
    'unlimited_recipes',
    'no_ads',
    'priority_support',
    'advanced_analytics',
    'ai_assistant',
    'custom_themes',
    'premium_badges',
    'exclusive_content'
  ]

  return premiumFeatures.includes(feature)
}
