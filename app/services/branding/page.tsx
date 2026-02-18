import { ServiceDetail } from '@/components/ServiceDetail'
import { PenTool } from 'lucide-react'

export default function BrandingPage() {
    return (
        <ServiceDetail
            icon={PenTool}
            title="Branding & Positionnement"
            subtitle="Identité de marque, storytelling et guidelines pour une présence mémorable"
            description="Dololka Agency vous accompagne pour définir et incarner une identité de marque forte. Du positionnement stratégique au storytelling en passant par les brand guidelines, nous créons les fondations qui permettent à votre marque de rayonner de manière cohérente et durable."
            features={[
                'Définition du positionnement et de la proposition de valeur',
                'Identité de marque (nom, tagline, promesse)',
                'Storytelling et narrative de marque',
                'Charte de marque et brand guidelines',
                'Ton de voix et personnalité de la marque',
                'Étude de concurrence et différentiation',
                'Architecture de marque (marque-mère, sous-marques)',
                'Support de déploiement (présentations, formations)',
            ]}
            process={[
                {
                    title: 'Immersion',
                    description: 'Ateliers de découverte : vision, valeurs, cibles, concurrence. Cartographie de votre écosystème et de vos forces.',
                },
                {
                    title: 'Stratégie',
                    description: 'Définition du positionnement, de la proposition de valeur et du storytelling. Validation des axes stratégiques.',
                },
                {
                    title: 'Identité',
                    description: 'Création ou consolidation de l’identité visuelle et verbale. Charte de marque et guidelines d’utilisation.',
                },
                {
                    title: 'Déploiement',
                    description: 'Livraison des livrables et accompagnement pour déployer l’identité sur tous vos outils et supports.',
                },
            ]}
            pricing="Projet sur mesure selon le périmètre : positionnement seul, identité complète ou accompagnement global. Devis établi après brief détaillé."
            faq={[
                {
                    q: 'Quelle est la différence avec la création graphique ?',
                    a: 'Le branding couvre la stratégie (positionnement, storytelling, ton de voix) et les fondations de la marque. La création graphique en est l’expression visuelle concrète (logo, charte, supports). Les deux sont complémentaires.',
                },
                {
                    q: 'Faut-il avoir une marque existante pour faire du branding ?',
                    a: 'Non. Nous accompagnons autant les nouvelles marques (création from scratch) que les marques existantes qui souhaitent se repositionner ou consolider leur identité.',
                },
                {
                    q: 'Combien de temps dure un projet de branding ?',
                    a: 'Un projet complet (positionnement + identité + guidelines) prend généralement 6 à 12 semaines, selon la complexité et le nombre d’ateliers et de validations.',
                },
                {
                    q: 'Incluez-vous l’identité visuelle (logo, couleurs) ?',
                    a: 'Oui. Les projets de branding peuvent inclure l’identité visuelle complète (logo, palette, typographies, déclinaisons). Nous proposons aussi un pack branding + graphisme pour un accompagnement 360°.',
                },
            ]}
        />
    )
}
