import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import {
    Globe, Palette, Megaphone, Camera, Shirt, PenTool, BarChart3,
    ShoppingBag, Users, Lightbulb, Building2, Sparkles, ArrowRight
} from 'lucide-react'

const services = [
    {
        icon: Globe,
        title: 'Création de site internet',
        description: 'Sites vitrines, e-commerce, landing pages et applications web. Design sur mesure, responsive et optimisé SEO pour maximiser votre visibilité.',
        href: '/services/creation-site',
        features: ['Site vitrine', 'E-commerce', 'Landing page', 'SEO'],
    },
    {
        icon: Palette,
        title: 'Création digitale & graphisme',
        description: 'Logos, chartes graphiques, supports print et digital. Nous créons une identité visuelle forte et cohérente qui vous ressemble.',
        href: '/services/graphisme',
        features: ['Logo', 'Charte graphique', 'Flyers', 'Brochures'],
    },
    {
        icon: BarChart3,
        title: 'Gestion des réseaux sociaux',
        description: 'Stratégie social media, création de contenu, planification et community management sur toutes les plateformes.',
        href: '/services/reseaux-sociaux',
        features: ['Instagram', 'TikTok', 'Facebook', 'LinkedIn'],
    },
    {
        icon: Megaphone,
        title: 'Publicité & acquisition',
        description: 'Campagnes publicitaires performantes sur Meta, Google et TikTok. Optimisation continue pour un ROI maximal.',
        href: '/services/publicite',
        features: ['Meta Ads', 'Google Ads', 'TikTok Ads', 'Retargeting'],
    },
    {
        icon: PenTool,
        title: 'Branding & positionnement',
        description: 'Définition de votre identité de marque, positionnement stratégique, storytelling et brand guidelines complètes.',
        href: '/services/branding',
        features: ['Identité de marque', 'Storytelling', 'Positionnement', 'Guidelines'],
    },
    {
        icon: Building2,
        title: 'Enseignes sur mesure',
        description: 'Conception et fabrication d\'enseignes lumineuses, signalétique, vitrophanie et covering.',
        href: '/services/enseignes',
        features: ['Enseigne lumineuse', 'Signalétique', 'Vitrine', 'Covering'],
    },
    {
        icon: Camera,
        title: 'Photo & vidéo',
        description: 'Shootings photo professionnels, vidéos corporate, Reels, contenu UGC et montage vidéo.',
        href: '/services/photo-video',
        features: ['Shooting', 'Vidéo corporate', 'Reels', 'UGC'],
    },
    {
        icon: Shirt,
        title: 'Accompagnement marque textile',
        description: 'De l\'idée à la production : création de collections, sourcing, patronage, prototypes et lancement.',
        href: '/services/textile',
        features: ['Collection', 'Sourcing', 'Prototypage', 'Production'],
    },
    {
        icon: Lightbulb,
        title: 'Conseil & stratégie',
        description: 'Audit de votre communication, plan d\'action stratégique, coaching et accompagnement business.',
        href: '/services/conseil',
        features: ['Audit', 'Stratégie', 'Coaching', 'Business plan'],
    },
    {
        icon: ShoppingBag,
        title: 'E-commerce & business en ligne',
        description: 'Création de boutiques en ligne Shopify, WooCommerce ou sur mesure. Tunnel de vente et automatisation.',
        href: '/services/ecommerce',
        features: ['Shopify', 'WooCommerce', 'Tunnel de vente', 'Automation'],
    },
    {
        icon: Sparkles,
        title: 'Production & fabrication textile',
        description: 'Sérigraphie, broderie, DTF, flocage. Production en petite et grande série avec des matériaux premium.',
        href: '/services/production-textile',
        features: ['Sérigraphie', 'Broderie', 'DTF', 'Flocage'],
    },
    {
        icon: Users,
        title: 'Community building & influence',
        description: 'Création et animation de communautés, partenariats influenceurs, marketing d\'influence et UGC.',
        href: '/services/community',
        features: ['Communauté', 'Influenceurs', 'UGC', 'Engagement'],
    },
]

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                        Nos{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                            Services
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                        12 expertises complémentaires pour un accompagnement 360° de votre marque
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => {
                            const Icon = service.icon
                            return (
                                <Link key={service.href} href={service.href} className="group">
                                    <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors">{service.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{service.description}</p>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {service.features.map((f) => (
                                                <span key={f} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">{f}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center text-primary-600 text-sm font-medium">
                                            En savoir plus <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Besoin d'un service sur mesure ?</h2>
                    <p className="text-lg mb-8 text-primary-100">
                        Chaque projet est unique. Contactez-nous pour un devis personnalisé et gratuit.
                    </p>
                    <Link href="/contact" className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                        Demander un devis <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
