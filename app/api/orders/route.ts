import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/orders - Get orders (filtered by user or all for admin)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')

        // Build query conditions
        const where: any = {}

        // If not admin, only show user's own orders
        if ((session.user as any)?.role !== 'admin') {
            where.userId = (session.user as any).id
        }

        if (status && status !== 'all') {
            where.status = status
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                product: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}


// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            productId,
            totalPrice,
            designFileUrl,
            designFileName,
            position,
            designX,
            designY,
            designWidth,
            designHeight,
            designRotation,
            customNotes,
        } = body

        const userId = (session.user as any).id

        // Validation
        if (!productId || !totalPrice) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const order = await prisma.order.create({
            data: {
                userId,
                productId,
                totalPrice: parseFloat(totalPrice),
                status: 'pending',
                designFileUrl: designFileUrl || null,
                designFileName: designFileName || null,
                position: position || null,
                designX: designX !== undefined ? parseFloat(designX) : null,
                designY: designY !== undefined ? parseFloat(designY) : null,
                designWidth: designWidth !== undefined ? parseFloat(designWidth) : null,
                designHeight: designHeight !== undefined ? parseFloat(designHeight) : null,
                designRotation: designRotation !== undefined ? parseFloat(designRotation) : null,
                customNotes: customNotes || null,
            },
            include: {
                product: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(order, { status: 201 })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
