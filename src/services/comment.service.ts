import { db } from '@/lib/db'
import { sanitizeText } from '@/lib/sanitize'
import { CommentInput } from '@/validations/plan.schema'

export class CommentService {
  static async createComment(userId: string, data: CommentInput) {
    const { body, targetType, targetId } = data

    // Sanitize body
    const sanitizedBody = sanitizeText(body)

    // Create comment
    const comment = await db.comment.create({
      data: {
        authorId: userId,
        targetType,
        targetId,
        body: sanitizedBody,
        status: 'visible', // Auto-approve for now
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Increment comment count
    if (targetType === 'plan') {
      await db.plan.update({
        where: { id: targetId },
        data: { commentsCount: { increment: 1 } },
      })
    }

    return comment
  }

  static async getComments(targetType: string, targetId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where: {
          targetType: targetType as any,
          targetId,
          status: 'visible',
        },
        skip,
        take: limit,
        include: {
          author: {
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
      db.comment.count({
        where: {
          targetType: targetType as any,
          targetId,
          status: 'visible',
        },
      }),
    ])

    return {
      items: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw new Error('Yorum bulunamadı')
    }

    if (comment.authorId !== userId) {
      throw new Error('Bu yorumu silme yetkiniz yok')
    }

    await db.comment.delete({
      where: { id: commentId },
    })

    // Decrement comment count
    if (comment.targetType === 'plan') {
      await db.plan.update({
        where: { id: comment.targetId },
        data: { commentsCount: { decrement: 1 } },
      })
    }

    return { success: true }
  }
}
