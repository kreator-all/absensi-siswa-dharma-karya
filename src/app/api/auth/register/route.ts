import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'
import { validateCSRF, validateUsername, validatePassword, validateName, validateNIS, validateClass } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // Validate CSRF
    if (!validateCSRF(request)) {
      return NextResponse.json(
        { error: 'Permintaan tidak valid' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { username, password, name, nis, class: className, role } = body

    // Validate required fields
    if (!username || !password || !name) {
      return NextResponse.json(
        { error: 'Username, password, dan nama harus diisi' },
        { status: 400 }
      )
    }

    // Validate input
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

    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      )
    }

    if (nis) {
      const nisValidaton = validateNIS(nis)
      if (!nisValidaton.valid) {
        return NextResponse.json(
          { error: nisValidaton.error },
          { status: 400 }
        )
      }
    }

    if (className) {
      const classValidation = validateClass(className)
      if (!classValidation.valid) {
        return NextResponse.json(
          { error: classValidation.error },
          { status: 400 }
        )
      }
    }

    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { username: username.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username sudah digunakan' },
        { status: 400 }
      )
    }

    // Check if NIS already exists
    if (nis) {
      const existingNIS = await db.user.findUnique({
        where: { nis }
      })
      if (existingNIS) {
        return NextResponse.json(
          { error: 'NIS sudah terdaftar' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.user.create({
      data: {
        username: username.toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        nis: nis || null,
        class: className || null,
        role: role || 'student'
      }
    })

    // Create token
    const token = await createToken({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      class: user.class
    })

    // Set cookie
    await setAuthCookie(token)

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        class: user.class,
        nis: user.nis
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
