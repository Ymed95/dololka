import { ServiceDetail } from '@/components/ServiceDetail'
import { Sparkles } from 'lucide-react'

export default function ProductionTextilePage() {
    return (
        <ServiceDetail
            icon={Sparkles}
            title="Production & Fabrication Textile"
            subtitle="Sérigraphie, broderie, DTF, flocage — production en petite et grande série"
            description="Dololka Agency assure la production et la fabrication textile de vos produits personnalisés. Sérigraphie, broderie, DTF (Direct to Film), flocage : nous maîtrisons les principales techniques d’impression et proposons des solutions adaptées à la petite comme à la grande série. Qualité premium, délais maîtrisés et accompagnement de A à Z pour des produits qui incarnent votre marque."
            features={[
                'Sérigraphie pour tirages en série (tee-shirts, sweats, accessoires)',
                'Broderie sur vêtements, sacs et objets textiles',
                'Impression DTF pour petits volumes et tests',
                'Flocage et transferts personnalisés',
                'Production en petite série (à partir de 10 pièces)',
                'Production en grande série avec tarifs dégressifs',
                'Sélection de matières premium (coton, polyester, mélange)',
                'Contrôle qualité et livraison soignée',
            ]}
            process={[
                {
                    title: 'Brief & fichiers',
                    description: 'Réception de vos visuels (vectoriels pour la sérigraphie), validation des couleurs et des positions d’impression.',
                },
                {
                    title: 'Devis & validation',
                    description: 'Devis détaillé selon la technique, les quantités et les supports. Validation et confirmation de la commande.',
                },
                {
                    title: 'Production',
                    description: 'Mise en production dans nos ateliers partenaires : préparation des écrans, broderie, impression DTF ou flocage.',
                },
                {
                    title: 'Contrôle & livraison',
                    description: 'Contrôle qualité avant expédition, conditionnement soigné et livraison à l’adresse de votre choix.',
                },
            ]}
            pricing="Tarifs selon la technique (sérigraphie, broderie, DTF, flocage), les quantités et les couleurs. Devis gratuit sous 48h."
            faq={[
                {
                    q: 'Quelle est la quantité minimum pour la sérigraphie ?',
                    a: 'Généralement à partir de 10 à 20 pièces selon le modèle et le nombre de couleurs. Pour des quantités plus faibles, le DTF est plus adapté.',
                },
                {
                    q: 'Fournissez-vous les textiles ou apportez-vous les vôtres ?',
                    a: 'Les deux. Nous pouvons sourcer des supports de qualité ou travailler sur vos propres pièces fournies (BYOG - Bring Your Own Garment).',
                },
                {
                    q: 'Combien de temps pour une commande ?',
                    a: 'Délai standard de 7 à 15 jours selon la technique et le volume. Urgences possibles sous réserve de disponibilité.',
                },
                {
                    q: 'Quel format de fichier pour les visuels ?',
                    a: 'Pour la sérigraphie : fichiers vectoriels (AI, EPS, PDF). Pour le DTF et le flocage : haute résolution (300 dpi minimum).',
                },
            ]}
        />
    )
}
