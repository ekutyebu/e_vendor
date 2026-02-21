import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { action } = await req.json() // 'approve' | 'reject'

        if (!['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        const vendor = await prisma.vendor.update({
            where: { id: params.id },
            data: {
                isActive: action === 'approve',
                verified: action === 'approve',
            },
        })

        // TODO: Send email to vendor with decision (using Resend)

        return NextResponse.json({
            success: true,
            vendor,
            message: `Vendor ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update vendor status' }, { status: 500 })
    }
}
