import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const vendorSchema = z.object({
    businessName: z.string().min(2),
    businessEmail: z.string().email(),
    businessPhone: z.string().min(8),
    description: z.string().min(20),
    descriptionFr: z.string().min(20),
    categoryId: z.string(),
    address: z.string().min(5),
    city: z.string().min(2),
    deliveryRadius: z.number().min(1),
    baseDeliveryFee: z.number().min(0),
})

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== 'VENDOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const parsed = vendorSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
        }

        // Check if vendor already exists for this user
        const existingVendor = await prisma.vendor.findUnique({ where: { userId: session.user.id! } })
        if (existingVendor) {
            return NextResponse.json({ error: 'Vendor profile already exists' }, { status: 409 })
        }

        const vendor = await prisma.vendor.create({
            data: {
                ...parsed.data,
                userId: session.user.id!,
                isActive: false, // Wait for admin approval maybe? Or set true for now
            },
        })

        return NextResponse.json({ success: true, vendor }, { status: 201 })
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Business name or identity conflict' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Failed to create vendor profile' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== 'VENDOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const parsed = vendorSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
        }

        const vendor = await prisma.vendor.update({
            where: { userId: session.user.id! },
            data: parsed.data,
        })

        return NextResponse.json({ success: true, vendor })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update vendor profile' }, { status: 500 })
    }
}
