import { NextResponse } from 'next/server'

export function apiError(error: unknown, status = 500) {
  console.error(error)

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
    },
    { status }
  )
}
