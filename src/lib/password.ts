import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto'

const HASH_PREFIX = 'pbkdf2-sha256'
const ITERATIONS = 310000
const KEY_LENGTH = 32
const DIGEST = 'sha256'

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url')
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('base64url')

  return `${HASH_PREFIX}$${ITERATIONS}$${salt}$${hash}`
}

export function isPasswordHash(value: string) {
  return value.startsWith(`${HASH_PREFIX}$`)
}

export function verifyPassword(password: string, storedPassword: string) {
  if (!isPasswordHash(storedPassword)) {
    return password === storedPassword
  }

  const [prefix, iterationsValue, salt, expectedHash] = storedPassword.split('$')
  const iterations = Number(iterationsValue)

  if (prefix !== HASH_PREFIX || !Number.isInteger(iterations) || !salt || !expectedHash) {
    return false
  }

  const actual = Buffer.from(
    pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString('base64url')
  )
  const expected = Buffer.from(expectedHash)

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
