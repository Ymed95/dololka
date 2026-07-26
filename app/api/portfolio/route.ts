import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { slugify } from '@/lib/slugify'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

/** Génère un slug unique à partir du titre du projet. */
async function uniqueSlug(title: string, currentId?: string): Promise<string> {
    const base = slugify(title) || 'projet'
    // findFirst (et non findUnique) : slug n'a pas de contrainte d'unicité en base.
    const existing = await prisma.portfolio.findFirst({ where: { slug: base } })
    if (!existing || existing.id === currentId) return base
    return `${base}-${Date.now().toString(36)}`
}

/** Normalise la galerie reçue du client. */
function toImageArray(input: unknown): Prisma.InputJsonValue {
    return Array.isArray(input) ? input.filter((u) => typeof u === 'string') : []
}

/** Normalise la liste de fichiers sources reçue du client. */
function toFileArray(input: unknown): Prisma.InputJsonValue {
    if (!Array.isArray(input)) return []
    return input
        .filter((f) => f && typeof f === 'object' && typeof (f as any).url === 'string')
        .map((f) => ({
            url: String((f as any).url),
            name: String((f as any).name || 'fichier'),
            ext: String((f as any).ext || ''),
        }))
}

export async function GET() {
    try {
        const projects = await prisma.portfolio.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(projects)
    } catch (error) {
        console.error('Error fetching portfolio:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, detailText, category, tags, color, imageUrl, images, files } = body

        if (!title || !description || !category || !tags) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const gallery = toImageArray(images)
        const galleryList = gallery as string[]

        const project = await prisma.portfolio.create({
            data: {
                slug: await uniqueSlug(title),
                title,
                description,
                detailText: detailText || null,
                category,
                tags,
                color: color || 'from-primary-500 to-secondary-500',
                // La couverture est l'image explicite, sinon la première de la galerie.
                imageUrl: imageUrl || galleryList[0] || null,
                images: gallery,
                files: toFileArray(files),
            },
        })

        return NextResponse.json(project, { status: 201 })
    } catch (error) {
        console.error('Error creating portfolio:', error)
        return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id, title, description, detailText, category, tags, color, imageUrl, images, files, isActive } = body
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

        const current = await prisma.portfolio.findUnique({ where: { id } })
        if (!current) return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 })

        const gallery = images !== undefined ? toImageArray(images) : undefined
        const galleryList = (gallery ?? []) as string[]

        const project = await prisma.portfolio.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(detailText !== undefined && { detailText: detailText || null }),
                ...(category !== undefined && { category }),
                ...(tags !== undefined && { tags }),
                ...(color !== undefined && { color }),
                ...(imageUrl !== undefined || gallery !== undefined
                    ? { imageUrl: imageUrl || galleryList[0] || null }
                    : {}),
                ...(gallery !== undefined && { images: gallery }),
                ...(files !== undefined && { files: toFileArray(files) }),
                ...(isActive !== undefined && { isActive }),
                // Un projet créé avant l'ajout du slug en reçoit un ici.
                ...(current.slug ? {} : { slug: await uniqueSlug(title || current.title, id) }),
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error('Error updating portfolio:', error)
        return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

        await prisma.portfolio.delete({ where: { id } })
        return NextResponse.json({ message: 'Deleted' })
    } catch (error) {
        console.error('Error deleting portfolio:', error)
        return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
    }
}
