import { createClient } from 'redis'

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined
  isRedisAvailable: boolean
}

// Check if Redis is configured
const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST)

// Only create client if Redis is configured
let redis: ReturnType<typeof createClient> | null = null

if (isRedisConfigured) {
  const redisConfig = process.env.REDIS_URL 
    ? { url: process.env.REDIS_URL }
    : {
        socket: {
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          connectTimeout: 5000, // 5 second timeout
        },
        password: process.env.REDIS_PASSWORD || undefined,
      }

  redis = globalForRedis.redis ?? createClient(redisConfig)

  if (!redis.isOpen && !globalForRedis.isRedisAvailable) {
    redis.connect()
      .then(() => {
        globalForRedis.isRedisAvailable = true
        console.log('✓ Redis connected')
      })
      .catch((err) => {
        console.warn('⚠ Redis not available - rate limiting disabled:', err.message)
        globalForRedis.isRedisAvailable = false
      })
  }

  if (process.env.NODE_ENV !== 'production') {
    globalForRedis.redis = redis
  }
} else {
  console.log('ℹ Redis not configured - rate limiting and cache disabled')
}

export { redis }

// Rate limiting helper (graceful fallback if Redis unavailable)
export async function rateLimit(
  key: string,
  limit: number,
  window: number // seconds
): Promise<{ success: boolean; remaining: number }> {
  try {
    // If Redis is not configured or not connected, allow all requests (fail open)
    if (!redis || !redis.isOpen) {
      return { success: true, remaining: limit }
    }

    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, window)
    }
    
    const remaining = Math.max(0, limit - current)
    
    return {
      success: current <= limit,
      remaining,
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // Fail open on Redis errors
    return { success: true, remaining: limit }
  }
}

// Cache helper (graceful fallback if Redis unavailable)
export async function cache<T>(
  key: string,
  ttl: number, // seconds
  fn: () => Promise<T>
): Promise<T> {
  try {
    // If Redis is not configured or not connected, skip cache
    if (!redis || !redis.isOpen) {
      return fn()
    }

    const cached = await redis.get(key)
    
    if (cached) {
      return JSON.parse(cached) as T
    }
    
    const result = await fn()
    await redis.setEx(key, ttl, JSON.stringify(result))
    
    return result
  } catch (error) {
    console.error('Cache error:', error)
    return fn()
  }
}
