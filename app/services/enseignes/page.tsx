import { ServiceDetail } from '@/components/ServiceDetail'
import { Building2 } from 'lucide-react'

export default function EnseignesPage() {
    return (
        <ServiceDetail
            icon={Building2}
            title="Enseignes Sur Mesure"
            subtitle="Signalétique, enseignes lumineuses, habillage vitrine et covering personnalisé"
            description="Dololka Agency conçoit et réalise des enseignes et de la signalétique sur mesure pour valoriser votre commerce ou votre entreprise. De l’enseigne lumineuse à l’habillage vitrine en passant par le covering véhicule, nous créons des solutions durables et impactantes qui renforcent votre visibilité."
            features={[
                'Enseignes lumineuses (néon, LED, lettres 3D)',
                'Signalétique intérieure et extérieure',
                'Habillage vitrine et devanture',
                'Covering véhicule et flotte',
                'Lettres et logos en relief',
                'Panneaux et totems',
                'Conception sur mesure et devis détaillé',
                'Installation et mise en place',
            ]}
            process={[
                {
                    title: 'Consultation',
                    description: 'Visite ou échange pour comprendre vos besoins, vos contraintes (règlementation, façade) et vos objectifs visuels.',
                },
                {
                    title: 'Conception',
                    description: 'Proposition de designs, matériaux et techniques adaptés. Devis personnalisé et plan de pose.',
                },
                {
                    title: 'Fabrication',
                    description: 'Réalisation des enseignes et supports dans nos ateliers ou avec nos partenaires qualifiés.',
                },
                {
                    title: 'Installation',
                    description: 'Pose sur site, raccordements si nécessaire et vérification du bon fonctionnement.',
                },
            ]}
            pricing="Devis gratuit selon vos dimensions, matériaux et techniques. Les prix varient selon le type d’enseigne (lumineuse, lettres, covering) et la surface."
            faq={[
                {
                    q: 'Quels types d’enseignes proposez-vous ?',
                    a: 'Enseignes lumineuses (LED, néon), lettres en relief (alu, acrylique, bois), panneaux, totems, habillage vitrine (adhésifs, stores) et covering véhicule.',
                },
                {
                    q: 'Faut-il une autorisation pour une enseigne ?',
                    a: 'Selon la commune et le type d’enseigne, une déclaration préalable ou un permis peut être requis. Nous vous guidons dans les démarches administratives.',
                },
                {
                    q: 'Proposez-vous l’installation ?',
                    a: 'Oui. Nous assurons la pose sur site pour les enseignes et signalétiques. Pour les travaux en hauteur, nous faisons appel à des installateurs agréés.',
                },
                {
                    q: 'Quelle est la durée de vie d’une enseigne ?',
                    a: 'Une enseigne LED bien entretenue dure généralement 8 à 15 ans. Les lettres et supports en matériaux durables (alu, acrylique) restent en bon état pendant de nombreuses années.',
                },
            ]}
        />
    )
}
