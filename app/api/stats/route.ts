import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// Stats par défaut : affichées tant que la table n'est pas migrée/peuplée.
// Pour masquer une stat sans la supprimer, l'admin la désactive (isActive).
const DEFAULT_STATS = [
    { id: 'default-1', value: '150+', label: 'Projets réalisés', sortOrder: 0, isActive: true },
    { id: 'default-2', value: '95%', label: 'Clients satisfaits', sortOrder: 1, isActive: true },
    { id: 'default-3', value: '360°', label: 'Accompagnement', sortOrder: 2, isActive: true },
]

async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') return null
    return session
}

// GET /api/stats — stats publiques (actives, repli sur les défauts) ; ?all=1 pour l'admin
export async function GET(request: NextRequest) {
    try {
        const all = request.nextUrl.searchParams.get('all') === '1'

        if (all) {
            const session = await requireAdmin()
            if (!session) {
                return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
            }
            const stats = await prisma.siteStat.findMany({
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
            })
            return NextResponse.json(stats)
        }

        const count = await prisma.siteStat.count()
        if (count === 0) return NextResponse.json(DEFAULT_STATS)

        const stats = await prisma.siteStat.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        })
        return NextResponse.json(stats)
    } catch (error) {
        console.error('Error fetching stats (repli défauts):', error)
        return NextResponse.json(DEFAULT_STATS)
    }
}

// POST /api/stats — création (admin)
export async function POST(request: NextRequest) {
    try {
        const session = await requireAdmin()
        if (!session) {
            return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
        }

        const body = await request.json()
        const { value, label, sortOrder, isActive } = body
        if (!value || !label) {
            return NextResponse.json({ error: 'Valeur et libellé requis' }, { status: 400 })
        }

        const stat = await prisma.siteStat.create({
            data: {
                value,
                label,
                sortOrder: Number.isFinite(sortOrder) ? sortOrder : 999,
                isActive: isActive !== false,
            },
        })
        return NextResponse.json(stat, { status: 201 })
    } catch (error) {
        console.error('Error creating stat:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
