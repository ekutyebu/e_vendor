import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
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
} catch (e) {
    console.warn('⚠️ Could not load .env file:', e)
}

const connectionString = (process.env.PROD_DATABASE_URL || process.env.DATABASE_URL || '')
    .trim()
    .replace(/^["']|["']$/g, '')

if (!connectionString) {
    console.error('❌ CRITICAL: No database connection string found in process.env')
    console.log('Available Env Keys:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('URL')))
} else {
    console.log('🔗 Database connection string found (length:', connectionString.length, ')')
}

// Force standard postgres protocol and strip query parameters (like sslmode=require)
const normalizedConnectionString = connectionString
    .replace('postgresql://', 'postgres://')
    .split('?')[0] // Neon serverless driver sometimes chokes on query parameters

// Neon pool occasionally reads from process.env.DATABASE_URL automatically as a fallback.
// Parse the URL manually to avoid Neon driver parsing issues
// Use standard connectionString property
const pool = new Pool({ connectionString: normalizedConnectionString })
const adapter = new PrismaNeon(pool)

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
