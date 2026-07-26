import type { MetadataRoute } from 'next'
import { SITE_URL, PRIVATE_PATHS } from '@/lib/site'

// Généré à /robots.txt — indique aux moteurs ce qu'ils peuvent explorer.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Espaces privés et tunnel d'achat : aucun intérêt en recherche,
            // et on évite d'exposer l'administration.
            disallow: PRIVATE_PATHS.map((p) => `${p}/`),
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
