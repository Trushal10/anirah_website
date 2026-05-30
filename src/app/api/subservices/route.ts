import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const subservice = await db.subService.findUnique({
        where: { slug },
        include: {
          series: true,
        },
      })

      if (!subservice) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }

      // Parse features JSON
      let features: string[] = []
      try {
        features = JSON.parse(subservice.features || '[]')
      } catch {
        features = subservice.features ? subservice.features.split('\n').filter(Boolean) : []
      }

      return NextResponse.json({
        ...subservice,
        features,
      })
    }

    // Get all subservices
    const subservices = await db.subService.findMany({
      where: { isActive: true },
      include: { series: true },
      orderBy: [{ series: { order: 'asc' } }, { order: 'asc' }],
    })

    const parsed = subservices.map((s) => {
      let features: string[] = []
      try {
        features = JSON.parse(s.features || '[]')
      } catch {
        features = s.features ? s.features.split('\n').filter(Boolean) : []
      }
      return { ...s, features }
    })

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Subservices API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
