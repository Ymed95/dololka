'use client'

import { useState } from 'react'
import { Plus, X, RotateCcw } from 'lucide-react'
import { DEFAULT_PRODUCT_COLORS, type ProductColor } from '@/lib/productColors'

interface ColorPaletteFieldProps {
    value: ProductColor[]
    onChange: (colors: ProductColor[]) => void
}

/** Coloris réellement disponibles pour un produit.
 *  Laisser la liste vide fait retomber le site sur la palette par défaut. */
export function ColorPaletteField({ value, onChange }: ColorPaletteFieldProps) {
    const [name, setName] = useState('')
    const [hex, setHex] = useState('#1e3a8a')

    const add = () => {
        const label = name.trim() || hex
        if (value.some((c) => c.value.toLowerCase() === hex.toLowerCase())) return
        onChange([...value, { name: label, value: hex.toLowerCase() }])
        setName('')
    }

    const remove = (i: number) => onChange(value.filter((_, j) => j !== i))

    const rename = (i: number, label: string) => {
        const next = [...value]
        next[i] = { ...next[i], name: label }
        onChange(next)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Coloris disponibles{' '}
                    <span className="font-normal text-gray-400">
                        {value.length === 0 ? '— palette par défaut du site' : `(${value.length})`}
                    </span>
                </label>
                {value.length === 0 && (
                    <button
                        type="button"
                        onClick={() => onChange(DEFAULT_PRODUCT_COLORS)}
                        className="inline-flex items-center text-xs text-primary-600 hover:text-primary-700"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Partir de la palette par défaut
                    </button>
                )}
            </div>

            {value.length > 0 && (
                <div className="space-y-2 mb-3 max-h-56 overflow-y-auto pr-1">
                    {value.map((c, i) => (
                        <div key={`${c.value}-${i}`} className="flex items-center gap-2">
                            <span
                                className="w-8 h-8 rounded-lg border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: c.value }}
                                title={c.value}
                            />
                            <input
                                type="text"
                                value={c.name}
                                onChange={(e) => rename(i, e.target.value)}
                                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                                placeholder="Nom du coloris"
                            />
                            <code className="text-xs text-gray-400 w-16 flex-shrink-0">{c.value}</code>
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                                title="Retirer ce coloris"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Ajout d'un coloris */}
            <div className="flex items-end gap-2">
                <div>
                    <span className="block text-xs text-gray-500 mb-1">Teinte</span>
                    <input
                        type="color"
                        value={hex}
                        onChange={(e) => setHex(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer bg-white"
                    />
                </div>
                <div className="flex-1">
                    <span className="block text-xs text-gray-500 mb-1">Nom</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); add() }
                        }}
                        placeholder="Ex. Bleu Marine"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <button
                    type="button"
                    onClick={add}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border-2 border-primary-500 text-primary-600 hover:bg-primary-50"
                >
                    <Plus className="w-4 h-4 mr-1" /> Ajouter
                </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
                Renseignez uniquement les coloris que votre fournisseur propose réellement : le client
                ne pourra commander que ceux-ci.
            </p>
        </div>
    )
}
