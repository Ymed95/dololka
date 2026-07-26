import type { Metadata } from 'next'

// La page est un composant client : les métadonnées passent donc par ce layout.
export const metadata: Metadata = {
    title: 'Boutique — produits personnalisables',
    description: 'T-shirts, hoodies, casquettes, mugs et plus : personnalisez vos produits en ligne avec notre configurateur 2D et 3D, puis commandez en quelques clics.',
    alternates: { canonical: '/boutique' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
