import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Nettoie les commandes orphelines de l'utilisateur courant restées en
// "pending_payment" (paiement annulé/abandonné). Le panier côté client n'est
// pas touché : le client peut relancer son paiement immédiatement.
export async function POST() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const userId = (session.user as any).id

        const result = await prisma.order.deleteMany({
            where: { userId, status: 'pending_payment' },
        })

        return NextResponse.json({ deleted: result.count })
    } catch (error) {
        console.error('Cancel cleanup error:', error)
        return NextResponse.json(
            { error: 'Échec du nettoyage des commandes' },
            { status: 500 }
        )
    }
}
