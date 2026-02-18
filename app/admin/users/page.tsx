'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Users, ShoppingBag, MessageSquare, Shield, User } from 'lucide-react'

export default function AdminUsers() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
        else if (status === 'authenticated') {
            if ((session.user as any)?.role !== 'admin') router.push('/client/dashboard')
            else fetchUsers()
        }
    }, [status, session, router])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users')
            const data = await res.json()
            if (Array.isArray(data)) setUsers(data)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </div>
        )
    }

    const clients = users.filter(u => u.role === 'client')
    const admins = users.filter(u => u.role === 'admin')

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-1">Gestion des Utilisateurs</h1>
                    <p className="text-gray-600 text-sm">{users.length} utilisateur(s) inscrit(s)</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total</p>
                                    <p className="text-2xl font-bold">{users.length}</p>
                                </div>
                                <Users className="w-10 h-10 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Clients</p>
                                    <p className="text-2xl font-bold">{clients.length}</p>
                                </div>
                                <User className="w-10 h-10 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Admins</p>
                                    <p className="text-2xl font-bold">{admins.length}</p>
                                </div>
                                <Shield className="w-10 h-10 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Commandes</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Messages</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Inscrit le</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white text-xs font-bold">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
                                                    </div>
                                                    <span className="font-medium text-sm">{user.name || 'Sans nom'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {user.role === 'admin' ? 'Admin' : 'Client'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center gap-1 text-sm">
                                                    <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                                                    {user._count?.orders || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-flex items-center gap-1 text-sm">
                                                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                                                    {user._count?.sentMessages || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
