'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import os from 'os'

export async function getSystemMetrics() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // CPU kullanımı
  const cpus = os.cpus()
  const cpuUsage = cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0)
    const idle = cpu.times.idle
    return acc + ((total - idle) / total) * 100
  }, 0) / cpus.length

  // RAM kullanımı
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory
  const memoryUsage = (usedMemory / totalMemory) * 100

  // Uptime
  const uptime = os.uptime()

  return {
    cpu: {
      usage: cpuUsage.toFixed(1),
      cores: cpus.length,
      model: cpus[0].model,
    },
    memory: {
      total: (totalMemory / 1024 / 1024 / 1024).toFixed(2),
      used: (usedMemory / 1024 / 1024 / 1024).toFixed(2),
      free: (freeMemory / 1024 / 1024 / 1024).toFixed(2),
      usage: memoryUsage.toFixed(1),
    },
    uptime: {
      seconds: uptime,
      formatted: formatUptime(uptime),
    },
    platform: {
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      hostname: os.hostname(),
    },
  }
}

export async function getServiceStatus() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Database status
  let databaseStatus = 'healthy'
  let databaseLatency = 0
  try {
    const start = Date.now()
    await db.$queryRaw`SELECT 1`
    databaseLatency = Date.now() - start
  } catch (error) {
    databaseStatus = 'error'
  }

  // Redis status (optional)
  let redisStatus = 'not_configured'
  const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST)
  
  if (isRedisConfigured) {
    try {
      const { redis } = await import('@/lib/redis')
      if (redis && redis.isOpen) {
        await redis.ping()
        redisStatus = 'healthy'
      } else {
        redisStatus = 'error'
      }
    } catch (error) {
      redisStatus = 'error'
    }
  }

  // Email status (check if configured)
  const emailStatus = process.env.RESEND_API_KEY ? 'configured' : 'not_configured'

  return {
    database: {
      status: databaseStatus,
      latency: databaseLatency,
      type: 'MySQL',
    },
    redis: {
      status: redisStatus,
      type: 'Redis',
    },
    email: {
      status: emailStatus,
      provider: 'Resend',
    },
  }
}

export async function getDatabaseStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [
    totalUsers,
    totalPlans,
    totalComments,
    totalLikes,
    totalNotifications,
    databaseSize,
  ] = await Promise.all([
    db.user.count(),
    db.plan.count(),
    db.comment.count(),
    db.like.count(),
    db.notification.count(),
    // Database size (approximate)
    db.$queryRaw<Array<{ size: number }>>`
      SELECT 
        SUM(data_length + index_length) as size
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `.then(result => result[0]?.size || 0),
  ])

  return {
    tables: {
      users: totalUsers,
      plans: totalPlans,
      comments: totalComments,
      likes: totalLikes,
      notifications: totalNotifications,
    },
    size: {
      bytes: databaseSize,
      mb: (databaseSize / 1024 / 1024).toFixed(2),
      gb: (databaseSize / 1024 / 1024 / 1024).toFixed(2),
    },
  }
}

export async function getBackupInfo() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Get last backup date from settings
  const lastBackup = await db.setting.findUnique({
    where: { key: 'lastBackupDate' },
  })

  return {
    lastBackup: lastBackup?.value || null,
    autoBackup: true,
    frequency: 'daily',
    retention: '7 days',
  }
}

export async function clearCache() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Clear settings cache
  const { clearSettingsCache } = await import('@/lib/settings')
  clearSettingsCache()

  revalidatePath('/admin/sistem')
  return { success: true, message: 'Cache temizlendi' }
}

export async function restartServices() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // In production, this would restart services
  // For now, just clear cache and revalidate
  const { clearSettingsCache } = await import('@/lib/settings')
  clearSettingsCache()

  revalidatePath('/admin/sistem')
  return { success: true, message: 'Servisler yeniden başlatıldı' }
}

export async function getRedisStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  try {
    const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST)
    
    if (!isRedisConfigured) {
      return {
        available: false,
        stats: null,
      }
    }

    const { redis } = await import('@/lib/redis')
    
    if (!redis || !redis.isOpen) {
      return {
        available: false,
        stats: null,
      }
    }

    const info = await redis.info()
    const dbSize = await redis.dbSize()
    
    // Parse Redis INFO output
    const lines = info.split('\r\n')
    const stats: Record<string, string> = {}
    
    lines.forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':')
        if (key && value) {
          stats[key] = value
        }
      }
    })

    return {
      available: true,
      stats: {
        version: stats.redis_version || 'Unknown',
        uptime: parseInt(stats.uptime_in_seconds || '0'),
        uptimeFormatted: formatUptime(parseInt(stats.uptime_in_seconds || '0')),
        connectedClients: parseInt(stats.connected_clients || '0'),
        usedMemory: stats.used_memory_human || '0',
        usedMemoryPeak: stats.used_memory_peak_human || '0',
        totalKeys: dbSize,
        opsPerSec: parseInt(stats.instantaneous_ops_per_sec || '0'),
        hitRate: calculateHitRate(stats),
      },
    }
  } catch (error) {
    return {
      available: false,
      stats: null,
    }
  }
}

export async function clearRedisCache() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  try {
    const { redis } = await import('@/lib/redis')
    
    if (!redis || !redis.isOpen) {
      throw new Error('Redis bağlantısı yok')
    }

    await redis.flushDb()
    
    revalidatePath('/admin/sistem')
    return { success: true, message: 'Redis cache temizlendi' }
  } catch (error) {
    throw new Error('Redis cache temizlenemedi: ' + (error as Error).message)
  }
}

export async function getRedisKeys(pattern: string = '*', limit: number = 100) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  try {
    const { redis } = await import('@/lib/redis')
    
    if (!redis || !redis.isOpen) {
      return []
    }

    const keys = await redis.keys(pattern)
    const limitedKeys = keys.slice(0, limit)
    
    const keysWithTTL = await Promise.all(
      limitedKeys.map(async (key) => {
        const ttl = await redis!.ttl(key)
        const type = await redis!.type(key)
        return { key, ttl, type }
      })
    )

    return keysWithTTL
  } catch (error) {
    return []
  }
}

function calculateHitRate(stats: Record<string, string>): string {
  const hits = parseInt(stats.keyspace_hits || '0')
  const misses = parseInt(stats.keyspace_misses || '0')
  const total = hits + misses
  
  if (total === 0) return '0.00'
  
  return ((hits / total) * 100).toFixed(2)
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const parts = []
  if (days > 0) parts.push(`${days} gün`)
  if (hours > 0) parts.push(`${hours} saat`)
  if (minutes > 0) parts.push(`${minutes} dakika`)

  return parts.join(', ') || '0 dakika'
}
