'use client'

import * as React from 'react'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture, useGLTF, Center, Html, Decal } from '@react-three/drei'
import * as THREE from 'three'

interface Product3DViewerProps {
    /** Modèle GLB. Si fourni, mode réaliste (mesh + design en Decal). */
    modelUrl?: string
    /** Design brut (PNG transparent) projeté en decal sur le modèle GLB. */
    designTextureUrl?: string
    /** Ratio largeur/hauteur du design, pour conserver ses proportions. */
    decalAspect?: number

    /** Rendu composite avant (mode procédural, sans GLB). */
    frontTextureUrl?: string
    /** Rendu composite arrière (mode procédural). */
    backTextureUrl?: string

    productType?: string
    baseColor?: string
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

/** Analyse du GLB : repère la zone d'impression et le mesh « corps » cible. */
interface ModelAnalysis {
    scene: THREE.Group
    bodyMesh: THREE.Mesh | null
    decalPosition: THREE.Vector3
    decalRotation: THREE.Euler
    printSize: { width: number; height: number }
}

function analyzeModel(source: THREE.Object3D, baseColor: string): ModelAnalysis {
    // Clone profond pour ne pas muter le cache global de useGLTF.
    const scene = source.clone(true) as THREE.Group
    scene.updateMatrixWorld(true)

    let printArea: THREE.Mesh | null = null
    const candidates: THREE.Mesh[] = []

    scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        if (mesh.name === 'PrintArea') {
            printArea = mesh
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

    // Position / rotation du decal dans l'espace LOCAL du mesh corps.
    const decalPosition = new THREE.Vector3()
    const decalRotation = new THREE.Euler()
    let printSize = { width: 1.2, height: 1.5 }

    const pa = printArea as THREE.Mesh | null
    const bm = bodyMesh as THREE.Mesh | null

    if (pa && bm) {
        const worldPos = new THREE.Vector3()
        const worldQuat = new THREE.Quaternion()
        pa.getWorldPosition(worldPos)
        pa.getWorldQuaternion(worldQuat)

        // Conversion monde → local du mesh corps.
        bm.updateMatrixWorld(true)
        decalPosition.copy(bm.worldToLocal(worldPos.clone()))

        const bodyWorldQuat = new THREE.Quaternion()
        bm.getWorldQuaternion(bodyWorldQuat)
        const localQuat = bodyWorldQuat.clone().invert().multiply(worldQuat)
        decalRotation.setFromQuaternion(localQuat)

        // Taille de la zone depuis la PlaneGeometry.
        const geo = pa.geometry as THREE.PlaneGeometry
        const params = geo.parameters as { width?: number; height?: number } | undefined
        if (params?.width && params?.height) {
            printSize = { width: params.width, height: params.height }
        }
    } else if (bm) {
        // Pas de PrintArea : on centre sur la face avant du bounding box.
        bm.geometry.computeBoundingBox()
        const bb = bm.geometry.boundingBox!
        const size = new THREE.Vector3()
        bb.getSize(size)
        const center = new THREE.Vector3()
        bb.getCenter(center)
        decalPosition.set(center.x, center.y, bb.max.z)
        printSize = { width: size.x * 0.6, height: size.y * 0.6 }
    }

    return { scene, bodyMesh: bm, decalPosition, decalRotation, printSize }
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

/** Mode réaliste : modèle GLB + design projeté en Decal. */
function DecalModel({
    modelUrl,
    designTextureUrl,
    decalAspect = 1,
    baseColor = '#ffffff',
}: {
    modelUrl: string
    designTextureUrl?: string
    decalAspect?: number
    baseColor?: string
}) {
    const { scene: source } = useGLTF(modelUrl)
    const analysis = useMemo(() => analyzeModel(source, baseColor), [source, baseColor])
    const bodyRef = useRef<THREE.Mesh | null>(null)
    // Assignation synchrone pendant le rendu : le Decal lit cette ref dès son
    // premier montage (un useEffect arriverait trop tard → crash drei).
    bodyRef.current = analysis.bodyMesh

    // Échelle du decal : on inscrit le design dans la zone en gardant le ratio.
    const decalScale = useMemo<[number, number, number]>(() => {
        const { width: pw, height: ph } = analysis.printSize
        const areaAspect = pw / ph
        let sw: number
        let sh: number
        if (decalAspect > areaAspect) {
            sw = pw
            sh = pw / decalAspect
        } else {
            sh = ph
            sw = ph * decalAspect
        }
        const depth = Math.max(pw, ph) * 1.5 // profondeur de projection
        return [sw, sh, depth]
    }, [analysis.printSize, decalAspect])

    return (
        <group>
            <primitive object={analysis.scene} />
            {analysis.bodyMesh && designTextureUrl && (
                <DesignDecal
                    bodyRef={bodyRef}
                    url={designTextureUrl}
                    position={analysis.decalPosition}
                    rotation={analysis.decalRotation}
                    scale={decalScale}
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
    designTextureUrl,
    decalAspect = 1,
    frontTextureUrl,
    backTextureUrl,
    productType = 'tshirt',
    baseColor = '#ffffff',
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
                        <DecalModel
                            modelUrl={modelUrl}
                            designTextureUrl={designTextureUrl}
                            decalAspect={decalAspect}
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
