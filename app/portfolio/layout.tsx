import type { Metadata } from 'next'

// La page est un composant client : les métadonnées passent donc par ce layout.
export const metadata: Metadata = {
    title: 'Nos réalisations',
    description: 'Découvrez les projets réalisés par Dololka Agency : identités visuelles, sites web, campagnes publicitaires, enseignes et production textile.',
    alternates: { canonical: '/portfolio' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
