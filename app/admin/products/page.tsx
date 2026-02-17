'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Edit, Trash2, X, Save } from 'lucide-react'

const categoryOptions = [
    { value: 'tshirt', label: 'T-shirt' },
    { value: 'hoodie', label: 'Hoodie' },
    { value: 'sweatshirt', label: 'Sweatshirt' },
    { value: 'cap', label: 'Casquette' },
    { value: 'mug', label: 'Mug' },
    { value: 'vest', label: 'Gilet' },
    { value: 'bag', label: 'Sac' },
    { value: 'car', label: 'Voiture' },
]

export default function AdminProducts() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'tshirt',
        imageUrl: '',
        mockupUrl: '',
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

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const data = await res.json()
            if (Array.isArray(data)) setProducts(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching products:', error)
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', category: 'tshirt', imageUrl: '', mockupUrl: '' })
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
            imageUrl: product.imageUrl,
            mockupUrl: product.mockupUrl || '',
        })
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                mockupUrl: formData.mockupUrl || null,
            }

            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : '/api/products'

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
            if (res.ok) {
                fetchProducts()
            }
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Gestion des Produits</h1>
                        <p className="text-gray-600">{products.length} produit(s)</p>
                    </div>
                    <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter un produit
                    </Button>
                </div>

                {showForm && (
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">
                                    {editingProduct ? 'Modifier le produit' : 'Nouveau Produit'}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                                        <select
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categoryOptions.map((cat) => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">URL image (recto)</label>
                                        <Input
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            placeholder="/products/product-front.png"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">URL mockup (verso)</label>
                                        <Input
                                            value={formData.mockupUrl}
                                            onChange={(e) => setFormData({ ...formData, mockupUrl: e.target.value })}
                                            placeholder="/products/product-back.png"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit">
                                        <Save className="w-4 h-4 mr-2" />
                                        {editingProduct ? 'Enregistrer' : 'Créer le produit'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Annuler
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product.id}>
                            <CardContent className="p-6">
                                <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                                    {product.imageUrl ? (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <span className="text-gray-400">Image</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-primary-600">{product.price.toFixed(2)}€</span>
                                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Modifier
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
