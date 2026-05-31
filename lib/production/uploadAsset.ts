// Helper client : envoie une dataURL à /api/upload et renvoie l'URL servable.
// En cas d'échec (réseau, FS lecture seule…), on retombe sur la dataURL
// d'origine pour ne jamais bloquer le parcours d'achat.

export async function uploadDataUrl(dataUrl: string, prefix: string): Promise<string> {
    if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl
    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl, prefix }),
        })
        if (res.ok) {
            const data = await res.json()
            if (data?.url) return data.url as string
        }
    } catch (err) {
        console.warn('Upload asset échoué, conservation de la dataURL', err)
    }
    return dataUrl
}
