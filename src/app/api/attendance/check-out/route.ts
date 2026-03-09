import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayDate } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const body = await request.json()
    const { verificationMethod } = body

    const today = getTodayDate()

    // Check if checked in today
    const existingAttendance = await db.attendance.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      }
    })

    if (!existingAttendance?.timeIn) {
      return NextResponse.json(
        { error: 'Anda belum melakukan absensi masuk hari ini' },
        { status: 400 }
      )
    }

    if (existingAttendance.timeOut) {
      return NextResponse.json(
        { error: 'Anda sudah melakukan absensi keluar hari ini' },
        { status: 400 }
      )
    }

    // Update attendance with check-out time
    const attendance = await db.attendance.update({
      where: {
        id: existingAttendance.id
      },
      data: {
        timeOut: new Date(),
        verificationMethod: verificationMethod || existingAttendance.verificationMethod
      }
    })

    return NextResponse.json({
      success: true,
      attendance: {
        id: attendance.id,
        date: attendance.date,
        timeIn: attendance.timeIn,
        timeOut: attendance.timeOut,
        status: attendance.status
      }
    })
  } catch (error) {
    console.error('Check-out error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
