import type { Metadata } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// La page produit est un composant client : ses métadonnées passent par ce
// layout, qui interroge la base pour un titre et une description propres à
// chaque produit (essentiel pour le référencement de la boutique).
export async function generateMetadata(
    { params }: { params: { id: string } }
): Promise<Metadata> {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            select: { name: true, description: true, imageUrl: true, isActive: true },
        })

        if (!product) return { title: 'Produit introuvable' }

        const description = (product.description || '').slice(0, 160)

        return {
            title: product.name,
            description,
            alternates: { canonical: `/product/${params.id}` },
            // Un produit désactivé reste accessible par lien mais sort de l'index.
            robots: product.isActive ? undefined : { index: false, follow: true },
            openGraph: {
                title: `${product.name} | Dololka Agency`,
                description,
                type: 'website',
                images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
            },
        }
    } catch (error) {
        console.error('Métadonnées produit indisponibles', error)
        return {}
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
