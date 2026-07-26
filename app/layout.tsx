import './globals.css'
import type { Metadata } from 'next'
import { Work_Sans, Encode_Sans } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

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

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Dololka Agency — Agence de communication 360°',
        template: '%s | Dololka Agency',
    },
    description: SITE_DESCRIPTION,
    alternates: { canonical: '/' },
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

// Données structurées : permettent aux moteurs d'identifier l'entreprise
// (nom, logo, site, contact) et d'enrichir l'affichage des résultats.
const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-mark.png`,
    image: `${SITE_URL}/opengraph-image.png`,
    description: SITE_DESCRIPTION,
    areaServed: 'FR',
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: `${SITE_URL}/contact`,
        availableLanguage: ['French'],
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <SessionProvider>{children}</SessionProvider>
            </body>
        </html>
    )
}
