import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      slug,
      description,
      seoTitle,
      seoDescription,
      seoKeywords,
      features,
      pricing,
      referenceLink,
      seriesId,
      benefits,
      process,
      documents,
      eligibility,
      registrationTime,
    } = body

    if (!name || !slug || !description || !seriesId) {
      return NextResponse.json(
        { error: 'Name, slug, description, and seriesId are required' },
        { status: 400 }
      )
    }

    const subservice = await db.subService.create({
      data: {
        name,
        slug,
        description,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        pricing: pricing || null,
        referenceLink: referenceLink || null,
        seriesId,
        benefits: benefits || '[]',
        process: process || '[]',
        documents: documents || '[]',
        eligibility: eligibility || '',
        registrationTime: registrationTime || null,
      },
    })

    return NextResponse.json(subservice, { status: 201 })
  } catch (error) {
    console.error('Error creating subservice:', error)
    return NextResponse.json({ error: 'Failed to create subservice' }, { status: 500 })
  }
}
