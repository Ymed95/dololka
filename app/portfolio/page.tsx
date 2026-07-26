'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { HorizontalScroller } from '@/components/portfolio/HorizontalScroller'

const categories = [
    { value: 'all', label: 'Tout' },
    { value: 'branding', label: 'Branding' },
    { value: 'web', label: 'Sites Web' },
    { value: 'social', label: 'Réseaux Sociaux' },
    { value: 'textile', label: 'Textile' },
    { value: 'design', label: 'Design' },
    { value: 'pub', label: 'Publicité' },
    { value: 'photo', label: 'Photo & Vidéo' },
]

interface PortfolioProject {
    id: string
    slug?: string | null
    title: string
    description: string
    category: string
    tags: string
    color: string
    imageUrl?: string
    images?: string[]
    isActive: boolean
}

export default function PortfolioPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [projects, setProjects] = useState<PortfolioProject[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/portfolio')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data.filter((p: PortfolioProject) => p.isActive !== false))
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const filtered = selectedCategory === 'all'
        ? projects
        : projects.filter(p => p.category === selectedCategory)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                        Nos{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                            Réalisations
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Découvrez une sélection de projets réalisés pour nos clients
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === cat.value
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">
                                {projects.length === 0
                                    ? 'Les projets arrivent bientôt. Restez connectés !'
                                    : 'Aucun projet dans cette catégorie pour le moment'
                                }
                            </p>
                        </div>
                    ) : (
                        <HorizontalScroller itemWidth={340} ariaLabel="Nos réalisations">
                            {filtered.map((project, index) => {
                                const cover = project.imageUrl || project.images?.[0]
                                const extra = (project.images?.length || 0) - 1
                                return (
                                <Link
                                    key={project.id}
                                    href={`/portfolio/${project.slug || project.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col w-[300px] sm:w-[320px] flex-shrink-0 snap-start"
                                >
                                    {/* Visuel de couverture, ou dégradé si le projet n'a pas d'image */}
                                    {cover ? (
                                        <div className="relative h-48 bg-gray-50 overflow-hidden">
                                            <Image
                                                src={cover}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                            {extra > 0 && (
                                                <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                                                    +{extra} image{extra > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                                            <span className="text-white/80 text-6xl font-black">{String(index + 1).padStart(2, '0')}</span>
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors">{project.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">{project.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.tags.split(',').filter(Boolean).map((tag) => (
                                                <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="inline-flex items-center text-primary-600 text-sm font-medium">
                                            Voir le projet <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                                )
                            })}
                        </HorizontalScroller>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Votre projet pourrait être le prochain</h2>
                    <p className="text-lg mb-8 text-primary-100">
                        Contactez-nous pour discuter de votre projet et obtenir un devis gratuit
                    </p>
                    <Link href="/contact" className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                        Lancer mon projet <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
