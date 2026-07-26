'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ProjectGalleryProps {
    images: string[]
    title: string
}

/** Galerie horizontale : une image à la fois, navigation par flèches,
 *  clavier, miniatures et glissement tactile. Agrandissement au clic. */
export function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [index, setIndex] = useState(0)
    const [zoomed, setZoomed] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)
    const total = images.length

    const goTo = useCallback((next: number) => {
        if (total === 0) return
        // Défilement circulaire : après la dernière on revient à la première.
        const target = ((next % total) + total) % total
        setIndex(target)
        const track = trackRef.current
        if (track) {
            track.scrollTo({ left: track.clientWidth * target, behavior: 'smooth' })
        }
    }, [total])

    // Navigation au clavier (utile aussi pour l'accessibilité).
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goTo(index + 1)
            if (e.key === 'ArrowLeft') goTo(index - 1)
            if (e.key === 'Escape') setZoomed(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [index, goTo])

    // Garde l'index synchronisé quand l'utilisateur fait défiler au doigt.
    const handleScroll = () => {
        const track = trackRef.current
        if (!track || track.clientWidth === 0) return
        const current = Math.round(track.scrollLeft / track.clientWidth)
        if (current !== index) setIndex(current)
    }

    if (total === 0) return null

    return (
        <div>
            <div className="relative group">
                {/* Piste horizontale : un visuel par écran, aimantée */}
                <div
                    ref={trackRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-2xl bg-white border border-gray-100"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {images.map((url, i) => (
                        <div key={`${url}-${i}`} className="min-w-full snap-center flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setZoomed(true)}
                                className="w-full h-[45vh] md:h-[60vh] relative cursor-zoom-in"
                                aria-label={`Agrandir le visuel ${i + 1}`}
                            >
                                <Image
                                    src={url}
                                    alt={`${title} — visuel ${i + 1}`}
                                    fill
                                    className="object-contain p-4"
                                    sizes="(max-width: 768px) 100vw, 900px"
                                    priority={i === 0}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                {total > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(index - 1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all"
                            aria-label="Visuel précédent"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(index + 1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all"
                            aria-label="Visuel suivant"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 text-white text-xs rounded-full">
                            {index + 1} / {total}
                        </span>
                    </>
                )}
            </div>

            {/* Miniatures pour accéder directement à un visuel */}
            {total > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {images.map((url, i) => (
                        <button
                            key={`thumb-${url}-${i}`}
                            type="button"
                            onClick={() => goTo(i)}
                            className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                i === index ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-primary-300 opacity-70 hover:opacity-100'
                            }`}
                            aria-label={`Aller au visuel ${i + 1}`}
                        >
                            <Image src={url} alt="" fill className="object-cover" sizes="64px" />
                        </button>
                    ))}
                </div>
            )}

            {/* Vue agrandie */}
            {zoomed && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setZoomed(false)}
                >
                    <button
                        type="button"
                        onClick={() => setZoomed(false)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                        aria-label="Fermer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[index]}
                            alt={`${title} — visuel ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>
                    {total > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); goTo(index - 1) }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
                                aria-label="Visuel précédent"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); goTo(index + 1) }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
                                aria-label="Visuel suivant"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
