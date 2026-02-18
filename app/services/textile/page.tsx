import { ServiceDetail } from '@/components/ServiceDetail'
import { Shirt } from 'lucide-react'

export default function TextilePage() {
    return (
        <ServiceDetail
            icon={Shirt}
            title="Accompagnement Marque Textile"
            subtitle="De l'idée à la production : création de collections, sourcing, prototypage et lancement"
            description="Dololka Agency accompagne les marques et entrepreneurs dans le développement de leur marque textile. De la création de collections à la production, nous gérons le sourcing de matières et fournisseurs, le patronage, le prototypage et le lancement. Notre expertise vous permet de concrétiser votre vision avec des produits de qualité et une chaîne d'approvisionnement fiable."
            features={[
                'Création de collections cohérentes et tendances',
                'Sourcing de matières premières et fournisseurs qualifiés',
                'Patronage et prototypage sur mesure',
                'Coordination de la production (petite et grande série)',
                'Développement de l\'identité visuelle de la marque',
                'Stratégie de lancement et communication',
                'Accompagnement sur les normes et certifications',
                'Suivi qualité à chaque étape de production',
            ]}
            process={[
                {
                    title: 'Définition & concept',
                    description: 'Workshop créatif pour poser l’ADN de la marque, le positionnement, la gamme et les objectifs de la première collection.',
                },
                {
                    title: 'Sourcing & prototypage',
                    description: 'Recherche de fournisseurs, sélection des matières, création des patrons et réalisation des prototypes.',
                },
                {
                    title: 'Validation & pré-série',
                    description: 'Ajustements sur les prototypes, validation qualité, lancement de la pré-série et tests avant production.',
                },
                {
                    title: 'Production & lancement',
                    description: 'Suivi de la production en série, contrôle qualité, préparation du lancement et accompagnement marketing.',
                },
            ]}
            pricing="Accompagnement au forfait ou à la mission. Devis personnalisé selon le périmètre (collection, nombre de modèles, volume de production)."
            faq={[
                {
                    q: 'Travaillez-vous avec des fournisseurs en France ou à l\'étranger ?',
                    a: 'Nous travaillons avec un réseau de fournisseurs en France, Europe et Asie, selon vos critères de qualité, délais et budget.',
                },
                {
                    q: 'Quel est le volume minimum pour lancer une production ?',
                    a: 'Nous accompagnons des projets à partir de petites séries (dizaines de pièces). Les quantités minimales varient selon les techniques de fabrication.',
                },
                {
                    q: 'Pouvez-vous créer une marque textile de A à Z ?',
                    a: 'Oui. Nous offrons un accompagnement complet : identité, collections, sourcing, production et lancement, en partenariat avec nos experts métier.',
                },
                {
                    q: 'Comment gérez-vous les délais de production ?',
                    a: 'Nous établissons un planning réaliste dès le début et assurons un suivi régulier avec les ateliers pour respecter les échéances convenues.',
                },
            ]}
        />
    )
}
