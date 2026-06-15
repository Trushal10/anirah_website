import bcrypt from 'bcryptjs'
import { pbkdf2Sync, timingSafeEqual } from 'crypto'

const LEGACY_HASH_PREFIX = 'pbkdf2-sha256'
const ITERATIONS = 310000
const KEY_LENGTH = 32
const DIGEST = 'sha256'
const BCRYPT_ROUNDS = 12

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, BCRYPT_ROUNDS)
}

export function isPasswordHash(value: string) {
  try {
    return bcrypt.getRounds(value) > 0
  } catch {
    return false
  }
}

export function verifyPassword(password: string, storedPassword: string) {
  if (isPasswordHash(storedPassword)) {
    return bcrypt.compareSync(password, storedPassword)
  }

  if (!storedPassword.startsWith(`${LEGACY_HASH_PREFIX}$`)) {
    return password === storedPassword
  }

  const [prefix, iterationsValue, salt, expectedHash] = storedPassword.split('$')
  const iterations = Number(iterationsValue)

  if (prefix !== LEGACY_HASH_PREFIX || !Number.isInteger(iterations) || !salt || !expectedHash) {
    return false
  }

  const actual = Buffer.from(
    pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST).toString('base64url')
  )
  const expected = Buffer.from(expectedHash)

  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
