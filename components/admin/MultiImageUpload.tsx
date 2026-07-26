'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { uploadDataUrlDetailed } from '@/lib/production/uploadAsset'

interface MultiImageUploadProps {
    label: string
    /** URLs des images de la galerie, dans l'ordre d'affichage. */
    value: string[]
    onChange: (urls: string[]) => void
    prefix?: string
    hint?: string
}

const ACCEPTED = 'image/png,image/jpeg,image/webp,image/svg+xml'
const MAX_MB = 10

function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
        reader.readAsDataURL(file)
    })
}

/** Galerie d'images : envoi multiple, réordonnancement, suppression.
 *  La première image sert de visuel de couverture. */
export function MultiImageUpload({
    label,
    value,
    onChange,
    prefix = 'projet',
    hint,
}: MultiImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleFiles = async (files: FileList) => {
        setError('')
        const list = Array.from(files)

        const invalid = list.find((f) => !ACCEPTED.split(',').includes(f.type))
        if (invalid) {
            setError(`« ${invalid.name} » : format non supporté. Utilisez PNG, JPG, WEBP ou SVG.`)
            return
        }
        const tooBig = list.find((f) => f.size > MAX_MB * 1024 * 1024)
        if (tooBig) {
            setError(`« ${tooBig.name} » dépasse ${MAX_MB} Mo.`)
            return
        }

        setUploading(true)
        const added: string[] = []
        try {
            for (const file of list) {
                const dataUrl = await readAsDataUrl(file)
                const result = await uploadDataUrlDetailed(dataUrl, prefix)
                if (!result.stored) {
                    setError(result.error || "L'envoi a échoué.")
                    break
                }
                added.push(result.url)
            }
            if (added.length > 0) onChange([...value, ...added])
        } catch (err) {
            console.error(err)
            setError("L'envoi des fichiers a échoué.")
        } finally {
            setUploading(false)
        }
    }

    const move = (index: number, delta: -1 | 1) => {
        const next = index + delta
        if (next < 0 || next >= value.length) return
        const copy = [...value]
        ;[copy[index], copy[next]] = [copy[next], copy[index]]
        onChange(copy)
    }

    const remove = (index: number) => onChange(value.filter((_, i) => i !== index))

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {value.map((url, i) => (
                        <div key={`${url}-${i}`} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <div className="relative aspect-square">
                                <Image src={url} alt={`${label} ${i + 1}`} fill className="object-contain p-1" sizes="160px" />
                            </div>
                            {i === 0 && (
                                <span className="absolute top-1 left-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary-600 text-white text-[10px] rounded">
                                    <Star className="w-2.5 h-2.5" /> Couverture
                                </span>
                            )}
                            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-white/90 px-1 py-0.5">
                                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                                    className="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-30" title="Déplacer à gauche">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                                <button type="button" onClick={() => remove(i)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded" title="Retirer">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1}
                                    className="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-30" title="Déplacer à droite">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                multiple
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.length) handleFiles(e.target.files)
                    e.target.value = ''
                }}
            />

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border-2 border-primary-500 text-primary-600 hover:bg-primary-50 disabled:opacity-50"
            >
                {uploading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</>
                ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Ajouter des images</>
                )}
            </button>

            <p className="text-xs text-gray-500 mt-1.5">
                {hint || `PNG, JPG, WEBP ou SVG — ${MAX_MB} Mo par image. La première image sert de couverture.`}
            </p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    )
}
