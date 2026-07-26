'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, LinkIcon } from 'lucide-react'
import { uploadDataUrlDetailed } from '@/lib/production/uploadAsset'

interface ImageUploadFieldProps {
    label: string
    value: string
    onChange: (url: string) => void
    /** Préfixe du nom de fichier stocké (ex. "produit", "produit-verso"). */
    prefix?: string
    hint?: string
}

const ACCEPTED = 'image/png,image/jpeg,image/webp,image/svg+xml'
const MAX_MB = 10

/** Champ image de l'administration : envoi d'un fichier depuis l'ordinateur,
 *  avec repli possible sur une URL saisie à la main. */
export function ImageUploadField({
    label,
    value,
    onChange,
    prefix = 'produit',
    hint,
}: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [showUrl, setShowUrl] = useState(false)

    const handleFile = async (file: File) => {
        setError('')

        if (!ACCEPTED.split(',').includes(file.type)) {
            setError('Format non supporté. Utilisez PNG, JPG, WEBP ou SVG.')
            return
        }
        if (file.size > MAX_MB * 1024 * 1024) {
            setError(`Fichier trop lourd (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum ${MAX_MB} Mo.`)
            return
        }

        setUploading(true)
        try {
            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
                reader.readAsDataURL(file)
            })

            const result = await uploadDataUrlDetailed(dataUrl, prefix)
            if (!result.stored) {
                // On n'enregistre jamais la dataURL de repli en base : elle
                // serait énorme. On affiche la cause réelle renvoyée par le serveur.
                setError(result.error || "L'envoi du fichier a échoué.")
                return
            }
            onChange(result.url)
        } catch (err) {
            console.error(err)
            setError("L'envoi du fichier a échoué.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

            <div className="flex items-start gap-3">
                {/* Aperçu */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
                    {value ? (
                        <>
                            <Image src={value} alt={label} fill className="object-contain p-1" sizes="80px" />
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="absolute top-0.5 right-0.5 p-0.5 bg-white/90 rounded text-red-600 hover:bg-white"
                                title="Retirer l'image"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Upload className="w-6 h-6" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED}
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (f) handleFile(f)
                            e.target.value = ''
                        }}
                    />

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={uploading}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border-2 border-primary-500 text-primary-600 hover:bg-primary-50 disabled:opacity-50"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" /> {value ? 'Remplacer' : 'Choisir un fichier'}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowUrl((s) => !s)}
                            className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary-600"
                        >
                            <LinkIcon className="w-4 h-4 mr-1.5" /> Utiliser une URL
                        </button>
                    </div>

                    {showUrl && (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="/products/… ou https://…"
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    )}

                    <p className="text-xs text-gray-500 mt-1.5">
                        {hint || `PNG, JPG, WEBP ou SVG — ${MAX_MB} Mo maximum.`}
                    </p>
                    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>
            </div>
        </div>
    )
}
