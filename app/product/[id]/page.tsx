'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Palette, FileText } from 'lucide-react'

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

const categoryLabels: Record<string, string> = {
    tshirt: 'T-SHIRT',
    hoodie: 'HOODIE',
    sweatshirt: 'SWEATSHIRT',
    cap: 'CASQUETTE',
    mug: 'MUG',
    bag: 'TOTE BAG',
    vest: 'GILET',
    car: 'VOITURE',
}

const categoryFeatures: Record<string, string[]> = {
    tshirt: [
        'Coton 100% biologique',
        'Coupe classique unisexe',
        'Tissu pré-rétréci',
        'Impression haute qualité',
        'Entretien facile en machine',
    ],
    hoodie: [
        'Coton épais premium',
        'Capuche doublée',
        'Poche kangourou',
        'Impression haute qualité',
        'Entretien facile en machine',
    ],
    sweatshirt: [
        'Coton doux 100%',
        'Col rond classique',
        'Tissu résistant',
        'Impression haute qualité',
        'Entretien facile en machine',
    ],
    cap: [
        'Taille ajustable',
        'Tissu résistant',
        'Visière incurvée',
        'Broderie ou impression',
        'Usage quotidien',
    ],
    mug: [
        'Céramique haute qualité',
        'Passe au lave-vaisselle',
        'Impression durable',
        'Capacité 330ml',
        'Idéal bureau ou maison',
    ],
    bag: [
        'Toile résistante',
        'Anses longues',
        'Réutilisable',
        'Impression grande surface',
        'Léger et pratique',
    ],
    vest: [
        'Tissu confortable',
        'Coupe moderne',
        'Impression recto/verso',
        'Entretien facile',
        'Disponible en plusieurs tailles',
    ],
    car: [
        'Covering complet véhicule',
        'Vinyle premium haute qualité',
        'Résistant UV et intempéries',
        'Installation professionnelle',
        'Design sur 4 faces',
    ],
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSize, setSelectedSize] = useState('M')

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setProduct(data)
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-center h-64">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
                    <Link href="/">
                        <Button>Retour à l'accueil</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const features = categoryFeatures[product.category] || categoryFeatures['tshirt']
    const showSizes = !['mug', 'bag', 'car'].includes(product.category)

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-primary-600 hover:text-primary-700">Accueil</Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Product Image */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center shadow-xl p-8">
                            <div className="relative w-full h-full">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {product.mockupUrl && product.mockupUrl !== product.imageUrl && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-square bg-gray-50 rounded-lg p-4 border-2 border-primary-500">
                                    <div className="relative w-full h-full">
                                        <Image src={product.imageUrl} alt="Recto" fill className="object-contain" />
                                    </div>
                                </div>
                                <div className="aspect-square bg-gray-50 rounded-lg p-4 hover:border-2 hover:border-primary-300 transition-all">
                                    <div className="relative w-full h-full">
                                        <Image src={product.mockupUrl} alt="Verso" fill className="object-contain" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="default" className="mb-3">
                                {categoryLabels[product.category] || product.category.toUpperCase()}
                            </Badge>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            {product.category !== 'car' && (
                                <p className="text-2xl font-bold text-primary-600 mb-6">
                                    {product.price.toFixed(2)}€
                                </p>
                            )}
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Size Selection */}
                        {showSizes && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Taille
                                </label>
                                <div className="flex gap-2">
                                    {productSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-16 h-12 border-2 rounded-lg transition-all font-semibold ${selectedSize === size
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-gray-300 hover:border-primary-300 text-gray-700'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Caractéristiques</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-primary-500 mt-1">✓</span>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="pt-6 border-t border-gray-200 space-y-3">
                            {product.category === 'car' ? (
                                <>
                                    <Link href="/contact" className="block">
                                        <Button size="lg" className="w-full text-lg">
                                            <FileText className="w-6 h-6 mr-2" />
                                            Demander un devis
                                        </Button>
                                    </Link>
                                    <p className="text-sm text-center text-gray-500">
                                        Contactez-nous pour obtenir un devis personnalisé
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Link href={`/customize/${params.id}`} className="block">
                                        <Button size="lg" className="w-full text-lg">
                                            <Palette className="w-6 h-6 mr-2" />
                                            Personnaliser ce produit
                                        </Button>
                                    </Link>
                                    <p className="text-sm text-center text-gray-500">
                                        Créez votre design unique en quelques clics
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h4>
                            <ol className="text-sm text-blue-800 space-y-1">
                                <li>1. Uploadez votre logo ou design</li>
                                <li>2. Positionnez-le sur le produit</li>
                                <li>3. Ajustez la taille et la rotation</li>
                                <li>4. Validez et commandez !</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
