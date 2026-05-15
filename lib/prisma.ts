import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Allow Neon to work in local environments with WebSockets (bypasses port 5432)
neonConfig.webSocketConstructor = ws

// Load environment variables manually for standalone scripts (tsx)
try {
    // @ts-ignore
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile('.env')
        console.log('✅ .env file loaded successfully via native Node.js')
    }
} catch (e) {}

const connectionString = (process.env.PROD_DATABASE_URL || process.env.DATABASE_URL || '').trim()

// Ensure DATABASE_URL is available for the adapter and engine internals
process.env.DATABASE_URL = connectionString

// In Prisma 6, PrismaNeon takes the PoolConfig directly to handle Pool creation internally!
const adapter = new PrismaNeon({ connectionString })

export const prisma =
    globalThis.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma

declare global {
    var prisma: PrismaClient | undefined
}
