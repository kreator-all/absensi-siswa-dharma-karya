import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    // Get full user data
    const fullUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        class: true,
        nis: true,
        faceDescriptor: true,
        fingerprintId: true,
        isActive: true,
        createdAt: true,
      }
    })

    if (!fullUser) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        ...fullUser,
        hasFaceRegistered: !!fullUser.faceDescriptor,
        hasFingerprintRegistered: !!fullUser.fingerprintId
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
