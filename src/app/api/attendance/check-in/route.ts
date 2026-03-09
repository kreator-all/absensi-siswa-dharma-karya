import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayDate, isWithinSchoolHours } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const body = await request.json()
    const { verificationMethod } = body

    const today = getTodayDate()

    // Check if already checked in today
    const existingAttendance = await db.attendance.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      }
    })

    if (existingAttendance?.timeIn) {
      return NextResponse.json(
        { error: 'Anda sudah melakukan absensi masuk hari ini' },
        { status: 400 }
      )
    }

    // Check school hours
    const schoolHours = isWithinSchoolHours()
    
    let status = 'present'
    if (schoolHours.status === 'late') {
      status = 'late'
    } else if (schoolHours.status === 'too_early' || schoolHours.status === 'too_late') {
      return NextResponse.json(
        { error: 'Di luar jam sekolah. Absensi tersedia pukul 07:00 - 15:00' },
        { status: 400 }
      )
    }

    // Create or update attendance
    const attendance = await db.attendance.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      },
      create: {
        userId: user.id,
        date: today,
        timeIn: new Date(),
        status,
        verificationMethod: verificationMethod || 'manual'
      },
      update: {
        timeIn: new Date(),
        status,
        verificationMethod: verificationMethod || 'manual'
      }
    })

    return NextResponse.json({
      success: true,
      attendance: {
        id: attendance.id,
        date: attendance.date,
        timeIn: attendance.timeIn,
        status: attendance.status
      }
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
