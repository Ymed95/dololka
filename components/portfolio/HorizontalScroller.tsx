'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HorizontalScrollerProps {
    children: React.ReactNode
    /** Largeur d'un élément, utilisée comme pas de défilement. */
    itemWidth?: number
    ariaLabel?: string
}

/** Bande défilante horizontale avec flèches. Les flèches n'apparaissent que
 *  s'il reste du contenu à voir dans cette direction. */
export function HorizontalScroller({
    children,
    itemWidth = 320,
    ariaLabel = 'Liste défilante',
}: HorizontalScrollerProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    const [canLeft, setCanLeft] = useState(false)
    const [canRight, setCanRight] = useState(false)

    const update = () => {
        const el = trackRef.current
        if (!el) return
        // Marge de 4px : évite que la flèche reste active sur un reliquat
        // d'arrondi en fin de course.
        setCanLeft(el.scrollLeft > 4)
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }

    useEffect(() => {
        update()
        const el = trackRef.current
        if (!el) return
        const onResize = () => update()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children])

    const scrollBy = (dir: -1 | 1) => {
        trackRef.current?.scrollBy({ left: dir * itemWidth, behavior: 'smooth' })
    }

    return (
        <div className="relative">
            <div
                ref={trackRef}
                onScroll={update}
                role="region"
                aria-label={ariaLabel}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>

            {canLeft && (
                <button
                    type="button"
                    onClick={() => scrollBy(-1)}
                    className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center text-gray-700 hover:scale-110 transition-transform z-10"
                    aria-label="Faire défiler vers la gauche"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}
            {canRight && (
                <button
                    type="button"
                    onClick={() => scrollBy(1)}
                    className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center text-gray-700 hover:scale-110 transition-transform z-10"
                    aria-label="Faire défiler vers la droite"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    )
}
