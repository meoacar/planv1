import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { rateLimit } from '@/lib/redis'
import { blogCommentSchema } from '@/validations/blog.schema'
import type { BlogErrorResponse, BlogComment } from '@/types/blog'

// Spam kontrolü için sabitler
const SPAM_MAX_COMMENTS = 5 // 10 dakikada maksimum 5 yorum
const SPAM_WINDOW_SECONDS = 600 // 10 dakika
const DUPLICATE_CHECK_HOURS = 1 // Aynı içerik kontrolü için 1 saat

/**
 * Spam kontrolü yapar
 * - 10 dakikada 5'ten fazla yorum yapılamaz
 * - Aynı içerik 1 saat içinde tekrar gönderilemez
 */
async function checkSpam(
  userId: string,
  postId: string,
  content: string
): Promise<boolean> {
  try {
    // 1. Rate limiting kontrolü (10 dakikada 5 yorum)
    const rateLimitKey = `blog-comment:spam:${userId}`
    const { success } = await rateLimit(
      rateLimitKey,
      SPAM_MAX_COMMENTS,
      SPAM_WINDOW_SECONDS
    )

    if (!success) {
      console.log(`[Blog Comment Spam] Rate limit exceeded for user ${userId}`)
      return true // Spam tespit edildi
    }

    // 2. Aynı içerik kontrolü (son 1 saat)
    const oneHourAgo = new Date(
      Date.now() - DUPLICATE_CHECK_HOURS * 60 * 60 * 1000
    )
    const duplicateContent = await prisma.blogComment.findFirst({
      where: {
        userId,
        postId,
        content: content.trim(),
        createdAt: { gte: oneHourAgo },
      },
    })

    if (duplicateContent) {
      console.log(
        `[Blog Comment Spam] Duplicate content detected for user ${userId}`
      )
      return true // Aynı içerik tekrar gönderilmiş
    }

    // 3. Çok kısa sürede çok fazla yorum kontrolü (veritabanı bazlı)
    const recentComments = await prisma.blogComment.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - SPAM_WINDOW_SECONDS * 1000),
        },
      },
    })

    if (recentComments >= SPAM_MAX_COMMENTS) {
      console.log(
        `[Blog Comment Spam] Too many comments in short time for user ${userId}`
      )
      return true
    }

    return false // Spam değil
  } catch (error) {
    console.error('Error in checkSpam:', error)
    // Hata durumunda güvenli tarafta kal, spam olarak işaretle
    return true
  }
}

/**
 * Basit uygunsuz içerik kontrolü
 * Daha gelişmiş filtreleme için moderation.service.ts'deki fonksiyonlar kullanılabilir
 */
function containsInappropriateContent(content: string): boolean {
  const inappropriateWords = [
    'spam',
    'reklam',
    'link',
    'http://',
    'https://',
    'www.',
  ]

  const lowerContent = content.toLowerCase()
  return inappropriateWords.some((word) => lowerContent.includes(word))
}

// GET /api/blog/[slug]/comments - Yorumları getir
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<{ success: true; data: BlogComment[] } | BlogErrorResponse>> {
  try {
    const { slug } = params

    // Blog post kontrolü
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })

    if (!post) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'BLOG_POST_NOT_FOUND',
          message: 'Blog yazısı bulunamadı',
        },
      }
      return NextResponse.json(errorResponse, { status: 404 })
    }

    // Sadece onaylanmış yorumları getir
    const comments = await prisma.blogComment.findMany({
      where: {
        postId: post.id,
        status: 'APPROVED',
      },
      select: {
        id: true,
        content: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: comments,
    })
  } catch (error: any) {
    console.error('Get blog comments error:', error)

    const errorResponse: BlogErrorResponse = {
      success: false,
      error: {
        code: 'GET_COMMENTS_ERROR',
        message: error.message || 'Yorumlar yüklenirken hata oluştu',
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// POST /api/blog/[slug]/comments - Yorum ekle
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<{ success: true; data: any } | BlogErrorResponse>> {
  try {
    // 1. Auth kontrolü
    const session = await auth()

    if (!session?.user?.id) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Yorum yapmak için giriş yapmalısınız',
        },
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }

    // 2. Kullanıcı ban kontrolü
    if (session.user.isBanned) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'USER_BANNED',
          message: 'Hesabınız yasaklandığı için yorum yapamazsınız',
        },
      }
      return NextResponse.json(errorResponse, { status: 403 })
    }

    // 3. Blog post kontrolü
    const { slug } = params
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })

    if (!post) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'BLOG_POST_NOT_FOUND',
          message: 'Blog yazısı bulunamadı',
        },
      }
      return NextResponse.json(errorResponse, { status: 404 })
    }

    // 4. Request body parse ve validate
    const body = await req.json()
    const validation = blogCommentSchema.safeParse(body)

    if (!validation.success) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error.errors[0]?.message || 'Geçersiz veri',
        },
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    const { content } = validation.data

    // 5. Rate limiting
    const rateLimitKey = `blog-comment:${session.user.id}`
    const { success: rateLimitSuccess } = await rateLimit(
      rateLimitKey,
      20,
      3600
    ) // 20 yorum / saat

    if (!rateLimitSuccess) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Çok fazla yorum yaptınız. Lütfen daha sonra tekrar deneyin',
        },
      }
      return NextResponse.json(errorResponse, { status: 429 })
    }

    // 6. Spam kontrolü
    const isSpam = await checkSpam(session.user.id, post.id, content)

    if (isSpam) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'SPAM_DETECTED',
          message:
            'Spam tespit edildi. Lütfen daha sonra tekrar deneyin veya farklı bir yorum yazın',
        },
      }
      return NextResponse.json(errorResponse, { status: 429 })
    }

    // 7. Uygunsuz içerik kontrolü
    if (containsInappropriateContent(content)) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'INAPPROPRIATE_CONTENT',
          message:
            'Yorumunuz uygunsuz içerik içeriyor. Lütfen düzenleyip tekrar deneyin',
        },
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // 8. Yorum oluştur (moderasyon için PENDING durumunda)
    const comment = await prisma.blogComment.create({
      data: {
        content,
        postId: post.id,
        userId: session.user.id,
        status: 'PENDING', // Admin onayı bekliyor
      },
      select: {
        id: true,
        content: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        comment,
        message:
          'Yorumunuz başarıyla gönderildi. Onaylandıktan sonra yayınlanacaktır',
      },
    })
  } catch (error: any) {
    console.error('Create blog comment error:', error)

    const errorResponse: BlogErrorResponse = {
      success: false,
      error: {
        code: 'CREATE_COMMENT_ERROR',
        message: error.message || 'Yorum eklenirken hata oluştu',
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
