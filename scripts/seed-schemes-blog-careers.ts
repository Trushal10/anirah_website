import { readFileSync } from 'fs'
import { join } from 'path'
import { db } from '../src/lib/db'

type SchemeSeed = {
  title: string
  slug: string
  description: string
  benefits: string
  eligibility: string
  category: string
  image?: string | null
  order?: number
}

type BlogPostSeed = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string | null
  category: string
  tags: string
  readTime?: string
  isPublished?: boolean
  isFeatured?: boolean
  order?: number
}

type CareerSeed = {
  title: string
  slug: string
  location: string
  type: string
  experience: string
  description: string
  requirements: string
  department: string
  salary?: string | null
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

  const schemesLiteral = extractLiteral(seedSource, 'const schemes', '[', ']')
  const blogPostsLiteral = extractLiteral(seedSource, 'const blogPosts', '[', ']')
  const careersLiteral = extractLiteral(seedSource, 'const careers', '[', ']')

  return {
    schemes: Function(`"use strict"; return (${schemesLiteral})`)() as SchemeSeed[],
    blogPosts: Function(`"use strict"; return (${blogPostsLiteral})`)() as BlogPostSeed[],
    careers: Function(`"use strict"; return (${careersLiteral})`)() as CareerSeed[],
  }
}

async function main() {
  const { schemes, blogPosts, careers } = loadSeedData()

  console.log('Seeding government schemes, blog posts, and careers...')

  for (const scheme of schemes) {
    await db.scheme.upsert({
      where: { slug: scheme.slug },
      update: {
        title: scheme.title,
        description: scheme.description,
        benefits: scheme.benefits,
        eligibility: scheme.eligibility,
        category: scheme.category,
        image: scheme.image || null,
        isActive: true,
        order: scheme.order || 0,
      },
      create: {
        title: scheme.title,
        slug: scheme.slug,
        description: scheme.description,
        benefits: scheme.benefits,
        eligibility: scheme.eligibility,
        category: scheme.category,
        image: scheme.image || null,
        isActive: true,
        order: scheme.order || 0,
      },
    })
  }

  for (const post of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || null,
        category: post.category,
        tags: post.tags,
        readTime: post.readTime || '5 min read',
        isPublished: post.isPublished ?? true,
        isFeatured: post.isFeatured ?? false,
        order: post.order || 0,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || null,
        category: post.category,
        tags: post.tags,
        readTime: post.readTime || '5 min read',
        isPublished: post.isPublished ?? true,
        isFeatured: post.isFeatured ?? false,
        order: post.order || 0,
      },
    })
  }

  for (const career of careers) {
    await db.career.upsert({
      where: { slug: career.slug },
      update: {
        title: career.title,
        location: career.location,
        type: career.type,
        experience: career.experience,
        description: career.description,
        requirements: career.requirements,
        department: career.department,
        salary: career.salary || null,
        isActive: true,
      },
      create: {
        title: career.title,
        slug: career.slug,
        location: career.location,
        type: career.type,
        experience: career.experience,
        description: career.description,
        requirements: career.requirements,
        department: career.department,
        salary: career.salary || null,
        isActive: true,
      },
    })
  }

  console.log(`Done. Upserted ${schemes.length} schemes, ${blogPosts.length} blog posts, and ${careers.length} careers.`)
}

main()
  .catch((error) => {
    console.error('Schemes/blog/careers seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
