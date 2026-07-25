// Rendu côté client de l'asset de production.
// Génère un PNG haute résolution (produit + couleur + design positionné)
// pour une vue donnée, en reproduisant fidèlement le rendu du canvas Konva.

import type { ViewDesign } from '@/lib/types/customization'

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`Impossible de charger l'image : ${src}`))
        img.src = src
    })
}

export interface RenderOptions {
    /** Couleur de teinte du vêtement (hex). #ffffff = aucune teinte. */
    baseColor?: string
    /** Facteur de sur-échantillonnage pour la HD (3 = ~3x la taille native). */
    pixelRatio?: number
}

/**
 * Compose une vue en PNG dataURL.
 * Les coordonnées du design (designX/Y/Width/Height) sont exprimées dans
 * l'espace en pixels natifs du template produit — on rend donc à la taille
 * native du template multipliée par `pixelRatio`.
 */
export async function renderViewToDataURL(
    view: ViewDesign,
    opts: RenderOptions = {}
): Promise<string> {
    const pixelRatio = opts.pixelRatio ?? 3
    const product = await loadImage(view.templateUrl)

    const baseWidth = product.naturalWidth || product.width
    const baseHeight = product.naturalHeight || product.height

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(baseWidth * pixelRatio)
    canvas.height = Math.round(baseHeight * pixelRatio)

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Contexte canvas 2D indisponible')
    ctx.scale(pixelRatio, pixelRatio)

    // 1. Produit
    ctx.drawImage(product, 0, 0, baseWidth, baseHeight)

    // 2. Teinte couleur (source-atop : ne colore que les pixels du produit),
    //    identique au Rect Konva (opacity 0.4).
    if (opts.baseColor && opts.baseColor.toLowerCase() !== '#ffffff') {
        ctx.save()
        ctx.globalCompositeOperation = 'source-atop'
        ctx.globalAlpha = 0.4
        ctx.fillStyle = opts.baseColor
        ctx.fillRect(0, 0, baseWidth, baseHeight)
        ctx.restore()
    }

    // 3. Design (par-dessus, non teinté — comme le layer Konva séparé).
    if (view.designFileUrl) {
        const design = await loadImage(view.designFileUrl)
        ctx.save()
        ctx.globalCompositeOperation = 'source-over'
        // Konva applique la rotation autour de l'origine (x, y) du node.
        ctx.translate(view.designX, view.designY)
        ctx.rotate((view.designRotation * Math.PI) / 180)
        ctx.drawImage(design, 0, 0, view.designWidth, view.designHeight)
        ctx.restore()
    }

    return canvas.toDataURL('image/png')
}

/** Rend toutes les vues comportant un design. Renvoie les vues enrichies du
 *  `productionImageUrl`. Les vues sans design sont laissées intactes. */
export async function renderAllViews(
    views: ViewDesign[],
    opts: RenderOptions = {}
): Promise<ViewDesign[]> {
    return Promise.all(
        views.map(async (view) => {
            if (!view.designFileUrl) return view
            try {
                const productionImageUrl = await renderViewToDataURL(view, opts)
                return { ...view, productionImageUrl }
            } catch (err) {
                // En cas d'échec (ex. image produit cross-origin tainted),
                // on conserve la vue sans rendu plutôt que de bloquer la commande.
                console.error('Rendu production échoué pour la vue', view.viewId, err)
                return view
            }
        })
    )
}
