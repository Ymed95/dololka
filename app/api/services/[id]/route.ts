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

// PUT /api/services/[id] — mise à jour (admin)
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
        const { title, subtitle, description, icon, features, process, pricing, faq, isActive, sortOrder } = body

        const service = await prisma.service.update({
            where: { id: params.id },
            data: {
                ...(title !== undefined && { title }),
                ...(subtitle !== undefined && { subtitle }),
                ...(description !== undefined && { description }),
                ...(icon !== undefined && { icon }),
                ...(features !== undefined && { features: Array.isArray(features) ? features : [] }),
                ...(process !== undefined && { process: Array.isArray(process) ? process : [] }),
                ...(pricing !== undefined && { pricing: pricing || null }),
                ...(faq !== undefined && { faq: Array.isArray(faq) ? faq : [] }),
                ...(isActive !== undefined && { isActive: !!isActive }),
                ...(sortOrder !== undefined && Number.isFinite(sortOrder) && { sortOrder }),
            },
        })
        return NextResponse.json(service)
    } catch (error) {
        console.error('Error updating service:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

// DELETE /api/services/[id] — suppression (admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAdmin()
        if (!session) {
            return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
        }

        await prisma.service.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting service:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
