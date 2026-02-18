import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface ServiceDetailProps {
    icon: LucideIcon
    title: string
    subtitle: string
    description: string
    features: string[]
    process: { title: string; description: string }[]
    pricing?: string
    faq?: { q: string; a: string }[]
}

export function ServiceDetail({ icon: Icon, title, subtitle, description, features, process, pricing, faq }: ServiceDetailProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <Link href="/services" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors">
                            &larr; Tous nos services
                        </Link>
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-6">
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{title}</h1>
                        <p className="text-lg md:text-xl text-gray-300">{subtitle}</p>
                    </div>
                </div>
            </section>

            {/* Description */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ce que nous proposons</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
                            {pricing && (
                                <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
                                    <p className="text-primary-800 font-medium">{pricing}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Ce qui est inclus</h3>
                            <div className="space-y-3">
                                {features.map((f) => (
                                    <div key={f} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Comment ça se passe</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {process.map((step, i) => (
                            <div key={step.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                                <div className="text-3xl font-black text-primary-200 mb-3">{String(i + 1).padStart(2, '0')}</div>
                                <h3 className="font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            {faq && faq.length > 0 && (
                <section className="py-12 md:py-16 bg-white">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Questions fréquentes</h2>
                        <div className="space-y-4">
                            {faq.map((item) => (
                                <div key={item.q} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <h3 className="font-bold mb-2">{item.q}</h3>
                                    <p className="text-gray-600 text-sm">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Intéressé par ce service ?</h2>
                    <p className="text-lg mb-8 text-primary-100">Contactez-nous pour en discuter et obtenir un devis gratuit</p>
                    <Link href="/contact" className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                        Demander un devis <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
