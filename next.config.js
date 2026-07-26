/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                // Fichiers envoyés depuis l'administration (Vercel Blob).
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com',
            },
        ],
        // Les SVG servis depuis le stockage doivent pouvoir s'afficher.
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    webpack: (config, { isServer }) => {
        // Exclude canvas from server-side rendering (needed for Konva)
        if (isServer) {
            config.externals = [...(config.externals || []), 'canvas']
        }

        // Ignore canvas module warnings
        config.resolve.alias.canvas = false

        return config
    },
}

module.exports = nextConfig
