import type { Metadata } from 'next'

// La page est un composant client : les métadonnées passent donc par ce layout.
export const metadata: Metadata = {
    title: 'Contact et devis gratuit',
    description: 'Un projet de communication ? Contactez Dololka Agency pour un devis gratuit et personnalisé. Réponse rapide, accompagnement sur mesure.',
    alternates: { canonical: '/contact' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
