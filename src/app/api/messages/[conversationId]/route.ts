import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/messages/[conversationId] - Get messages in a conversation
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is participant
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { id: session.user.id }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Konuşma bulunamadı' }, { status: 404 })
    }

    // Get messages
    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Mark messages as read
    await db.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    const otherUser = conversation.participants.find(p => p.id !== session.user.id)

    return NextResponse.json({
      success: true,
      data: {
        conversation: {
          id: conversation.id,
          otherUser
        },
        messages
      }
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
