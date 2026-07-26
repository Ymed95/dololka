'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageUploadField } from '@/components/admin/ImageUploadField'
import { Plus, Edit, Trash2, X, Save, Package, Shirt, PenTool } from 'lucide-react'

const productTypes = [
    { id: 'customizable', label: 'Personnalisation', icon: Package, description: 'Produits personnalisables par le client' },
    { id: 'textile', label: 'Textile Vierge', icon: Shirt, description: 'Produits sans personnalisation' },
    { id: 'materiel', label: 'Matériel & Fournitures', icon: PenTool, description: 'Outils et consommables' },
]

const categoryOptions: Record<string, { value: string; label: string }[]> = {
    customizable: [
        { value: 'tshirt', label: 'T-shirt' },
        { value: 'hoodie', label: 'Hoodie' },
        { value: 'sweatshirt', label: 'Sweatshirt' },
        { value: 'cap', label: 'Casquette' },
        { value: 'mug', label: 'Mug' },
        { value: 'vest', label: 'Gilet' },
        { value: 'bag', label: 'Sac' },
        { value: 'car', label: 'Voiture' },
    ],
    textile: [
        { value: 'tshirt', label: 'T-shirt' },
        { value: 'hoodie', label: 'Hoodie' },
        { value: 'sweatshirt', label: 'Sweatshirt' },
        { value: 'polo', label: 'Polo' },
        { value: 'cap', label: 'Casquette' },
        { value: 'bag', label: 'Sac / Tote bag' },
        { value: 'vest', label: 'Gilet' },
        { value: 'other', label: 'Autre' },
    ],
    materiel: [
        { value: 'presse', label: 'Presse à chaud' },
        { value: 'vinyle', label: 'Vinyle / Flex' },
        { value: 'encre', label: 'Encre' },
        { value: 'papier', label: 'Papier transfert' },
        { value: 'dtf', label: 'DTF' },
        { value: 'plotter', label: 'Plotter / Découpe' },
        { value: 'other', label: 'Autre' },
    ],
}

export default function AdminProducts() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeType, setActiveType] = useState('customizable')
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'tshirt',
        type: 'customizable',
        imageUrl: '',
        mockupUrl: '',
        sizes: '',
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            if ((session.user as any)?.role !== 'admin') {
                router.push('/client/dashboard')
            } else {
                fetchProducts()
            }
        }
    }, [status, session, router])

    useEffect(() => {
        if (status === 'authenticated') fetchProducts()
    }, [activeType])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/products?type=${activeType}&includeInactive=1`)
            const data = await res.json()
            if (Array.isArray(data)) setProducts(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '', description: '', price: '',
            category: categoryOptions[activeType]?.[0]?.value || 'tshirt',
            type: activeType, imageUrl: '', mockupUrl: '', sizes: '',
        })
        setEditingProduct(null)
        setShowForm(false)
    }

    const handleEdit = (product: any) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            type: product.type || activeType,
            imageUrl: product.imageUrl,
            mockupUrl: product.mockupUrl || '',
            sizes: product.sizes || '',
        })
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                type: activeType,
                mockupUrl: formData.mockupUrl || null,
                sizes: formData.sizes || null,
            }

            const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
            const res = await fetch(url, {
                method: editingProduct ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                resetForm()
                fetchProducts()
            }
        } catch (error) {
            console.error('Error saving product:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
            if (res.ok) fetchProducts()
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        )
    }

    const currentCategories = categoryOptions[activeType] || categoryOptions.customizable

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Gestion des Produits</h1>
                        <p className="text-gray-600 text-sm">Gérez vos produits par catégorie</p>
                    </div>
                    <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un produit
                    </Button>
                </div>

                {/* Type Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                    {productTypes.map((pt) => {
                        const Icon = pt.icon
                        return (
                            <button
                                key={pt.id}
                                onClick={() => { setActiveType(pt.id); resetForm(); }}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                                    activeType === pt.id
                                        ? 'border-primary-600 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {pt.label}
                            </button>
                        )
                    })}
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    {editingProduct ? 'Modifier le produit' : `Nouveau produit — ${productTypes.find(t => t.id === activeType)?.label}`}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                        <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                        <select
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {currentCategories.map((cat) => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                                        <Input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tailles disponibles</label>
                                        <Input value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} placeholder="XS,S,M,L,XL,2XL" />
                                    </div>
                                </div>

                                {/* Visuels : envoi de fichier, ou URL au choix */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                                    <ImageUploadField
                                        label="Image du produit (recto)"
                                        value={formData.imageUrl}
                                        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                        prefix="produit"
                                    />
                                    {/* Le textile vierge est personnalisable : il a lui aussi
                                        besoin d'un visuel verso pour le configurateur. */}
                                    {(activeType === 'customizable' || activeType === 'textile') && (
                                        <ImageUploadField
                                            label="Image verso (optionnel)"
                                            value={formData.mockupUrl}
                                            onChange={(url) => setFormData({ ...formData, mockupUrl: url })}
                                            prefix="produit-verso"
                                            hint="Sans verso, le configurateur réutilise l'image recto."
                                        />
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit">
                                        <Save className="w-4 h-4 mr-2" />
                                        {editingProduct ? 'Enregistrer' : 'Créer'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 mb-4">Aucun produit dans cette catégorie</p>
                        <Button onClick={() => { resetForm(); setShowForm(true); }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter le premier produit
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <Card key={product.id}>
                                <CardContent className="p-4">
                                    <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                                        {product.imageUrl && product.imageUrl !== '/products/placeholder.jpg' ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-3"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">Pas d'image</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-sm mb-1 truncate">{product.name}</h3>
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                                    {product.sizes && (
                                        <p className="text-xs text-gray-400 mb-2">Tailles : {product.sizes}</p>
                                    )}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-primary-600">{product.price.toFixed(2)}€</span>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{product.category}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleEdit(product)}>
                                            <Edit className="w-3 h-3 mr-1" /> Modifier
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(product.id)} className="text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
