import { ServiceDetail } from '@/components/ServiceDetail'
import { Users } from 'lucide-react'

export default function CommunityPage() {
    return (
        <ServiceDetail
            icon={Users}
            title="Community Building & Influence"
            subtitle="Créez une communauté engagée autour de votre marque et exploitez le pouvoir de l'influence"
            description="Dans un monde où l'authenticité est reine, construire une communauté fidèle et engagée est un levier de croissance puissant. Nous vous accompagnons dans la création et l'animation de votre communauté, ainsi que dans la mise en place de stratégies d'influence marketing pour amplifier votre message."
            features={[
                'Stratégie de community building sur mesure',
                'Identification et partenariats avec des influenceurs',
                'Campagnes UGC (User Generated Content)',
                'Animation de groupes et communautés en ligne',
                'Organisation d\'événements et meetups',
                'Programmes ambassadeurs de marque',
                'Analyse des KPIs d\'engagement',
                'Gestion des micro et macro influenceurs',
            ]}
            process={[
                { title: 'Audit & Stratégie', description: 'Analyse de votre audience cible et définition de la stratégie communautaire.' },
                { title: 'Identification', description: 'Recherche et sélection des influenceurs et créateurs pertinents.' },
                { title: 'Activation', description: 'Lancement des campagnes, partenariats et actions communautaires.' },
                { title: 'Optimisation', description: 'Mesure des résultats et ajustement continu pour maximiser l\'impact.' },
            ]}
            pricing="À partir de 500€/mois pour la gestion communautaire"
            faq={[
                { q: 'Combien de followers faut-il pour commencer ?', a: 'Aucun minimum requis. On peut démarrer une communauté de zéro et la construire stratégiquement.' },
                { q: 'Travaillez-vous avec des micro-influenceurs ?', a: 'Absolument ! Les micro-influenceurs ont souvent un meilleur taux d\'engagement et sont plus authentiques.' },
                { q: 'Comment mesurez-vous les résultats ?', a: 'Nous suivons les KPIs clés : engagement, croissance, portée, conversions et retour sur investissement.' },
            ]}
        />
    )
}
