import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get('session_id')

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status === 'paid') {
            // Update orders if not already updated by webhook
            const orderIds = JSON.parse(session.metadata?.orderIds || '[]')

            for (const orderId of orderIds) {
                const order = await prisma.order.findUnique({ where: { id: orderId } })
                if (order && order.status === 'pending_payment') {
                    await prisma.order.update({
                        where: { id: orderId },
                        data: {
                            status: 'pending',
                            customNotes: `${order.customNotes || ''}\n\n--- Paiement ---\nStatut: Payé via Stripe\nSession: ${session.id}\nMontant total: ${(session.amount_total || 0) / 100}€`,
                        },
                    })
                }
            }

            return NextResponse.json({ status: 'paid' })
        }

        return NextResponse.json(
            { error: 'Payment not completed', status: session.payment_status },
            { status: 402 }
        )
    } catch (error: any) {
        console.error('Payment verification error:', error)
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        )
    }
}
