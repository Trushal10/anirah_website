import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const team = await db.teamMember.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(team)
  } catch (error) {
    console.error('Error fetching admin team members:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, role, bio, avatarUrl, linkedin } = body

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Name and role are required' },
        { status: 400 }
      )
    }

    const member = await db.teamMember.create({
      data: {
        name,
        role,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        linkedin: linkedin || null,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
