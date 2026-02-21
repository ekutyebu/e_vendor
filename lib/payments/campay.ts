export interface PaymentRequest {
    amount: number
    currency?: string
    phoneNumber: string
    description: string
    externalReference: string
}

export interface PaymentResponse {
    success: boolean
    reference?: string
    ussdCode?: string
    message?: string
    error?: string
}

/**
 * Initiate a payment via Campay (Orange Money / Mobile Money aggregator for Cameroon)
 * Docs: https://docs.campay.net
 */
export async function initiatePayment(
    method: 'ORANGE_MONEY' | 'MOBILE_MONEY',
    data: PaymentRequest
): Promise<PaymentResponse> {
    const apiUrl = process.env.CAMPAY_API_URL || 'https://demo.campay.net/api'

    try {
        // Step 1: Get access token
        const tokenRes = await fetch(`${apiUrl}/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: process.env.CAMPAY_USERNAME,
                password: process.env.CAMPAY_PASSWORD,
            }),
        })

        if (!tokenRes.ok) {
            return { success: false, error: 'Failed to authenticate with payment provider' }
        }

        const { token } = await tokenRes.json()

        // Step 2: Initiate collection
        const collectRes = await fetch(`${apiUrl}/collect/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                amount: data.amount.toString(),
                currency: data.currency || 'XAF',
                from: data.phoneNumber,
                description: data.description,
                external_reference: data.externalReference,
            }),
        })

        const result = await collectRes.json()

        if (collectRes.ok && result.reference) {
            return {
                success: true,
                reference: result.reference,
                ussdCode: result.ussd_code,
                message: 'Payment initiated. Please confirm on your phone.',
            }
        }

        return { success: false, error: result.message || 'Payment initiation failed' }
    } catch (error) {
        console.error('Payment error:', error)
        return { success: false, error: 'Payment service unavailable' }
    }
}

/**
 * Check payment status by reference
 */
export async function checkPaymentStatus(
    reference: string
): Promise<{ status: 'SUCCESSFUL' | 'FAILED' | 'PENDING'; message?: string }> {
    const apiUrl = process.env.CAMPAY_API_URL || 'https://demo.campay.net/api'

    try {
        const tokenRes = await fetch(`${apiUrl}/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: process.env.CAMPAY_USERNAME,
                password: process.env.CAMPAY_PASSWORD,
            }),
        })

        const { token } = await tokenRes.json()

        const statusRes = await fetch(`${apiUrl}/transaction/${reference}/`, {
            headers: { Authorization: `Token ${token}` },
        })

        const result = await statusRes.json()
        return { status: result.status, message: result.message }
    } catch {
        return { status: 'FAILED', message: 'Could not verify payment status' }
    }
}
