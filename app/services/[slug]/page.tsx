import { notFound } from 'next/navigation'
import { ServiceDetail } from '@/components/ServiceDetail'
import { getServiceIcon } from '@/lib/serviceIcons'
import { getServiceBySlug } from '@/lib/servicesData'

// Page de service dynamique : le contenu vient de la base (gérable via l'admin),
// avec repli sur les 12 services historiques tant que la DB n'est pas migrée.
// force-dynamic : pas de pré-rendu au build (la DB n'y est pas accessible).
export const dynamic = 'force-dynamic'

export default async function ServicePage({ params }: { params: { slug: string } }) {
    const service = await getServiceBySlug(params.slug)
    if (!service) notFound()

    return (
        <ServiceDetail
            icon={getServiceIcon(service.icon)}
            title={service.title}
            subtitle={service.subtitle}
            description={service.description}
            features={service.features}
            process={service.process}
            pricing={service.pricing ?? undefined}
            faq={service.faq.length > 0 ? service.faq : undefined}
        />
    )
}
