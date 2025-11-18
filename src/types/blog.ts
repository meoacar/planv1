// Blog API Response Types

export interface BlogPostListItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  coverImageAlt: string | null
  readingTime: number
  viewCount: number
  publishedAt: Date | null
  createdAt: Date
  category: {
    id: string
    name: string
    slug: string
    color: string | null
    icon: string | null
  }
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  commentsCount: number
}

export interface BlogPostListResponse {
  success: true
  data: BlogPostListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface BlogPostListFilters {
  category?: string
  tag?: string
  search?: string
  sort?: 'newest' | 'popular'
  page?: number
  limit?: number
}

export interface BlogPostDetail {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  coverImageAlt: string | null
  metaTitle: string | null
  metaDescription: string | null
  readingTime: number
  viewCount: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    slug: string
    color: string | null
    icon: string | null
  }
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  commentsCount: number
  relatedPosts: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    readingTime: number
    viewCount: number
    publishedAt: Date | null
    category: {
      id: string
      name: string
      slug: string
      color: string | null
    }
  }>
}

export interface BlogPostDetailResponse {
  success: true
  data: BlogPostDetail
}

export interface BlogErrorResponse {
  success: false
  error: {
    code: string
    message: string
  }
}

// Category Types
export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  order: number
  _count?: {
    posts: number
  }
}

export interface BlogCategoryListResponse {
  success: true
  data: BlogCategory[]
}

// Tag Types
export interface BlogTag {
  id: string
  name: string
  slug: string
  _count?: {
    posts: number
  }
}

export interface BlogTagListResponse {
  success: true
  data: BlogTag[]
}

// Featured Posts Types
export interface BlogFeaturedPostsResponse {
  success: true
  data: Array<{
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    coverImageAlt: string | null
    readingTime: number
    viewCount: number
    publishedAt: Date | null
    featuredOrder: number | null
    category: {
      id: string
      name: string
      slug: string
      color: string | null
      icon: string | null
    }
    author: {
      id: string
      name: string | null
      username: string | null
      image: string | null
    }
  }>
}

// Comment Types
export interface BlogComment {
  id: string
  content: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM'
  createdAt: Date
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
  }
}

export interface BlogCommentCreateResponse {
  success: true
  data: {
    comment: BlogComment
    message: string
  }
}

// Table of Contents Types
export interface TOCItem {
  id: string
  text: string
  level: number
}
