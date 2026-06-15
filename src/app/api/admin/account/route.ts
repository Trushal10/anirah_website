import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/password'

export async function GET() {
  try {
    const admin = await db.admin.findFirst()
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }
    return NextResponse.json({ email: admin.email, name: admin.name, role: admin.role })
  } catch (error) {
    console.error('Error fetching admin account:', error)
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, currentPassword, newPassword } = body

    // Get the first admin (single admin system)
    const admin = await db.admin.findFirst()
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    let emailUpdated = false
    let passwordUpdated = false

    // If changing email
    if (email && email !== admin.email) {
      await db.admin.update({
        where: { id: admin.id },
        data: { email },
      })
      emailUpdated = true
    }

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set new password' }, { status: 400 })
      }
      if (!verifyPassword(currentPassword, admin.password)) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
      }
      await db.admin.update({
        where: { id: admin.id },
        data: { password: hashPassword(newPassword) },
      })
      passwordUpdated = true
    }

    if (!emailUpdated && !passwordUpdated) {
      return NextResponse.json({ error: 'No changes specified' }, { status: 400 })
    }

    const messages: string[] = []
    if (emailUpdated) messages.push('Email updated')
    if (passwordUpdated) messages.push('Password updated')

    return NextResponse.json({ success: true, message: messages.join(' and ') + ' successfully' })
  } catch (error) {
    console.error('Error updating admin account:', error)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}
