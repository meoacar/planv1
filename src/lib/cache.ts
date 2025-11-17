// src/lib/cache.ts

import { redis } from './redis';

// ====================================================
// CACHE TTL CONSTANTS (seconds)
// ====================================================

export const CACHE_TTL = {
  FEED: 5 * 60, // 5 dakika
  POPULAR: 60 * 60, // 1 saat
  DAILY_LIMIT: 24 * 60 * 60, // 24 saat
  AI_RESPONSE: 7 * 24 * 60 * 60, // 1 hafta
  STATS: 60 * 60, // 1 saat
  USER_CONFESSIONS: 10 * 60, // 10 dakika
} as const;

// ====================================================
// CACHE KEY PREFIXES
// ====================================================

export const CACHE_PREFIX = {
  FEED: 'confessions:feed:',
  POPULAR: 'confessions:popular',
  DAILY_LIMIT: 'confession:daily:',
  AI_RESPONSE: 'ai:response:',
  STATS: 'confessions:stats',
  USER_CONFESSIONS: 'confessions:user:',
  SPAM: 'confession:spam:',
} as const;

// ====================================================
// GENERIC CACHE FUNCTIONS
// ====================================================

/**
 * Cache'den veri getirir
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (!redis || !redis.isOpen) {
      return null;
    }

    const cached = await redis.get(key);

    if (!cached) {
      return null;
    }

    return JSON.parse(cached) as T;
  } catch (error) {
    console.error('Redis cache get error:', error);
    return null;
  }
}

/**
 * Cache'e veri kaydeder
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number
): Promise<void> {
  try {
    if (!redis || !redis.isOpen) {
      return;
    }

    await redis.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Redis cache set error:', error);
  }
}

/**
 * Cache'den veri siler
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    if (!redis || !redis.isOpen) {
      return;
    }

    await redis.del(key);
  } catch (error) {
    console.error('Redis cache delete error:', error);
  }
}

/**
 * Pattern'e göre cache'leri siler
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    if (!redis || !redis.isOpen) {
      return;
    }

    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`✓ Deleted ${keys.length} cache entries matching pattern: ${pattern}`);
    }
  } catch (error) {
    console.error('Redis cache delete pattern error:', error);
  }
}

/**
 * Cache'in var olup olmadığını kontrol eder
 */
export async function hasCache(key: string): Promise<boolean> {
  try {
    if (!redis || !redis.isOpen) {
      return false;
    }

    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Redis cache exists error:', error);
    return false;
  }
}

/**
 * Cache TTL'ini günceller
 */
export async function updateCacheTTL(key: string, ttl: number): Promise<void> {
  try {
    if (!redis || !redis.isOpen) {
      return;
    }

    await redis.expire(key, ttl);
  } catch (error) {
    console.error('Redis cache expire error:', error);
  }
}

// ====================================================
// CONFESSION-SPECIFIC CACHE FUNCTIONS
// ====================================================

/**
 * Feed cache key oluşturur
 */
export function getFeedCacheKey(
  category?: string,
  isPopular?: boolean,
  page: number = 1,
  limit: number = 20
): string {
  const parts: string[] = [CACHE_PREFIX.FEED];
  
  if (category) parts.push(`cat:${category}`);
  if (isPopular !== undefined) parts.push(`pop:${isPopular}`);
  parts.push(`p:${page}`);
  parts.push(`l:${limit}`);
  
  return parts.join(':');
}

/**
 * Feed cache'i getirir
 */
export async function getFeedCache<T>(
  category?: string,
  isPopular?: boolean,
  page: number = 1,
  limit: number = 20
): Promise<T | null> {
  const key = getFeedCacheKey(category, isPopular, page, limit);
  return getCache<T>(key);
}

/**
 * Feed cache'e kaydeder
 */
export async function setFeedCache<T>(
  data: T,
  category?: string,
  isPopular?: boolean,
  page: number = 1,
  limit: number = 20
): Promise<void> {
  const key = getFeedCacheKey(category, isPopular, page, limit);
  await setCache(key, data, CACHE_TTL.FEED);
}

/**
 * Tüm feed cache'lerini temizler
 */
export async function clearFeedCache(): Promise<void> {
  await deleteCachePattern(`${CACHE_PREFIX.FEED}*`);
}

/**
 * Popüler itiraflar cache'i getirir
 */
export async function getPopularCache<T>(): Promise<T | null> {
  return getCache<T>(CACHE_PREFIX.POPULAR);
}

/**
 * Popüler itiraflar cache'e kaydeder
 */
export async function setPopularCache<T>(data: T): Promise<void> {
  await setCache(CACHE_PREFIX.POPULAR, data, CACHE_TTL.POPULAR);
}

/**
 * Popüler itiraflar cache'ini temizler
 */
export async function clearPopularCache(): Promise<void> {
  await deleteCache(CACHE_PREFIX.POPULAR);
}

/**
 * İstatistikler cache'i getirir
 */
export async function getStatsCache<T>(): Promise<T | null> {
  return getCache<T>(CACHE_PREFIX.STATS);
}

/**
 * İstatistikler cache'e kaydeder
 */
export async function setStatsCache<T>(data: T): Promise<void> {
  await setCache(CACHE_PREFIX.STATS, data, CACHE_TTL.STATS);
}

/**
 * İstatistikler cache'ini temizler
 */
export async function clearStatsCache(): Promise<void> {
  await deleteCache(CACHE_PREFIX.STATS);
}

/**
 * Kullanıcı itirafları cache key oluşturur
 */
export function getUserConfessionsCacheKey(
  userId: string,
  page: number = 1,
  limit: number = 20
): string {
  return `${CACHE_PREFIX.USER_CONFESSIONS}${userId}:p:${page}:l:${limit}`;
}

/**
 * Kullanıcı itirafları cache'i getirir
 */
export async function getUserConfessionsCache<T>(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<T | null> {
  const key = getUserConfessionsCacheKey(userId, page, limit);
  return getCache<T>(key);
}

/**
 * Kullanıcı itirafları cache'e kaydeder
 */
export async function setUserConfessionsCache<T>(
  userId: string,
  data: T,
  page: number = 1,
  limit: number = 20
): Promise<void> {
  const key = getUserConfessionsCacheKey(userId, page, limit);
  await setCache(key, data, CACHE_TTL.USER_CONFESSIONS);
}

/**
 * Kullanıcı itirafları cache'ini temizler
 */
export async function clearUserConfessionsCache(userId: string): Promise<void> {
  await deleteCachePattern(`${CACHE_PREFIX.USER_CONFESSIONS}${userId}*`);
}

/**
 * Günlük limit cache key oluşturur
 */
export function getDailyLimitCacheKey(userId: string): string {
  return `${CACHE_PREFIX.DAILY_LIMIT}${userId}`;
}

/**
 * Günlük limit cache'i getirir
 */
export async function getDailyLimitCache(userId: string): Promise<number | null> {
  try {
    if (!redis || !redis.isOpen) {
      return null;
    }

    const key = getDailyLimitCacheKey(userId);
    const count = await redis.get(key);
    
    return count ? parseInt(count) : null;
  } catch (error) {
    console.error('Redis daily limit cache get error:', error);
    return null;
  }
}

/**
 * Günlük limit cache'i artırır
 */
export async function incrementDailyLimitCache(userId: string): Promise<number> {
  try {
    if (!redis || !redis.isOpen) {
      return 0;
    }

    const key = getDailyLimitCacheKey(userId);
    const current = await redis.incr(key);
    
    // İlk itirafsa TTL ayarla (gece yarısına kadar)
    if (current === 1) {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const secondsUntilMidnight = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      await redis.expire(key, secondsUntilMidnight);
    }
    
    return current;
  } catch (error) {
    console.error('Redis daily limit cache increment error:', error);
    return 0;
  }
}

/**
 * Tüm confession cache'lerini temizler (admin fonksiyonu)
 */
export async function clearAllConfessionCaches(): Promise<void> {
  await Promise.all([
    clearFeedCache(),
    clearPopularCache(),
    clearStatsCache(),
  ]);
  
  console.log('✓ All confession caches cleared');
}

// ====================================================
// CACHE WARMING (Optional)
// ====================================================

/**
 * Cache'i önceden doldurur (warm-up)
 * Uygulama başlangıcında veya cache temizlendikten sonra çağrılabilir
 */
export async function warmupConfessionCaches(): Promise<void> {
  console.log('🔥 Warming up confession caches...');
  
  try {
    // Bu fonksiyon isteğe bağlı olarak implement edilebilir
    // Örneğin: Popüler itirafları ve ilk sayfa feed'i önceden cache'e alabilir
    
    console.log('✓ Confession caches warmed up');
  } catch (error) {
    console.error('❌ Error warming up caches:', error);
  }
}

// ====================================================
// EXPORTS
// ====================================================

export default {
  // Generic
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern,
  hasCache,
  updateCacheTTL,
  
  // Feed
  getFeedCache,
  setFeedCache,
  clearFeedCache,
  
  // Popular
  getPopularCache,
  setPopularCache,
  clearPopularCache,
  
  // Stats
  getStatsCache,
  setStatsCache,
  clearStatsCache,
  
  // User Confessions
  getUserConfessionsCache,
  setUserConfessionsCache,
  clearUserConfessionsCache,
  
  // Daily Limit
  getDailyLimitCache,
  incrementDailyLimitCache,
  
  // Utilities
  clearAllConfessionCaches,
  warmupConfessionCaches,
};
