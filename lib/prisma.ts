import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Allow Neon to work in local environments with WebSockets (bypasses port 5432)
// Load environment variables manually for standalone scripts (tsx)
try {
    // @ts-ignore - loadEnvFile is available in Node 20.12+ / 22+
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile('.env')
    }
} catch (e) {
    // Ignore if .env is missing or already loaded
}

neonConfig.webSocketConstructor = ws

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const connectionString = process.env.PROD_DATABASE_URL!

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
