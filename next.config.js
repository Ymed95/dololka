/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
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
