'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Download, BarChart3 } from 'lucide-react'

interface Stat {
    id: string
    value: string
    label: string
    sortOrder: number
    isActive: boolean
}

// Les 3 stats actuellement affichées par défaut sur l'accueil.
const CURRENT_DEFAULTS = [
    { value: '150+', label: 'Projets réalisés' },
    { value: '95%', label: 'Clients satisfaits' },
    { value: '360°', label: 'Accompagnement' },
]

export default function AdminSettings() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<Stat[]>([])
    const [loading, setLoading] = useState(true)
    const [importing, setImporting] = useState(false)
    const [newValue, setNewValue] = useState('')
    const [newLabel, setNewLabel] = useState('')
    const [adding, setAdding] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            if ((session.user as any)?.role !== 'admin') {
                router.push('/client/dashboard')
            } else {
                fetchStats()
            }
        }
    }, [status, session, router])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats?all=1')
            const data = await res.json()
            if (Array.isArray(data)) setStats(data)
        } catch (err) {
            console.error('Error fetching stats:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleImportDefaults = async () => {
        setImporting(true)
        setError('')
        try {
            for (let i = 0; i < CURRENT_DEFAULTS.length; i++) {
                await fetch('/api/stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...CURRENT_DEFAULTS[i], sortOrder: i }),
                })
            }
            await fetchStats()
        } catch {
            setError("Échec de l'import — la base est-elle migrée ? (npm run db:push)")
        } finally {
            setImporting(false)
        }
    }

    const updateStat = async (id: string, patch: Partial<Stat>) => {
        try {
            await fetch(`/api/stats/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
            })
        } catch (err) {
            console.error('Error updating stat:', err)
        }
    }

    // Édition locale + sauvegarde au blur.
    const editLocal = (id: string, patch: Partial<Stat>) => {
        setStats(stats.map(s => s.id === id ? { ...s, ...patch } : s))
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newValue.trim() || !newLabel.trim()) return
        setAdding(true)
        setError('')
        try {
            const res = await fetch('/api/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: newValue.trim(), label: newLabel.trim(), sortOrder: stats.length }),
            })
            if (res.ok) {
                setNewValue('')
                setNewLabel('')
                await fetchStats()
            } else {
                const data = await res.json()
                setError(data.error || "Échec de l'ajout")
            }
        } catch {
            setError("Échec de l'ajout — la base est-elle migrée ?")
        } finally {
            setAdding(false)
        }
    }

    const handleDelete = async (stat: Stat) => {
        if (!confirm(`Supprimer la statistique « ${stat.value} ${stat.label} » ?`)) return
        try {
            await fetch(`/api/stats/${stat.id}`, { method: 'DELETE' })
            fetchStats()
        } catch (err) {
            console.error('Error deleting stat:', err)
        }
    }

    const move = async (index: number, delta: -1 | 1) => {
        const other = index + delta
        if (other < 0 || other >= stats.length) return
        await Promise.all([
            updateStat(stats[index].id, { sortOrder: other }),
            updateStat(stats[other].id, { sortOrder: index }),
        ])
        fetchStats()
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Réglages du site</h1>
                    <p className="text-gray-600">Statistiques affichées sur la page d'accueil</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
                )}

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="w-6 h-6 text-primary-600" />
                            <h2 className="text-xl font-bold">Statistiques de la page d'accueil</h2>
                        </div>

                        {stats.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Le site affiche actuellement les statistiques par défaut.
                                    Importez-les pour pouvoir les modifier ici.
                                </p>
                                <Button onClick={handleImportDefaults} disabled={importing}>
                                    <Download className="w-5 h-5 mr-2" />
                                    {importing ? 'Import en cours…' : 'Importer les statistiques actuelles'}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.map((stat, index) => (
                                    <div key={stat.id} className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg ${!stat.isActive ? 'opacity-50 bg-gray-50' : ''}`}>
                                        <div className="flex flex-col gap-0.5">
                                            <button
                                                onClick={() => move(index, -1)}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-primary-600 disabled:opacity-30"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => move(index, 1)}
                                                disabled={index === stats.length - 1}
                                                className="p-1 text-gray-400 hover:text-primary-600 disabled:opacity-30"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="w-28">
                                            <Input
                                                value={stat.value}
                                                onChange={(e) => editLocal(stat.id, { value: e.target.value })}
                                                onBlur={() => updateStat(stat.id, { value: stat.value })}
                                                placeholder="150+"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                value={stat.label}
                                                onChange={(e) => editLocal(stat.id, { label: e.target.value })}
                                                onBlur={() => updateStat(stat.id, { label: stat.label })}
                                                placeholder="Projets réalisés"
                                            />
                                        </div>
                                        <button
                                            onClick={async () => {
                                                await updateStat(stat.id, { isActive: !stat.isActive })
                                                fetchStats()
                                            }}
                                            className={`p-2 rounded-lg ${stat.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                            title={stat.isActive ? 'Masquer' : 'Afficher'}
                                        >
                                            {stat.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(stat)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Ajout */}
                        <form onSubmit={handleAdd} className="mt-6 pt-6 border-t flex items-end gap-3">
                            <div className="w-28">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Valeur</label>
                                <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="500+" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Libellé</label>
                                <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Clients accompagnés" />
                            </div>
                            <Button type="submit" disabled={adding || !newValue.trim() || !newLabel.trim()}>
                                <Plus className="w-5 h-5 mr-1" />
                                Ajouter
                            </Button>
                        </form>

                        <p className="text-xs text-gray-500 mt-4">
                            Les modifications sont enregistrées automatiquement. Les statistiques sont toujours centrées sur la page d'accueil, quel que soit leur nombre.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
