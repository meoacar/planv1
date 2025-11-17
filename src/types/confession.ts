// Confession types - Prisma model'i oluşturulana kadar geçici type tanımları

export enum ConfessionCategory {
  night_attack = 'night_attack',
  special_occasion = 'special_occasion',
  stress_eating = 'stress_eating',
  social_pressure = 'social_pressure',
  no_regrets = 'no_regrets',
  seasonal = 'seasonal'
}

export enum AITone {
  empathetic = 'empathetic',
  humorous = 'humorous',
  motivational = 'motivational',
  realistic = 'realistic'
}

export enum ConfessionStatus {
  pending = 'pending',
  published = 'published',
  rejected = 'rejected',
  hidden = 'hidden'
}

export interface Confession {
  id: string
  userId: string
  content: string
  category: ConfessionCategory
  aiResponse: string | null
  aiTone: AITone | null
  telafiBudget: string | null
  empathyCount: number
  status: ConfessionStatus
  rejectionReason: string | null
  isPopular: boolean
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}

export interface User {
  id: string
  name: string | null
  username: string | null
  image: string | null
}

export interface ConfessionWithUser extends Confession {
  user: Pick<User, 'id' | 'name' | 'username' | 'image'>
  _count?: {
    empathies: number
    reports?: number
  }
  hasEmpathized?: boolean
}
