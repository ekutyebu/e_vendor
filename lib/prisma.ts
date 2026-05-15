import { PrismaClient } from '@prisma/client'

// Standard Prisma Client — uses TCP connection (port 5432) reliable in Node.js runtime.
// schema.prisma uses PROD_DATABASE_URL directly, so Prisma auto-picks it up.
// We also alias it to DATABASE_URL for compatibility with any third-party tooling.

const prodUrl = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL || ''

// Make sure DATABASE_URL is always set (some Prisma internals expect it)
if (prodUrl && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = prodUrl
}

function createPrismaClient() {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
}

// Prevent hot-reload from creating multiple instances in development
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma

