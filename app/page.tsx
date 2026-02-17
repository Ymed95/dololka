'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardTitle } from '@/components/ui/Card'
import { Sparkles, Palette, Clock, Shield, Search } from 'lucide-react'

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    imageUrl: string
}

const features = [
    {
        icon: Palette,
        title: 'Personnalisation Totale',
        description: 'Uploadez vos  designs et positionnez-les exactement comme vous le souhaitez',
    },
    {
        icon: Clock,
        title: 'Processus Rapide',
        description: 'Commandez en quelques clics sans échanges interminables',
    },
    {
        icon: Sparkles,
        title: 'Qualité Premium',
        description: 'Des produits de haute qualité pour vos créations',
    },
    {
        icon: Shield,
        title: 'Paiement Sécurisé',
        description: 'Transactions sécurisées et suivi de commande complet',
    },
]

const categories = [
    { value: 'all', label: 'Tous les produits' },
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

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [selectedCategory, searchQuery])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (selectedCategory !== 'all') {
                params.append('category', selectedCategory)
            }
            if (searchQuery) {
                params.append('search', searchQuery)
            }

            const res = await fetch(`/api/products?${params.toString()}`)
            const data = await res.json()

            // Vérifier que data est bien un tableau
            if (Array.isArray(data)) {
                setProducts(data)
            } else {
                console.error('API response is not an array:', data)
                setProducts([])
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
                            Créez Vos Produits
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
                                Personnalisés
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-50 mb-8 max-w-3xl mx-auto">
                            Personnalisez facilement vos t-shirts, pulls, casquettes et plus encore avec notre outil en ligne intuitif
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="#produits">
                                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                                    Commencer maintenant
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                    En savoir plus
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Dololka Agency ?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="produits" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold mb-4">Nos Produits</h2>
                        <p className="text-xl text-gray-600">Sélectionnez un produit et personnalisez-le à votre goût</p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-8 space-y-4">
                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === cat.value
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Chargement des produits...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <Card key={product.id} hover className="overflow-hidden">
                                    <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-8"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <CardTitle className="mb-2">{product.name}</CardTitle>
                                        <p className="text-gray-600 mb-4">{product.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-primary-600">{product.price.toFixed(2)}€</span>
                                            <Link href={`/customize/${product.id}`}>
                                                <Button>Personnaliser</Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6">Prêt à créer votre design unique ?</h2>
                    <p className="text-xl mb-8 text-primary-50">
                        Rejoignez des centaines de clients satisfaits qui ont donné vie à leurs idées
                    </p>
                    <Link href="#produits">
                        <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                            Commencer maintenant
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}
