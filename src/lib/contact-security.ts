import { NextRequest } from 'next/server'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5

type RateLimitEntry = {
  count: number
  resetAt: number
}

const globalForRateLimit = globalThis as unknown as {
  contactRateLimits?: Map<string, RateLimitEntry>
}

const contactRateLimits =
  globalForRateLimit.contactRateLimits ?? new Map<string, RateLimitEntry>()

globalForRateLimit.contactRateLimits = contactRateLimits

export function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return (
    forwarded ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

export function checkRateLimit(key: string) {
  const now = Date.now()
  const existing = contactRateLimits.get(key)

  if (!existing || existing.resetAt <= now) {
    contactRateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { limited: false }
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return { limited: true, retryAfterMs: existing.resetAt - now }
  }

  existing.count += 1
  return { limited: false }
}

export function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 255
}

export function hasSpamSignals(message: string) {
  const urlMatches = message.match(/https?:\/\/|www\./gi) || []
  return urlMatches.length > 3
}

export async function verifyTurnstileToken(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    return {
      success: process.env.NODE_ENV !== 'production',
      error: process.env.NODE_ENV === 'production' ? 'Turnstile is not configured' : undefined,
    }
  }

  if (!token) {
    return { success: false, error: 'Please complete the security check' }
  }

  const formData = new FormData()
  formData.append('secret', secret)
  formData.append('response', token)
  if (ip && ip !== 'unknown') formData.append('remoteip', ip)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()

    return {
      success: data.success === true,
      error: data.success === true ? undefined : 'Security check failed. Please try again.',
    }
  } catch {
    return { success: false, error: 'Unable to verify security check. Please try again.' }
  }
}
