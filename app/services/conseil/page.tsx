import { ServiceDetail } from '@/components/ServiceDetail'
import { Lightbulb } from 'lucide-react'

export default function ConseilPage() {
    return (
        <ServiceDetail
            icon={Lightbulb}
            title="Conseil & Stratégie"
            subtitle="Audit de communication, plan d'action stratégique, coaching et accompagnement business"
            description="Dololka Agency vous accompagne dans la définition et la mise en œuvre de votre stratégie de communication et de développement. Nous réalisons des audits approfondis, élaborons des plans d'action sur mesure et proposons du coaching personnalisé pour structurer votre projet et atteindre vos objectifs business. Notre approche pragmatique allie vision stratégique et opérationnelle."
            features={[
                'Audit complet de votre communication (online et offline)',
                'Plan d\'action stratégique personnalisé et priorisé',
                'Coaching dirigeants et équipes sur la stratégie',
                'Accompagnement business et structuration de projet',
                'Analyse de positionnement et recommandations',
                'Définition d\'indicateurs de performance (KPIs)',
                'Workshops et formations sur-mesure',
                'Suivi et ajustement continu de la stratégie',
            ]}
            process={[
                {
                    title: 'Audit & diagnostic',
                    description: 'Analyse de votre écosystème actuel : marque, communication, concurrence, forces et axes d’amélioration.',
                },
                {
                    title: 'Stratégie & recommandations',
                    description: 'Restitution du diagnostic et proposition d’un plan d’action priorisé avec objectifs mesurables et planning.',
                },
                {
                    title: 'Coaching & mise en œuvre',
                    description: 'Accompagnement dans la mise en œuvre : ateliers, formations, suivi opérationnel et ajustements.',
                },
                {
                    title: 'Suivi & optimisation',
                    description: 'Points réguliers pour mesurer les progrès, adapter la stratégie et pérenniser les bonnes pratiques.',
                },
            ]}
            pricing="Tarifs au forfait pour missions ponctuelles (audit, stratégie) ou accompagnement mensuel (coaching). Devis détaillé après un premier échange découverte."
            faq={[
                {
                    q: 'En quoi consiste l\'audit de communication ?',
                    a: 'Nous analysons votre identité, vos supports, votre présence digitale, votre positionnement face à la concurrence et l’efficacité de vos actions. Un rapport détaillé avec recommandations vous est remis.',
                },
                {
                    q: 'Le coaching est-il individuel ou en équipe ?',
                    a: 'Les deux. Nous proposons du coaching dirigeant, des sessions en équipe et des ateliers collectifs selon vos besoins.',
                },
                {
                    q: 'Combien de temps dure un accompagnement stratégique ?',
                    a: 'La durée varie : 1 à 2 mois pour un audit et une stratégie, plusieurs mois pour un accompagnement coaching avec suivi régulier.',
                },
                {
                    q: 'Proposez-vous des formations ?',
                    a: 'Oui. Nous concevons des formations sur mesure (stratégie, communication, réseaux sociaux, etc.) adaptées à vos équipes et objectifs.',
                },
            ]}
        />
    )
}
