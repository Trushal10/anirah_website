import { NextResponse } from 'next/server'
import { apiError } from '@/lib/api-error'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany()
    const kv: Record<string, string> = {}
    for (const s of settings) {
      kv[s.key] = s.value
    }
    return NextResponse.json(kv)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return apiError(error)
  }
}
