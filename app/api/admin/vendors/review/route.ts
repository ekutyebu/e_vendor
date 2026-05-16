import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const body = await req.json()
        const { vendorId, action, reason } = body

        let onboardingStatus: 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION'
        let isActive = false
        let verified = false

        switch (action) {
            case 'APPROVE':
                onboardingStatus = 'APPROVED'
                isActive = true
                verified = true
                break
            case 'REJECT':
                onboardingStatus = 'REJECTED'
                isActive = false
                verified = false
                break
            case 'CORRECTION':
                onboardingStatus = 'NEEDS_CORRECTION'
                isActive = false
                verified = false
                break
            default:
                return new NextResponse('Invalid Action', { status: 400 })
        }

        const vendor = await prisma.vendor.update({
            where: { id: vendorId },
            data: {
                onboardingStatus,
                isActive,
                paymentVerified: action === 'APPROVE', // Payment is verified upon approval for simplicity
                rejectionReason: reason || null
            }
        })

        return NextResponse.json(vendor)
    } catch (error) {
        console.error('[VENDOR_REVIEW_ERROR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
