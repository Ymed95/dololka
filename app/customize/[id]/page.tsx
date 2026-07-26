'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cartStore'
import { uploadDataUrl } from '@/lib/production/uploadAsset'
import type { CustomizationData } from '@/lib/types/customization'
import { colorsForProduct, isLightColor, type ProductColor } from '@/lib/productColors'

// react-konva ne fonctionne qu'au navigateur : chargement côté client uniquement.
const CustomizationCanvas = dynamic(
    () => import('@/components/customizer/CustomizationCanvas').then((m) => m.CustomizationCanvas),
    {
        ssr: false,
        loading: () => (
            <div className="bg-white rounded-xl shadow-lg p-12 flex items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        ),
    }
)

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    /** "customizable" | "textile" | "materiel" */
    type?: string
    imageUrl: string
    mockupUrl?: string | null
    model3dUrl?: string | null
    /** Coloris disponibles ; vide = palette par défaut du site. */
    colors?: unknown
}

// Modèles GLB de scaffold fournis par défaut selon la catégorie produit.
const DEFAULT_MODELS: Record<string, string> = {
    tshirt: '/models/tshirt.glb',
    hoodie: '/models/hoodie.glb',
    sweatshirt: '/models/hoodie.glb',
    cap: '/models/cap.glb',
    mug: '/models/mug.glb',
}

const productSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function CustomizePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const addItem = useCartStore((s) => s.addItem)
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSize, setSelectedSize] = useState<string>('M')
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)
    const [quantity, setQuantity] = useState(1)
    // Autres supports de la même catégorie (nos modèles + textile fournisseurs)
    const [siblings, setSiblings] = useState<Product[]>([])

    // Coloris réellement proposés pour ce produit (sinon palette par défaut).
    const availableColors = colorsForProduct(product?.colors)

    // Sélectionne un coloris valide : au chargement, et si l'on change de
    // support dont la palette ne contient pas la couleur en cours.
    useEffect(() => {
        if (availableColors.length === 0) return
        const stillAvailable =
            selectedColor && availableColors.some((c) => c.value === selectedColor.value)
        if (!stillAvailable) setSelectedColor(availableColors[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id, product?.colors])

    // Fetch product from database
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setProduct(data)
                } else {
                    console.error('Failed to load product')
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [params.id])

    // Supports disponibles dans la même catégorie, pour pouvoir en changer
    // sans quitter le configurateur ni perdre le design en cours.
    useEffect(() => {
        if (!product?.category) return
        fetch(`/api/products?types=customizable,textile&category=${encodeURIComponent(product.category)}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setSiblings(data)
            })
            .catch(() => {})
    }, [product?.category])

    /** Change de support en conservant design, couleur, taille et quantité.
     *  On met l'URL à jour sans recharger la page (un remount réinitialiserait
     *  la personnalisation en cours). */
    const handleSelectProduct = (next: Product) => {
        if (next.id === product?.id) return
        setProduct(next)
        window.history.replaceState(null, '', `/customize/${next.id}`)
    }

    const handleSaveCustomization = async (data: CustomizationData) => {
        if (!product || !selectedColor) return

        // Upload des assets (design + rendus de production) pour alléger le
        // panier et la DB. Le design est partagé entre les vues : on l'upload
        // une seule fois et on réutilise l'URL.
        //
        // Si l'upload échoue (pas de Blob configuré, réseau…), uploadDataUrl
        // renvoie la dataURL d'origine. On refuse alors de la conserver
        // au-delà d'une certaine taille : le panier vit dans localStorage
        // (~5 Mo de quota) et une dataURL volumineuse le casserait entièrement.
        const MAX_INLINE_BYTES = 600 * 1024
        const tooHeavy = (url?: string) =>
            !!url && url.startsWith('data:') && url.length > MAX_INLINE_BYTES

        let sharedDesignUrl: string | undefined
        const uploadedViews = await Promise.all(
            data.views.map(async (view) => {
                let designFileUrl = view.designFileUrl
                if (designFileUrl?.startsWith('data:')) {
                    sharedDesignUrl =
                        sharedDesignUrl || (await uploadDataUrl(designFileUrl, 'design'))
                    designFileUrl = sharedDesignUrl
                }
                let productionImageUrl = view.productionImageUrl?.startsWith('data:')
                    ? await uploadDataUrl(view.productionImageUrl, `prod-${view.viewId}`)
                    : view.productionImageUrl

                // Le rendu composite n'est qu'une référence visuelle : l'admin
                // le reconstitue depuis le design + les coordonnées si absent.
                if (tooHeavy(productionImageUrl)) {
                    console.warn(
                        `Rendu de production non stocké (upload indisponible, ${Math.round((productionImageUrl!.length) / 1024)} Ko). ` +
                        `L'aperçu admin sera recalculé depuis le design et sa position.`
                    )
                    productionImageUrl = undefined
                }

                return { ...view, designFileUrl, productionImageUrl }
            })
        )

        // Le design lui-même est indispensable à la production : s'il est trop
        // lourd pour le panier et non uploadé, on prévient le client plutôt que
        // de casser silencieusement la commande.
        if (uploadedViews.some((v) => tooHeavy(v.designFileUrl))) {
            alert(
                "Votre design n'a pas pu être enregistré sur le serveur (fichier trop volumineux). " +
                "Merci de réessayer avec une image plus légère, ou de nous contacter."
            )
            return
        }

        const customization: CustomizationData = { ...data, views: uploadedViews }

        const qty = Math.max(1, Math.min(99, quantity))
        addItem({
            productId: params.id,
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                category: product.category,
            },
            size: selectedSize,
            color: selectedColor.name,
            quantity: qty,
            unitPrice: product.price,
            totalPrice: product.price * qty,
            customization,
        })

        router.push('/cart')
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        )
    }

    // Product not found
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
                        <Link href="/">
                            <Button>Retour à l'accueil</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const carViews = [
        { id: 'front', label: 'Avant', templateUrl: '/products/car-front.png' },
        { id: 'back', label: 'Arrière', templateUrl: '/products/car-back.png' },
        { id: 'left', label: 'Gauche', templateUrl: '/products/car-left.png' },
        { id: 'right', label: 'Droite', templateUrl: '/products/car-right.png' },
    ]
    const capViews = [
        { id: 'front', label: 'Face', templateUrl: '/products/cap-front.png.png' },
        { id: 'back', label: 'Arrière', templateUrl: '/products/cap-back.png.png' },
        { id: 'left', label: 'Gauche', templateUrl: '/products/cap-left.png.png' },
        { id: 'right', label: 'Droite', templateUrl: '/products/cap-right.png.png' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-primary-600 hover:text-primary-700">
                        Accueil
                    </Link>
                    <span className="text-gray-400">/</span>
                    <Link href={`/product/${params.id}`} className="text-primary-600 hover:text-primary-700">
                        {product.name}
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">Personnalisation</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Product Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:sticky lg:top-24">
                            <Link href={`/product/${params.id}`} className="flex items-center text-primary-600 hover:text-primary-700 mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour au produit
                            </Link>

                            <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-gray-600 mb-6">{product.description}</p>

                            {/* Choix du support : tous les modèles de la même
                                catégorie, y compris le textile fournisseurs. */}
                            {siblings.length > 1 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Modèle ({siblings.length} disponibles)
                                    </label>
                                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                        {siblings.map((p) => {
                                            const isCurrent = p.id === product.id
                                            return (
                                                <button
                                                    key={p.id}
                                                    onClick={() => handleSelectProduct(p)}
                                                    className={`w-full flex items-center gap-3 p-2 rounded-lg border-2 text-left transition-all ${
                                                        isCurrent
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                                                        {p.imageUrl && (
                                                            <Image
                                                                src={p.imageUrl}
                                                                alt={p.name}
                                                                fill
                                                                className="object-contain p-1"
                                                                sizes="48px"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`text-sm font-medium truncate ${isCurrent ? 'text-primary-700' : 'text-gray-800'}`}>
                                                            {p.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {p.price.toFixed(2)}€
                                                            {p.type === 'textile' && ' · textile fournisseur'}
                                                        </p>
                                                    </div>
                                                    {isCurrent && (
                                                        <Check className="w-4 h-4 text-primary-600 flex-shrink-0" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Changez de modèle à tout moment : votre design est conservé.
                                    </p>
                                </div>
                            )}

                            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg p-4 mb-6">
                                <p className="text-sm opacity-90">Prix</p>
                                <p className="text-3xl font-bold">{product.price.toFixed(2)}€</p>
                            </div>

                            {/* Size Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Taille
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {productSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-3 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${selectedSize === size
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 hover:border-primary-300 text-gray-700'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Quantité
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-200 font-bold text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={99}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                                        className="w-16 text-center py-2 border-2 border-gray-200 rounded-lg font-bold text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(q => Math.min(99, q + 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-200 font-bold text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Prix unitaire : {product.price.toFixed(2)}€ — Total : {(product.price * quantity).toFixed(2)}€
                                </p>
                            </div>

                            {/* Coloris disponibles pour ce produit */}
                            {selectedColor && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Couleur : <span className="text-primary-600">{selectedColor.name}</span>
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableColors.map((color) => {
                                            const active = selectedColor.value === color.value
                                            return (
                                                <button
                                                    key={color.value}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 relative ${active
                                                        ? 'border-primary-500 scale-110 shadow-lg ring-2 ring-primary-300 ring-offset-2'
                                                        : 'border-gray-300 hover:scale-105'
                                                        }`}
                                                    style={{ backgroundColor: color.value }}
                                                    title={color.name}
                                                >
                                                    {active && (
                                                        <span className="absolute inset-0 flex items-center justify-center">
                                                            {/* Coche foncée sur les teintes claires, pour rester lisible */}
                                                            <svg className={`w-5 h-5 drop-shadow-lg ${isLightColor(color.value) ? 'text-gray-800' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 text-sm border-t pt-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Livraison gratuite dès 50€</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Production sous 3-5 jours</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Qualité premium garantie</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Customization Tool */}
                    <div className="lg:col-span-2">
                        <CustomizationCanvas
                            productImageUrl={product.imageUrl}
                            productBackUrl={product.mockupUrl || product.imageUrl}
                            productType={product.category as any}
                            baseColor={(selectedColor ?? availableColors[0]).value}
                            baseColorName={(selectedColor ?? availableColors[0]).name}
                            model3dUrl={product.model3dUrl || DEFAULT_MODELS[product.category]}
                            productName={product.name}
                            productViews={
                                product.category === 'car'
                                    ? carViews
                                    : product.category === 'cap'
                                        ? capViews
                                        : undefined
                            }
                            onSave={handleSaveCustomization}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
