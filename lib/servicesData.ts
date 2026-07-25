// Accès serveur aux services avec repli automatique.
// Tant que la table Service n'est pas migrée/peuplée en production, le site
// continue d'afficher les 12 services historiques (lib/data/defaultServices).

import { PrismaClient } from '@prisma/client'
import { defaultServices } from '@/lib/data/defaultServices'

const prisma = new PrismaClient()

export interface ProcessStep {
    title: string
    description: string
}

export interface FaqItem {
    q: string
    a: string
}

export interface ServiceData {
    id: string
    slug: string
    title: string
    subtitle: string
    description: string
    icon: string
    features: string[]
    process: ProcessStep[]
    pricing: string | null
    faq: FaqItem[]
    sortOrder: number
}

function fromDefault(d: (typeof defaultServices)[number]): ServiceData {
    return {
        id: d.slug,
        slug: d.slug,
        title: d.title,
        subtitle: d.subtitle,
        description: d.description,
        icon: d.icon,
        features: d.features,
        process: d.process,
        pricing: d.pricing || null,
        faq: d.faq,
        sortOrder: d.sortOrder,
    }
}

function fromDb(s: {
    id: string; slug: string; title: string; subtitle: string; description: string
    icon: string; features: unknown; process: unknown; pricing: string | null
    faq: unknown; sortOrder: number
}): ServiceData {
    return {
        id: s.id,
        slug: s.slug,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        icon: s.icon,
        features: (s.features as string[] | null) ?? [],
        process: (s.process as ProcessStep[] | null) ?? [],
        pricing: s.pricing,
        faq: (s.faq as FaqItem[] | null) ?? [],
        sortOrder: s.sortOrder,
    }
}

/**
 * Services actifs, triés.
 * Repli sur les 12 par défaut UNIQUEMENT si la table est vide ou indisponible
 * (migration pas encore faite). Dès qu'elle contient des données, la DB fait
 * foi : un service supprimé/désactivé par l'admin ne réapparaît jamais.
 */
export async function getActiveServices(): Promise<ServiceData[]> {
    try {
        const count = await prisma.service.count()
        if (count > 0) {
            const services = await prisma.service.findMany({
                where: { isActive: true },
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
            })
            return services.map(fromDb)
        }
    } catch (error) {
        console.error('getActiveServices: DB indisponible, repli sur les services par défaut', error)
    }
    return defaultServices.map(fromDefault)
}

/** Un service actif par slug. Même règle de repli que getActiveServices. */
export async function getServiceBySlug(slug: string): Promise<ServiceData | null> {
    try {
        const count = await prisma.service.count()
        if (count > 0) {
            const service = await prisma.service.findUnique({ where: { slug } })
            return service && service.isActive ? fromDb(service) : null
        }
    } catch (error) {
        console.error('getServiceBySlug: DB indisponible, repli sur les services par défaut', error)
    }
    const fallback = defaultServices.find((d) => d.slug === slug)
    return fallback ? fromDefault(fallback) : null
}
