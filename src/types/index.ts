import { User, Plan, Comment, WeightLog, ProgressPhoto, Notification, Recipe, RecipeComment } from '@prisma/client'

// Extended types with relations
export type PlanWithAuthor = Plan & {
  author: Pick<User, 'id' | 'name' | 'username' | 'image'>
  _count?: {
    likes: number
    comments: number
  }
}

export type RecipeWithAuthor = Recipe & {
  author: Pick<User, 'id' | 'name' | 'username' | 'image'>
  _count?: {
    likes: number
    comments: number
  }
}

export type RecipeCommentWithAuthor = RecipeComment & {
  author: Pick<User, 'id' | 'name' | 'username' | 'image'>
}

export type CommentWithAuthor = Comment & {
  author: Pick<User, 'id' | 'name' | 'username' | 'image'>
}

export type UserProfile = User & {
  _count?: {
    plans: number
    followers: number
    following: number
  }
}

// API Response types
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    page?: number
    total?: number
    totalPages?: number
  }
}

// Pagination
export type PaginationParams = {
  page?: number
  limit?: number
}

export type PaginatedResponse<T> = {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filters
export type PlanFilters = {
  search?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  duration?: 'short' | 'medium' | 'long' // 1-7, 8-30, 31+
  tags?: string[]
  authorId?: string
}

export type RecipeFilters = {
  search?: string
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'drink' | 'main' | 'side' | 'salad' | 'soup'
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  difficulty?: 'easy' | 'medium' | 'hard'
  maxCalories?: number
  authorId?: string
}

// Stats
export type UserStats = {
  totalPlans: number
  totalLikes: number
  totalComments: number
  followers: number
  following: number
  weightLoss?: number
}

export type AdminStats = {
  totalUsers: number
  totalPlans: number
  totalRecipes: number
  totalComments: number
  pendingPlans: number
  pendingRecipes: number
  pendingComments: number
  newUsersToday: number
  newPlansToday: number
  newRecipesToday: number
}
