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
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
}

async function storeOnVercelBlob(
    fileName: string,
    buffer: Buffer,
    mimeType: string
): Promise<string | null> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return null
    try {
        // Import dynamique : le paquet n'est sollicité que si le token existe.
        const { put } = await import('@vercel/blob')
        const blob = await put(`uploads/${fileName}`, buffer, {
            access: 'public',
            contentType: mimeType,
            token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        return blob.url
    } catch (err) {
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
            return NextResponse.json(
                { error: "Échec de l'enregistrement du fichier" },
                { status: 500 }
            )
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
