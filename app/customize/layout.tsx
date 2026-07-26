import type { Metadata } from 'next'

// Outil de personnalisation : utile au client, sans intérêt en recherche
// (le contenu indexable est la fiche produit correspondante).
export const metadata: Metadata = {
    title: 'Personnaliser votre produit',
    robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
