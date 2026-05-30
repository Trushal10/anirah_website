import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const team = await db.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(team)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}
