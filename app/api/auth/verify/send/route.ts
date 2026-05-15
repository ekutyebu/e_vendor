import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    // Lazy-initialize SDKs inside handler so build-time env var absence doesn't crash
    const { Resend } = await import('resend')
    const twilio = (await import('twilio')).default
    const resend = new Resend(process.env.RESEND_API_KEY)
    const twilioClient = twilio(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET, {
        accountSid: process.env.TWILIO_ACCOUNT_SID
    })
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

        // Dispatch Real Communication
        if (type === 'EMAIL') {
            await resend.emails.send({
                from: 'INOVAMARK Security <onboarding@resend.dev>', // Resend test domain
                to: identifier,
                subject: 'Your INOVAMARK Verification Code',
                html: `
                    <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                        <h2 style="color: #000;">INOVAMARK Security</h2>
                        <p>Your identity verification code is:</p>
                        <h1 style="color: #ff6600; letter-spacing: 5px; font-size: 32px;">${code}</h1>
                        <p style="color: #666; font-size: 12px;">This code will expire in 15 minutes.</p>
                    </div>
                `
            })
        } else if (type === 'PHONE') {
            await twilioClient.messages.create({
                body: `Your INOVAMARK security code is: ${code}`,
                from: process.env.TWILIO_PHONE_NUMBER || '+1234567890', // User needs to set this in .env
                to: identifier
            })
        }

        console.log(`✅ DISPATCHED REAL ${type} OTP TO ${identifier}`)

        return NextResponse.json({ success: true, message: 'Verification code sent successfully' })
    } catch (error: any) {
        console.error('OTP Send Error:', error?.message || error)
        return NextResponse.json({ error: 'Failed to dispatch verification code' }, { status: 500 })
    }
}
