// Helper client : envoie une dataURL à /api/upload et renvoie l'URL servable.
// En cas d'échec (réseau, stockage non configuré…), on retombe sur la dataURL
// d'origine pour ne jamais bloquer le parcours d'achat.

export interface UploadResult {
    /** URL servable, ou la dataURL d'origine si l'envoi a échoué. */
    url: string
    /** Vrai si le fichier est réellement stocké. */
    stored: boolean
    /** Motif exact de l'échec, à afficher à l'utilisateur. */
    error?: string
}

/** Envoie une dataURL et renvoie le détail du résultat. */
export async function uploadDataUrlDetailed(
    dataUrl: string,
    prefix: string
): Promise<UploadResult> {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
        return { url: dataUrl, stored: true }
    }

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl, prefix }),
        })

        if (res.ok) {
            const data = await res.json()
            if (data?.url) return { url: data.url as string, stored: true }
            return { url: dataUrl, stored: false, error: 'Réponse inattendue du serveur.' }
        }

        // Message précis selon la cause réelle du refus.
        let serverError = ''
        try {
            const data = await res.json()
            serverError = data?.error || ''
        } catch {
            /* réponse non JSON */
        }

        const byStatus: Record<number, string> = {
            401: "Vous n'êtes plus connecté. Reconnectez-vous puis réessayez.",
            403: "Vous n'avez pas les droits pour envoyer un fichier.",
            413: 'Fichier trop volumineux pour être envoyé.',
        }

        return {
            url: dataUrl,
            stored: false,
            error: byStatus[res.status] || serverError || `Échec de l'envoi (erreur ${res.status}).`,
        }
    } catch (err) {
        console.warn('Upload asset échoué', err)
        return {
            url: dataUrl,
            stored: false,
            error: 'Serveur injoignable. Vérifiez votre connexion puis réessayez.',
        }
    }
}

/** Variante simple : renvoie l'URL, ou la dataURL d'origine en cas d'échec. */
export async function uploadDataUrl(dataUrl: string, prefix: string): Promise<string> {
    const { url } = await uploadDataUrlDetailed(dataUrl, prefix)
    return url
}
