// Constantes du site, partagées par les métadonnées, le sitemap et robots.txt.

export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'https://www.dololkaagency.com'
).replace(/\/$/, '')

export const SITE_NAME = 'Dololka Agency'

export const SITE_DESCRIPTION =
    "Agence de communication 360° : création de sites web, identité visuelle, réseaux sociaux, publicité, enseignes et production textile. Personnalisez vos produits en ligne avec notre configurateur 2D et 3D."

/** Sections privées : jamais indexées, jamais dans le sitemap. */
export const PRIVATE_PATHS = [
    '/admin',
    '/client',
    '/cart',
    '/checkout',
    '/login',
    '/signup',
    '/api',
]
