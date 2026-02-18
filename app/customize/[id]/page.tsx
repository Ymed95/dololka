'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/Button'
import { CustomizationCanvas, CustomizationConfig } from '@/components/customizer/CustomizationCanvas'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    imageUrl: string
    mockupUrl?: string | null
}

const productSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const productColors = [
    { name: 'Blanc', value: '#ffffff' },
    { name: 'Noir', value: '#1a1a1a' },
    { name: 'Gris', value: '#9ca3af' },
    { name: 'Gris Foncé', value: '#4b5563' },
    { name: 'Bleu Marine', value: '#1e3a8a' },
    { name: 'Bleu Ciel', value: '#3b82f6' },
    { name: 'Rouge', value: '#dc2626' },
    { name: 'Bordeaux', value: '#7f1d1d' },
    { name: 'Vert', value: '#16a34a' },
    { name: 'Vert Foncé', value: '#14532d' },
    { name: 'Jaune', value: '#eab308' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Rose', value: '#ec4899' },
    { name: 'Violet', value: '#7c3aed' },
    { name: 'Beige', value: '#d4a574' },
    { name: 'Marron', value: '#78350f' },
]

export default function CustomizePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSize, setSelectedSize] = useState<string>('M')
    const [selectedColor, setSelectedColor] = useState(productColors[0])

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

    const handleSaveCustomization = (config: CustomizationConfig) => {
        if (!product) return

        console.log('Customization saved:', config)

        // Save to cart
        const cartItem = {
            productId: params.id,
            product: product,
            customization: config,
            size: selectedSize,
            color: selectedColor.name,
            quantity: 1,
            totalPrice: product.price,
        }

        // Store in localStorage for demo
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        cart.push(cartItem)
        localStorage.setItem('cart', JSON.stringify(cart))

        // Navigate to cart
        alert('Produit ajouté au panier !')
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

                            {/* Color Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Couleur : <span className="text-primary-600">{selectedColor.name}</span>
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {productColors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 relative ${selectedColor.name === color.name
                                                ? 'border-primary-500 scale-110 shadow-lg ring-2 ring-primary-300 ring-offset-2'
                                                : 'border-gray-300 hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        >
                                            {selectedColor.name === color.name && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <svg className={`w-5 h-5 drop-shadow-lg ${['#ffffff', '#eab308', '#d4a574', '#9ca3af'].includes(color.value) ? 'text-gray-800' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

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
                            baseColor={selectedColor.value}
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
