import { ServiceDetail } from '@/components/ServiceDetail'
import { Camera } from 'lucide-react'

export default function PhotoVideoPage() {
    return (
        <ServiceDetail
            icon={Camera}
            title="Photo & Vidéo"
            subtitle="Shootings professionnels, vidéos corporate, Reels et contenu UGC pour une marque qui marque"
            description="Dololka Agency met son expertise photo et vidéo au service de votre communication visuelle. Nous réalisons des shootings photo professionnels, des vidéos corporate, des Reels engageants et du contenu UGC authentique. Notre équipe combine créativité et maîtrise technique pour produire des visuels qui renforcent votre identité et boostent votre présence digitale."
            features={[
                'Shootings photo produits et lifestyle pour e-commerce',
                'Vidéos corporate et institutionnelles',
                'Reels et contenus courts optimisés pour les réseaux sociaux',
                'Contenu UGC (User Generated Content) authentique et engageant',
                'Direction artistique et mise en scène sur mesure',
                'Post-production : retouche photo et montage vidéo',
                'Conseil en stratégie de contenu visuel',
                'Packages photo + vidéo pour campagnes 360°',
            ]}
            process={[
                {
                    title: 'Brief créatif',
                    description: 'Échange sur votre univers de marque, vos objectifs et les supports envisagés. Définition du concept visuel et du ton.',
                },
                {
                    title: 'Préproduction',
                    description: 'Scénario ou storyboard, repérage, casting si nécessaire, planification du tournage et sélection des équipements.',
                },
                {
                    title: 'Tournage',
                    description: 'Journée(s) de shooting en studio ou en extérieur, avec notre équipe technique et créative dédiée.',
                },
                {
                    title: 'Post-production & livraison',
                    description: 'Retouches, montage, étalonnage et livraison des fichiers optimisés selon vos supports de diffusion.',
                },
            ]}
            pricing="Devis sur mesure selon le type de prestation (shooting, vidéo, Reels, pack complet). Tarifs dégressifs pour les commandes récurrentes."
            faq={[
                {
                    q: 'Fournissez-vous les modèles ou doit-on les trouver nous-mêmes ?',
                    a: 'Nous pouvons organiser le casting et sélectionner des modèles adaptés à votre marque, ou travailler avec vos propres équipes et ambassadeurs.',
                },
                {
                    q: 'Livrez-vous du contenu brut ou retravaillé ?',
                    a: 'Nous livrons des visuels retouchés et montés, prêts à l’emploi. Le brut peut être fourni sur demande pour archivage ou exploitation ultérieure.',
                },
                {
                    q: 'Pouvez-vous adapter les formats pour Instagram, TikTok, LinkedIn ?',
                    a: 'Oui. Tous nos contenus sont livrés en plusieurs formats (9:16, 1:1, 16:9) pour une diffusion optimale sur chaque plateforme.',
                },
                {
                    q: 'Combien de temps pour une vidéo corporate de 2 minutes ?',
                    a: 'Comptez généralement 3 à 4 semaines entre le brief et la livraison finale, selon la complexité du tournage et des interventions en post-production.',
                },
            ]}
        />
    )
}
