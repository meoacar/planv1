// Rate Limits
export const RATE_LIMITS = {
  REGISTER: { limit: 5, window: 900 }, // 5 attempts per 15 min
  LOGIN: { limit: 5, window: 900 }, // 5 attempts per 15 min
  CREATE_PLAN: { limit: 10, window: 3600 }, // 10 plans per hour
  CREATE_COMMENT: { limit: 20, window: 3600 }, // 20 comments per hour
  LIKE: { limit: 30, window: 60 }, // 30 likes per minute
  FOLLOW: { limit: 20, window: 3600 }, // 20 follows per hour
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

// Plan
export const PLAN = {
  MIN_DURATION: 1,
  MAX_DURATION: 365,
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 2000,
} as const

// Weight
export const WEIGHT = {
  MIN: 30,
  MAX: 300,
} as const

// Height
export const HEIGHT = {
  MIN: 100,
  MAX: 250,
} as const

// Comment
export const COMMENT = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 1000,
} as const

// User
export const USER = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
  MAX_BIO_LENGTH: 500,
} as const

// Cache TTL (seconds)
export const CACHE_TTL = {
  PLANS_LIST: 60, // 1 minute
  PLAN_DETAIL: 300, // 5 minutes
  USER_PROFILE: 300, // 5 minutes
  STATS: 600, // 10 minutes
} as const

// Roles
export const ROLES = {
  USER: 'USER',
  STAFF: 'STAFF',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
} as const

// Plan Status
export const PLAN_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
} as const

// Difficulty
export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  PLAN_APPROVED: 'plan_approved',
  PLAN_REJECTED: 'plan_rejected',
} as const
