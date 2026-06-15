import { NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const schemes = await db.scheme.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(schemes)
  } catch (error) {
    console.error('Error fetching schemes:', error)
    return apiError(error)
  }
}
