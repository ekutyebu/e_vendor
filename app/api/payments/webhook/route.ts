import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Campay Payment Webhook Handler
 * Receives payment status updates from Campay (Orange Money / Mobile Money)
 */
export async function POST(req: NextRequest) {
    try {
        // Verify webhook — in production, validate X-Campay-Signature header
        const body = await req.json()
        const { reference, status, external_reference } = body

        if (!reference || !external_reference) {
            return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
        }

        // Find the order by externalReference (orderNumber)
        const order = await prisma.order.findFirst({
            where: { orderNumber: external_reference },
        })

        if (!order) {
            console.error(`Order not found for reference: ${external_reference}`)
            return NextResponse.json({ received: true }) // Return 200 to avoid retries
        }

        // Update payment status
        const paymentStatus = status === 'SUCCESSFUL' ? 'PAID' : status === 'FAILED' ? 'FAILED' : 'PENDING'
        const orderStatus = status === 'SUCCESSFUL' ? 'CONFIRMED' : order.status

        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus,
                status: orderStatus,
                transactionId: reference,
            },
        })

        // TODO: Send email notifications to customer and vendor

        return NextResponse.json({ received: true, updated: order.id })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
