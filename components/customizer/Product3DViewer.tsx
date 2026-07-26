'use client'

import * as React from 'react'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture, useGLTF, Center, Html, Decal } from '@react-three/drei'
import * as THREE from 'three'

/** Placement d'un design sur une face, exprimé relativement au template 2D
 *  du configurateur (coordonnées 0..1, v orienté vers le bas). */
export interface DecalPlacement {
    textureUrl: string
    /** Centre du design (0..1). */
    u: number
    v: number
    /** Taille du design (0..1 de la largeur/hauteur du template). */
    uWidth: number
    vHeight: number
    /** Rotation en degrés (sens du configurateur Konva). */
    rotationDeg: number
}

interface Product3DViewerProps {
    /** Modèle GLB. Si fourni, mode réaliste (mesh + designs en Decal). */
    modelUrl?: string
    /** Design positionné sur la face avant. */
    frontDecal?: DecalPlacement
    /** Design positionné sur la face arrière. */
    backDecal?: DecalPlacement

    /** Rendu composite avant (mode procédural, sans GLB). */
    frontTextureUrl?: string
    /** Rendu composite arrière (mode procédural). */
    backTextureUrl?: string

    productType?: string
    baseColor?: string
    autoRotate?: boolean
    /** Position initiale de la caméra (debug/vues spécifiques). */
    cameraPosition?: [number, number, number]
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

/** Analyse du GLB : mesh « corps » cible + teinte couleur. */
interface ModelAnalysis {
    scene: THREE.Group
    bodyMesh: THREE.Mesh | null
    bodyBox: THREE.Box3
}

function analyzeModel(source: THREE.Object3D, baseColor: string): ModelAnalysis {
    // Clone profond pour ne pas muter le cache global de useGLTF.
    const scene = source.clone(true) as THREE.Group
    scene.updateMatrixWorld(true)

    const candidates: THREE.Mesh[] = []

    scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        if (mesh.name === 'PrintArea' || mesh.name === 'PrintAreaBack') {
            mesh.visible = false
        } else {
            candidates.push(mesh)
        }
    })

    // Teinte du tissu : on clone le matériau pour éviter les effets de bord.
    const tint = new THREE.Color(baseColor)
    candidates.forEach((mesh) => {
        const apply = (m: THREE.Material) => {
            const cloned = m.clone() as THREE.MeshStandardMaterial
            if ('color' in cloned && cloned.color) cloned.color.copy(tint)
            return cloned
        }
        mesh.material = Array.isArray(mesh.material)
            ? mesh.material.map(apply)
            : apply(mesh.material)
    })

    // Mesh « corps » = plus gros volume de bounding box (le torse en général).
    let bodyMesh: THREE.Mesh | null = null
    let maxVolume = -1
    candidates.forEach((mesh) => {
        mesh.geometry.computeBoundingBox()
        const bb = mesh.geometry.boundingBox
        if (!bb) return
        const size = new THREE.Vector3()
        bb.getSize(size)
        const volume = size.x * size.y * size.z
        if (volume > maxVolume) {
            maxVolume = volume
            bodyMesh = mesh
        }
    })

    const bodyBox = new THREE.Box3()
    const bm = bodyMesh as THREE.Mesh | null
    if (bm?.geometry.boundingBox) bodyBox.copy(bm.geometry.boundingBox)

    return { scene, bodyMesh: bm, bodyBox }
}

/** Traduit un placement 2D (relatif au template) en transform de decal 3D
 *  sur la face avant ou arrière du bounding box du mesh corps. */
function computeDecalTransform(
    box: THREE.Box3,
    placement: DecalPlacement,
    side: 'front' | 'back'
): { position: THREE.Vector3; rotation: THREE.Euler; scale: [number, number, number] } {
    const w3 = box.max.x - box.min.x
    const h3 = box.max.y - box.min.y
    const d3 = Math.max(box.max.z - box.min.z, 0.1)

    const y = box.max.y - placement.v * h3
    const rad = (placement.rotationDeg * Math.PI) / 180

    if (side === 'front') {
        return {
            position: new THREE.Vector3(box.min.x + placement.u * w3, y, box.max.z),
            // Konva : rotation horaire (y vers le bas) → -z en three (y vers le haut).
            rotation: new THREE.Euler(0, 0, -rad),
            scale: [placement.uWidth * w3, placement.vHeight * h3, d3],
        }
    }
    // Face arrière : vue depuis -z, l'axe x apparaît inversé.
    return {
        position: new THREE.Vector3(box.max.x - placement.u * w3, y, box.min.z),
        rotation: new THREE.Euler(0, Math.PI, rad),
        scale: [placement.uWidth * w3, placement.vHeight * h3, d3],
    }
}

/** Decal du design, monté uniquement quand une texture existe (le hook
 *  useSrgbTexture reste ainsi inconditionnel à l'intérieur du composant). */
function DesignDecal({
    bodyRef,
    url,
    position,
    rotation,
    scale,
}: {
    bodyRef: React.MutableRefObject<THREE.Mesh | null>
    url: string
    position: THREE.Vector3
    rotation: THREE.Euler
    scale: [number, number, number]
}) {
    const tex = useSrgbTexture(url)
    return (
        <Decal
            mesh={bodyRef as React.MutableRefObject<THREE.Mesh>}
            position={position}
            rotation={rotation}
            scale={scale}
            polygonOffsetFactor={-10}
        >
            <meshStandardMaterial
                map={tex}
                transparent
                polygonOffset
                polygonOffsetFactor={-10}
                roughness={0.7}
                depthTest
            />
        </Decal>
    )
}

/** Mode réaliste : modèle GLB + designs projetés en Decal (avant/arrière). */
function DecalModel({
    modelUrl,
    frontDecal,
    backDecal,
    baseColor = '#ffffff',
}: {
    modelUrl: string
    frontDecal?: DecalPlacement
    backDecal?: DecalPlacement
    baseColor?: string
}) {
    const { scene: source } = useGLTF(modelUrl)
    const analysis = useMemo(() => analyzeModel(source, baseColor), [source, baseColor])
    const bodyRef = useRef<THREE.Mesh | null>(null)
    // Assignation synchrone pendant le rendu : le Decal lit cette ref dès son
    // premier montage (un useEffect arriverait trop tard → crash drei).
    bodyRef.current = analysis.bodyMesh

    const frontTransform = useMemo(
        () => (frontDecal ? computeDecalTransform(analysis.bodyBox, frontDecal, 'front') : null),
        [analysis.bodyBox, frontDecal]
    )
    const backTransform = useMemo(
        () => (backDecal ? computeDecalTransform(analysis.bodyBox, backDecal, 'back') : null),
        [analysis.bodyBox, backDecal]
    )

    return (
        <group>
            <primitive object={analysis.scene} />
            {analysis.bodyMesh && frontDecal && frontTransform && (
                <DesignDecal
                    bodyRef={bodyRef}
                    url={frontDecal.textureUrl}
                    position={frontTransform.position}
                    rotation={frontTransform.rotation}
                    scale={frontTransform.scale}
                />
            )}
            {analysis.bodyMesh && backDecal && backTransform && (
                <DesignDecal
                    bodyRef={bodyRef}
                    url={backDecal.textureUrl}
                    position={backTransform.position}
                    rotation={backTransform.rotation}
                    scale={backTransform.scale}
                />
            )}
        </group>
    )
}

/** Mug procédural (mode sans GLB). */
function MugMesh({ frontTextureUrl, baseColor }: { frontTextureUrl: string; baseColor: string }) {
    const texture = useSrgbTexture(frontTextureUrl)
    return (
        <group>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[1.1, 1.1, 2.4, 64, 1, true]} />
                <meshStandardMaterial map={texture} roughness={0.35} metalness={0.05} side={THREE.DoubleSide} />
            </mesh>
            <mesh>
                <cylinderGeometry args={[1.08, 1.08, 2.38, 64]} />
                <meshStandardMaterial color={baseColor} roughness={0.4} />
            </mesh>
            <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.55, 0.14, 16, 48, Math.PI]} />
                <meshStandardMaterial color={baseColor} roughness={0.4} />
            </mesh>
        </group>
    )
}

/** Vêtement procédural (mode sans GLB) : boîte fine texturée recto/verso. */
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

function Loader() {
    return (
        <Html center>
            <div className="text-sm text-gray-500">Chargement du modèle 3D…</div>
        </Html>
    )
}

export function Product3DViewer({
    modelUrl,
    frontDecal,
    backDecal,
    frontTextureUrl,
    backTextureUrl,
    productType = 'tshirt',
    baseColor = '#ffffff',
    autoRotate = true,
    cameraPosition = [0, 0, 7],
}: Product3DViewerProps) {
    return (
        <Canvas
            shadows
            camera={{ position: cameraPosition, fov: 40 }}
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
                        <DecalModel
                            modelUrl={modelUrl}
                            frontDecal={frontDecal}
                            backDecal={backDecal}
                            baseColor={baseColor}
                        />
                    ) : productType === 'mug' ? (
                        <MugMesh frontTextureUrl={frontTextureUrl || ''} baseColor={baseColor} />
                    ) : (
                        <GarmentMesh
                            frontTextureUrl={frontTextureUrl || ''}
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

useGLTF.preload('/models/tshirt.glb')
