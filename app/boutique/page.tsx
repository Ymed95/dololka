'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Search, ShoppingBag, Shirt, PenTool, ArrowRight, Palette, Printer } from 'lucide-react'
import { Suspense } from 'react'

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    type: string
    imageUrl: string
    sizes?: string
}

const tabs = [
    { id: 'personnalisation', label: 'Personnalisation', icon: Palette, description: 'Créez vos produits sur mesure' },
    { id: 'textile', label: 'Textile Vierge', icon: Shirt, description: 'Nos supports fournisseurs, personnalisables' },
    { id: 'materiel', label: 'Matériel & Fournitures', icon: PenTool, description: 'Outils et consommables pro' },
    { id: 'impression', label: 'Impression', icon: Printer, description: 'Flyers, affiches et supports imprimés' },
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

function BoutiqueContent() {
    const searchParams = useSearchParams()
    const initialTab = searchParams.get('tab') || 'personnalisation'

    const [activeTab, setActiveTab] = useState(initialTab)
    const [customProducts, setCustomProducts] = useState<Product[]>([])
    const [textileProducts, setTextileProducts] = useState<Product[]>([])
    const [materielProducts, setMaterielProducts] = useState<Product[]>([])
    const [impressionProducts, setImpressionProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [activeTab, selectedCategory, searchQuery])

    const fetchProducts = async () => {
        try {
            setLoading(true)

            if (activeTab === 'personnalisation') {
                const params = new URLSearchParams({ type: 'customizable' })
                if (selectedCategory !== 'all') params.append('category', selectedCategory)
                if (searchQuery) params.append('search', searchQuery)
                const res = await fetch(`/api/products?${params.toString()}`)
                const data = await res.json()
                if (Array.isArray(data)) setCustomProducts(data)
            } else if (activeTab === 'textile') {
                const res = await fetch('/api/products?type=textile')
                const data = await res.json()
                if (Array.isArray(data)) setTextileProducts(data)
            } else if (activeTab === 'materiel') {
                const res = await fetch('/api/products?type=materiel')
                const data = await res.json()
                if (Array.isArray(data)) setMaterielProducts(data)
            } else if (activeTab === 'impression') {
                const res = await fetch('/api/products?type=impression')
                const data = await res.json()
                if (Array.isArray(data)) setImpressionProducts(data)
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false)
        }
    }

    const currentProducts = activeTab === 'personnalisation' ? customProducts
        : activeTab === 'textile' ? textileProducts
        : activeTab === 'impression' ? impressionProducts
        : materielProducts

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
                                    onClick={() => { setActiveTab(tab.id); setSelectedCategory('all'); setSearchQuery(''); }}
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

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* Search & Filters for personnalisation */}
                {activeTab === 'personnalisation' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">Personnalisation</h2>
                        <p className="text-gray-600 mb-4">Choisissez un produit et créez votre design unique</p>
                        <div className="mb-4 max-w-lg">
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
                        <div className="flex flex-wrap gap-2">
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
                    </div>
                )}

                {activeTab === 'textile' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">Textile Vierge</h2>
                        <p className="text-gray-600">Produits textiles de qualité, idéals pour vos projets DIY ou la revente</p>
                    </div>
                )}

                {activeTab === 'materiel' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">Matériel & Fournitures</h2>
                        <p className="text-gray-600">Tout l'équipement pour la personnalisation textile professionnelle</p>
                    </div>
                )}

                {activeTab === 'impression' && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">Impression</h2>
                        <p className="text-gray-600">Flyers, affiches, cartes de visite et tous vos supports imprimés</p>
                    </div>
                )}

                {/* Products */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 text-sm">Chargement...</p>
                    </div>
                ) : currentProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 text-lg mb-2">Aucun produit disponible pour le moment</p>
                        <p className="text-gray-400 text-sm">Revenez bientôt ou contactez-nous pour plus d'informations</p>
                    </div>
                ) : (
                    <div className={`grid gap-4 md:gap-6 ${
                        activeTab === 'materiel'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    }`}>
                        {currentProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                {product.imageUrl && product.imageUrl !== '/products/placeholder.jpg' ? (
                                    <div className="relative aspect-square bg-gray-50">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center">
                                        {activeTab === 'materiel' ? (
                                            <PenTool className="w-12 h-12 text-gray-300" />
                                        ) : activeTab === 'impression' ? (
                                            <Printer className="w-12 h-12 text-gray-300" />
                                        ) : (
                                            <Shirt className="w-12 h-12 text-gray-300" />
                                        )}
                                    </div>
                                )}
                                <div className="p-3 md:p-4">
                                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                    <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                                    {product.sizes && (
                                        <p className="text-xs text-gray-400 mb-2">Tailles : {product.sizes}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary-600 font-bold">{product.price.toFixed(2)}€</span>
                                        {/* Le textile vierge est aussi personnalisable :
                                            il sert de support dans le configurateur. */}
                                        {activeTab === 'personnalisation' || activeTab === 'textile' ? (
                                            <Link href={`/customize/${product.id}`} className="text-xs text-primary-600 font-medium flex items-center gap-1">
                                                Personnaliser <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        ) : (
                                            <Link href="/contact" className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors">
                                                Commander
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                {(activeTab === 'textile' || activeTab === 'materiel' || activeTab === 'impression') && currentProducts.length > 0 && (
                    <div className="mt-8 bg-primary-50 rounded-2xl p-6 md:p-8 text-center border border-primary-100">
                        <h3 className="text-lg font-bold mb-2">Besoin de quantités ou de références spécifiques ?</h3>
                        <p className="text-gray-600 text-sm mb-4">Contactez-nous pour un devis personnalisé</p>
                        <Link href="/contact">
                            <Button className="bg-primary-600 hover:bg-primary-700 text-white">Demander un devis</Button>
                        </Link>
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
