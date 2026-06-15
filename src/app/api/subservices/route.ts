import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

function parseList(value: string | null | undefined): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return value.split('\n').map((item) => item.trim()).filter(Boolean)
  }
}

function parseProcess(value: string | null | undefined): { title: string; desc: string }[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseSubservice<T extends {
  features: string
  benefits: string
  process: string
  documents: string
}>(subservice: T) {
  return {
    ...subservice,
    features: parseList(subservice.features),
    benefits: parseList(subservice.benefits),
    process: parseProcess(subservice.process),
    documents: parseList(subservice.documents),
  }
}

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

      return NextResponse.json(parseSubservice(subservice))
    }

    // Get all subservices
    const subservices = await db.subService.findMany({
      where: { isActive: true },
      include: { series: true },
      orderBy: [{ series: { order: 'asc' } }, { order: 'asc' }],
    })

    const parsed = subservices.map(parseSubservice)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Subservices API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
