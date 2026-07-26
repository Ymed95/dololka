import type { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'
import { SITE_URL } from '@/lib/site'
import { getActiveServices } from '@/lib/servicesData'

const prisma = new PrismaClient()

// Le sitemap interroge la base : jamais de pré-rendu au build.
export const dynamic = 'force-dynamic'

/** Pages statiques publiques, avec leur importance relative. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/agence', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/boutique', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/portfolio', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/faq', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/help', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/delivery', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
        url: `${SITE_URL}${r.path}`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }))

    // Services (gérés depuis l'admin, avec repli sur les services par défaut)
    try {
        const services = await getActiveServices()
        for (const s of services) {
            entries.push({
                url: `${SITE_URL}/services/${s.slug}`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.8,
            })
        }
    } catch (error) {
        console.error('Sitemap : services indisponibles', error)
    }

    // Projets du portfolio
    try {
        const projects = await prisma.portfolio.findMany({
            where: { isActive: true },
            select: { id: true, slug: true, updatedAt: true },
        })
        for (const p of projects) {
            entries.push({
                url: `${SITE_URL}/portfolio/${p.slug || p.id}`,
                lastModified: p.updatedAt ?? now,
                changeFrequency: 'monthly',
                priority: 0.6,
            })
        }
    } catch (error) {
        console.error('Sitemap : projets indisponibles', error)
    }

    // Fiches produits de la boutique
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true },
        })
        for (const p of products) {
            entries.push({
                url: `${SITE_URL}/product/${p.id}`,
                lastModified: p.updatedAt ?? now,
                changeFrequency: 'weekly',
                priority: 0.6,
            })
        }
    } catch (error) {
        console.error('Sitemap : produits indisponibles', error)
    }

    return entries
}
