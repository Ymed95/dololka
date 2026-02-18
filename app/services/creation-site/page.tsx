import { ServiceDetail } from '@/components/ServiceDetail'
import { Globe } from 'lucide-react'

export default function CreationSitePage() {
    return (
        <ServiceDetail
            icon={Globe}
            title="Création de Site Internet"
            subtitle="Sites web professionnels, e-commerce et landing pages optimisés pour convertir"
            description="Chez Dololka Agency, nous concevons des sites internet sur mesure qui incarnent votre marque et génèrent des résultats. Que vous ayez besoin d'un site vitrine, d'une boutique en ligne ou d'une landing page dédiée, notre équipe assure un design moderne, responsive et une optimisation SEO intégrée dès le départ."
            features={[
                'Web design sur mesure et interfaces utilisateur optimisées',
                'Sites e-commerce avec tunnel de vente optimisé',
                'Landing pages à forte conversion pour vos campagnes',
                'Optimisation SEO technique et éditoriale',
                'Design responsive (mobile, tablette, desktop)',
                'Intégration de formulaires et outils marketing',
                'Hébergement sécurisé et maintenance continue',
                'Analytics et suivi des performances',
            ]}
            process={[
                {
                    title: 'Brief & stratégie',
                    description: 'Échange approfondi sur vos objectifs, cibles et contraintes. Définition de l’arborescence et du cahier des charges.',
                },
                {
                    title: 'Maquettes & UX',
                    description: 'Création de maquettes wireframes puis designs au plus près de votre identité de marque. Validation étape par étape.',
                },
                {
                    title: 'Développement',
                    description: 'Intégration des maquettes, développement des fonctionnalités et tests qualité sur tous les navigateurs et appareils.',
                },
                {
                    title: 'Mise en ligne & formation',
                    description: 'Mise en production, paramétrage SEO et formation à l’utilisation de votre nouvel outil.',
                },
            ]}
            pricing="Devis personnalisé selon la nature du projet (vitrine, e-commerce, landing page). Tarifs transparents dès le premier échange."
            faq={[
                {
                    q: 'Combien de temps prend la création d’un site ?',
                    a: 'La durée varie selon le périmètre : 4 à 8 semaines pour un site vitrine, 8 à 16 semaines pour un site e-commerce complet. Un planning détaillé vous est remis dès la validation du projet.',
                },
                {
                    q: 'Proposez-vous l’hébergement et la maintenance ?',
                    a: 'Oui. Nous pouvons gérer l’hébergement sur des serveurs performants et sécurisés, ainsi que des formules de maintenance (mises à jour, sauvegardes, corrections) adaptées à vos besoins.',
                },
                {
                    q: 'Mon site sera-t-il optimisé pour le référencement ?',
                    a: 'Tous nos sites intègrent les bonnes pratiques SEO dès la conception : structure sémantique, balises, meta, performances et contenu pensé pour les moteurs de recherche.',
                },
                {
                    q: 'Quelles technologies utilisez-vous ?',
                    a: 'Nous travaillons avec des technologies modernes et pérennes (Next.js, React, CMS headless) pour des sites rapides, sécurisés et évolutifs.',
                },
            ]}
        />
    )
}
