import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const services = await db.serviceSeries.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        subservices: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}
