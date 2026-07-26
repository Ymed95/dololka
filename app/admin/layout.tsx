import type { Metadata } from 'next'

// Section privée : exclue de l'indexation par les moteurs de recherche.
export const metadata: Metadata = {
    title: 'Administration',
    robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
