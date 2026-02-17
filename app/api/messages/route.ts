import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/messages - Get user's messages
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = (session.user as any).id

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(messages)
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        )
    }
}

// POST /api/messages - Send a new message
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
        const { receiverId, content, subject, orderId } = body

        if (!content) {
            return NextResponse.json(
                { error: 'Le contenu du message est requis' },
                { status: 400 }
            )
        }

        const senderId = (session.user as any).id
        const userRole = (session.user as any).role

        let finalReceiverId = receiverId
        if (!finalReceiverId && userRole === 'client') {
            const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
            if (!admin) {
                return NextResponse.json({ error: 'Aucun admin disponible' }, { status: 500 })
            }
            finalReceiverId = admin.id
        }

        if (!finalReceiverId) {
            return NextResponse.json({ error: 'Destinataire requis' }, { status: 400 })
        }

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId: finalReceiverId,
                content,
                subject: subject || null,
                orderId: orderId || null,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json(message, { status: 201 })
    } catch (error) {
        console.error('Error creating message:', error)
        return NextResponse.json(
            { error: 'Failed to create message' },
            { status: 500 }
        )
    }
}
