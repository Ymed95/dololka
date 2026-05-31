'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture, useGLTF, Center, Html } from '@react-three/drei'
import * as THREE from 'three'

interface Product3DViewerProps {
    /** Rendu composite (produit + couleur + design) de la face avant. */
    frontTextureUrl: string
    /** Rendu composite de la face arrière (optionnel). */
    backTextureUrl?: string
    /** Type de produit pour choisir la géométrie. */
    productType?: string
    /** Couleur de base (faces latérales). */
    baseColor?: string
    /** Modèle GLB optionnel : si fourni, il remplace la géométrie procédurale. */
    modelUrl?: string
    /** Rotation automatique. */
    autoRotate?: boolean
}

function useSrgbTexture(url: string): THREE.Texture {
    const texture = useTexture(url) as THREE.Texture
    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 8
        texture.needsUpdate = true
    }, [texture])
    return texture
}

/** Mug : cylindre avec le design enroulé autour. */
function MugMesh({ frontTextureUrl, baseColor }: { frontTextureUrl: string; baseColor: string }) {
    const texture = useSrgbTexture(frontTextureUrl)
    return (
        <group>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[1.1, 1.1, 2.4, 64, 1, true]} />
                <meshStandardMaterial map={texture} roughness={0.35} metalness={0.05} side={THREE.DoubleSide} />
            </mesh>
            {/* Corps intérieur teinté */}
            <mesh>
                <cylinderGeometry args={[1.08, 1.08, 2.38, 64]} />
                <meshStandardMaterial color={baseColor} roughness={0.4} />
            </mesh>
            {/* Anse */}
            <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.55, 0.14, 16, 48, Math.PI]} />
                <meshStandardMaterial color={baseColor} roughness={0.4} />
            </mesh>
        </group>
    )
}

/** Vêtement / objet plat : boîte fine dont les faces avant/arrière portent le rendu. */
function GarmentMesh({
    frontTextureUrl,
    backTextureUrl,
    baseColor,
}: {
    frontTextureUrl: string
    backTextureUrl?: string
    baseColor: string
}) {
    const front = useSrgbTexture(frontTextureUrl)
    const back = useSrgbTexture(backTextureUrl || frontTextureUrl)

    const materials = useMemo(() => {
        const side = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.85 })
        const frontMat = new THREE.MeshStandardMaterial({ map: front, roughness: 0.85, transparent: true })
        const backMat = new THREE.MeshStandardMaterial({ map: back, roughness: 0.85, transparent: true })
        // Ordre des faces d'une BoxGeometry : px, nx, py, ny, pz(front), nz(back)
        return [side, side, side, side, frontMat, backMat]
    }, [front, back, baseColor])

    return (
        <mesh castShadow receiveShadow material={materials}>
            <boxGeometry args={[3, 3.7, 0.25]} />
        </mesh>
    )
}

/** Chargement d'un vrai modèle GLB si fourni par l'admin. */
function GltfModel({ modelUrl }: { modelUrl: string }) {
    const { scene } = useGLTF(modelUrl)
    return <primitive object={scene} />
}

function Loader() {
    return (
        <Html center>
            <div className="text-sm text-gray-500">Chargement du modèle 3D…</div>
        </Html>
    )
}

export function Product3DViewer({
    frontTextureUrl,
    backTextureUrl,
    productType = 'tshirt',
    baseColor = '#ffffff',
    modelUrl,
    autoRotate = true,
}: Product3DViewerProps) {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 7], fov: 40 }}
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, -3, -5]} intensity={0.5} />
            <directionalLight position={[0, 2, -6]} intensity={0.4} />

            <Suspense fallback={<Loader />}>
                <Center>
                    {modelUrl ? (
                        <GltfModel modelUrl={modelUrl} />
                    ) : productType === 'mug' ? (
                        <MugMesh frontTextureUrl={frontTextureUrl} baseColor={baseColor} />
                    ) : (
                        <GarmentMesh
                            frontTextureUrl={frontTextureUrl}
                            backTextureUrl={backTextureUrl}
                            baseColor={baseColor}
                        />
                    )}
                </Center>
            </Suspense>

            <OrbitControls
                enablePan={false}
                autoRotate={autoRotate}
                autoRotateSpeed={1.4}
                minDistance={4}
                maxDistance={12}
            />
        </Canvas>
    )
}
