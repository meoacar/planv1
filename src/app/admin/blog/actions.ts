'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getBlogsForAdmin(
  status?: string,
  categoryId?: string,
  page: number = 1,
  search?: string
) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim')
  }

  const limit = 20
  const skip = (page - 1) * limit

  const where: any = {
    deletedAt: null,
  }

  if (status && status !== 'all') {
    where.status = status.toUpperCase()
  }

  if (categoryId && categoryId !== 'all') {
    where.categoryId = categoryId
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        category: true,
        blog_tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    }),
    db.blogPost.count({ where }),
  ])

  return { posts, total }
}

export async function getBlogCategories() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim')
  }

  const categories = await db.blogCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  return categories
}

export async function deleteBlogPost(postId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim')
  }

  // Get current post
  const post = await db.blogPost.findUnique({
    where: { id: postId },
    select: { slug: true },
  })

  if (!post) {
    throw new Error('Blog bulunamadı')
  }

  // Soft delete with slug modification to allow reuse
  const timestamp = Date.now()
  await db.blogPost.update({
    where: { id: postId },
    data: { 
      deletedAt: new Date(),
      slug: `${post.slug}-deleted-${timestamp}`, // Slug'ı değiştir
    },
  })

  revalidatePath('/admin/blog')
  revalidatePath('/blog')

  return { success: true }
}

export async function publishBlogPost(postId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim')
  }

  await db.blogPost.update({
    where: { id: postId },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  })

  revalidatePath('/admin/blog')
  revalidatePath('/blog')

  return { success: true }
}

export async function unpublishBlogPost(postId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim')
  }

  await db.blogPost.update({
    where: { id: postId },
    data: {
      status: 'DRAFT',
    },
  })

  revalidatePath('/admin/blog')
  revalidatePath('/blog')

  return { success: true }
}

export async function toggleFeaturedBlogPost(postId: string, featured: boolean) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim')
  }

  // Eğer featured yapılıyorsa, mevcut featured sayısını kontrol et
  if (featured) {
    const featuredCount = await db.blogPost.count({
      where: {
        featured: true,
        deletedAt: null,
      },
    })

    if (featuredCount >= 3) {
      throw new Error('Maksimum 3 yazı öne çıkarılabilir')
    }
  }

  await db.blogPost.update({
    where: { id: postId },
    data: {
      featured,
      featuredOrder: featured ? new Date().getTime() : null,
    },
  })

  revalidatePath('/admin/blog')
  revalidatePath('/blog')

  return { success: true }
}

export async function bulkPublishBlogPosts(postIds: string[]) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim')
  }

  await db.blogPost.updateMany({
    where: {
      id: { in: postIds },
    },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  })

  revalidatePath('/admin/blog')
  revalidatePath('/blog')

  return { success: true }
}

export async function bulkDeleteBlogPosts(postIds: string[]) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Yetkisiz erişim')
  }

  // Get posts to modify their slugs
  const posts = await db.blogPost.findMany({
    where: { id: { in: postIds } },
    select: { id: true, slug: true },
  })

  const timestamp = Date.now()

  // Update each post individually to modify slug
  await Promise.all(
    posts.map((post) =>
      db.blogPost.update({
        where: { id: post.id },
        data: {
          deletedAt: new Date(),
          slug: `${post.slug}-deleted-${timestamp}`,
        },
      })
    )
  )

  revalidatePath('/admin/blog')
  revalidatePath('/blog')

  return { success: true }
}
