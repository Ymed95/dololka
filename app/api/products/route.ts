import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const type = searchParams.get('type')

        const where: any = {}

        if (type) {
            where.type = type
        }

        if (category && category !== 'all') {
            where.category = category
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ]
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(products)
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
        }

        const body = await request.json()
        const { name, description, price, category, type, imageUrl, mockupUrl, sizes } = body

        if (!name || !description || !price || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category,
                type: type || 'customizable',
                imageUrl: imageUrl || '/products/placeholder.jpg',
                mockupUrl: mockupUrl || null,
                sizes: sizes || null,
            },
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}
