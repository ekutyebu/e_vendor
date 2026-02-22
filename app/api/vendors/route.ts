import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const categorySlug = searchParams.get('category')
        const city = searchParams.get('city')
        const search = searchParams.get('q')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')

        const vendors = await prisma.vendor.findMany({
            where: {
                isActive: true,
                ...(categorySlug && { category: { slug: categorySlug } }),
                ...(city && { city: { contains: city, mode: 'insensitive' } }),
                ...(search && { businessName: { contains: search, mode: 'insensitive' } }),
            },
            include: {
                category: { select: { name: true, nameFr: true, slug: true, color: true } },
                _count: { select: { products: true, orders: true } },
            },
            orderBy: { rating: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        })

        const total = await prisma.vendor.count({ where: { isActive: true } })

        return NextResponse.json({ vendors, total, page, pages: Math.ceil(total / limit) })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const {
            businessName, businessEmail, businessPhone, description, descriptionFr,
            categoryId, address, city, coordinates, deliveryRadius, baseDeliveryFee,
        } = body

        // Create vendor for the logged-in user
        const vendor = await prisma.$transaction(async (tx) => {
            const newVendor = await tx.vendor.create({
                data: {
                    businessName, businessEmail, businessPhone,
                    description, descriptionFr: descriptionFr || '',
                    categoryId, address, city, coordinates,
                    deliveryRadius: parseFloat(deliveryRadius),
                    baseDeliveryFee: parseFloat(baseDeliveryFee),
                    userId: session.user!.id!,
                    isActive: false, // Requires admin approval
                },
            })

            // Update user role to VENDOR
            await tx.user.update({
                where: { id: session.user!.id! },
                data: { role: 'VENDOR', vendorId: newVendor.id },
            })

            return newVendor
        })

        return NextResponse.json({ success: true, vendor }, { status: 201 })
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json({ error: 'Business name already taken' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Failed to register vendor' }, { status: 500 })
    }
}
