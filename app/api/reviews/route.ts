import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { type, targetId, rating, comment } = body

        if (!targetId || !rating) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
        }

        // Get customer ID
        const customer = await prisma.customer.findUnique({
            where: { userId: session.user.id }
        })

        if (!customer) {
            return NextResponse.json({ message: 'Customer profile not found' }, { status: 404 })
        }

        if (type === 'PRODUCT') {
            const review = await prisma.productReview.create({
                data: {
                    rating,
                    comment,
                    customerId: customer.id,
                    productId: targetId,
                    userId: session.user.id
                }
            })

            // Update product average rating
            const productReviews = await prisma.productReview.findMany({
                where: { productId: targetId }
            })
            const avgRating = productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length
            await prisma.product.update({
                where: { id: targetId },
                data: { 
                    rating: avgRating,
                    totalReviews: productReviews.length
                }
            })

            return NextResponse.json(review)
        } else if (type === 'VENDOR') {
            const review = await prisma.vendorReview.create({
                data: {
                    rating,
                    comment,
                    customerId: customer.id,
                    vendorId: targetId,
                    userId: session.user.id
                }
            })

            // Update vendor average rating
            const vendorReviews = await prisma.vendorReview.findMany({
                where: { vendorId: targetId }
            })
            const avgRating = vendorReviews.reduce((acc, curr) => acc + curr.rating, 0) / vendorReviews.length
            await prisma.vendor.update({
                where: { id: targetId },
                data: { 
                    rating: avgRating,
                    totalReviews: vendorReviews.length
                }
            })

            return NextResponse.json(review)
        }

        return NextResponse.json({ message: 'Invalid type' }, { status: 400 })
    } catch (error: any) {
        console.error('[REVIEWS_POST_ERROR]', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ message: 'You have already reviewed this' }, { status: 400 })
        }
        return NextResponse.json({ message: 'Internal Error' }, { status: 500 })
    }
}
