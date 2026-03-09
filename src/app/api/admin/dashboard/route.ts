import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayDate } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const today = getTodayDate()

    // Get total students
    const totalStudents = await db.user.count({
      where: { role: 'student' }
    })

    // Get today's attendance stats
    const todayAttendances = await db.attendance.findMany({
      where: { date: today }
    })

    const presentToday = todayAttendances.filter(a => a.status === 'present' || a.status === 'late').length
    const absentToday = todayAttendances.filter(a => a.status === 'absent').length
    const lateToday = todayAttendances.filter(a => a.status === 'late').length

    // Get pending permissions
    const pendingPermissions = await db.permission.count({
      where: { status: 'pending' }
    })

    // Get recent attendances with user info
    const recentAttendances = await db.attendance.findMany({
      where: { date: today },
      include: {
        user: {
          select: {
            name: true,
            class: true
          }
        }
      },
      orderBy: { timeIn: 'desc' },
      take: 10
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        presentToday,
        absentToday,
        lateToday,
        pendingPermissions
      },
      recentAttendances
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
