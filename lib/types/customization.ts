// Types partagés pour la personnalisation produit et le panier.
// Source de vérité unique, utilisée par le configurateur, le panier,
// le checkout, l'API et le dashboard admin.

/** Placement d'un design sur une vue (coordonnées exprimées dans
 *  l'espace en pixels natifs du template produit). */
export interface DesignPlacement {
    designX: number
    designY: number
    designWidth: number
    designHeight: number
    designRotation: number
}

/** Un design appliqué sur une vue précise du produit (recto, verso, etc.). */
export interface ViewDesign extends DesignPlacement {
    viewId: string
    label: string
    /** Template produit de cette vue (sert au rendu de production). */
    templateUrl: string
    /** Emplacement logique, ex. "front-center". */
    position: string
    /** Design uploadé par le client (dataURL ou URL après upload). */
    designFileUrl?: string
    /** Rendu composite HD (produit + couleur + design) prêt pour la prod. */
    productionImageUrl?: string
}

/** Données complètes de personnalisation d'un article. */
export interface CustomizationData {
    /** Couleur de base du vêtement (hex). */
    baseColor: string
    /** Nom lisible de la couleur, ex. "Bleu Marine". */
    baseColorName?: string
    /** Type de produit (tshirt, hoodie, cap, ...). */
    productType: string
    /** Nom du fichier design d'origine. */
    designFileName?: string
    /** Toutes les vues comportant un design. */
    views: ViewDesign[]
    /** Notes libres du client. */
    customNotes?: string
}

/** Instantané produit conservé dans le panier (indépendant de la DB). */
export interface ProductSnapshot {
    id: string
    name: string
    price: number
    imageUrl: string
    category?: string
}

/** Un article du panier. */
export interface CartItem {
    /** Identifiant unique de la ligne panier. */
    id: string
    productId: string
    product: ProductSnapshot
    size: string
    color: string
    quantity: number
    unitPrice: number
    totalPrice: number
    customization?: CustomizationData
}

/** Payload envoyé à l'API de checkout pour chaque article. */
export interface CheckoutItemPayload {
    productId: string
    size: string
    color: string
    quantity: number
    customization?: CustomizationData
}
