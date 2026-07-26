import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getActiveServices } from '@/lib/servicesData'
import { getServiceIcon } from '@/lib/serviceIcons'

export const metadata: Metadata = {
    title: 'Nos services de communication',
    description:
        "Création de sites web, graphisme, réseaux sociaux, publicité, branding, enseignes, photo-vidéo, textile : découvrez toutes les expertises de Dololka Agency.",
    alternates: { canonical: '/services' },
}

// Liste des services gérée depuis l'espace admin (repli sur les 12 historiques
// tant que la base n'est pas migrée).
export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
    const services = await getActiveServices()

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
                        {services.length} expertises complémentaires pour un accompagnement 360° de votre marque
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => {
                            const Icon = getServiceIcon(service.icon)
                            return (
                                <Link key={service.slug} href={`/services/${service.slug}`} className="group">
                                    <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors">{service.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                                            {service.subtitle || service.description}
                                        </p>
                                        {service.features.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {service.features.slice(0, 4).map((f) => (
                                                    <span key={f} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full font-medium max-w-[180px] truncate">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
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
