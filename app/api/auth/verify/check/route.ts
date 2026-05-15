import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { identifier, type, code } = await req.json()

        if (!identifier || !type || !code) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const otp = await prisma.verificationOTP.findUnique({
            where: {
                identifier_type: {
                    identifier,
                    type,
                },
            },
        })

        if (!otp) {
            return NextResponse.json({ error: 'No verification code requested' }, { status: 400 })
        }

        if (otp.expiresAt < new Date()) {
            return NextResponse.json({ error: 'Verification code expired' }, { status: 400 })
        }

        if (otp.code !== code) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
        }

        // Delete the OTP after successful validation
        await prisma.verificationOTP.delete({
            where: {
                id: otp.id,
            },
        })

        return NextResponse.json({ success: true, message: 'Verification successful' })
    } catch (error) {
        console.error('OTP Check Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
