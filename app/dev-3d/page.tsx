'use client'

// Page de vérification visuelle du viewer 3D (outil de développement).
// Cas de test : placement décentré, rotation, vue arrière (miroir), 4 modèles.

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { DecalPlacement } from '@/components/customizer/Product3DViewer'

const Product3DViewer = dynamic(
    () => import('@/components/customizer/Product3DViewer').then((m) => m.Product3DViewer),
    { ssr: false, loading: () => <div className="p-8">Chargement 3D…</div> }
)

const LOGO = '/logo-transparent.png'

const centered: DecalPlacement = { textureUrl: LOGO, u: 0.5, v: 0.4, uWidth: 0.3, vHeight: 0.3, rotationDeg: 0 }
const bottomRight: DecalPlacement = { textureUrl: LOGO, u: 0.72, v: 0.62, uWidth: 0.2, vHeight: 0.2, rotationDeg: 0 }
const rotated: DecalPlacement = { textureUrl: LOGO, u: 0.5, v: 0.38, uWidth: 0.28, vHeight: 0.28, rotationDeg: 25 }
const backTopLeft: DecalPlacement = { textureUrl: LOGO, u: 0.3, v: 0.28, uWidth: 0.22, vHeight: 0.22, rotationDeg: 0 }

interface TestCase {
    key: string
    label: string
    modelUrl: string
    productType: string
    front?: DecalPlacement
    back?: DecalPlacement
    camera?: [number, number, number]
}

const CASES: TestCase[] = [
    { key: 't1', label: 'tshirt — décentré bas-droite', modelUrl: '/models/tshirt.glb', productType: 'tshirt', front: bottomRight },
    { key: 't2', label: 'tshirt — VU DE DOS (design haut-gauche du verso)', modelUrl: '/models/tshirt.glb', productType: 'tshirt', back: backTopLeft, camera: [0, 0, -7] },
    { key: 'h1', label: 'hoodie — rotation 25°', modelUrl: '/models/hoodie.glb', productType: 'hoodie', front: rotated },
    { key: 'c1', label: 'cap — centré', modelUrl: '/models/cap.glb', productType: 'cap', front: { ...centered, v: 0.45, uWidth: 0.35, vHeight: 0.25 } },
    { key: 'm1', label: 'mug — centré', modelUrl: '/models/mug.glb', productType: 'mug', front: centered },
    { key: 'h2', label: 'hoodie — centré', modelUrl: '/models/hoodie.glb', productType: 'hoodie', front: centered },
]

const COLORS = ['#ffffff', '#1e3a8a', '#dc2626', '#1a1a1a']

export default function Dev3DPage() {
    const [color, setColor] = useState('#1e3a8a')

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Vérification du viewer 3D — placements</h1>

            <div className="flex gap-2 mb-6">
                {COLORS.map((c) => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-10 h-10 rounded-full border-2 ${color === c ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CASES.map((tc) => (
                    <div key={tc.key} className="bg-white rounded-xl shadow p-2">
                        <p className="font-bold mb-2 px-2 text-sm">{tc.label}</p>
                        <div className="h-[360px] bg-gray-50 rounded-lg overflow-hidden">
                            <Product3DViewer
                                modelUrl={tc.modelUrl}
                                frontDecal={tc.front}
                                backDecal={tc.back}
                                productType={tc.productType}
                                baseColor={color}
                                autoRotate={false}
                                cameraPosition={tc.camera}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
