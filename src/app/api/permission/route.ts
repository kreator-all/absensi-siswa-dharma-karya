import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const permissions = await db.permission.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      permissions
    })
  } catch (error) {
    console.error('Get permissions error:', error)
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
    const { type, reason, startDate, endDate, fileUrl } = body

    if (!type || !reason || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    if (!['sick', 'permission'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipe izin tidak valid' },
        { status: 400 }
      )
    }

    const permission = await db.permission.create({
      data: {
        userId: user.id,
        type,
        reason,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        fileUrl: fileUrl || null,
        status: 'pending'
      }
    })

    return NextResponse.json({
      success: true,
      permission
    })
  } catch (error) {
    console.error('Create permission error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
