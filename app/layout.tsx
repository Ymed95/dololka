import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Personnalisateur de Produits - Créez vos designs uniques',
    description: 'Personnalisez vos t-shirts, pulls, casquettes, tasses et plus encore avec notre outil de design en ligne. Créez, visualisez et commandez en quelques clics.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr">
            <body className={inter.className}>
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    )
}
