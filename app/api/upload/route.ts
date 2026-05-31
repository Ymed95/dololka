import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

// Reçoit une image en dataURL (design client ou rendu de production) et
// l'écrit dans public/uploads, renvoyant une URL servable. Permet d'éviter
// de stocker des base64 volumineux directement en base de données.
//
// Le client gère un fallback : si l'upload échoue (ex. système de fichiers
// en lecture seule), il conserve la dataURL d'origine.

const ALLOWED_TYPES: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            )
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
            return NextResponse.json(
                { error: `Type non supporté: ${mimeType}` },
                { status: 400 }
            )
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

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadsDir, { recursive: true })
        await writeFile(path.join(uploadsDir, fileName), buffer)

        return NextResponse.json({ url: `/uploads/${fileName}` })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: "Échec de l'enregistrement du fichier" },
            { status: 500 }
        )
    }
}
