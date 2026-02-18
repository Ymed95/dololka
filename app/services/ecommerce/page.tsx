import { ServiceDetail } from '@/components/ServiceDetail'
import { ShoppingBag } from 'lucide-react'

export default function EcommercePage() {
    return (
        <ServiceDetail
            icon={ShoppingBag}
            title="E-commerce & Business en Ligne"
            subtitle="Création de boutiques en ligne, tunnels de vente et automatisation pour booster vos ventes"
            description="Dololka Agency conçoit et déploie votre stratégie e-commerce de A à Z. Que vous choisissiez Shopify, WooCommerce ou une solution sur mesure, nous créons des boutiques en ligne performantes, des tunnels de vente optimisés et des automatisations qui convertissent. Notre objectif : transformer vos visiteurs en clients fidèles et maximiser votre chiffre d'affaires en ligne."
            features={[
                'Création de boutiques Shopify, WooCommerce ou sur mesure',
                'Design e-commerce optimisé pour la conversion',
                'Tunnels de vente (funnels) et pages de capture',
                'Automatisation des processus (emails, relances, stocks)',
                'Intégration des moyens de paiement et livraison',
                'Optimisation SEO et stratégie de contenu produit',
                'Analytics et suivi des performances de vente',
                'Formation et accompagnement à l\'exploitation',
            ]}
            process={[
                {
                    title: 'Stratégie & conception',
                    description: 'Analyse de votre marché, définition de l’architecture, choix de la solution technique et conception de l’expérience utilisateur.',
                },
                {
                    title: 'Développement & intégration',
                    description: 'Création de la boutique, intégration des produits, paiements, livraisons et connexion des outils marketing.',
                },
                {
                    title: 'Tunnels & automatisation',
                    description: 'Mise en place des funnels, séquences email, relances panier abandonné et autres automatisations de conversion.',
                },
                {
                    title: 'Lancement & optimisation',
                    description: 'Tests, mise en ligne, formation à l’usage et suivi continu pour améliorer les performances de vente.',
                },
            ]}
            pricing="Devis personnalisé selon la solution (Shopify, WooCommerce, sur mesure), le nombre de produits et les fonctionnalités demandées. Paiement possible en plusieurs fois."
            faq={[
                {
                    q: 'Shopify ou WooCommerce : que recommandez-vous ?',
                    a: 'Shopify convient aux débutants et aux projets nécessitant une mise en ligne rapide. WooCommerce offre plus de flexibilité et est idéal si vous avez déjà un site WordPress.',
                },
                {
                    q: 'Prenez-vous en charge la gestion des stocks et des commandes ?',
                    a: 'Nous configurons tous les outils (stock, commandes, livraison). L’exploitation au quotidien reste à votre charge, avec possibilité de formation et support.',
                },
                {
                    q: 'Combien coûte une boutique e-commerce ?',
                    a: 'Les tarifs varient selon la complexité : à partir de quelques milliers d’euros pour une boutique standard, davantage pour des solutions sur mesure ou des volumétries importantes.',
                },
                {
                    q: 'Pouvez-vous créer des tunnels de vente sans boutique complète ?',
                    a: 'Oui. Nous réalisons des pages de vente, formulaires de capture et séquences email pour vendre des produits ou services sans site e-commerce complet.',
                },
            ]}
        />
    )
}
