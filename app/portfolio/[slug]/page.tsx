import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ArrowLeft, ArrowRight, Download, FileText } from 'lucide-react'

const prisma = new PrismaClient()

// Le contenu vient de la base : pas de pré-rendu au build.
export const dynamic = 'force-dynamic'

interface SourceFile {
    url: string
    name: string
    ext: string
}

/** Retrouve un projet par son slug, avec repli sur l'identifiant pour les
 *  projets créés avant l'introduction des slugs. */
async function getProject(slug: string) {
    try {
        const bySlug = await prisma.portfolio.findUnique({ where: { slug } })
        if (bySlug) return bySlug
        return await prisma.portfolio.findUnique({ where: { id: slug } })
    } catch (error) {
        console.error('Chargement du projet impossible', error)
        return null
    }
}

export async function generateMetadata(
    { params }: { params: { slug: string } }
): Promise<Metadata> {
    const project = await getProject(params.slug)
    if (!project) return { title: 'Projet introuvable' }

    const description = (project.description || '').slice(0, 160)
    const cover = project.imageUrl || (project.images as string[] | null)?.[0]

    return {
        title: project.title,
        description,
        alternates: { canonical: `/portfolio/${project.slug || project.id}` },
        openGraph: {
            title: `${project.title} | Dololka Agency`,
            description,
            type: 'article',
            images: cover ? [{ url: cover }] : undefined,
        },
    }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const project = await getProject(params.slug)
    if (!project || !project.isActive) notFound()

    const gallery = ((project.images as string[] | null) ?? []).filter(Boolean)
    const files = ((project.files as unknown as SourceFile[] | null) ?? []).filter((f) => f?.url)
    const cover = project.imageUrl || gallery[0]
    // Évite d'afficher deux fois la couverture si elle ouvre déjà la galerie.
    const rest = gallery.filter((url) => url !== cover)
    const tags = project.tags.split(',').map((t) => t.trim()).filter(Boolean)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* En-tête */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-14 md:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/portfolio" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Toutes nos réalisations
                    </Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                    <p className="text-lg text-gray-300 max-w-3xl">{project.description}</p>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6">
                            {tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 text-sm rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Visuel principal */}
                    {cover && (
                        <div className="relative w-full rounded-2xl overflow-hidden bg-white border border-gray-100 mb-8" style={{ minHeight: 280 }}>
                            <Image
                                src={cover}
                                alt={project.title}
                                width={1600}
                                height={1000}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>
                    )}

                    {/* Description détaillée */}
                    {project.detailText && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4">À propos du projet</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.detailText}</p>
                        </div>
                    )}

                    {/* Galerie */}
                    {rest.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Galerie</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {rest.map((url, i) => (
                                    <div key={`${url}-${i}`} className="rounded-xl overflow-hidden bg-white border border-gray-100">
                                        <Image
                                            src={url}
                                            alt={`${project.title} — visuel ${i + 2}`}
                                            width={1200}
                                            height={900}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fichiers sources */}
                    {files.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                            <h2 className="text-xl font-bold mb-4">Fichiers du projet</h2>
                            <ul className="space-y-2">
                                {files.map((f, i) => (
                                    <li key={`${f.url}-${i}`}>
                                        <a
                                            href={f.url}
                                            download={f.name}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                                        >
                                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm text-gray-800 truncate flex-1">{f.name}</span>
                                            <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                {f.ext}
                                            </span>
                                            <Download className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-center">
                        <Link
                            href="/contact"
                            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Un projet similaire ? Parlons-en <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
