import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/orders/[id] - Get order by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                product: true,
                user: {
                    select: { id: true, name: true, email: true },
                },
                messages: {
                    include: {
                        sender: { select: { id: true, name: true, email: true } },
                        receiver: { select: { id: true, name: true, email: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        })

        if (!order) {
            return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
        }

        const userRole = (session.user as any).role
        const userId = (session.user as any).id
        if (userRole !== 'admin' && order.userId !== userId) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

// PUT /api/orders/[id] - Update order (admin only for status)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const userRole = (session.user as any).role
        if (userRole !== 'admin') {
            return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
        }

        const body = await request.json()
        const { status, customNotes } = body

        const order = await prisma.order.update({
            where: { id: params.id },
            data: {
                ...(status && { status }),
                ...(customNotes !== undefined && { customNotes }),
            },
            include: {
                product: true,
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
