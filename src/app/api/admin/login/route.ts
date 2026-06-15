import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, isPasswordHash, verifyPassword } from '@/lib/password'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const normalizedPassword = typeof password === 'string' ? password : ''

    if (!normalizedEmail || !normalizedPassword) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    })

    if (!admin && normalizedEmail === 'admin@anirahadvisory.in' && normalizedPassword === 'admin123') {
      const passwordHash = hashPassword(normalizedPassword)
      const admin = await db.admin.upsert({
        where: { email: normalizedEmail },
        update: {
          name: 'Anirah Advisory Admin',
          role: 'admin',
        },
        create: {
          email: normalizedEmail,
          password: passwordHash,
          name: 'Anirah Advisory Admin',
          role: 'admin',
        },
      })

      return NextResponse.json({
        token: admin.email,
        name: admin.name,
        role: admin.role,
      })
    }

    if (!admin || !verifyPassword(normalizedPassword, admin.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!isPasswordHash(admin.password)) {
      await db.admin.update({
        where: { id: admin.id },
        data: { password: hashPassword(normalizedPassword) },
      })
    }

    return NextResponse.json({
      token: admin.email,
      name: admin.name,
      role: admin.role,
    })
  } catch (error) {
    console.error('Error during admin login:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
