'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
    Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, Eye, EyeOff,
    Download, ExternalLink
} from 'lucide-react'
import { SERVICE_ICON_NAMES, getServiceIcon } from '@/lib/serviceIcons'
import type { ProcessStep, FaqItem } from '@/lib/servicesData'

interface AdminService {
    id: string
    slug: string
    title: string
    subtitle: string
    description: string
    icon: string
    features: string[] | null
    process: ProcessStep[] | null
    pricing: string | null
    faq: FaqItem[] | null
    isActive: boolean
    sortOrder: number
}

interface ServiceForm {
    title: string
    slug: string
    subtitle: string
    description: string
    icon: string
    featuresText: string
    process: ProcessStep[]
    pricing: string
    faq: FaqItem[]
    isActive: boolean
}

const emptyForm: ServiceForm = {
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    icon: 'Sparkles',
    featuresText: '',
    process: [],
    pricing: '',
    faq: [],
    isActive: true,
}

export default function AdminServices() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [services, setServices] = useState<AdminService[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [importing, setImporting] = useState(false)
    const [editing, setEditing] = useState<AdminService | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<ServiceForm>(emptyForm)
    const [error, setError] = useState('')

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            if ((session.user as any)?.role !== 'admin') {
                router.push('/client/dashboard')
            } else {
                fetchServices()
            }
        }
    }, [status, session, router])

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services?all=1')
            const data = await res.json()
            if (Array.isArray(data)) setServices(data)
        } catch (err) {
            console.error('Error fetching services:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleImportDefaults = async () => {
        setImporting(true)
        setError('')
        try {
            const res = await fetch('/api/services/import-defaults', { method: 'POST' })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || "Échec de l'import")
            }
            await fetchServices()
        } catch {
            setError("Échec de l'import — la base est-elle migrée ? (npm run db:push)")
        } finally {
            setImporting(false)
        }
    }

    const openCreate = () => {
        setEditing(null)
        setForm(emptyForm)
        setShowForm(true)
        setError('')
    }

    const openEdit = (svc: AdminService) => {
        setEditing(svc)
        setForm({
            title: svc.title,
            slug: svc.slug,
            subtitle: svc.subtitle || '',
            description: svc.description || '',
            icon: svc.icon || 'Sparkles',
            featuresText: (svc.features || []).join('\n'),
            process: svc.process || [],
            pricing: svc.pricing || '',
            faq: svc.faq || [],
            isActive: svc.isActive,
        })
        setShowForm(true)
        setError('')
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim()) return
        setSaving(true)
        setError('')

        const payload = {
            title: form.title.trim(),
            slug: form.slug.trim() || undefined,
            subtitle: form.subtitle.trim(),
            description: form.description.trim(),
            icon: form.icon,
            features: form.featuresText.split('\n').map(s => s.trim()).filter(Boolean),
            process: form.process.filter(p => p.title.trim()),
            pricing: form.pricing.trim(),
            faq: form.faq.filter(f => f.q.trim()),
            isActive: form.isActive,
        }

        try {
            const res = editing
                ? await fetch(`/api/services/${editing.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
                : await fetch('/api/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Échec de la sauvegarde')
                return
            }
            setShowForm(false)
            await fetchServices()
        } catch {
            setError('Échec de la sauvegarde')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (svc: AdminService) => {
        if (!confirm(`Supprimer le service « ${svc.title} » ? Cette action est définitive.`)) return
        try {
            const res = await fetch(`/api/services/${svc.id}`, { method: 'DELETE' })
            if (res.ok) fetchServices()
        } catch (err) {
            console.error('Error deleting service:', err)
        }
    }

    const toggleActive = async (svc: AdminService) => {
        try {
            await fetch(`/api/services/${svc.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !svc.isActive }),
            })
            fetchServices()
        } catch (err) {
            console.error('Error toggling service:', err)
        }
    }

    const move = async (index: number, delta: -1 | 1) => {
        const other = index + delta
        if (other < 0 || other >= services.length) return
        const a = services[index]
        const b = services[other]
        try {
            await Promise.all([
                fetch(`/api/services/${a.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sortOrder: other }),
                }),
                fetch(`/api/services/${b.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sortOrder: index }),
                }),
            ])
            // Renumérote tout pour garder des sortOrder cohérents.
            const reordered = [...services]
            reordered[index] = b
            reordered[other] = a
            await Promise.all(reordered.map((s, i) =>
                s.sortOrder !== i
                    ? fetch(`/api/services/${s.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sortOrder: i }),
                    })
                    : Promise.resolve()
            ))
            fetchServices()
        } catch (err) {
            console.error('Error reordering:', err)
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
                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Gestion des Services</h1>
                        <p className="text-gray-600">Ajoutez, modifiez, réordonnez ou masquez les services affichés sur le site</p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="w-5 h-5 mr-2" />
                        Nouveau service
                    </Button>
                </div>

                {error && !showForm && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
                )}

                {services.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <h3 className="text-xl font-bold mb-2">Aucun service en base</h3>
                            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                                Le site affiche actuellement les 12 services historiques intégrés au code.
                                Importez-les en base pour pouvoir les modifier ici.
                            </p>
                            <Button onClick={handleImportDefaults} disabled={importing}>
                                <Download className="w-5 h-5 mr-2" />
                                {importing ? 'Import en cours…' : 'Importer les 12 services existants'}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {services.map((svc, index) => {
                                    const Icon = getServiceIcon(svc.icon)
                                    return (
                                        <div key={svc.id} className={`flex items-center gap-4 p-4 ${!svc.isActive ? 'opacity-50 bg-gray-50' : ''}`}>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => move(index, -1)}
                                                    disabled={index === 0}
                                                    className="p-1 text-gray-400 hover:text-primary-600 disabled:opacity-30"
                                                    title="Monter"
                                                >
                                                    <ArrowUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => move(index, 1)}
                                                    disabled={index === services.length - 1}
                                                    className="p-1 text-gray-400 hover:text-primary-600 disabled:opacity-30"
                                                    title="Descendre"
                                                >
                                                    <ArrowDown className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold truncate">{svc.title}</p>
                                                <p className="text-sm text-gray-500 truncate">/services/{svc.slug}</p>
                                            </div>
                                            <a
                                                href={`/services/${svc.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 text-gray-400 hover:text-primary-600"
                                                title="Voir la page"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => toggleActive(svc)}
                                                className={`p-2 rounded-lg ${svc.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                                title={svc.isActive ? 'Masquer du site' : 'Afficher sur le site'}
                                            >
                                                {svc.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => openEdit(svc)}
                                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                                                title="Modifier"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(svc)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Formulaire création / édition */}
            {showForm && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowForm(false)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto">
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">
                                    {editing ? `Modifier « ${editing.title} »` : 'Nouveau service'}
                                </h2>
                                <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                                    <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adresse (slug) {editing && <span className="text-xs text-gray-400">— fixe après création</span>}
                                    </label>
                                    <Input
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        placeholder="auto depuis le titre"
                                        disabled={!!editing}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre (une phrase, affichée dans les listes)</label>
                                <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Icône</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {(() => {
                                                const Icon = getServiceIcon(form.icon)
                                                return <Icon className="w-5 h-5 text-white" />
                                            })()}
                                        </div>
                                        <select
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            value={form.icon}
                                            onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                        >
                                            {SERVICE_ICON_NAMES.map((name) => (
                                                <option key={name} value={name}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarifs / mention devis</label>
                                    <Input value={form.pricing} onChange={(e) => setForm({ ...form, pricing: e.target.value })} placeholder="Ex. : Sur devis selon votre projet" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prestations incluses <span className="text-xs text-gray-400">(une par ligne)</span>
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                                    rows={6}
                                    value={form.featuresText}
                                    onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                                    placeholder={'Site vitrine\nE-commerce\nLanding page'}
                                />
                            </div>

                            {/* Étapes du process */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Étapes « Comment ça se passe »</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setForm({ ...form, process: [...form.process, { title: '', description: '' }] })}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Étape
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {form.process.map((step, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={step.title}
                                                    onChange={(e) => {
                                                        const process = [...form.process]
                                                        process[i] = { ...process[i], title: e.target.value }
                                                        setForm({ ...form, process })
                                                    }}
                                                    placeholder={`Étape ${i + 1} — titre`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({ ...form, process: form.process.filter((_, j) => j !== i) })}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <Input
                                                value={step.description}
                                                onChange={(e) => {
                                                    const process = [...form.process]
                                                    process[i] = { ...process[i], description: e.target.value }
                                                    setForm({ ...form, process })
                                                }}
                                                placeholder="Description de l'étape"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Questions fréquentes</label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setForm({ ...form, faq: [...form.faq, { q: '', a: '' }] })}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Question
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {form.faq.map((item, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    value={item.q}
                                                    onChange={(e) => {
                                                        const faq = [...form.faq]
                                                        faq[i] = { ...faq[i], q: e.target.value }
                                                        setForm({ ...form, faq })
                                                    }}
                                                    placeholder="Question"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({ ...form, faq: form.faq.filter((_, j) => j !== i) })}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <textarea
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                                                rows={2}
                                                value={item.a}
                                                onChange={(e) => {
                                                    const faq = [...form.faq]
                                                    faq[i] = { ...faq[i], a: e.target.value }
                                                    setForm({ ...form, faq })
                                                }}
                                                placeholder="Réponse"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Visible sur le site</span>
                            </label>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit" className="flex-1" disabled={saving}>
                                    {saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer le service'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    )
}
