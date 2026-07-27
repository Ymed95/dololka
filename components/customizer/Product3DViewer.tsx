'use client'

import * as React from 'react'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {
    OrbitControls, useTexture, useGLTF, Center, Html, Decal,
    ContactShadows, Environment, Lightformer,
} from '@react-three/drei'
import * as THREE from 'three'

/** Normal map « tissage » générée en canvas : donne au tissu un grain de
 *  textile sous l'éclairage studio (au lieu d'un aplat pâte-à-modeler).
 *  Générée une seule fois puis mise en cache. */
let fabricNormalTexture: THREE.Texture | null = null
function getFabricNormalTexture(): THREE.Texture | null {
    if (typeof document === 'undefined') return null
    if (fabricNormalTexture) return fabricNormalTexture

    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const img = ctx.createImageData(size, size)
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4
            // Trame de tissage : ondulations croisées + bruit fin
            const weaveX = Math.sin((x / size) * Math.PI * 96) * 14
            const weaveY = Math.sin((y / size) * Math.PI * 96) * 14
            const noise = (Math.random() - 0.5) * 12
            img.data[i] = 128 + weaveX + noise       // normale X
            img.data[i + 1] = 128 + weaveY + noise   // normale Y
            img.data[i + 2] = 255                     // normale Z
            img.data[i + 3] = 255
        }
    }
    ctx.putImageData(img, 0, 0)

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(5, 5)
    fabricNormalTexture = tex
    return tex
}

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

/** Côté du produit portant un design. */
export type DecalSide = 'front' | 'back'

interface Product3DViewerProps {
    /** Modèle GLB. Si fourni, mode réaliste (mesh + designs en Decal). */
    modelUrl?: string
    /** Design positionné sur la face avant. */
    frontDecal?: DecalPlacement
    /** Design positionné sur la face arrière. */
    backDecal?: DecalPlacement

    /** Mode édition : glisser le design directement sur le modèle. */
    editable?: boolean
    /** Appelé pendant le drag avec le placement mis à jour. */
    onDecalChange?: (side: DecalSide, placement: DecalPlacement) => void

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

/** Taille visée pour la plus grande dimension d'un modèle, afin que tous les
 *  produits s'affichent de façon comparable quelle que soit leur échelle d'origine. */
const TARGET_SIZE = 3.8

/** Analyse du GLB : mesh « corps » cible + teinte couleur. */
interface ModelAnalysis {
    scene: THREE.Group
    bodyMesh: THREE.Mesh | null
    bodyBox: THREE.Box3
    /** Facteur ramenant le modèle à une taille d'affichage constante. */
    scale: number
}

function analyzeModel(source: THREE.Object3D, baseColor: string, fabric: boolean): ModelAnalysis {
    // Clone profond pour ne pas muter le cache global de useGLTF.
    const scene = source.clone(true) as THREE.Group
    scene.updateMatrixWorld(true)

    // Les modèles du commerce arrivent à des échelles très variables (souvent
    // en mètres : un t-shirt fait alors 0,7 unité). On calcule un facteur pour
    // les ramener à une taille constante, appliqué au groupe qui contient AUSSI
    // les décalques : sinon le design serait placé dans une autre échelle que
    // le vêtement et se retrouverait hors du modèle.
    const rawBox = new THREE.Box3().setFromObject(scene)
    const rawSize = new THREE.Vector3()
    rawBox.getSize(rawSize)
    const largest = Math.max(rawSize.x, rawSize.y, rawSize.z)
    const scale = largest > 0 ? TARGET_SIZE / largest : 1

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

    // Teinte + grain textile : on clone le matériau pour éviter les effets de bord.
    const tint = new THREE.Color(baseColor)
    const fabricNormal = fabric ? getFabricNormalTexture() : null
    candidates.forEach((mesh) => {
        const apply = (m: THREE.Material) => {
            const cloned = m.clone() as THREE.MeshStandardMaterial
            if ('color' in cloned && cloned.color) cloned.color.copy(tint)
            // N'ajoute le grain tissu que si le modèle n'a pas déjà sa propre
            // normal map (les GLB pro gardent leurs matériaux d'origine).
            if (fabricNormal && 'normalMap' in cloned && !cloned.normalMap) {
                cloned.normalMap = fabricNormal
                cloned.normalScale = new THREE.Vector2(0.35, 0.35)
                cloned.roughness = Math.max(cloned.roughness ?? 0.85, 0.82)
            }
            return cloned
        }
        mesh.material = Array.isArray(mesh.material)
            ? mesh.material.map(apply)
            : apply(mesh.material)
    })

    // Mesh « corps » : celui qui porte le design.
    // On retient le plus détaillé parmi ceux dont le volume est proche du
    // maximum. Le seul volume ne suffit pas : les modèles du commerce
    // contiennent souvent plusieurs couches de même encombrement (doublure,
    // coque interne), dont certaines très peu détaillées.
    let bodyMesh: THREE.Mesh | null = null
    const measured = candidates
        .map((mesh) => {
            mesh.geometry.computeBoundingBox()
            const bb = mesh.geometry.boundingBox
            if (!bb) return null
            const size = new THREE.Vector3()
            bb.getSize(size)
            const geo = mesh.geometry
            const triangles = geo.index
                ? geo.index.count / 3
                : (geo.attributes.position?.count ?? 0) / 3
            return { mesh, volume: size.x * size.y * size.z, triangles }
        })
        .filter((m): m is { mesh: THREE.Mesh; volume: number; triangles: number } => m !== null)

    if (measured.length > 0) {
        const maxVolume = Math.max(...measured.map((m) => m.volume))
        const biggest = measured.filter((m) => m.volume >= maxVolume * 0.9)
        biggest.sort((a, b) => b.triangles - a.triangles)
        bodyMesh = biggest[0].mesh
    }

    const bodyBox = new THREE.Box3()
    const bm = bodyMesh as THREE.Mesh | null
    if (bm?.geometry.boundingBox) bodyBox.copy(bm.geometry.boundingBox)

    return { scene, bodyMesh: bm, bodyBox, scale }
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

/** Mode réaliste : modèle GLB + designs projetés en Decal (avant/arrière).
 *  En mode éditable, glisser sur le produit déplace le design du côté touché. */
function DecalModel({
    modelUrl,
    frontDecal,
    backDecal,
    baseColor = '#ffffff',
    fabric = true,
    editable = false,
    onDecalChange,
    onDraggingChange,
}: {
    modelUrl: string
    frontDecal?: DecalPlacement
    backDecal?: DecalPlacement
    baseColor?: string
    fabric?: boolean
    editable?: boolean
    onDecalChange?: (side: DecalSide, placement: DecalPlacement) => void
    onDraggingChange?: (dragging: boolean) => void
}) {
    const { scene: source } = useGLTF(modelUrl)
    const analysis = useMemo(() => analyzeModel(source, baseColor, fabric ?? true), [source, baseColor, fabric])
    const bodyRef = useRef<THREE.Mesh | null>(null)
    // Assignation synchrone pendant le rendu : le Decal lit cette ref dès son
    // premier montage (un useEffect arriverait trop tard → crash drei).
    bodyRef.current = analysis.bodyMesh

    const draggingRef = useRef(false)
    // Placements courants accessibles depuis les handlers sans re-bind.
    const placementsRef = useRef<{ front?: DecalPlacement; back?: DecalPlacement }>({})
    placementsRef.current = { front: frontDecal, back: backDecal }

    // Fin de drag globale (même si le pointeur quitte le mesh).
    useEffect(() => {
        const end = () => {
            if (draggingRef.current) {
                draggingRef.current = false
                onDraggingChange?.(false)
            }
        }
        window.addEventListener('pointerup', end)
        return () => window.removeEventListener('pointerup', end)
    }, [onDraggingChange])

    /** Convertit un point d'impact 3D en (side, u, v). */
    const pointToPlacement = (worldPoint: THREE.Vector3): { side: DecalSide; u: number; v: number } | null => {
        const bm = bodyRef.current
        if (!bm) return null
        const local = bm.worldToLocal(worldPoint.clone())
        const box = analysis.bodyBox
        const w3 = box.max.x - box.min.x
        const h3 = box.max.y - box.min.y
        const midZ = (box.min.z + box.max.z) / 2
        const side: DecalSide = local.z >= midZ ? 'front' : 'back'
        const u = side === 'front'
            ? (local.x - box.min.x) / w3
            : (box.max.x - local.x) / w3
        const v = (box.max.y - local.y) / h3
        return { side, u: Math.min(1, Math.max(0, u)), v: Math.min(1, Math.max(0, v)) }
    }

    const handlePointerDown = (e: any) => {
        if (!editable) return
        e.stopPropagation()
        draggingRef.current = true
        onDraggingChange?.(true)
    }

    const handlePointerMove = (e: any) => {
        if (!editable || !draggingRef.current || !e.point) return
        e.stopPropagation()
        const hit = pointToPlacement(e.point as THREE.Vector3)
        if (!hit) return
        const current = placementsRef.current[hit.side]
        if (!current) return // pas de design sur cette face
        onDecalChange?.(hit.side, { ...current, u: hit.u, v: hit.v })
    }

    const frontTransform = useMemo(
        () => (frontDecal ? computeDecalTransform(analysis.bodyBox, frontDecal, 'front') : null),
        [analysis.bodyBox, frontDecal]
    )
    const backTransform = useMemo(
        () => (backDecal ? computeDecalTransform(analysis.bodyBox, backDecal, 'back') : null),
        [analysis.bodyBox, backDecal]
    )

    return (
        <group
            scale={analysis.scale}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
        >
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
    editable = false,
    onDecalChange,
    frontTextureUrl,
    backTextureUrl,
    productType = 'tshirt',
    baseColor = '#ffffff',
    autoRotate = true,
    cameraPosition = [0, 0, 7],
}: Product3DViewerProps) {
    // Pendant le drag d'un design, on fige la caméra (sinon tout bouge en même temps).
    const [dragging, setDragging] = React.useState(false)
    const FLOOR_Y = -2.3

    return (
        <Canvas
            shadows
            camera={{ position: cameraPosition, fov: 40 }}
            dpr={[1, 2]}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
        >
            {/* Fond studio légèrement dégradé (clair en haut) */}
            <color attach="background" args={['#f3f4f6']} />

            {/* Éclairage de base doux */}
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 7, 5]} intensity={0.7} castShadow />

            {/* Environnement studio (softboxes) : reflets doux sur le tissu.
                Généré localement — aucune ressource réseau. */}
            <Environment resolution={256} frames={1}>
                <Lightformer form="rect" intensity={2.4} position={[0, 5, 4]} scale={[7, 4, 1]} target={[0, 0, 0]} />
                <Lightformer form="rect" intensity={1.1} position={[-5, 1.5, 2.5]} rotation-y={0.7} scale={[3, 4, 1]} />
                <Lightformer form="rect" intensity={1.1} position={[5, 1.5, 2.5]} rotation-y={-0.7} scale={[3, 4, 1]} />
                <Lightformer form="rect" intensity={0.7} position={[0, 2, -5]} scale={[6, 3, 1]} />
            </Environment>

            <Suspense fallback={<Loader />}>
                {/* top : tous les modèles reposent sur le même « sol » */}
                <Center top position={[0, FLOOR_Y, 0]}>
                    {modelUrl ? (
                        <DecalModel
                            modelUrl={modelUrl}
                            frontDecal={frontDecal}
                            backDecal={backDecal}
                            baseColor={baseColor}
                            fabric={productType !== 'mug'}
                            editable={editable}
                            onDecalChange={onDecalChange}
                            onDraggingChange={setDragging}
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

                {/* Ombre portée douce au sol : ancre le produit dans l'espace */}
                <ContactShadows
                    position={[0, FLOOR_Y + 0.01, 0]}
                    opacity={0.38}
                    scale={10}
                    blur={2.4}
                    far={4.5}
                    resolution={512}
                    frames={dragging ? Infinity : 60}
                />
            </Suspense>

            <OrbitControls
                enabled={!dragging}
                enablePan={false}
                autoRotate={autoRotate && !editable}
                autoRotateSpeed={1.4}
                minDistance={4}
                maxDistance={12}
                target={[0, -0.4, 0]}
            />
        </Canvas>
    )
}

useGLTF.preload('/models/tshirt.glb')
