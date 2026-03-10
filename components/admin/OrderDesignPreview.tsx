'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import useImage from 'use-image'

interface OrderDesignPreviewProps {
    productImageUrl: string
    designFileUrl: string
    designX: number
    designY: number
    designWidth: number
    designHeight: number
    designRotation: number
    className?: string
}

export function OrderDesignPreview({
    productImageUrl,
    designFileUrl,
    designX,
    designY,
    designWidth,
    designHeight,
    designRotation,
    className = '',
}: OrderDesignPreviewProps) {
    const [productImage] = useImage(productImageUrl)
    const [designImage] = useImage(designFileUrl)
    const containerRef = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({ w: 400, h: 500 })

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const w = Math.min(containerRef.current.offsetWidth, 400)
                const h = Math.round(w * (500 / 400))
                setSize({ w, h })
            }
        }
        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    const layout = useMemo(() => {
        if (!productImage) return { offsetX: 0, offsetY: 0, scale: 1 }
        const maxW = size.w - 40
        const maxH = size.h - 40
        const scale = Math.min(maxW / productImage.width, maxH / productImage.height, 1)
        const displayW = productImage.width * scale
        const displayH = productImage.height * scale
        return {
            offsetX: (size.w - displayW) / 2,
            offsetY: (size.h - displayH) / 2,
            scale,
            displayWidth: displayW,
            displayHeight: displayH,
        }
    }, [productImage, size])

    if (!productImage) {
        return (
            <div ref={containerRef} className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ minHeight: 200 }}>
                <span className="text-gray-400 text-sm">Chargement...</span>
            </div>
        )
    }

    const scale = layout.scale

    return (
        <div ref={containerRef} className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}>
            <Stage width={size.w} height={size.h}>
                <Layer>
                    <KonvaImage
                        image={productImage}
                        x={layout.offsetX}
                        y={layout.offsetY}
                        width={layout.displayWidth}
                        height={layout.displayHeight}
                    />
                    {designImage && (
                        <KonvaImage
                            image={designImage}
                            x={layout.offsetX + designX * scale}
                            y={layout.offsetY + designY * scale}
                            width={designWidth * scale}
                            height={designHeight * scale}
                            rotation={designRotation}
                            listening={false}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    )
}
