'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MultiImageUpload } from '@/components/admin/MultiImageUpload'
import { SourceFilesUpload, type SourceFile } from '@/components/admin/SourceFilesUpload'
import { Plus, Edit, Trash2, X, Save } from 'lucide-react'

const categoryOptions = [
    { value: 'branding', label: 'Branding' },
    { value: 'web', label: 'Sites Web' },
    { value: 'social', label: 'Réseaux Sociaux' },
    { value: 'textile', label: 'Textile' },
    { value: 'design', label: 'Design' },
    { value: 'pub', label: 'Publicité' },
    { value: 'photo', label: 'Photo & Vidéo' },
    { value: 'other', label: 'Autre' },
]

const colorOptions = [
    { value: 'from-violet-500 to-purple-600', label: 'Violet' },
    { value: 'from-pink-500 to-rose-600', label: 'Rose' },
    { value: 'from-blue-500 to-cyan-600', label: 'Bleu' },
    { value: 'from-orange-500 to-amber-600', label: 'Orange' },
    { value: 'from-green-500 to-emerald-600', label: 'Vert' },
    { value: 'from-gray-600 to-gray-800', label: 'Gris' },
    { value: 'from-teal-500 to-green-600', label: 'Teal' },
    { value: 'from-red-500 to-orange-600', label: 'Rouge' },
    { value: 'from-indigo-500 to-blue-600', label: 'Indigo' },
    { value: 'from-primary-500 to-secondary-500', label: 'Primaire' },
]

export default function AdminPortfolio() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProject, setEditingProject] = useState<any | null>(null)
    const [formData, setFormData] = useState({
        title: '', description: '', detailText: '', category: 'branding', tags: '',
        color: 'from-primary-500 to-secondary-500', imageUrl: '',
    })
    // Galerie et fichiers sources, gérés à part car ce sont des listes.
    const [images, setImages] = useState<string[]>([])
    const [files, setFiles] = useState<SourceFile[]>([])

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
        else if (status === 'authenticated') {
            if ((session.user as any)?.role !== 'admin') router.push('/client/dashboard')
            else fetchProjects()
        }
    }, [status, session, router])

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/portfolio')
            const data = await res.json()
            if (Array.isArray(data)) setProjects(data)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    const resetForm = () => {
        setFormData({ title: '', description: '', detailText: '', category: 'branding', tags: '', color: 'from-primary-500 to-secondary-500', imageUrl: '' })
        setImages([])
        setFiles([])
        setEditingProject(null)
        setShowForm(false)
    }

    const handleEdit = (project: any) => {
        setEditingProject(project)
        setFormData({
            title: project.title,
            description: project.description,
            detailText: project.detailText || '',
            category: project.category,
            tags: project.tags,
            color: project.color,
            imageUrl: project.imageUrl || '',
        })
        setImages(Array.isArray(project.images) ? project.images : [])
        setFiles(Array.isArray(project.files) ? project.files : [])
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingProject) {
                await fetch('/api/portfolio', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, images, files, id: editingProject.id }),
                })
            } else {
                await fetch('/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, images, files }),
                })
            }
            resetForm()
            fetchProjects()
        } catch (e) { console.error(e) }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer ce projet ?')) return
        try {
            await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' })
            fetchProjects()
        } catch (e) { console.error(e) }
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Gestion du Portfolio</h1>
                        <p className="text-gray-600 text-sm">{projects.length} projet(s) — visible sur la page Portfolio</p>
                    </div>
                    <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un projet
                    </Button>
                </div>

                {showForm && (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{editingProject ? 'Modifier le projet' : 'Nouveau projet'}</h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                        <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Nom du projet" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                        <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Résumé <span className="font-normal text-gray-400">— affiché sur la carte du projet</span>
                                    </label>
                                    <textarea required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description détaillée <span className="font-normal text-gray-400">(optionnel) — affichée sur la page du projet</span>
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                                        rows={6}
                                        value={formData.detailText}
                                        onChange={(e) => setFormData({ ...formData, detailText: e.target.value })}
                                        placeholder="Contexte du projet, besoin du client, ce qui a été réalisé, résultats obtenus…"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
                                        <Input required value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Logo, Charte graphique, Site" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Couleur de fond <span className="font-normal text-gray-400">(sans image)</span></label>
                                        <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })}>
                                            {colorOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Galerie et fichiers sources */}
                                <div className="pt-4 border-t space-y-6">
                                    <MultiImageUpload
                                        label="Images du projet"
                                        value={images}
                                        onChange={setImages}
                                        prefix="projet"
                                    />
                                    <SourceFilesUpload
                                        label="Fichiers sources (optionnel)"
                                        value={files}
                                        onChange={setFiles}
                                        prefix="projet-source"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit"><Save className="w-4 h-4 mr-2" />{editingProject ? 'Enregistrer' : 'Créer'}</Button>
                                    <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 mb-4">Aucun projet dans le portfolio</p>
                        <Button onClick={() => { resetForm(); setShowForm(true); }}>
                            <Plus className="w-4 h-4 mr-2" /> Ajouter le premier projet
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                            <Card key={project.id}>
                                <div className={`h-32 bg-gradient-to-br ${project.color} rounded-t-xl flex items-center justify-center`}>
                                    <span className="text-white/60 text-3xl font-black">{project.title.charAt(0)}</span>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-sm mb-1">{project.title}</h3>
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {project.tags.split(',').map((t: string) => (
                                            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{t.trim()}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleEdit(project)}>
                                            <Edit className="w-3 h-3 mr-1" /> Modifier
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)} className="text-red-600 hover:bg-red-50">
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
