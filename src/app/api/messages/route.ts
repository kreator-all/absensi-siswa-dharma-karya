import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ]
      },
      include: {
        sender: {
          select: {
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      messages
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const body = await request.json()
    const { content, receiverId } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Find admin to send message to
    let actualReceiverId = receiverId
    if (receiverId === 'admin') {
      const admin = await db.user.findFirst({
        where: { role: 'admin' }
      })
      if (admin) {
        actualReceiverId = admin.id
      }
    }

    const message = await db.message.create({
      data: {
        senderId: user.id,
        receiverId: actualReceiverId,
        content: content.trim()
      }
    })

    return NextResponse.json({
      success: true,
      message
    })
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
