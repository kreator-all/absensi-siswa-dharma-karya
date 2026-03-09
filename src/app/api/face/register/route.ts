import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const body = await request.json()
    const { descriptor } = body

    // In a real implementation, the descriptor would be an array of numbers
    // representing the face embedding from face-api.js
    // For demo purposes, we'll just store a placeholder

    const faceDescriptor = JSON.stringify(descriptor || [])

    await db.user.update({
      where: { id: user.id },
      data: { faceDescriptor }
    })

    return NextResponse.json({
      success: true,
      message: 'Wajah berhasil didaftarkan'
    })
  } catch (error) {
    console.error('Face register error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
