import { readFileSync } from 'fs'
import { join } from 'path'
import { db } from '../src/lib/db'

type ServiceSeriesSeed = {
  name: string
  slug: string
  icon: string
  tagline: string
  description: string
  accentColor: string
  order: number
}

type SubServiceSeed = {
  name: string
  description: string
  features?: string[]
  pricing?: string
  benefits?: string[]
  process?: { title: string; desc: string }[]
  documents?: string[]
  eligibility?: string
  registrationTime?: string
}

function enrichSubServiceDescription(name: string, description: string, seriesName: string) {
  const plainText = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  if (description.includes('<p>') && plainText.length >= 220) {
    return description
  }

  const intro = description.includes('<')
    ? description
    : `<p>${description}</p>`

  return `${intro}<p>Our ${name} service gives founders and MSME owners a complete execution path instead of only basic form filling. The team reviews your business model, current documents, eligibility, timelines, and compliance risks before preparing the application, so the submission is cleaner and easier to track.</p><p>Under the ${seriesName} series, we coordinate documentation, portal filing, follow-ups, corrections, and final handover with practical guidance for what should be done after approval. This helps clients avoid repeated rejections, missed deadlines, and incomplete records while keeping the process transparent from start to finish.</p>`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function findMatching(source: string, startIndex: number, openChar: string, closeChar: string) {
  let depth = 0
  let quote: string | null = null
  let escaped = false

  for (let i = startIndex; i < source.length; i++) {
    const char = source[i]

    if (quote) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '\'' || char === '"' || char === '`') {
      quote = char
      continue
    }

    if (char === openChar) depth++
    if (char === closeChar) depth--

    if (depth === 0) return i
  }

  throw new Error(`Could not find matching ${closeChar}`)
}

function extractLiteral(source: string, marker: string, openChar: string, closeChar: string) {
  const markerIndex = source.indexOf(marker)
  if (markerIndex === -1) {
    throw new Error(`Could not find ${marker}`)
  }

  const assignmentIndex = source.indexOf('=', markerIndex)
  if (assignmentIndex === -1) {
    throw new Error(`Could not find assignment after ${marker}`)
  }

  const startIndex = source.indexOf(openChar, assignmentIndex)
  if (startIndex === -1) {
    throw new Error(`Could not find ${openChar} after ${marker}`)
  }

  const endIndex = findMatching(source, startIndex, openChar, closeChar)
  return source.slice(startIndex, endIndex + 1)
}

function loadSeedData() {
  const seedPath = join(process.cwd(), 'prisma', 'seed.ts')
  const seedSource = readFileSync(seedPath, 'utf8')

  const seriesLiteral = extractLiteral(seedSource, 'const seriesData', '[', ']')
  const subservicesLiteral = extractLiteral(seedSource, 'const subservicesBySlug', '{', '}')

  const seriesData = Function(`"use strict"; return (${seriesLiteral})`)() as ServiceSeriesSeed[]
  const subservicesBySlug = Function(`"use strict"; return (${subservicesLiteral})`)() as Record<string, SubServiceSeed[]>

  return { seriesData, subservicesBySlug }
}

async function main() {
  const { seriesData, subservicesBySlug } = loadSeedData()
  let seriesCount = 0
  let subserviceCount = 0

  console.log('Seeding service series and subservices...')

  for (const series of seriesData) {
    const seriesRecord = await db.serviceSeries.upsert({
      where: { slug: series.slug },
      update: {
        name: series.name,
        icon: series.icon,
        tagline: series.tagline,
        description: series.description,
        accentColor: series.accentColor,
        order: series.order,
        isActive: true,
      },
      create: {
        ...series,
        isActive: true,
      },
    })
    seriesCount++

    const subservices = subservicesBySlug[series.slug] || []

    for (let index = 0; index < subservices.length; index++) {
      const subservice = subservices[index]
      const slug = slugify(subservice.name)

      await db.subService.upsert({
        where: { slug },
        update: {
          name: subservice.name,
          description: enrichSubServiceDescription(subservice.name, subservice.description, series.name),
          features: JSON.stringify(subservice.features || []),
          benefits: JSON.stringify(subservice.benefits || []),
          process: JSON.stringify(subservice.process || []),
          documents: JSON.stringify(subservice.documents || []),
          eligibility: subservice.eligibility || '',
          registrationTime: subservice.registrationTime || '',
          pricing: subservice.pricing || null,
          order: index + 1,
          isActive: true,
          seriesId: seriesRecord.id,
        },
        create: {
          name: subservice.name,
          slug,
          description: enrichSubServiceDescription(subservice.name, subservice.description, series.name),
          features: JSON.stringify(subservice.features || []),
          benefits: JSON.stringify(subservice.benefits || []),
          process: JSON.stringify(subservice.process || []),
          documents: JSON.stringify(subservice.documents || []),
          eligibility: subservice.eligibility || '',
          registrationTime: subservice.registrationTime || '',
          pricing: subservice.pricing || null,
          order: index + 1,
          isActive: true,
          seriesId: seriesRecord.id,
        },
      })

      subserviceCount++
    }
  }

  console.log(`Done. Upserted ${seriesCount} service series and ${subserviceCount} subservices.`)
}

main()
  .catch((error) => {
    console.error('Subservice seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
