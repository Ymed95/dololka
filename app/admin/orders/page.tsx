'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Package, Download, X, Eye, User, MapPin, FileImage } from 'lucide-react'
import dynamic from 'next/dynamic'

// Composant basé sur react-konva → chargement client uniquement (pas de SSR).
const OrderDesignPreview = dynamic(
    () => import('@/components/admin/OrderDesignPreview').then((m) => m.OrderDesignPreview),
    { ssr: false }
)

const statusLabels: Record<string, string> = {
    pending_payment: 'En attente de paiement',
    pending: 'En attente',
    in_production: 'En production',
    shipped: 'Expédié',
    completed: 'Terminé',
}

export default function AdminOrders() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [filteredOrders, setFilteredOrders] = useState<any[]>([])
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            if ((session.user as any)?.role !== 'admin') {
                router.push('/client/dashboard')
            } else {
                fetchOrders()
            }
        }
    }, [status, session, router])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders')
            const data = await res.json()
            if (Array.isArray(data)) {
                setOrders(data)
                setFilteredOrders(data)
            }
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

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })
            if (res.ok) {
                fetchOrders()
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null)
                }
            }
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'pending_payment': return 'bg-orange-100 text-orange-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'in_production': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'completed': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const downloadUrl = (url: string, filename: string) => {
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDownloadDesign = (order: any) => {
        if (!order.designFileUrl) return
        downloadUrl(
            order.designFileUrl,
            order.designFileName || `design-commande-${order.id.slice(0, 8)}.png`
        )
    }

    const viewOrderDetail = async (orderId: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`)
            if (res.ok) {
                const data = await res.json()
                setSelectedOrder(data)
            }
        } catch (error) {
            console.error('Error fetching order detail:', error)
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
                    <h1 className="text-4xl font-bold mb-2">Gestion des Commandes</h1>
                    <p className="text-gray-600">Gérez toutes les commandes clients et récupérez les designs</p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-3">
                    {['all', 'pending_payment', 'pending', 'in_production', 'shipped', 'completed'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSelectedStatus(s)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedStatus === s
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {s === 'all' ? `Toutes (${orders.length})` : `${statusLabels[s]} (${orders.filter(o => o.status === s).length})`}
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                <Card>
                    <CardContent className="p-6">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Aucune commande</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produit</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Design</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Montant</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-500 font-mono">#{order.id.slice(0, 8)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm font-medium">{order.user?.name}</div>
                                                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium">{order.product?.name}</td>
                                                <td className="px-4 py-3">
                                                    {order.designFileUrl ? (
                                                        <button
                                                            onClick={() => handleDownloadDesign(order)}
                                                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                                                            title="Télécharger le design"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            Design
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Aucun</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold">{order.totalPrice?.toFixed(2)}€</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    >
                                                        <option value="pending_payment">En attente de paiement</option>
                                                        <option value="pending">En attente</option>
                                                        <option value="in_production">En production</option>
                                                        <option value="shipped">Expédié</option>
                                                        <option value="completed">Terminé</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => viewOrderDetail(order.id)}
                                                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 font-medium"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Détail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedOrder(null)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Commande #{selectedOrder.id.slice(0, 8)}</h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                                <select
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 ${getStatusColor(selectedOrder.status)}`}
                                    value={selectedOrder.status}
                                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                                >
                                    <option value="pending_payment">En attente de paiement</option>
                                    <option value="pending">En attente</option>
                                    <option value="in_production">En production</option>
                                    <option value="shipped">Expédié</option>
                                    <option value="completed">Terminé</option>
                                </select>
                            </div>

                            {/* Client Info */}
                            <div className="bg-gray-50 rounded-xl p-5 mb-6">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Client
                                </h3>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p className="font-medium">{selectedOrder.user?.name}</p>
                                    <p>{selectedOrder.user?.email}</p>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="bg-gray-50 rounded-xl p-5 mb-6">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Produit
                                </h3>
                                <div className="flex items-center gap-4">
                                    {selectedOrder.product?.imageUrl && (
                                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden relative flex-shrink-0">
                                            <Image
                                                src={selectedOrder.product.imageUrl}
                                                alt={selectedOrder.product.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium">{selectedOrder.product?.name}</p>
                                        <p className="text-sm text-gray-500">{selectedOrder.product?.category}</p>
                                        <p className="text-lg font-bold text-primary-600 mt-1">{selectedOrder.totalPrice?.toFixed(2)}€</p>
                                    </div>
                                </div>
                            </div>

                            {/* Customization Info */}
                            <div className="bg-gray-50 rounded-xl p-5 mb-6">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Personnalisation
                                </h3>
                                <div className="text-sm text-gray-700 space-y-2">
                                    {selectedOrder.baseColor && (
                                        <p className="flex items-center gap-2">
                                            <span className="font-medium">Couleur du vêtement :</span>
                                            <span
                                                className="inline-block w-5 h-5 rounded-full border border-gray-300"
                                                style={{ backgroundColor: selectedOrder.baseColor }}
                                            />
                                            <span>{selectedOrder.customizationData?.baseColorName || selectedOrder.baseColor}</span>
                                        </p>
                                    )}
                                    {selectedOrder.position && (
                                        <p><span className="font-medium">Position :</span> {selectedOrder.position}</p>
                                    )}
                                    {selectedOrder.designX != null && (
                                        <p><span className="font-medium">Coordonnées :</span> X: {Math.round(selectedOrder.designX)}, Y: {Math.round(selectedOrder.designY)}</p>
                                    )}
                                    {selectedOrder.designWidth != null && (
                                        <p><span className="font-medium">Taille :</span> {Math.round(selectedOrder.designWidth)} x {Math.round(selectedOrder.designHeight)} px</p>
                                    )}
                                    {selectedOrder.designRotation != null && selectedOrder.designRotation !== 0 && (
                                        <p><span className="font-medium">Rotation :</span> {Math.round(selectedOrder.designRotation)}°</p>
                                    )}
                                </div>
                            </div>

                            {/* Assets de production (rendus HD multi-vues) */}
                            {Array.isArray(selectedOrder.customizationData?.views) &&
                                selectedOrder.customizationData.views.some((v: any) => v.productionImageUrl) && (
                                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-6">
                                    <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                        <FileImage className="w-4 h-4" /> Fichiers de production
                                    </h3>
                                    <p className="text-xs text-gray-600 mb-4">
                                        Rendus haute résolution (produit + couleur + design) prêts pour l'impression.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedOrder.customizationData.views
                                            .filter((v: any) => v.productionImageUrl)
                                            .map((v: any) => (
                                                <div key={v.viewId} className="bg-white rounded-lg p-3 border border-green-100">
                                                    <p className="text-xs font-medium text-gray-700 mb-2">{v.label}</p>
                                                    <div className="bg-gray-50 rounded flex items-center justify-center mb-3" style={{ minHeight: 140 }}>
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={v.productionImageUrl}
                                                            alt={`Rendu production ${v.label}`}
                                                            className="max-w-full max-h-48 object-contain"
                                                        />
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() => downloadUrl(
                                                            v.productionImageUrl,
                                                            `production-${selectedOrder.id.slice(0, 8)}-${v.viewId}.png`
                                                        )}
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Télécharger ({v.label})
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Design File */}
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <FileImage className="w-4 h-4" /> Design du client
                                </h3>
                                {selectedOrder.designFileUrl ? (
                                    <div>
                                        {/* Prévisualisation complète : produit + design positionné */}
                                        {selectedOrder.designX != null && selectedOrder.product?.imageUrl && (
                                            <div className="mb-4">
                                                <p className="text-xs font-medium text-gray-600 mb-2">Vue d&apos;ensemble (produit + design)</p>
                                                <OrderDesignPreview
                                                    productImageUrl={selectedOrder.product.imageUrl}
                                                    designFileUrl={selectedOrder.designFileUrl}
                                                    designX={selectedOrder.designX}
                                                    designY={selectedOrder.designY}
                                                    designWidth={selectedOrder.designWidth ?? 100}
                                                    designHeight={selectedOrder.designHeight ?? 100}
                                                    designRotation={selectedOrder.designRotation ?? 0}
                                                    className="w-full max-w-sm"
                                                />
                                            </div>
                                        )}

                                        {/* Design seul */}
                                        <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center" style={{ minHeight: 120 }}>
                                            <img
                                                src={selectedOrder.designFileUrl}
                                                alt="Design client"
                                                className="max-w-full max-h-40 object-contain"
                                            />
                                        </div>

                                        {/* Download Button */}
                                        <Button
                                            onClick={() => handleDownloadDesign(selectedOrder)}
                                            className="w-full"
                                        >
                                            <Download className="w-5 h-5 mr-2" />
                                            Télécharger le design
                                        </Button>

                                        {selectedOrder.designFileName && (
                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                Fichier : {selectedOrder.designFileName}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <FileImage className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                        <p>Aucun design uploadé pour cette commande</p>
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            {selectedOrder.customNotes && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
                                    <h3 className="font-bold text-gray-900 mb-2">Notes / Adresse de livraison</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{selectedOrder.customNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
