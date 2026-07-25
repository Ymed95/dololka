import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') return null
    return session
}

// PUT /api/stats/[id] — mise à jour (admin)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAdmin()
        if (!session) {
            return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
        }

        const body = await request.json()
        const { value, label, sortOrder, isActive } = body

        const stat = await prisma.siteStat.update({
            where: { id: params.id },
            data: {
                ...(value !== undefined && { value }),
                ...(label !== undefined && { label }),
                ...(sortOrder !== undefined && Number.isFinite(sortOrder) && { sortOrder }),
                ...(isActive !== undefined && { isActive: !!isActive }),
            },
        })
        return NextResponse.json(stat)
    } catch (error) {
        console.error('Error updating stat:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

// DELETE /api/stats/[id] — suppression (admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAdmin()
        if (!session) {
            return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
        }

        await prisma.siteStat.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting stat:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
