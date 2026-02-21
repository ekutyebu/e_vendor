import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const productCreateSchema = z.object({
    name: z.string().min(2),
    nameFr: z.string().min(2),
    description: z.string().min(20),
    descriptionFr: z.string().min(20),
    price: z.number().min(1),
    compareAtPrice: z.number().optional(),
    stock: z.number().min(0).int(),
    sku: z.string().min(2),
    images: z.array(z.string()).min(1),
    categoryId: z.string(),
    isActive: z.boolean().default(true),
})

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const vendorId = searchParams.get('vendorId')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            ...(vendorId && { vendorId }),
            ...(categoryId && { categoryId }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { nameFr: { contains: search, mode: 'insensitive' } },
                ],
            }),
        },
        include: {
            vendor: { select: { id: true, businessName: true } },
            category: { select: { name: true, nameFr: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    })

    return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user || !['VENDOR', 'ADMIN'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const parsed = productCreateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
        }

        // Get vendor for current user
        const vendor = await prisma.vendor.findUnique({ where: { userId: session.user.id! } })
        if (!vendor) {
            return NextResponse.json({ error: 'Vendor profile not found' }, { status: 404 })
        }

        const product = await prisma.product.create({
            data: {
                ...parsed.data,
                vendorId: vendor.id,
            },
        })

        return NextResponse.json({ success: true, product }, { status: 201 })
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return NextResponse.json({ error: 'SKU already exists' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}
