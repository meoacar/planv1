import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/messages - Get user's conversations
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id
          }
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
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            body: true,
            senderId: true,
            read: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                receiverId: session.user.id,
                read: false
              }
            }
          }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    })

    // Format conversations
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.participants.find(p => p.id !== session.user.id)
      const lastMessage = conv.messages[0]
      
      return {
        id: conv.id,
        otherUser,
        lastMessage,
        unreadCount: conv._count.messages,
        lastMessageAt: conv.lastMessageAt
      }
    })

    return NextResponse.json({ success: true, data: formattedConversations })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/messages - Send a new message
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { receiverId, body } = await req.json()

    if (!receiverId || !body?.trim()) {
      return NextResponse.json({ error: 'Alıcı ve mesaj gerekli' }, { status: 400 })
    }

    if (receiverId === session.user.id) {
      return NextResponse.json({ error: 'Kendinize mesaj gönderemezsiniz' }, { status: 400 })
    }

    // Check if receiver exists
    const receiver = await db.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Find or create conversation
    let conversation = await db.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: session.user.id } } },
          { participants: { some: { id: receiverId } } }
        ]
      }
    })

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          participants: {
            connect: [
              { id: session.user.id },
              { id: receiverId }
            ]
          }
        }
      })
    }

    // Create message
    const message = await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.user.id,
        receiverId,
        body: body.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      }
    })

    // Update conversation lastMessageAt
    await db.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() }
    })

    // Create notification for receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        type: 'message',
        title: 'Yeni Mesaj',
        body: `${session.user.name || session.user.email} size mesaj gönderdi`
      }
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
