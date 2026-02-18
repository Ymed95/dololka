'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Package, Users, DollarSign, MessageSquare, TrendingUp, Briefcase, Image as ImageIcon } from 'lucide-react'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        unreadMessages: 0,
    })
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            if ((session.user as any)?.role !== 'admin') {
                router.push('/client/dashboard')
            } else {
                fetchDashboardData()
            }
        }
    }, [status, session, router])

    const fetchDashboardData = async () => {
        try {
            const ordersRes = await fetch('/api/orders')
            const orders = await ordersRes.json()

            const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
            const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.totalPrice, 0)

            // Get unique customers
            const uniqueCustomers = new Set(orders.map((o: any) => o.userId))

            const messagesRes = await fetch('/api/messages')
            const messages = await messagesRes.json()
            const unread = messages.filter((m: any) => !m.isRead && m.receiverId === (session?.user as any)?.id).length

            setStats({
                totalOrders: orders.length,
                pendingOrders,
                totalRevenue,
                totalCustomers: uniqueCustomers.size,
                unreadMessages: unread,
            })

            setRecentOrders(orders.slice(0, 10))
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Dashboard Administrateur</h1>
                    <p className="text-gray-600">Vue d'ensemble de votre activité</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm mb-1">En attente</p>
                                    <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                                </div>
                                <Package className="w-12 h-12 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm mb-1">Chiffre d'affaires</p>
                                    <p className="text-3xl font-bold">{stats.totalRevenue.toFixed(2)}€</p>
                                </div>
                                <DollarSign className="w-12 h-12 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm mb-1">Clients</p>
                                    <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                                </div>
                                <Users className="w-12 h-12 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Link href="/admin/messages">
                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-shadow cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm mb-1">Messages</p>
                                        <p className="text-3xl font-bold">{stats.unreadMessages}</p>
                                    </div>
                                    <MessageSquare className="w-12 h-12 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Recent Orders */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Commandes récentes</h2>
                            <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 font-medium">
                                Voir toutes →
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produit</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Montant</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm">{order.user.name}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{order.product.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium">{order.totalPrice.toFixed(2)}€</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/admin/products">
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-5 text-center">
                                <Package className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold mb-1">Produits</h3>
                                <p className="text-gray-600 text-sm">Personnalisation, textile vierge, matériel</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/orders">
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-5 text-center">
                                <Briefcase className="w-10 h-10 text-secondary-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold mb-1">Commandes</h3>
                                <p className="text-gray-600 text-sm">Gérer les statuts de commandes</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/messages">
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-5 text-center">
                                <MessageSquare className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold mb-1">Messages</h3>
                                <p className="text-gray-600 text-sm">Lire et répondre aux clients</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/portfolio">
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-5 text-center">
                                <ImageIcon className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold mb-1">Portfolio</h3>
                                <p className="text-gray-600 text-sm">Gérer les projets et réalisations</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/users">
                        <Card hover className="cursor-pointer">
                            <CardContent className="p-5 text-center">
                                <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                                <h3 className="text-lg font-bold mb-1">Utilisateurs</h3>
                                <p className="text-gray-600 text-sm">Voir les clients inscrits</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
