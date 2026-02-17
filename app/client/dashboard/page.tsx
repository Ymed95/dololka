'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Package, MessageSquare, TrendingUp } from 'lucide-react'

interface Stats {
    totalOrders: number
    inProduction: number
    unreadMessages: number
    totalSpent: number
}

export default function ClientDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<Stats>({
        totalOrders: 0,
        inProduction: 0,
        unreadMessages: 0,
        totalSpent: 0,
    })
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchDashboardData()
        }
    }, [status, router])

    const fetchDashboardData = async () => {
        try {
            // Fetch orders
            const ordersRes = await fetch('/api/orders')
            const orders = await ordersRes.json()

            // Fetch messages
            const messagesRes = await fetch('/api/messages')
            const messages = await messagesRes.json()

            // Calculate stats
            const inProduction = orders.filter((o: any) =>
                o.status === 'in_production' || o.status === 'pending'
            ).length
            const totalSpent = orders.reduce((sum: number, o: any) => sum + o.totalPrice, 0)
            const unreadMessages = messages.filter((m: any) =>
                !m.isRead && m.receiverId === (session?.user as any)?.id
            ).length

            setStats({
                totalOrders: orders.length,
                inProduction,
                unreadMessages,
                totalSpent,
            })

            // Get 5 most recent orders
            setRecentOrders(orders.slice(0, 5))
            setLoading(false)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setLoading(false)
        }
    }

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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Bienvenue, {session?.user?.name}!</h1>
                    <p className="text-gray-600">Voici un résumé de votre activité</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-primary-100 text-sm mb-1">Commandes</p>
                                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                                </div>
                                <Package className="w-12 h-12 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-secondary-100 text-sm mb-1">En cours</p>
                                    <p className="text-3xl font-bold">{stats.inProduction}</p>
                                </div>
                                <Package className="w-12 h-12 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Link href="/client/messages">
                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm mb-1">Messages</p>
                                        <p className="text-3xl font-bold">{stats.unreadMessages}</p>
                                    </div>
                                    <MessageSquare className="w-12 h-12 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm mb-1">Total dépensé</p>
                                    <p className="text-3xl font-bold">{stats.totalSpent.toFixed(2)}€</p>
                                </div>
                                <TrendingUp className="w-12 h-12 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Commandes récentes</h2>
                            <Link href="/client/orders" className="text-primary-600 hover:text-primary-700 font-medium">
                                Voir toutes →
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Aucune commande pour le moment</p>
                                <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium inline-block mt-4">
                                    Parcourir les produits
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                                                <Package className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium">{order.product.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                            <span className="font-bold">{order.totalPrice.toFixed(2)}€</span>
                                            <Link
                                                href={`/client/orders`}
                                                className="text-primary-600 hover:text-primary-700 font-medium"
                                            >
                                                Voir →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/">
                        <Card hover className="h-full cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <Package className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Nouvelle commande</h3>
                                <p className="text-gray-600">Parcourir les produits</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/client/orders">
                        <Card hover className="h-full cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <Package className="w-12 h-12 text-secondary-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Mes commandes</h3>
                                <p className="text-gray-600">Suivi et historique</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/client/messages">
                        <Card hover className="h-full cursor-pointer">
                            <CardContent className="p-6 text-center">
                                <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Messages</h3>
                                <p className="text-gray-600">Contacter le support</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
