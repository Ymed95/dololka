'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2, FileText } from 'lucide-react'
import { uploadDataUrlDetailed } from '@/lib/production/uploadAsset'

export interface SourceFile {
    url: string
    name: string
    ext: string
}

interface SourceFilesUploadProps {
    label: string
    value: SourceFile[]
    onChange: (files: SourceFile[]) => void
    prefix?: string
}

const MAX_MB = 15

/** Extensions acceptées, avec le type MIME correspondant quand le navigateur
 *  ne le renseigne pas (fréquent pour les fichiers Illustrator). */
const EXT_MIME: Record<string, string> = {
    pdf: 'application/pdf',
    ai: 'application/postscript',
    eps: 'application/postscript',
    psd: 'image/vnd.adobe.photoshop',
    zip: 'application/zip',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    svg: 'image/svg+xml',
}

function extensionOf(name: string): string {
    const parts = name.toLowerCase().split('.')
    return parts.length > 1 ? parts[parts.length - 1] : ''
}

/** Fichiers sources joints au projet (PDF, AI, PSD…). Ils ne s'affichent pas
 *  comme images : ils sont proposés au téléchargement. */
export function SourceFilesUpload({
    label,
    value,
    onChange,
    prefix = 'source',
}: SourceFilesUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleFiles = async (files: FileList) => {
        setError('')
        const list = Array.from(files)

        for (const f of list) {
            const ext = extensionOf(f.name)
            if (!EXT_MIME[ext]) {
                setError(`« ${f.name} » : extension non supportée (${Object.keys(EXT_MIME).join(', ')}).`)
                return
            }
            if (f.size > MAX_MB * 1024 * 1024) {
                setError(`« ${f.name} » dépasse ${MAX_MB} Mo.`)
                return
            }
        }

        setUploading(true)
        const added: SourceFile[] = []
        try {
            for (const file of list) {
                const ext = extensionOf(file.name)
                // Certains navigateurs ne renseignent pas le type des .ai :
                // on le reconstruit depuis l'extension pour que l'API l'accepte.
                const mime = file.type || EXT_MIME[ext]
                const raw = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = () => reject(new Error('Lecture impossible'))
                    reader.readAsDataURL(file)
                })
                const dataUrl = file.type ? raw : raw.replace(/^data:[^;]*/, `data:${mime}`)

                const result = await uploadDataUrlDetailed(dataUrl, prefix)
                if (!result.stored) {
                    setError(result.error || "L'envoi a échoué.")
                    break
                }
                added.push({ url: result.url, name: file.name, ext })
            }
            if (added.length > 0) onChange([...value, ...added])
        } catch (err) {
            console.error(err)
            setError("L'envoi des fichiers a échoué.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {value.length > 0 && (
                <ul className="space-y-2 mb-3">
                    {value.map((f, i) => (
                        <li key={`${f.url}-${i}`} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-800 truncate flex-1">{f.name}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-500 bg-white px-1.5 py-0.5 rounded border">
                                {f.ext}
                            </span>
                            <button
                                type="button"
                                onClick={() => onChange(value.filter((_, j) => j !== i))}
                                className="p-1 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                                title="Retirer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.ai,.eps,.psd,.zip,.png,.jpg,.jpeg,.svg"
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
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600 disabled:opacity-50"
            >
                {uploading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi…</>
                ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Ajouter des fichiers</>
                )}
            </button>

            <p className="text-xs text-gray-500 mt-1.5">
                PDF, AI, EPS, PSD ou ZIP — {MAX_MB} Mo par fichier. Proposés au téléchargement, ils ne s&apos;affichent pas dans la galerie.
            </p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    )
}
