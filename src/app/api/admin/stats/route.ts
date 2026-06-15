import { NextRequest, NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const stats = await db.stat.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return apiError(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Body must be an array of { id, value }' },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      body.map(({ id, value }: { id: string; value: number }) =>
        db.stat.update({
          where: { id },
          data: { value },
        })
      )
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error updating stats:', error)
    return apiError(error)
  }
}
