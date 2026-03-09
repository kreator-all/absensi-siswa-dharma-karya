import { NextRequest, NextResponse } from 'next/server'

// CSRF protection - validate origin and referer headers
export function validateCSRF(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')
  
  // Allow requests without origin/referer for same-origin requests
  if (!origin && !referer) {
    return true
  }
  
  // Check if origin matches host
  if (origin) {
    const originHost = origin.replace(/^https?:\/\//, '')
    if (originHost === host) {
      return true
    }
  }
  
  // Check if referer matches host
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      if (refererUrl.host === host) {
        return true
      }
    } catch {
      return false
    }
  }
  
  return false
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validate username format
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.length < 3) {
    return { valid: false, error: 'Username minimal 3 karakter' }
  }
  
  if (username.length > 50) {
    return { valid: false, error: 'Username maksimal 50 karakter' }
  }
  
  // Only alphanumeric and underscore
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username hanya boleh huruf, angka, dan underscore' }
  }
  
  return { valid: true }
}

// Validate password strength
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!password || password.length < 6) {
    errors.push('Password minimal 6 karakter')
  }
  
  if (password.length > 100) {
    errors.push('Password maksimal 100 karakter')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Validate name
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Nama minimal 2 karakter' }
  }
  
  if (name.length > 100) {
    return { valid: false, error: 'Nama maksimal 100 karakter' }
  }
  
  return { valid: true }
}

// Validate NIS (Nomor Induk Siswa)
export function validateNIS(nis: string): { valid: boolean; error?: string } {
  if (!nis) {
    return { valid: true } // NIS is optional
  }
  
  if (!/^\d{5,15}$/.test(nis)) {
    return { valid: false, error: 'NIS harus berisi 5-15 digit angka' }
  }
  
  return { valid: true }
}

// Validate class format
export function validateClass(className: string): { valid: boolean; error?: string } {
  if (!className) {
    return { valid: true } // Class is optional
  }
  
  if (className.length > 20) {
    return { valid: false, error: 'Format kelas maksimal 20 karakter' }
  }
  
  return { valid: true }
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// File upload validation
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Tipe file tidak diizinkan. Gunakan JPG, PNG, GIF, PDF, atau DOC/DOCX' 
    }
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: 'Ukuran file maksimal 5MB' 
    }
  }
  
  return { valid: true }
}

// Format date for display (Indonesian format)
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format time for display
export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Format datetime for display
export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get today's date at midnight for database queries
export function getTodayDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// Check if time is within school hours
export function isWithinSchoolHours(): { isWithin: boolean; status: string } {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const timeInMinutes = hours * 60 + minutes
  
  // School hours: 07:00 - 15:00
  const schoolStart = 7 * 60 // 07:00
  const schoolEnd = 15 * 60   // 15:00
  const lateThreshold = 7 * 60 + 30 // 07:30 - considered late after this
  
  if (timeInMinutes < schoolStart) {
    return { isWithin: false, status: 'too_early' }
  }
  
  if (timeInMinutes > schoolEnd) {
    return { isWithin: false, status: 'too_late' }
  }
  
  if (timeInMinutes > lateThreshold) {
    return { isWithin: true, status: 'late' }
  }
  
  return { isWithin: true, status: 'on_time' }
}
