import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

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
        const { title, description, category, tags, color, imageUrl } = body

        if (!title || !description || !category || !tags) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const project = await prisma.portfolio.create({
            data: {
                title,
                description,
                category,
                tags,
                color: color || 'from-primary-500 to-secondary-500',
                imageUrl: imageUrl || null,
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
        const { id, title, description, category, tags, color, imageUrl, isActive } = body

        const project = await prisma.portfolio.update({
            where: { id },
            data: { title, description, category, tags, color, imageUrl, isActive },
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
