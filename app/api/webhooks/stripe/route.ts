import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status === 'paid') {
            const orderIds = JSON.parse(session.metadata?.orderIds || '[]')

            // Update all orders to pending (paid, waiting for production)
            for (const orderId of orderIds) {
                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'pending',
                        customNotes: {
                            set: undefined,
                        },
                    },
                })

                // Append payment info to existing notes
                const order = await prisma.order.findUnique({ where: { id: orderId } })
                if (order) {
                    await prisma.order.update({
                        where: { id: orderId },
                        data: {
                            status: 'pending',
                            customNotes: `${order.customNotes || ''}\n\n--- Paiement ---\nStatut: Payé via Stripe\nSession: ${session.id}\nMontant total: ${(session.amount_total || 0) / 100}€`,
                        },
                    })
                }
            }
        }
    }

    if (event.type === 'checkout.session.expired') {
        const session = event.data.object as Stripe.Checkout.Session
        const orderIds = JSON.parse(session.metadata?.orderIds || '[]')

        // Clean up unpaid orders
        for (const orderId of orderIds) {
            const order = await prisma.order.findUnique({ where: { id: orderId } })
            if (order && order.status === 'pending_payment') {
                await prisma.order.delete({ where: { id: orderId } })
            }
        }
    }

    return NextResponse.json({ received: true })
}
