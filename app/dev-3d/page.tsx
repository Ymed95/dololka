'use client'

// Page de vérification visuelle du viewer 3D (outil de développement).
// Permet de contrôler le rendu des modèles GLB et le placement du Decal
// sans dépendre de la base de données ni du configurateur complet.

import { useState } from 'react'
import dynamic from 'next/dynamic'

const Product3DViewer = dynamic(
    () => import('@/components/customizer/Product3DViewer').then((m) => m.Product3DViewer),
    { ssr: false, loading: () => <div className="p-8">Chargement 3D…</div> }
)

const MODELS = [
    { key: 'tshirt', url: '/models/tshirt.glb' },
    { key: 'hoodie', url: '/models/hoodie.glb' },
    { key: 'cap', url: '/models/cap.glb' },
    { key: 'mug', url: '/models/mug.glb' },
]

const COLORS = ['#ffffff', '#1e3a8a', '#dc2626', '#1a1a1a']

export default function Dev3DPage() {
    const [color, setColor] = useState('#1e3a8a')

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Vérification du viewer 3D</h1>

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
                {MODELS.map((m) => (
                    <div key={m.key} className="bg-white rounded-xl shadow p-2">
                        <p className="font-bold mb-2 px-2">{m.key}</p>
                        <div id={`viewer-${m.key}`} className="h-[380px] bg-gray-50 rounded-lg overflow-hidden">
                            <Product3DViewer
                                modelUrl={m.url}
                                designTextureUrl="/logo-transparent.png"
                                decalAspect={1}
                                productType={m.key}
                                baseColor={color}
                                autoRotate={false}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
