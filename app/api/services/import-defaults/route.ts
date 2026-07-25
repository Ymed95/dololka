import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { defaultServices } from '@/lib/data/defaultServices'

const prisma = new PrismaClient()

// POST /api/services/import-defaults — importe les 12 services historiques
// (extraits des anciennes pages statiques) dans la base. Idempotent : les
// slugs déjà présents sont ignorés. Réservé à l'admin.
export async function POST() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Réservé aux administrateurs' }, { status: 403 })
        }

        let created = 0
        let skipped = 0

        for (const svc of defaultServices) {
            const exists = await prisma.service.findUnique({ where: { slug: svc.slug } })
            if (exists) {
                skipped++
                continue
            }
            await prisma.service.create({
                data: {
                    slug: svc.slug,
                    title: svc.title,
                    subtitle: svc.subtitle,
                    description: svc.description,
                    icon: svc.icon,
                    features: svc.features,
                    process: svc.process,
                    pricing: svc.pricing || null,
                    faq: svc.faq,
                    isActive: true,
                    sortOrder: svc.sortOrder,
                },
            })
            created++
        }

        return NextResponse.json({ created, skipped })
    } catch (error) {
        console.error('Error importing default services:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
