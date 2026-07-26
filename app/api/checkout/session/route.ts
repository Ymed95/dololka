import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { PrismaClient, Prisma } from '@prisma/client'
import type { CustomizationData, ViewDesign } from '@/lib/types/customization'

const prisma = new PrismaClient()

/** Vue principale = première vue comportant un design, sinon la première. */
function getPrimaryView(customization?: CustomizationData): ViewDesign | undefined {
    if (!customization?.views?.length) return undefined
    return customization.views.find((v) => v.designFileUrl) || customization.views[0]
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Vous devez être connecté pour passer commande' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { items, shipping } = body

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'Le panier est vide' },
                { status: 400 }
            )
        }

        // Validate products exist in database
        const productIds = items.map((item: any) => item.productId)
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        })

        const productMap = new Map(products.map(p => [p.id, p]))

        // Build Stripe line items
        const lineItems = items.map((item: any) => {
            const product = productMap.get(item.productId)
            if (!product) {
                throw new Error(`Produit introuvable: ${item.productId}`)
            }

            const description = [
                item.size ? `Taille: ${item.size}` : '',
                item.color ? `Couleur: ${item.color}` : '',
            ].filter(Boolean).join(' | ')

            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.name,
                        description: description || undefined,
                        images: product.imageUrl.startsWith('http')
                            ? [product.imageUrl]
                            : undefined,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity || 1,
            }
        })

        // Create orders in DB with pending_payment status
        const orderIds: string[] = []
        for (const item of items) {
            const product = productMap.get(item.productId)
            if (!product) continue

            const shippingBlock = [
                `--- Livraison ---`,
                `${shipping.firstName} ${shipping.lastName}`,
                shipping.address,
                `${shipping.postalCode} ${shipping.city}`,
                shipping.country,
                `Tél: ${shipping.phone}`,
                shipping.notes ? `Notes: ${shipping.notes}` : '',
            ].filter(Boolean).join('\n')

            const customization: CustomizationData | undefined = item.customization
            const primaryView = getPrimaryView(customization)

            const productBlock = [
                `--- Produit ---`,
                item.size ? `Taille: ${item.size}` : '',
                item.color ? `Couleur: ${item.color}` : '',
                item.quantity > 1 ? `Quantité: ${item.quantity}` : '',
            ].filter(Boolean).join('\n')

            const order = await prisma.order.create({
                data: {
                    userId: (session.user as any).id,
                    productId: item.productId,
                    totalPrice: product.price * (item.quantity || 1),
                    status: 'pending_payment',
                    // Vue principale (rétro-compatibilité avec l'affichage existant)
                    designFileUrl: primaryView?.designFileUrl || null,
                    designFileName: customization?.designFileName || null,
                    position: primaryView?.position || null,
                    designX: primaryView?.designX ?? null,
                    designY: primaryView?.designY ?? null,
                    designWidth: primaryView?.designWidth ?? null,
                    designHeight: primaryView?.designHeight ?? null,
                    designRotation: primaryView?.designRotation ?? null,
                    // Asset de production
                    baseColor: customization?.baseColor || null,
                    productionFileUrl: primaryView?.productionImageUrl || null,
                    customizationData: customization
                        ? (JSON.parse(JSON.stringify(customization)) as Prisma.InputJsonValue)
                        : Prisma.JsonNull,
                    customNotes: `${productBlock}\n\n${shippingBlock}`,
                    // Précisions saisies par le client dans le configurateur,
                    // conservées à part du récapitulatif généré.
                    clientNotes: customization?.customNotes || null,
                    // Preuve d'acceptation des conditions (droits + qualité).
                    termsAcceptedAt: customization?.acceptedTerms?.acceptedAt
                        ? new Date(customization.acceptedTerms.acceptedAt)
                        : null,
                },
            })
            orderIds.push(order.id)
        }

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            metadata: {
                orderIds: JSON.stringify(orderIds),
                userId: (session.user as any).id,
            },
            customer_email: session.user?.email || undefined,
            success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cart?cancelled=true`,
        })

        return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id })
    } catch (error: any) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la création du paiement' },
            { status: 500 }
        )
    }
}
