import { ServiceDetail } from '@/components/ServiceDetail'
import { Megaphone } from 'lucide-react'

export default function PublicitePage() {
    return (
        <ServiceDetail
            icon={Megaphone}
            title="Publicité & Acquisition"
            subtitle="Meta Ads, Google Ads, TikTok Ads : des campagnes performantes et un ROI optimisé"
            description="Dololka Agency conçoit et pilote vos campagnes publicitaires sur les principales plateformes (Meta, Google, TikTok) pour maximiser vos résultats. Nous mettons en place des stratégies d’acquisition ciblées et mesurables, avec une optimisation continue axée sur le ROI."
            features={[
                'Gestion de campagnes Meta Ads (Facebook, Instagram)',
                'Campagnes Google Ads (Search, Display, YouTube)',
                'Publicité TikTok et plateformes vidéo',
                'Audiences ciblées et lookalike',
                'Retargeting et funnel d’acquisition',
                'Tests A/B et optimisation des créatifs',
                'Suivi des conversions et attribution',
                'Reporting détaillé et recommandations',
            ]}
            process={[
                {
                    title: 'Objectifs & budget',
                    description: 'Définition de vos objectifs (trafic, leads, ventes), de votre budget et des KPIs de succès.',
                },
                {
                    title: 'Stratégie & ciblage',
                    description: 'Choix des canaux, définition des audiences, création des campagnes et des créatifs publicitaires.',
                },
                {
                    title: 'Lancement & tests',
                    description: 'Mise en ligne des campagnes, tests de variantes et réglages selon les premiers résultats.',
                },
                {
                    title: 'Optimisation continue',
                    description: 'Analyse des performances, ajustement des enchères, des audiences et des créatifs pour maximiser le ROI.',
                },
            ]}
            pricing="Gestion de campagnes à partir de votre budget publicitaire. Honoraires de gestion adaptés au volume et à la complexité de vos campagnes."
            faq={[
                {
                    q: 'Quel budget minimum pour démarrer ?',
                    a: 'Nous recommandons un budget publicitaire d’au moins 500 €/mois par plateforme pour obtenir des résultats significatifs. Les honoraires de gestion sont définis en fonction du volume.',
                },
                {
                    q: 'Comment mesurez-vous le ROI ?',
                    a: 'Nous configurons le suivi des conversions (formulaires, achats, appels) et utilisons les outils d’attribution (Meta Pixel, Google Analytics, etc.) pour mesurer l’impact réel de vos campagnes.',
                },
                {
                    q: 'Gérez-vous les créatifs publicitaires ?',
                    a: 'Oui. Notre équipe créative conçoit les visuels, vidéos et textes nécessaires. Nous pouvons aussi adapter vos contenus existants au format publicitaire.',
                },
                {
                    q: 'Combien de temps avant de voir des résultats ?',
                    a: 'Les premières données significatives arrivent généralement sous 2 à 4 semaines. L’optimisation continue permet d’améliorer les performances au fil des mois.',
                },
            ]}
        />
    )
}
