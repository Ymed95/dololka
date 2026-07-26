import './globals.css'
import type { Metadata } from 'next'
import { Work_Sans, Encode_Sans } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'

// Polices de la charte, exposées en variables CSS et consommées par Tailwind
// (voir `fontFamily` dans tailwind.config.js). Auparavant Inter était chargée
// alors que Tailwind déclarait Work Sans / Encode Sans : les classes
// `font-heading` retombaient donc sur la police système.
const workSans = Work_Sans({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
})

const encodeSans = Encode_Sans({
    subsets: ['latin'],
    weight: ['400', '600', '700', '800'],
    variable: '--font-heading',
    display: 'swap',
})

const SITE_URL = process.env.NEXTAUTH_URL || 'https://www.dololkaagency.com'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Dololka Agency — Agence de communication 360°',
        template: '%s | Dololka Agency',
    },
    description:
        "Agence de communication 360° : création de sites web, identité visuelle, réseaux sociaux, publicité, enseignes et production textile. Personnalisez vos produits en ligne avec notre configurateur 2D et 3D.",
    keywords: [
        'agence de communication',
        'création de site internet',
        'identité visuelle',
        'personnalisation textile',
        'enseignes',
        'Dololka',
    ],
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        siteName: 'Dololka Agency',
        title: 'Dololka Agency — Agence de communication 360°',
        description:
            "Sites web, branding, réseaux sociaux, publicité, enseignes et textile personnalisé. Un seul interlocuteur pour toute votre communication.",
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" className={`${workSans.variable} ${encodeSans.variable}`}>
            <body className="font-sans">
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    )
}
