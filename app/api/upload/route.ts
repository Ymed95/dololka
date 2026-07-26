import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

// Reçoit une image en dataURL (design client ou rendu de production) et la
// stocke, renvoyant une URL servable. Trois stratégies, dans l'ordre :
//   1. Vercel Blob (si BLOB_READ_WRITE_TOKEN défini) → URL CDN persistante.
//      Indispensable sur Vercel où le FS est éphémère.
//   2. FS local public/uploads (dev / serveur Node persistant).
//   3. Fallback côté client : conserve la dataURL d'origine (jamais bloquant).

const ALLOWED_TYPES: Record<string, string> = {
    // Images affichables directement dans le navigateur
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    // Fichiers sources : stockés pour téléchargement, non affichables en image
    'application/pdf': 'pdf',
    'application/postscript': 'ai', // Illustrator (.ai) et EPS
    'application/illustrator': 'ai',
    'application/x-photoshop': 'psd',
    'image/vnd.adobe.photoshop': 'psd',
    'application/zip': 'zip',
}

/** Un stockage Blob est disponible si l'on a soit un token de lecture/écriture
 *  (utilisable partout, y compris en local), soit un store connecté via OIDC
 *  (BLOB_STORE_ID, méthode recommandée par Vercel : aucun token à gérer). */
function hasBlobStorage(): boolean {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

/** Dernière erreur du stockage, remontée à l'interface pour diagnostic. */
let lastBlobError = ''

async function storeOnVercelBlob(
    fileName: string,
    buffer: Buffer,
    mimeType: string
): Promise<string | null> {
    if (!hasBlobStorage()) return null
    try {
        // Import dynamique : le paquet n'est sollicité que si un store existe.
        const { put } = await import('@vercel/blob')
        const blob = await put(`uploads/${fileName}`, buffer, {
            access: 'public',
            contentType: mimeType,
            // Sans token explicite, le SDK utilise VERCEL_OIDC_TOKEN +
            // BLOB_STORE_ID, tous deux fournis automatiquement par Vercel.
            ...(process.env.BLOB_READ_WRITE_TOKEN
                ? { token: process.env.BLOB_READ_WRITE_TOKEN }
                : {}),
        })
        lastBlobError = ''
        return blob.url
    } catch (err) {
        lastBlobError = err instanceof Error ? err.message : String(err)
        console.error('Vercel Blob upload échoué, fallback FS', err)
        return null
    }
}

async function storeOnLocalFs(fileName: string, buffer: Buffer): Promise<string | null> {
    try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadsDir, { recursive: true })
        await writeFile(path.join(uploadsDir, fileName), buffer)
        return `/uploads/${fileName}`
    } catch (err) {
        console.error('Écriture FS échouée', err)
        return null
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
        }

        const body = await request.json()
        const { dataUrl, prefix } = body as { dataUrl?: string; prefix?: string }

        if (!dataUrl || typeof dataUrl !== 'string') {
            return NextResponse.json({ error: 'dataUrl manquant' }, { status: 400 })
        }

        const match = dataUrl.match(/^data:([^;,]+)(;base64)?,([\s\S]+)$/)
        if (!match) {
            return NextResponse.json({ error: 'dataUrl invalide' }, { status: 400 })
        }

        const mimeType = match[1]
        const isBase64 = match[2] === ';base64'
        const rawData = match[3]

        const ext = ALLOWED_TYPES[mimeType]
        if (!ext) {
            return NextResponse.json({ error: `Type non supporté: ${mimeType}` }, { status: 400 })
        }

        const buffer = isBase64
            ? Buffer.from(rawData, 'base64')
            : Buffer.from(decodeURIComponent(rawData), 'utf-8')

        // Garde-fou taille (15 Mo) pour éviter les abus.
        if (buffer.byteLength > 15 * 1024 * 1024) {
            return NextResponse.json({ error: 'Fichier trop volumineux' }, { status: 413 })
        }

        const safePrefix = (prefix || 'file').replace(/[^a-z0-9_-]/gi, '').slice(0, 32) || 'file'
        const fileName = `${safePrefix}-${randomUUID()}.${ext}`

        // 1. Vercel Blob → 2. FS local
        const url =
            (await storeOnVercelBlob(fileName, buffer, mimeType)) ||
            (await storeOnLocalFs(fileName, buffer))

        if (!url) {
            // Distingue l'absence de configuration d'une vraie panne : le
            // message doit dire quoi faire, pas seulement qu'il y a un échec.
            let error: string
            if (!hasBlobStorage()) {
                error = "Aucun stockage de fichiers n'est configuré. Connectez un store Vercel Blob au projet, puis redéployez."
            } else if (/private (store|access)/i.test(lastBlobError)) {
                // Cas fréquent : un store créé en mode privé refuse les fichiers
                // publics, or les visuels de la boutique doivent être affichables
                // sans authentification. Le mode est figé à la création du store.
                error =
                    "Le store Blob connecté est en mode privé : il ne peut pas héberger les visuels de la boutique, " +
                    "qui doivent être accessibles publiquement. Créez un store Blob en mode public, connectez-le au projet " +
                    "à la place du store privé, puis redéployez."
            } else {
                error = `Le stockage a refusé le fichier${lastBlobError ? ` : ${lastBlobError}` : '.'}`
            }
            return NextResponse.json({ error }, { status: 500 })
        }

        return NextResponse.json({ url })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: "Échec de l'enregistrement du fichier" },
            { status: 500 }
        )
    }
}
