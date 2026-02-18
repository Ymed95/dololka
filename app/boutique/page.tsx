'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Search, ShoppingBag, Shirt, PenTool, ArrowRight, Palette } from 'lucide-react'
import { Suspense } from 'react'

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    imageUrl: string
}

const tabs = [
    { id: 'personnalisation', label: 'Personnalisation', icon: Palette, description: 'Créez vos produits sur mesure' },
    { id: 'textile', label: 'Textile Vierge', icon: Shirt, description: 'Produits sans personnalisation' },
    { id: 'materiel', label: 'Matériel & Fournitures', icon: PenTool, description: 'Outils et consommables pro' },
]

const productCategories = [
    { value: 'all', label: 'Tout' },
    { value: 'tshirt', label: 'T-Shirts' },
    { value: 'hoodie', label: 'Hoodies' },
    { value: 'sweatshirt', label: 'Sweatshirts' },
    { value: 'cap', label: 'Casquettes' },
    { value: 'mug', label: 'Mugs' },
    { value: 'vest', label: 'Gilets' },
    { value: 'bag', label: 'Sacs' },
    { value: 'phonecase', label: 'Coques' },
    { value: 'car', label: 'Voitures' },
]

const textileProducts = [
    { id: 'tv-1', name: 'T-Shirt Basique Unisexe', description: 'Coton 100%, 180g/m². Disponible en 15 coloris.', price: 8.90, image: '/products/tshirt-front.png', sizes: 'XS - 3XL' },
    { id: 'tv-2', name: 'Hoodie Premium', description: 'Molleton épais 350g/m², capuche doublée.', price: 22.90, image: '/products/hoodie-front.png', sizes: 'S - 2XL' },
    { id: 'tv-3', name: 'Sweatshirt Col Rond', description: 'Intérieur brossé, coupe regular.', price: 18.90, image: '/products/sweatshirt-front.png', sizes: 'S - 2XL' },
    { id: 'tv-4', name: 'Casquette Snapback', description: 'Visière plate, fermeture snapback ajustable.', price: 6.90, image: '/products/cap-front.png', sizes: 'Taille unique' },
    { id: 'tv-5', name: 'Tote Bag Coton', description: 'Coton naturel 140g/m², anses longues.', price: 3.90, image: '/products/totebag-front.png', sizes: 'Taille unique' },
    { id: 'tv-6', name: 'Polo Classic', description: 'Piqué coton, col et bord-côtes contrastés.', price: 12.90, image: '/products/tshirt-front.png', sizes: 'S - 2XL' },
]

const materielProducts = [
    { id: 'mat-1', name: 'Presse à Chaud 38x38cm', description: 'Presse pneumatique professionnelle, contrôle digital de température et timer.', price: 289.00 },
    { id: 'mat-2', name: 'Vinyle Thermocollant (rouleau)', description: 'Vinyle flex premium, 50cm x 25m. Disponible en 30 coloris.', price: 34.90 },
    { id: 'mat-3', name: 'Encre Sublimation (lot 4 couleurs)', description: 'CMJN, 100ml par couleur. Compatible Epson.', price: 29.90 },
    { id: 'mat-4', name: 'Papier Transfert A4 (100 feuilles)', description: 'Papier transfert pour textile clair ou foncé.', price: 19.90 },
    { id: 'mat-5', name: 'Kit DTF Starter', description: 'Film DTF, poudre adhésive et encre. Tout pour débuter.', price: 89.90 },
    { id: 'mat-6', name: 'Plotter de Découpe 30cm', description: 'Découpe vinyle et flex, compatible avec les principaux logiciels.', price: 199.00 },
]

function BoutiqueContent() {
    const searchParams = useSearchParams()
    const initialTab = searchParams.get('tab') || 'personnalisation'

    const [activeTab, setActiveTab] = useState(initialTab)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (activeTab === 'personnalisation') {
            fetchProducts()
        }
    }, [activeTab, selectedCategory, searchQuery])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (selectedCategory !== 'all') params.append('category', selectedCategory)
            if (searchQuery) params.append('search', searchQuery)
            const res = await fetch(`/api/products?${params.toString()}`)
            const data = await res.json()
            if (Array.isArray(data)) setProducts(data)
            else setProducts([])
        } catch {
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Notre{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                            Boutique
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                        Personnalisez vos produits, achetez du textile vierge ou équipez-vous en matériel pro
                    </p>
                </div>
            </section>

            {/* Tabs */}
            <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto gap-0 -mb-px">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 md:px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-primary-600 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* === PERSONNALISATION === */}
                {activeTab === 'personnalisation' && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2">Personnalisation</h2>
                            <p className="text-gray-600">Choisissez un produit et créez votre design unique avec notre outil en ligne</p>
                        </div>

                        {/* Search */}
                        <div className="mb-6 max-w-lg">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {productCategories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        selectedCategory === cat.value
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Products */}
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600 text-sm">Chargement...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Aucun produit trouvé</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {products.map((product) => (
                                    <Link key={product.id} href={`/customize/${product.id}`} className="group">
                                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                                            <div className="relative aspect-square bg-gray-50">
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-4"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                            </div>
                                            <div className="p-3 md:p-4">
                                                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary-600 transition-colors truncate">{product.name}</h3>
                                                <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-primary-600 font-bold">{product.price.toFixed(2)}€</span>
                                                    <span className="text-xs text-primary-600 font-medium flex items-center gap-1">
                                                        Personnaliser <ArrowRight className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* === TEXTILE VIERGE === */}
                {activeTab === 'textile' && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2">Textile Vierge</h2>
                            <p className="text-gray-600">Produits textiles de qualité sans personnalisation, idéals pour vos projets DIY ou revendeurs</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                            {textileProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                                    <div className="relative aspect-square bg-gray-50">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4"
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-3 md:p-4">
                                        <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                                        <p className="text-gray-500 text-xs mb-1">{product.description}</p>
                                        <p className="text-xs text-gray-400 mb-2">Tailles : {product.sizes}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-primary-600 font-bold">{product.price.toFixed(2)}€</span>
                                            <Link href="/contact" className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors">
                                                Commander
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-primary-50 rounded-2xl p-6 md:p-8 text-center border border-primary-100">
                            <h3 className="text-lg font-bold mb-2">Besoin de quantités ou de références spécifiques ?</h3>
                            <p className="text-gray-600 text-sm mb-4">Contactez-nous pour un devis personnalisé avec des tarifs dégressifs selon les quantités</p>
                            <Link href="/contact">
                                <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                                    Demander un devis
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* === MATÉRIEL & FOURNITURES === */}
                {activeTab === 'materiel' && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2">Matériel & Fournitures</h2>
                            <p className="text-gray-600">Tout l'équipement nécessaire pour la personnalisation textile professionnelle</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {materielProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all">
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-4">
                                        <PenTool className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold mb-1">{product.name}</h3>
                                    <p className="text-gray-500 text-sm mb-3">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary-600 font-bold text-lg">{product.price.toFixed(2)}€</span>
                                        <Link href="/contact" className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                                            Commander
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-gray-100 rounded-2xl p-6 md:p-8 text-center">
                            <h3 className="text-lg font-bold mb-2">Vous ne trouvez pas ce qu'il vous faut ?</h3>
                            <p className="text-gray-600 text-sm mb-4">Nous pouvons sourcer n'importe quel matériel ou consommable pour la personnalisation</p>
                            <Link href="/contact">
                                <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                                    Nous contacter
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default function BoutiquePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        }>
            <BoutiqueContent />
        </Suspense>
    )
}
