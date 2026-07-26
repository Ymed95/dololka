'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Stage, Layer, Image as KonvaImage, Transformer, Rect } from 'react-konva'
import useImage from 'use-image'
import { Button } from '@/components/ui/Button'
import { Upload, RotateCw, ZoomIn, ZoomOut, Move, Loader2, Box, X } from 'lucide-react'
import type { CustomizationData, ViewDesign } from '@/lib/types/customization'
import { renderAllViews, renderViewToDataURL } from '@/lib/production/renderDesign'
import type { DecalPlacement } from './Product3DViewer'

// Le viewer 3D embarque Three.js : on le charge à la demande, côté client.
const Product3DViewer = dynamic(
    () => import('./Product3DViewer').then((m) => m.Product3DViewer),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full text-gray-500">
                <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Chargement de la 3D…
            </div>
        ),
    }
)

interface CustomizationCanvasProps {
    productImageUrl: string
    productBackUrl?: string
    productType?: 'tshirt' | 'hoodie' | 'mug' | 'cap' | 'sweatshirt' | 'vest'
    baseColor?: string
    baseColorName?: string
    productName?: string
    productViews?: ProductView[]
    /** Modèle GLB pour l'aperçu 3D réaliste (design projeté en Decal). */
    model3dUrl?: string
    onSave: (data: CustomizationData) => void | Promise<void>
}

export interface ProductView {
    id: string
    label: string
    templateUrl: string
}

interface DesignConfig {
    x: number
    y: number
    width: number
    height: number
    rotation: number
}

interface ProductLayout {
    offsetX: number
    offsetY: number
    scale: number
    displayWidth: number
    displayHeight: number
}

// Component for the product background with color tint
const ProductImage = ({ image, layout, tintColor }: { image: HTMLImageElement | undefined; layout: ProductLayout; tintColor?: string }) => {
    if (!image) return null
    return (
        <>
            <KonvaImage
                image={image}
                x={layout.offsetX}
                y={layout.offsetY}
                width={layout.displayWidth}
                height={layout.displayHeight}
            />
            {tintColor && tintColor !== '#ffffff' && (
                <Rect
                    x={layout.offsetX}
                    y={layout.offsetY}
                    width={layout.displayWidth}
                    height={layout.displayHeight}
                    fill={tintColor}
                    opacity={0.4}
                    globalCompositeOperation="source-atop"
                    listening={false}
                />
            )}
        </>
    )
}

// Component for the uploaded design
const DesignImage = ({
    src,
    x,
    y,
    width,
    height,
    rotation,
    scale,
    offsetX,
    offsetY,
    isSelected,
    onSelect,
    onChange
}: any) => {
    const [image] = useImage(src)
    const imageRef = useRef<any>()
    const transformerRef = useRef<any>()

    useEffect(() => {
        if (isSelected && transformerRef.current && imageRef.current) {
            transformerRef.current.nodes([imageRef.current])
            transformerRef.current.getLayer().batchDraw()
        }
    }, [isSelected])

    return (
        <>
            <KonvaImage
                image={image}
                x={offsetX + x * scale}
                y={offsetY + y * scale}
                width={width * scale}
                height={height * scale}
                rotation={rotation}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                ref={imageRef}
                onDragEnd={(e) => {
                    onChange({
                        x: (e.target.x() - offsetX) / scale,
                        y: (e.target.y() - offsetY) / scale,
                    })
                }}
                onTransformEnd={(e: any) => {
                    const node = imageRef.current
                    const scaleX = node.scaleX()
                    const scaleY = node.scaleY()

                    node.scaleX(1)
                    node.scaleY(1)

                    onChange({
                        x: (node.x() - offsetX) / scale,
                        y: (node.y() - offsetY) / scale,
                        width: Math.max(5, (node.width() * scaleX) / scale),
                        height: Math.max(5, (node.height() * scaleY) / scale),
                        rotation: node.rotation(),
                    })
                }}
            />
            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox
                        }
                        return newBox
                    }}
                />
            )}
        </>
    )
}

export const CustomizationCanvas = ({
    productImageUrl,
    productBackUrl = productImageUrl,
    productType = 'tshirt',
    baseColor = '#ffffff',
    baseColorName,
    productName,
    productViews,
    model3dUrl,
    onSave
}: CustomizationCanvasProps) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [designFileName, setDesignFileName] = useState<string | undefined>(undefined)
    const [isSaving, setIsSaving] = useState(false)
    const [show3D, setShow3D] = useState(false)
    const [is3DLoading, setIs3DLoading] = useState(false)
    const [textures3D, setTextures3D] = useState<{
        front: string
        back?: string
        frontDecal?: DecalPlacement
        backDecal?: DecalPlacement
    }>({ front: '' })
    // Dimensions natives des templates + id de vue associé (pour reconvertir
    // un placement 3D en position 2D dans la bonne vue)
    const [templateDims, setTemplateDims] = useState<{
        front?: { w: number; h: number; viewId: string }
        back?: { w: number; h: number; viewId: string }
    }>({})
    // Face dont le design est en cours d'édition dans la 3D
    const [activeSide, setActiveSide] = useState<'front' | 'back'>('front')
    const views = useMemo<ProductView[]>(() => {
        if (productViews && productViews.length > 0) {
            return productViews
        }
        return [
            { id: 'front', label: 'Recto', templateUrl: productImageUrl },
            { id: 'back', label: 'Verso', templateUrl: productBackUrl },
        ]
    }, [productViews, productImageUrl, productBackUrl])

    const [currentViewId, setCurrentViewId] = useState<string>(views[0]?.id || 'front')

    useEffect(() => {
        if (!views.find(view => view.id === currentViewId)) {
            setCurrentViewId(views[0]?.id || 'front')
        }
    }, [views, currentViewId])

    const defaultDesignConfig: DesignConfig = {
        x: 200,
        y: 150,
        width: 120,
        height: 120,
        rotation: 0,
    }

    const viewIds = useMemo(() => views.map(view => view.id).join('|'), [views])
    const [designConfigs, setDesignConfigs] = useState<Record<string, DesignConfig>>({})

    useEffect(() => {
        setDesignConfigs(prev => {
            const next = { ...prev }
            views.forEach(view => {
                if (!next[view.id]) {
                    next[view.id] = view.id === 'back'
                        ? { ...defaultDesignConfig, y: 300 }
                        : { ...defaultDesignConfig }
                }
            })
            return next
        })
    }, [viewIds])

    const [isSelected, setIsSelected] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Config actuelle basée sur la vue
    const currentDesignConfig = designConfigs[currentViewId] || defaultDesignConfig
    const setCurrentDesignConfig = (updates: Partial<DesignConfig>) => {
        setDesignConfigs(prev => {
            const base = prev[currentViewId] || defaultDesignConfig
            return {
                ...prev,
                [currentViewId]: {
                    ...base,
                    ...updates,
                }
            }
        })
    }

    // Template actuel basé sur la vue
    const currentTemplateUrl = views.find(view => view.id === currentViewId)?.templateUrl || productImageUrl
    const [productImage] = useImage(currentTemplateUrl)

    const canvasContainerRef = useRef<HTMLDivElement>(null)
    const [canvasWidth, setCanvasWidth] = useState(520)
    const [canvasHeight, setCanvasHeight] = useState(640)

    useEffect(() => {
        const updateSize = () => {
            if (canvasContainerRef.current) {
                const containerWidth = canvasContainerRef.current.offsetWidth
                const w = Math.min(containerWidth, 520)
                const h = Math.round(w * (640 / 520))
                setCanvasWidth(w)
                setCanvasHeight(h)
            }
        }
        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [])

    const productLayout = useMemo<ProductLayout>(() => {
        if (!productImage) {
            return { offsetX: 0, offsetY: 0, scale: 1, displayWidth: 0, displayHeight: 0 }
        }

        const maxWidth = canvasWidth - 40
        const maxHeight = canvasHeight - 40
        const scale = Math.min(maxWidth / productImage.width, maxHeight / productImage.height, 1)
        const displayWidth = productImage.width * scale
        const displayHeight = productImage.height * scale
        return {
            offsetX: (canvasWidth - displayWidth) / 2,
            offsetY: (canvasHeight - displayHeight) / 2,
            scale,
            displayWidth,
            displayHeight,
        }
    }, [productImage, canvasWidth, canvasHeight])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setDesignFileName(file.name)
            const reader = new FileReader()
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string)
                setIsSelected(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        if (!uploadedImage || isSaving) return
        setIsSaving(true)
        try {
            // Construit une vue par template, avec le design positionné dessus.
            const viewDesigns: ViewDesign[] = views.map(buildViewDesign)

            // Génère le rendu HD (produit + couleur + design) pour chaque vue.
            const renderedViews = await renderAllViews(viewDesigns, {
                baseColor,
                pixelRatio: 3,
            })

            const data: CustomizationData = {
                baseColor,
                baseColorName,
                productType,
                designFileName,
                views: renderedViews,
            }

            await onSave(data)
        } finally {
            setIsSaving(false)
        }
    }

    const buildViewDesign = (view: ProductView): ViewDesign => {
        const cfg = designConfigs[view.id] || defaultDesignConfig
        return {
            viewId: view.id,
            label: view.label,
            templateUrl: view.templateUrl,
            position: `${view.id}-center`,
            designFileUrl: uploadedImage || undefined,
            designX: cfg.x,
            designY: cfg.y,
            designWidth: cfg.width,
            designHeight: cfg.height,
            designRotation: cfg.rotation,
        }
    }

    /** Dimensions natives d'une image (template produit). */
    const loadImageDims = (src: string) =>
        new Promise<{ w: number; h: number }>((resolve, reject) => {
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height })
            img.onerror = () => reject(new Error(`Template introuvable : ${src}`))
            img.src = src
        })

    /** Traduit le placement 2D du design d'une vue en placement relatif (0..1)
     *  pour le decal 3D. Tient compte de la rotation Konva (pivot = coin
     *  haut-gauche) pour calculer le vrai centre du design. */
    const placementForView = async (view: ProductView): Promise<DecalPlacement> => {
        const cfg = designConfigs[view.id] || defaultDesignConfig
        const { w, h } = await loadImageDims(view.templateUrl)
        const rad = (cfg.rotation * Math.PI) / 180
        const cx = cfg.x + (cfg.width / 2) * Math.cos(rad) - (cfg.height / 2) * Math.sin(rad)
        const cy = cfg.y + (cfg.width / 2) * Math.sin(rad) + (cfg.height / 2) * Math.cos(rad)
        return {
            textureUrl: uploadedImage as string,
            u: cx / w,
            v: cy / h,
            uWidth: cfg.width / w,
            vHeight: cfg.height / h,
            rotationDeg: cfg.rotation,
        }
    }

    const handleOpen3D = async () => {
        if (!uploadedImage || is3DLoading) return
        setIs3DLoading(true)
        try {
            const frontView = views.find((v) => v.id === 'front') || views[0]
            const backView = views.find((v) => v.id === 'back')
            // Rendus composites (mode procédural sans GLB)
            const front = await renderViewToDataURL(buildViewDesign(frontView), { baseColor, pixelRatio: 2 })
            const back = backView
                ? await renderViewToDataURL(buildViewDesign(backView), { baseColor, pixelRatio: 2 })
                : undefined
            // Placements fidèles du design pour le mode GLB (avant + arrière)
            const frontDecal = await placementForView(frontView)
            const backDecal = backView ? await placementForView(backView) : undefined
            // Dimensions des templates pour la synchro 3D → 2D
            const frontDims = await loadImageDims(frontView.templateUrl)
            const backDims = backView ? await loadImageDims(backView.templateUrl) : undefined
            setTemplateDims({
                front: { ...frontDims, viewId: frontView.id },
                back: backDims && backView ? { ...backDims, viewId: backView.id } : undefined,
            })
            setActiveSide('front')
            setTextures3D({ front, back, frontDecal, backDecal })
            setShow3D(true)
        } catch (err) {
            console.error('Aperçu 3D impossible', err)
        } finally {
            setIs3DLoading(false)
        }
    }

    /** Applique un placement venu de l'édition 3D : met à jour le decal ET la
     *  position 2D correspondante (le configurateur 2D reste la source de
     *  vérité pour l'export production). */
    const apply3DEdit = (side: 'front' | 'back', placement: DecalPlacement) => {
        setActiveSide(side)
        setTextures3D(prev => ({
            ...prev,
            [side === 'front' ? 'frontDecal' : 'backDecal']: placement,
        }))
        const dims = templateDims[side]
        if (!dims) return
        const rad = (placement.rotationDeg * Math.PI) / 180
        const wpx = placement.uWidth * dims.w
        const hpx = placement.vHeight * dims.h
        const cx = placement.u * dims.w
        const cy = placement.v * dims.h
        // Inverse du calcul de placementForView : centre → coin haut-gauche Konva
        setDesignConfigs(prev => ({
            ...prev,
            [dims.viewId]: {
                x: cx - (wpx / 2) * Math.cos(rad) + (hpx / 2) * Math.sin(rad),
                y: cy - (wpx / 2) * Math.sin(rad) - (hpx / 2) * Math.cos(rad),
                width: wpx,
                height: hpx,
                rotation: placement.rotationDeg,
            },
        }))
    }

    /** Boutons de la modale 3D : taille / rotation du design du côté actif. */
    const adjust3DDecal = (action: 'grow' | 'shrink' | 'rotL' | 'rotR') => {
        const current = activeSide === 'front' ? textures3D.frontDecal : textures3D.backDecal
        if (!current) return
        const next: DecalPlacement = { ...current }
        if (action === 'grow') { next.uWidth *= 1.15; next.vHeight *= 1.15 }
        if (action === 'shrink') { next.uWidth *= 0.87; next.vHeight *= 0.87 }
        if (action === 'rotL') next.rotationDeg -= 15
        if (action === 'rotR') next.rotationDeg += 15
        apply3DEdit(activeSide, next)
    }

    const handleRotate = () => {
        setCurrentDesignConfig({ rotation: currentDesignConfig.rotation + 90 })
    }

    const handleZoomIn = () => {
        setCurrentDesignConfig({
            width: currentDesignConfig.width * 1.2,
            height: currentDesignConfig.height * 1.2,
        })
    }

    const handleZoomOut = () => {
        setCurrentDesignConfig({
            width: currentDesignConfig.width * 0.8,
            height: currentDesignConfig.height * 0.8,
        })
    }

    return (
        <div className="space-y-6">
            {/* Canvas Container */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Prévisualisation du Produit</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        💡 Astuce : Cliquez et faites glisser le design pour le déplacer
                    </p>
                </div>

                {/* Konva Canvas with Drag & Drop */}
                <div ref={canvasContainerRef} className="relative flex flex-col justify-center items-center w-full">
                    <div className="rounded-lg bg-gray-50 border border-gray-200 max-w-full overflow-hidden">
                        <Stage
                            width={canvasWidth}
                            height={canvasHeight}
                            onClick={() => setIsSelected(false)}
                            onTap={() => setIsSelected(false)}
                        >
                            {/* Layer 1: Product image + color tint (isolated so source-atop only affects the product) */}
                            <Layer>
                                <ProductImage image={productImage} layout={productLayout} tintColor={baseColor} />
                            </Layer>

                            {/* Layer 2: User design (separate layer so tint doesn't affect it) */}
                            <Layer>
                                {uploadedImage && (
                                    <DesignImage
                                        src={uploadedImage}
                                        x={currentDesignConfig.x}
                                        y={currentDesignConfig.y}
                                        width={currentDesignConfig.width}
                                        height={currentDesignConfig.height}
                                        rotation={currentDesignConfig.rotation}
                                        scale={productLayout.scale}
                                        offsetX={productLayout.offsetX}
                                        offsetY={productLayout.offsetY}
                                        isSelected={isSelected}
                                        onSelect={() => setIsSelected(true)}
                                        onChange={(newAttrs: any) => {
                                            setCurrentDesignConfig(newAttrs)
                                        }}
                                    />
                                )}
                            </Layer>
                        </Stage>

                        {/* Instructions overlay when no design */}
                        {!uploadedImage && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-8 py-4 shadow-lg">
                                    <p className="text-gray-600 font-medium">
                                        👆 Uploadez un design pour commencer
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Toggle Views */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                        {views.map((view) => (
                            <motion.button
                                key={view.id}
                                onClick={() => setCurrentViewId(view.id)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.94 }}
                                className={`relative px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 ${currentViewId === view.id
                                    ? 'text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {currentViewId === view.id && (
                                    <motion.span
                                        layoutId="activeViewPill"
                                        className="absolute inset-0 rounded-lg bg-primary-600 shadow-lg"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{view.label}</span>
                            </motion.button>
                        ))}
                    </div>

                    {/* View Indicator */}
                    <div className="text-center mt-3 h-5">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentViewId}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm text-gray-500"
                            >
                                Vue actuelle : {views.find(view => view.id === currentViewId)?.label || 'Recto'}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>



            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Contrôles de Personnalisation</h3>

                    {/* File Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Votre Design
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="w-full"
                        >
                            <Upload className="w-5 h-5 mr-2" />
                            {uploadedImage ? 'Changer le design' : 'Télécharger un logo/design'}
                        </Button>
                        {uploadedImage && (
                            <p className="text-sm text-green-600 mt-2">✓ Design uploadé avec succès</p>
                        )}
                    </div>



                    {/* Transform Controls */}
                    {uploadedImage && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Outils de Transformation
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button onClick={handleRotate} variant="outline" size="sm">
                                        <RotateCw className="w-4 h-4 mr-2" />
                                        Rotation
                                    </Button>
                                    <Button onClick={handleZoomIn} variant="outline" size="sm">
                                        <ZoomIn className="w-4 h-4 mr-2" />
                                        Agrandir
                                    </Button>
                                    <Button onClick={handleZoomOut} variant="outline" size="sm">
                                        <ZoomOut className="w-4 h-4 mr-2" />
                                        Réduire
                                    </Button>
                                    <Button variant="outline" size="sm" disabled>
                                        <Move className="w-4 h-4 mr-2" />
                                        Déplacer
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Astuce :</strong> Vous pouvez glisser-déposer votre design directement sur la prévisualisation !
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>



            {/* Aperçu 3D 360° */}
            {uploadedImage && (
                <Button
                    onClick={handleOpen3D}
                    disabled={is3DLoading}
                    variant="outline"
                    className="w-full"
                    size="lg"
                >
                    {is3DLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Préparation de la 3D…
                        </>
                    ) : (
                        <>
                            <Box className="w-5 h-5 mr-2" />
                            Aperçu 3D 360°
                        </>
                    )}
                </Button>
            )}

            {/* Modale viewer 3D */}
            {show3D && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShow3D(false)}>
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[70vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/40 to-transparent">
                            <p className="text-white font-semibold drop-shadow">
                                Aperçu 3D 360° — faites glisser pour tourner
                            </p>
                            <button
                                onClick={() => setShow3D(false)}
                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                aria-label="Fermer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <Product3DViewer
                            modelUrl={model3dUrl}
                            frontDecal={textures3D.frontDecal}
                            backDecal={textures3D.backDecal}
                            editable={!!model3dUrl}
                            onDecalChange={apply3DEdit}
                            frontTextureUrl={textures3D.front}
                            backTextureUrl={textures3D.back}
                            productType={productType}
                            baseColor={baseColor}
                        />

                        {/* Contrôles d'édition 3D (mode GLB uniquement) */}
                        {model3dUrl && (
                            <div className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-gradient-to-t from-black/50 to-transparent">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-white/90 text-xs drop-shadow max-w-[45%]">
                                        ✋ Glissez le design sur le produit pour le déplacer — la position 2D suit automatiquement
                                        {textures3D.backDecal && (
                                            <span className="block mt-0.5 text-white/70">
                                                Face active : {activeSide === 'front' ? 'avant' : 'arrière'}
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => adjust3DDecal('shrink')}
                                            className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/35 text-white font-bold transition-colors"
                                            title="Réduire le design"
                                        >
                                            −
                                        </button>
                                        <button
                                            onClick={() => adjust3DDecal('grow')}
                                            className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/35 text-white font-bold transition-colors"
                                            title="Agrandir le design"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => adjust3DDecal('rotL')}
                                            className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/35 text-white transition-colors"
                                            title="Pivoter à gauche"
                                        >
                                            ⟲
                                        </button>
                                        <button
                                            onClick={() => adjust3DDecal('rotR')}
                                            className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/35 text-white transition-colors"
                                            title="Pivoter à droite"
                                        >
                                            ⟳
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Save Button */}
            <Button
                onClick={handleSave}
                disabled={!uploadedImage || isSaving}
                className="w-full"
                size="lg"
            >
                {isSaving ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Génération du visuel de production…
                    </>
                ) : (
                    'Valider et Ajouter au Panier'
                )}
            </Button>
        </div>
    )
}
