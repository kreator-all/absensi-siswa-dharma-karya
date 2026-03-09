import { db } from './db'
import bcrypt from 'bcrypt'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const key = new TextEncoder().encode(SECRET_KEY)

export interface UserPayload {
  id: string
  username: string
  role: string
  name: string
  class?: string | null
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Create JWT token
export async function createToken(payload: UserPayload): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token expires in 7 days
    .sign(key)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key)
    return payload as unknown as UserPayload
  } catch {
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

// Get current user from cookie
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  
  return verifyToken(token)
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// Authentication middleware for API routes
export async function authenticateRequest(request: NextRequest): Promise<UserPayload | NextResponse> {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) {
    return NextResponse.json(
      { error: 'Tidak terautentikasi' },
      { status: 401 }
    )
  }
  
  const user = await verifyToken(token)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Token tidak valid' },
      { status: 401 }
    )
  }
  
  return user
}

// Admin-only middleware
export async function requireAdmin(request: NextRequest): Promise<UserPayload | NextResponse> {
  const result = await authenticateRequest(request)
  
  if (result instanceof NextResponse) {
    return result
  }
  
  if (result.role !== 'admin') {
    return NextResponse.json(
      { error: 'Akses ditolak. Hanya admin yang dapat mengakses.' },
      { status: 403 }
    )
  }
  
  return result
}

// Get full user data from database
export async function getFullUser(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      class: true,
      nis: true,
      faceDescriptor: true,
      fingerprintId: true,
      isActive: true,
      createdAt: true,
    }
  })
}

// Rate limiting for login attempts (in-memory)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)
  
  if (attempts) {
    if (attempts.count >= MAX_ATTEMPTS) {
      const timePassed = now - attempts.lastAttempt
      if (timePassed < LOCKOUT_TIME) {
        return {
          allowed: false,
          remainingTime: Math.ceil((LOCKOUT_TIME - timePassed) / 1000)
        }
      }
      // Reset after lockout period
      loginAttempts.delete(identifier)
    }
  }
  
  return { allowed: true }
}

export function recordFailedAttempt(identifier: string) {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)
  
  if (attempts) {
    attempts.count++
    attempts.lastAttempt = now
  } else {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now })
  }
}

export function clearFailedAttempts(identifier: string) {
  loginAttempts.delete(identifier)
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of loginAttempts.entries()) {
    if (now - value.lastAttempt > LOCKOUT_TIME * 2) {
      loginAttempts.delete(key)
    }
  }
}, LOCKOUT_TIME)
