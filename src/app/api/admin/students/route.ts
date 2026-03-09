import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { validateUsername, validateName, validatePassword } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const students = await db.user.findMany({
      where: {
        role: 'student'
      },
      select: {
        id: true,
        username: true,
        name: true,
        class: true,
        nis: true,
        role: true,
        isActive: true,
        faceDescriptor: true,
        fingerprintId: true,
        createdAt: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Transform to include hasFaceRegistered and hasFingerprintRegistered
    const transformedStudents = students.map(s => ({
      ...s,
      hasFaceRegistered: !!s.faceDescriptor,
      hasFingerprintRegistered: !!s.fingerprintId,
      faceDescriptor: undefined
    }))

    return NextResponse.json({
      success: true,
      students: transformedStudents
    })
  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    
    if (user instanceof NextResponse) {
      return user
    }

    const body = await request.json()
    const { name, username, password, nis, class: className, role } = body

    // Validate inputs
    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      )
    }

    const usernameValidation = validateUsername(username)
    if (!usernameValidation.valid) {
      return NextResponse.json(
        { error: usernameValidation.error },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(', ') },
        { status: 400 }
      )
    }

    // Check if username exists
    const existingUser = await db.user.findUnique({
      where: { username: username.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create student
    const student = await db.user.create({
      data: {
        name: name.trim(),
        username: username.toLowerCase(),
        password: hashedPassword,
        nis: nis || null,
        class: className || null,
        role: role || 'student'
      }
    })

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        username: student.username,
        nis: student.nis,
        class: student.class
      }
    })
  } catch (error) {
    console.error('Create student error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
