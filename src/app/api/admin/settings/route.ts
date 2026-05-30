import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching admin settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { settings } = body

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'settings must be an array of { key, value }' },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      settings.map(({ key, value }: { key: string; value: string }) =>
        db.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
