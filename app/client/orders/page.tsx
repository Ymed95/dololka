'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Package, Calendar, DollarSign } from 'lucide-react'

export default function ClientOrders() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [filteredOrders, setFilteredOrders] = useState<any[]>([])
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchOrders()
        }
    }, [status, router])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders')
            const data = await res.json()
            setOrders(data)
            setFilteredOrders(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching orders:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (selectedStatus === 'all') {
            setFilteredOrders(orders)
        } else {
            setFilteredOrders(orders.filter(o => o.status === selectedStatus))
        }
    }, [selectedStatus, orders])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending_payment': return 'bg-orange-100 text-orange-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'in_production': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'completed': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending_payment': return 'En attente de paiement'
            case 'pending': return 'En attente'
            case 'in_production': return 'En production'
            case 'shipped': return 'Expédié'
            case 'completed': return 'Terminé'
            default: return status
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Mes Commandes</h1>
                    <p className="text-gray-600">Gérez et suivez toutes vos commandes</p>
                </div>

                {/* Status Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {['all', 'pending_payment', 'pending', 'in_production', 'shipped', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedStatus === status
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {status === 'all' && 'Toutes'}
                            {status === 'pending_payment' && 'En attente de paiement'}
                            {status === 'pending' && 'En attente'}
                            {status === 'in_production' && 'En production'}
                            {status === 'shipped' && 'Expédiées'}
                            {status === 'completed' && 'Terminées'}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Aucune commande trouvée</h3>
                            <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande avec ce statut</p>
                            <a href="/" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 inline-block">
                                Parcourir les produits
                            </a>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <Card key={order.id} hover>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-6">
                                        {/* Product Image Placeholder */}
                                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package className="w-12 h-12 text-gray-400" />
                                        </div>

                                        {/* Order Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-1">{order.product.name}</h3>
                                                    <p className="text-sm text-gray-500">Commande #{order.id.slice(0, 8)}</p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>{order.totalPrice.toFixed(2)}€</span>
                                                </div>
                                                {order.position && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Package className="w-4 h-4" />
                                                        <span>Position: {order.position}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {order.customNotes && (
                                                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                                                    <strong>Notes:</strong> {order.customNotes}
                                                </div>
                                            )}
                                        </div>
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
