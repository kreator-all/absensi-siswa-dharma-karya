import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createToken, setAuthCookie, checkRateLimit, recordFailedAttempt, clearFailedAttempts } from '@/lib/auth'
import { validateCSRF, validateUsername, validatePassword } from '@/lib/security'

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
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
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

    // Check rate limit
    const rateLimit = checkRateLimit(username)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: `Terlalu banyak percobaan login. Coba lagi dalam ${rateLimit.remainingTime} detik.` 
        },
        { status: 429 }
      )
    }

    // Find user
    const user = await db.user.findUnique({
      where: { username: username.toLowerCase() }
    })

    if (!user) {
      recordFailedAttempt(username)
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Akun Anda tidak aktif. Hubungi administrator.' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    
    if (!isValidPassword) {
      recordFailedAttempt(username)
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(username)

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
        class: user.class
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
