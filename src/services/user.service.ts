import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { RegisterInput } from '@/validations/auth.schema'

export class UserService {
  static async createUser(data: RegisterInput) {
    const { email, password, username, name } = data

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('Bu email zaten kullanılıyor')
    }

    // Check username if provided
    if (username) {
      const existingUsername = await db.user.findUnique({
        where: { username },
      })

      if (existingUsername) {
        throw new Error('Bu kullanıcı adı zaten kullanılıyor')
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        username,
        name,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        createdAt: true,
      },
    })

    return user
  }

  static async getUserById(id: string) {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        currentWeight: true,
        targetWeight: true,
        height: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            plans: true,
            followers: true,
            following: true,
          },
        },
      },
    })
  }

  static async getUserByUsername(username: string) {
    return db.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        currentWeight: true,
        targetWeight: true,
        height: true,
        createdAt: true,
        _count: {
          select: {
            plans: true,
            followers: true,
            following: true,
          },
        },
      },
    })
  }

  static async updateProfile(userId: string, data: any) {
    return db.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        image: true,
        currentWeight: true,
        targetWeight: true,
        height: true,
      },
    })
  }

  static async followUser(userId: string, targetId: string) {
    // Check if already following
    const existing = await db.follow.findUnique({
      where: {
        userId_targetId: {
          userId,
          targetId,
        },
      },
    })

    if (existing) {
      throw new Error('Zaten takip ediyorsun')
    }

    return db.follow.create({
      data: {
        userId,
        targetId,
      },
    })
  }

  static async unfollowUser(userId: string, targetId: string) {
    return db.follow.delete({
      where: {
        userId_targetId: {
          userId,
          targetId,
        },
      },
    })
  }

  static async getFollowers(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit

    const [followers, total] = await Promise.all([
      db.follow.findMany({
        where: { targetId: userId },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.follow.count({ where: { targetId: userId } }),
    ])

    return {
      items: followers.map((f) => f.user),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getFollowing(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit

    const [following, total] = await Promise.all([
      db.follow.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          target: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.follow.count({ where: { userId } }),
    ])

    return {
      items: following.map((f) => f.target),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async isFollowing(userId: string, targetId: string) {
    const follow = await db.follow.findUnique({
      where: {
        userId_targetId: {
          userId,
          targetId,
        },
      },
    })

    return !!follow
  }
}
