import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayDate } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const today = getTodayDate()

    // Get today's attendance
    const todayAttendance = await db.attendance.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      }
    })

    // Get attendance history (last 30 days)
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const history = await db.attendance.findMany({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      todayAttendance,
      history
    })
  } catch (error) {
    console.error('Attendance history error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
