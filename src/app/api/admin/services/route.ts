import { NextRequest, NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const services = await db.serviceSeries.findMany({
      orderBy: { order: 'asc' },
      include: {
        subservices: {
          orderBy: { order: 'asc' },
        },
      },
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching admin services:', error)
    return apiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, slug, icon, tagline, description, seoTitle, seoDescription, seoKeywords } = body

    if (!name || !slug || !icon || !tagline || !description) {
      return NextResponse.json(
        { error: 'Name, slug, icon, tagline, and description are required' },
        { status: 400 }
      )
    }

    const service = await db.serviceSeries.create({
      data: {
        name,
        slug,
        icon,
        tagline,
        description,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return apiError(error)
  }
}
