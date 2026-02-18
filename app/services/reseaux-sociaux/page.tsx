import { ServiceDetail } from '@/components/ServiceDetail'
import { BarChart3 } from 'lucide-react'

export default function ReseauxSociauxPage() {
    return (
        <ServiceDetail
            icon={BarChart3}
            title="Gestion des Réseaux Sociaux"
            subtitle="Une présence professionnelle et engageante sur toutes les plateformes"
            description="Les réseaux sociaux sont le premier point de contact avec vos clients. Nous prenons en charge la stratégie, la création de contenu et la gestion quotidienne de vos comptes pour développer votre audience et convertir vos abonnés en clients."
            features={[
                'Audit et stratégie social media personnalisée',
                'Création de contenu visuel et rédactionnel',
                'Planning éditorial mensuel',
                'Publication et programmation des posts',
                'Community management et modération',
                'Stories, Reels et contenus courts',
                'Reporting mensuel avec KPIs détaillés',
                'Veille concurrentielle et tendances',
            ]}
            process={[
                { title: 'Audit', description: 'Analyse de vos comptes actuels, votre audience et vos concurrents.' },
                { title: 'Stratégie', description: 'Définition de la ligne éditoriale, du ton et des objectifs.' },
                { title: 'Création', description: 'Production du contenu, validation et publication selon le planning.' },
                { title: 'Reporting', description: 'Analyse des performances mensuelles et recommandations d\'optimisation.' },
            ]}
            pricing="À partir de 400€/mois par plateforme"
            faq={[
                { q: 'Sur quelles plateformes intervenez-vous ?', a: 'Instagram, TikTok, Facebook, LinkedIn, X (Twitter), YouTube et Pinterest.' },
                { q: 'Combien de posts par mois ?', a: 'En général entre 12 et 20 posts par mois par plateforme, selon la formule choisie.' },
                { q: 'Est-ce que je garde le contrôle ?', a: 'Bien sûr. Vous validez chaque contenu avant publication et avez accès au planning en temps réel.' },
            ]}
        />
    )
}
