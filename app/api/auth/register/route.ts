import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().optional(),
    role: z.enum(['CUSTOMER', 'VENDOR']).default('CUSTOMER'),
    emailCode: z.string().length(6),
    phoneCode: z.string().length(6),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = registerSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: parsed.error.flatten() },
                { status: 400 }
            )
        }

        const { name, email, password, phone, role, emailCode, phoneCode } = parsed.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            )
        }

        // Validate Email OTP
        const emailOTP = await prisma.verificationOTP.findUnique({
            where: { identifier_type: { identifier: email, type: 'EMAIL' } }
        })
        if (!emailOTP || emailOTP.code !== emailCode || emailOTP.expiresAt < new Date()) {
            return NextResponse.json({ error: 'Invalid or expired email verification code' }, { status: 400 })
        }

        // Validate Phone OTP
        if (phone) {
            const phoneOTP = await prisma.verificationOTP.findUnique({
                where: { identifier_type: { identifier: phone, type: 'PHONE' } }
            })
            if (!phoneOTP || phoneOTP.code !== phoneCode || phoneOTP.expiresAt < new Date()) {
                return NextResponse.json({ error: 'Invalid or expired phone verification code' }, { status: 400 })
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user + customer profile in transaction
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    role: role as any,
                    emailVerified: new Date(),
                    phoneVerified: phone ? new Date() : null,
                },
            })

            await tx.customer.create({
                data: { userId: newUser.id },
            })

            // Clean up used OTPs
            await tx.verificationOTP.deleteMany({
                where: { identifier: { in: [email, phone || ''] } }
            })

            return newUser
        })

        return NextResponse.json(
            { success: true, userId: user.id },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        )
    }
}
