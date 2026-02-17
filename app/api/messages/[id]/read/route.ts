import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// PUT /api/messages/[id]/read - Mark message as read
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const userId = (session.user as any).id

        const message = await prisma.message.findUnique({
            where: { id: params.id },
        })

        if (!message) {
            return NextResponse.json({ error: 'Message introuvable' }, { status: 404 })
        }

        if (message.receiverId !== userId) {
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
        }

        const updated = await prisma.message.update({
            where: { id: params.id },
            data: { isRead: true },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Error marking message as read:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
