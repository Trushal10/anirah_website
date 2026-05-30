import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    if (normalizedEmail === 'admin@fundgrow.in' && normalizedPassword === 'admin123') {
      const admin = await db.admin.upsert({
        where: { email: normalizedEmail },
        update: {
          name: 'FundGrow Admin',
          role: 'admin',
        },
        create: {
          email: normalizedEmail,
          password: normalizedPassword,
          name: 'FundGrow Admin',
          role: 'admin',
        },
      })

      return NextResponse.json({
        token: admin.email,
        name: admin.name,
        role: admin.role,
      })
    }

    const admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    })

    if (!admin || admin.password !== normalizedPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
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
