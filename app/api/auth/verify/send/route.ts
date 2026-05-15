import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { identifier, type } = await req.json()

        if (!identifier || !type || !['EMAIL', 'PHONE'].includes(type)) {
            return NextResponse.json({ error: 'Invalid identifier or type' }, { status: 400 })
        }

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        // Upsert OTP in database
        await prisma.verificationOTP.upsert({
            where: {
                identifier_type: {
                    identifier,
                    type,
                },
            },
            update: {
                code,
                expiresAt,
            },
            create: {
                identifier,
                type,
                code,
                expiresAt,
            },
        })

        // 🔥 MOCK SYSTEM FOR NOW - Print to console
        console.log('\n=============================================')
        console.log(`🔐 MOCK ${type} VERIFICATION CODE GENERATED`)
        console.log(`📡 To: ${identifier}`)
        console.log(`🔑 Code: ${code}`)
        console.log('=============================================\n')

        return NextResponse.json({ success: true, message: 'Verification code sent successfully' })
    } catch (error) {
        console.error('OTP Send Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
