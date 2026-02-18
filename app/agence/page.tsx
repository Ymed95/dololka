import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import {
    Target, Eye, Lightbulb, Rocket, Users, Award, Heart, ArrowRight,
    CheckCircle2
} from 'lucide-react'

const values = [
    {
        icon: Target,
        title: 'Engagement',
        description: 'Nous nous investissons à 100% dans chaque projet comme si c\'était le nôtre.',
    },
    {
        icon: Lightbulb,
        title: 'Créativité',
        description: 'Des idées originales et des solutions innovantes pour vous démarquer.',
    },
    {
        icon: Heart,
        title: 'Passion',
        description: 'Chaque projet est une opportunité de créer quelque chose d\'exceptionnel.',
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'La qualité n\'est pas une option, c\'est notre standard minimum.',
    },
]

const process = [
    {
        step: '01',
        title: 'Écoute & Analyse',
        description: 'On prend le temps de comprendre votre vision, vos objectifs et votre marché.',
    },
    {
        step: '02',
        title: 'Stratégie & Proposition',
        description: 'On vous présente un plan d\'action clair avec un devis détaillé.',
    },
    {
        step: '03',
        title: 'Création & Production',
        description: 'Notre équipe se met au travail et vous tient informé à chaque étape.',
    },
    {
        step: '04',
        title: 'Livraison & Suivi',
        description: 'On vous livre un résultat impeccable et on reste disponibles pour la suite.',
    },
]

export default function AgencePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                            L'Agence
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Une agence{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                                360°
                            </span>
                            {' '}au service de votre ambition
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8">
                            Dololka Agency accompagne les entrepreneurs, TPE et PME dans le développement de leur image de marque et leur présence digitale. Du branding au textile, du web à la publicité — on fait tout, et on le fait bien.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission / Vision */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Rocket className="w-5 h-5 text-primary-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Notre Mission</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Rendre accessibles les services de communication professionnelle à tous les entrepreneurs. Nous croyons que chaque projet mérite une image à la hauteur de son ambition, quel que soit le budget.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-secondary-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Notre Vision</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Devenir l'agence de référence pour les entrepreneurs et créateurs qui veulent une présence de marque forte et cohérente, du digital au physique, sans compromis sur la qualité.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Valeurs</h2>
                        <p className="text-lg text-gray-600">Ce qui nous anime au quotidien</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v) => {
                            const Icon = v.icon
                            return (
                                <div key={v.title} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                                    <p className="text-gray-600 text-sm">{v.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Méthode</h2>
                        <p className="text-lg text-gray-600">Un processus simple et efficace</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((p) => (
                            <div key={p.step} className="relative">
                                <div className="text-5xl font-black text-primary-100 mb-4">{p.step}</div>
                                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                                <p className="text-gray-600 text-sm">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What we offer summary */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ce qu'on fait pour vous</h2>
                            <div className="space-y-3">
                                {[
                                    'Création de sites web & e-commerce',
                                    'Identité visuelle & branding complet',
                                    'Gestion et animation des réseaux sociaux',
                                    'Campagnes publicitaires (Meta, Google, TikTok)',
                                    'Création de contenu photo & vidéo',
                                    'Conception d\'enseignes et signalétique',
                                    'Production textile & personnalisation',
                                    'Conseil en stratégie & développement',
                                    'Lancement et accompagnement de marques',
                                    'E-commerce & vente en ligne',
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white text-center">
                                <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                                <div className="text-4xl md:text-5xl font-black mb-2">150+</div>
                                <p className="text-primary-100 text-lg">projets réalisés</p>
                                <div className="mt-6">
                                    <Link href="/portfolio" className="inline-flex items-center text-white font-medium hover:underline">
                                        Voir nos réalisations <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Envie de travailler ensemble ?</h2>
                    <p className="text-lg mb-8 text-primary-100">
                        Discutons de votre projet autour d'un premier échange gratuit et sans engagement
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                            Nous contacter
                        </Link>
                        <Link href="/services" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                            Voir nos services
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
