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

    // Get current month stats
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    const monthAttendances = await db.attendance.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfMonth
        }
      }
    })

    // Calculate stats
    const stats = {
      totalDays: monthAttendances.length,
      present: monthAttendances.filter(a => a.status === 'present').length,
      absent: monthAttendances.filter(a => a.status === 'absent').length,
      late: monthAttendances.filter(a => a.status === 'late').length,
      permission: monthAttendances.filter(a => a.status === 'permission' || a.status === 'sick').length
    }

    return NextResponse.json({
      success: true,
      stats,
      todayAttendance
    })
  } catch (error) {
    console.error('Attendance stats error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
