import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/fundgrow',
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
