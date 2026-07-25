import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { getActiveServices } from '@/lib/servicesData'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

async function requireAdmin() {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') return null
    return session
}

// GET /api/services — liste publique (actifs, avec repli sur les défauts) ;
// ?all=1 pour l'admin (tous, DB uniquement)
export async function GET(request: NextRequest) {
    try {
        const all = request.nextUrl.searchParams.get('all') === '1'

        if (all) {
            const session = await requireAdmin()
            if (!session) {
                return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
            }
            const services = await prisma.service.findMany({
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
            })
            return NextResponse.json(services)
        }

        const services = await getActiveServices()
        return NextResponse.json(services)
    } catch (error) {
        console.error('Error fetching services:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // retire les accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60)
}

// POST /api/services — création (admin)
export async function POST(request: NextRequest) {
    try {
        const session = await requireAdmin()
        if (!session) {
            return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
        }

        const body = await request.json()
        const { title, subtitle, description, icon, features, process, pricing, faq, isActive, sortOrder } = body

        if (!title || typeof title !== 'string') {
            return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 })
        }

        let slug = typeof body.slug === 'string' && body.slug.trim() ? slugify(body.slug) : slugify(title)
        if (!slug) {
            return NextResponse.json({ error: 'Slug invalide' }, { status: 400 })
        }
        // Unicité du slug : suffixe numérique si déjà pris.
        const existing = await prisma.service.findUnique({ where: { slug } })
        if (existing) slug = `${slug}-${Date.now().toString(36)}`

        const service = await prisma.service.create({
            data: {
                slug,
                title,
                subtitle: subtitle || '',
                description: description || '',
                icon: icon || 'Sparkles',
                features: Array.isArray(features) ? features : [],
                process: Array.isArray(process) ? process : [],
                pricing: pricing || null,
                faq: Array.isArray(faq) ? faq : [],
                isActive: isActive !== false,
                sortOrder: Number.isFinite(sortOrder) ? sortOrder : 999,
            },
        })
        return NextResponse.json(service, { status: 201 })
    } catch (error) {
        console.error('Error creating service:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
