import { ServiceDetail } from '@/components/ServiceDetail'
import { Palette } from 'lucide-react'

export default function GraphismePage() {
    return (
        <ServiceDetail
            icon={Palette}
            title="Création Digitale & Graphisme"
            subtitle="Identité visuelle, logos et supports print & digital qui distinguent votre marque"
            description="Dololka Agency crée des identités visuelles percutantes qui marquent les esprits. Du logo à la charte graphique complète, en passant par vos supports print et digital, nous assurons une cohérence visuelle forte sur tous les points de contact avec vos clients."
            features={[
                'Création de logos et déclinaisons',
                'Charte graphique complète (couleurs, typographies, visuels)',
                'Supports print : flyers, brochures, affiches, cartes de visite',
                'Supports digital : bannières, visuels réseaux sociaux, emailings',
                'Packaging et habillages produits',
                'Templates et outils éditoriaux',
                'Conformité aux standards d’impression (CMJN, traits de coupe)',
                'Livraison de fichiers sources et guides d’utilisation',
            ]}
            process={[
                {
                    title: 'Découverte',
                    description: 'Analyse de votre secteur, de vos concurrents et de votre positionnement. Définition du brief créatif.',
                },
                {
                    title: 'Direction artistique',
                    description: 'Esquisses et propositions de concepts visuels. Choix des axes graphiques validés avec vous.',
                },
                {
                    title: 'Production',
                    description: 'Finalisation des visuels, création de la charte et déclinaisons sur tous les supports retenus.',
                },
                {
                    title: 'Livraison',
                    description: 'Remise des fichiers (print & web), des guides de style et du matériel clé en main.',
                },
            ]}
            pricing="Projet à la carte ou pack complet (logo + charte + supports). Nous adaptons nos tarifs à vos besoins et à la quantité de supports."
            faq={[
                {
                    q: 'Combien de propositions de logo recevrai-je ?',
                    a: 'En fonction du pack choisi, nous vous présentons 2 à 4 propositions de concepts différents, avec des variantes autour de vos favoris jusqu’à validation finale.',
                },
                {
                    q: 'Puis-je utiliser mes visuels sur tous mes supports ?',
                    a: 'Oui. La charte graphique et les fichiers livrés vous permettent une utilisation cohérente sur supports print et digital, avec des règles claires pour préserver votre identité.',
                },
                {
                    q: 'Faites-vous l’impression des supports print ?',
                    a: 'Nous préparons les fichiers imprimables (prêt à l’impression). Nous pouvons aussi vous orienter vers des imprimeurs partenaires ou gérer l’impression pour vous.',
                },
                {
                    q: 'Quels formats de fichiers sont livrés ?',
                    a: 'Nous livrons les formats adaptés à chaque usage : vecteurs (AI, SVG) pour le logo, PDF haute résolution pour l’impression, PNG/JPG pour le digital et la charte au format PDF.',
                },
            ]}
        />
    )
}
