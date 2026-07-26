// Coloris des produits, partagés par le configurateur et l'administration.

export interface ProductColor {
    /** Nom lisible affiché au client, ex. "Bleu Marine". */
    name: string
    /** Couleur hexadécimale, ex. "#1e3a8a". */
    value: string
}

/** Palette utilisée quand un produit n'a pas de coloris propres.
 *  Sert aussi de point de départ dans l'administration. */
export const DEFAULT_PRODUCT_COLORS: ProductColor[] = [
    { name: 'Blanc', value: '#ffffff' },
    { name: 'Noir', value: '#1a1a1a' },
    { name: 'Gris', value: '#9ca3af' },
    { name: 'Gris Foncé', value: '#4b5563' },
    { name: 'Bleu Marine', value: '#1e3a8a' },
    { name: 'Bleu Ciel', value: '#3b82f6' },
    { name: 'Rouge', value: '#dc2626' },
    { name: 'Bordeaux', value: '#7f1d1d' },
    { name: 'Vert', value: '#16a34a' },
    { name: 'Vert Foncé', value: '#14532d' },
    { name: 'Jaune', value: '#eab308' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Rose', value: '#ec4899' },
    { name: 'Violet', value: '#7c3aed' },
    { name: 'Beige', value: '#d4a574' },
    { name: 'Marron', value: '#78350f' },
]

/** Normalise une valeur venue de la base ou d'un formulaire. */
export function toProductColors(input: unknown): ProductColor[] {
    if (!Array.isArray(input)) return []
    return input
        .filter(
            (c): c is ProductColor =>
                Boolean(c) &&
                typeof c === 'object' &&
                typeof (c as ProductColor).value === 'string' &&
                /^#[0-9a-fA-F]{6}$/.test((c as ProductColor).value)
        )
        .map((c) => ({ name: String(c.name || c.value), value: c.value.toLowerCase() }))
}

/** Coloris à proposer pour un produit : les siens, sinon la palette par défaut. */
export function colorsForProduct(input: unknown): ProductColor[] {
    const own = toProductColors(input)
    return own.length > 0 ? own : DEFAULT_PRODUCT_COLORS
}

/** Une couleur claire a besoin d'une coche foncée pour rester lisible. */
export function isLightColor(hex: string): boolean {
    const m = /^#([0-9a-f]{6})$/i.exec(hex)
    if (!m) return false
    const n = parseInt(m[1], 16)
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    // Luminance perçue (recommandation W3C).
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.7
}
