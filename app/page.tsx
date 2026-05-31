'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import {
    Globe, Palette, Megaphone, Camera, Shirt, PenTool, BarChart3,
    ShoppingBag, Users, ArrowRight, Star, CheckCircle2
} from 'lucide-react'

const heroServices = [
    { icon: Globe, label: 'Sites Web' },
    { icon: Palette, label: 'Design' },
    { icon: Megaphone, label: 'Publicité' },
    { icon: Camera, label: 'Photo & Vidéo' },
    { icon: Shirt, label: 'Textile' },
    { icon: PenTool, label: 'Branding' },
]

const mainServices = [
    {
        icon: Globe,
        title: 'Création de Sites Internet',
        description: 'Sites vitrines, e-commerce, landing pages. Design moderne et optimisé pour la conversion.',
        href: '/services/creation-site',
    },
    {
        icon: Palette,
        title: 'Design & Graphisme',
        description: 'Logos, chartes graphiques, supports print et digital. Une identité visuelle qui marque.',
        href: '/services/graphisme',
    },
    {
        icon: Megaphone,
        title: 'Publicité & Acquisition',
        description: 'Meta Ads, Google Ads, TikTok Ads. Des campagnes qui génèrent des résultats.',
        href: '/services/publicite',
    },
    {
        icon: BarChart3,
        title: 'Réseaux Sociaux',
        description: 'Stratégie, création de contenu et gestion quotidienne de vos réseaux.',
        href: '/services/reseaux-sociaux',
    },
    {
        icon: Camera,
        title: 'Photo & Vidéo',
        description: 'Shootings, vidéos corporate, contenu UGC. Du visuel qui capte l\'attention.',
        href: '/services/photo-video',
    },
    {
        icon: Shirt,
        title: 'Textile & Personnalisation',
        description: 'Personnalisez vos produits textiles avec notre outil en ligne intuitif.',
        href: '/boutique',
    },
]

const stats = [
    { value: '150+', label: 'Projets réalisés' },
    { value: '95%', label: 'Clients satisfaits' },
    { value: '12', label: 'Services proposés' },
    { value: '360°', label: 'Accompagnement' },
]

export default function HomePage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/products?limit=6')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProducts(data.slice(0, 6))
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-400 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                            Agence de communication 360°
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
                            Votre vision,
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-300 via-secondary-400 to-primary-300 drop-shadow-lg">
                                notre expertise
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                            Branding, web, publicité, textile, réseaux sociaux — on gère tout pour propulser votre marque.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                            <Link href="/services" className="group">
                                <Button size="lg" className="w-full sm:w-auto bg-secondary-500 hover:bg-secondary-400 text-primary-900 font-bold px-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                    Découvrir nos services
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/contact" className="group">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white hover:text-primary-900 px-8 font-semibold backdrop-blur-sm transition-all duration-300">
                                    Demander un devis
                                </Button>
                            </Link>
                        </div>

                        {/* Service icons */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            {heroServices.map((svc, i) => {
                                const Icon = svc.icon
                                return (
                                    <div key={svc.label} className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 backdrop-blur-sm">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-medium">{svc.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Services</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Un accompagnement complet pour développer votre marque sur tous les fronts
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mainServices.map((service) => {
                            const Icon = service.icon
                            return (
                                <Link key={service.href} href={service.href} className="group">
                                    <div className="bg-white rounded-2xl p-6 h-full border-2 border-gray-100 hover:border-primary-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-md">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors">{service.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                                        <div className="mt-4 flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            En savoir plus <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/services">
                            <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
                                Voir tous nos services
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Boutique Teaser */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Notre Boutique</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Personnalisez vos produits, achetez du textile vierge ou du matériel de personnalisation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <Link href="/boutique?tab=personnalisation" className="group">
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 text-white p-8 h-52 flex flex-col justify-end hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 shadow-xl">
                                <ShoppingBag className="w-10 h-10 mb-3 opacity-80" />
                                <h3 className="text-xl font-bold mb-1">Personnalisation</h3>
                                <p className="text-primary-100 text-sm">Créez vos produits sur mesure avec notre outil en ligne</p>
                            </div>
                        </Link>
                        <Link href="/boutique?tab=textile" className="group">
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary-600 to-secondary-700 text-white p-8 h-52 flex flex-col justify-end hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 shadow-xl">
                                <Shirt className="w-10 h-10 mb-3 opacity-80" />
                                <h3 className="text-xl font-bold mb-1">Textile Vierge</h3>
                                <p className="text-secondary-100 text-sm">T-shirts, hoodies, casquettes sans personnalisation</p>
                            </div>
                        </Link>
                        <Link href="/boutique?tab=materiel" className="group">
                            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 text-white p-8 h-52 flex flex-col justify-end hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 shadow-xl">
                                <PenTool className="w-10 h-10 mb-3 opacity-80" />
                                <h3 className="text-xl font-bold mb-1">Matériel & Fournitures</h3>
                                <p className="text-gray-300 text-sm">Presses à chaud, vinyles, encres et outils pro</p>
                            </div>
                        </Link>
                    </div>

                    {/* Quick product preview */}
                    {!loading && products.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {products.map((product) => (
                                <Link key={product.id} href={`/product/${product.id}`} className="group">
                                    <div className="bg-white rounded-xl p-3 shadow-md hover:shadow-xl hover:-translate-y-1 border border-gray-100 transition-all duration-300">
                                        <div className="relative aspect-square mb-2">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-2"
                                                sizes="(max-width: 768px) 50vw, 16vw"
                                            />
                                        </div>
                                        <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                                        <p className="text-xs text-primary-600 font-bold">{product.price?.toFixed(2)}€</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-8">
                        <Link href="/boutique">
                            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                Visiter la boutique
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Dololka */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pourquoi choisir Dololka&nbsp;Agency ?</h2>
                            <div className="space-y-4">
                                {[
                                    'Agence 360° : un seul interlocuteur pour tous vos besoins',
                                    'Expertise pluridisciplinaire : web, design, pub, textile',
                                    'Tarifs compétitifs adaptés aux TPE/PME et entrepreneurs',
                                    'Réactivité et suivi personnalisé sur chaque projet',
                                    'Résultats mesurables et transparence totale',
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <Link href="/agence">
                                    <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
                                        Découvrir l'agence
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Users, title: 'Équipe dédiée', desc: 'Des experts passionnés à votre service' },
                                { icon: Star, title: 'Qualité premium', desc: 'Excellence sur chaque projet' },
                                { icon: BarChart3, title: 'ROI garanti', desc: 'Des résultats concrets et mesurables' },
                                { icon: Megaphone, title: 'Visibilité max', desc: 'Stratégies qui font la différence' },
                            ].map((card) => {
                                const Icon = card.icon
                                return (
                                    <div key={card.title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-shadow">
                                        <Icon className="w-8 h-8 text-primary-600 mb-3" />
                                        <h4 className="font-bold text-sm mb-1">{card.title}</h4>
                                        <p className="text-gray-600 text-xs">{card.desc}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 text-white shadow-2xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à faire décoller votre marque ?</h2>
                    <p className="text-lg md:text-xl mb-8 text-primary-100">
                        Contactez-nous pour un premier échange gratuit et sans engagement
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact">
                            <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 px-8">
                                Demander un devis gratuit
                            </Button>
                        </Link>
                        <Link href="/boutique">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-8">
                                Visiter la boutique
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
