import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig, Pool } from '@neondatabase/serverless'

// ─── HTTP FETCH MODE ────────────────────────────────────────────────────────
// Using Neon's HTTP fetch transport instead of WebSocket or raw TCP.
// This routes every query over HTTPS (port 443) which is always open.
// Benefits:
//   ✅ No WebSocket → no bufferUtil native-addon crash
//   ✅ No TCP port 5432 → no ISP/firewall blocks
//   ✅ Works identically locally and on Vercel
//   ✅ Each query is an independent HTTP request — no stale connections
// Limitation: Interactive transactions require WebSocket; use $transaction([...]) instead.
neonConfig.poolQueryViaFetch = true

const connectionString = (
    process.env.PROD_DATABASE_URL ||
    process.env.DATABASE_URL ||
    ''
).trim()

function createPrismaClient() {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool)

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
}

// Prevent hot-reload from spawning multiple Prisma instances in dev
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma
