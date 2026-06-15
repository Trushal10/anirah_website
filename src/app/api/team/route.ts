import { NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
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
    return apiError(error)
  }
}
