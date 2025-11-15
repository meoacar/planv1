import { db } from '@/lib/db'
import { WeightLogInput, ProgressPhotoInput } from '@/validations/tracking.schema'

export class TrackingService {
  static async createWeightLog(userId: string, data: WeightLogInput) {
    const { weight, date, note } = data

    const log = await db.weightLog.create({
      data: {
        userId,
        weight,
        date: date || new Date(),
        note,
      },
    })

    // Update user's current weight
    await db.user.update({
      where: { id: userId },
      data: { currentWeight: weight },
    })

    return log
  }

  static async getWeightLogs(userId: string, limit = 30) {
    return db.weightLog.findMany({
      where: { userId },
      take: limit,
      orderBy: { date: 'desc' },
    })
  }

  static async getWeightStats(userId: string) {
    const logs = await db.weightLog.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      take: 100,
    })

    if (logs.length === 0) {
      return null
    }

    const firstLog = logs[0]
    const lastLog = logs[logs.length - 1]
    const totalLoss = firstLog.weight - lastLog.weight

    return {
      currentWeight: lastLog.weight,
      startWeight: firstLog.weight,
      totalLoss,
      logsCount: logs.length,
      logs: logs.slice(-30), // Last 30 days
    }
  }

  static async createProgressPhoto(userId: string, data: ProgressPhotoInput) {
    const { photoUrl, weight, type, caption } = data

    return db.progressPhoto.create({
      data: {
        userId,
        photoUrl,
        weight,
        type,
        caption,
      },
    })
  }

  static async getProgressPhotos(userId: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit

    const [photos, total] = await Promise.all([
      db.progressPhoto.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.progressPhoto.count({ where: { userId } }),
    ])

    return {
      items: photos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async deleteProgressPhoto(photoId: string, userId: string) {
    const photo = await db.progressPhoto.findUnique({
      where: { id: photoId },
    })

    if (!photo) {
      throw new Error('Fotoğraf bulunamadı')
    }

    if (photo.userId !== userId) {
      throw new Error('Bu fotoğrafı silme yetkiniz yok')
    }

    await db.progressPhoto.delete({
      where: { id: photoId },
    })

    return { success: true }
  }
}
