import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function validatePassword(password: string): string | null {
    if (password.length < 8) {
        return 'Le mot de passe doit contenir au moins 8 caractères'
    }
    if (!/[a-z]/.test(password)) {
        return 'Le mot de passe doit contenir au moins une minuscule'
    }
    if (!/[A-Z]/.test(password)) {
        return 'Le mot de passe doit contenir au moins une majuscule'
    }
    if (!/[0-9]/.test(password)) {
        return 'Le mot de passe doit contenir au moins un chiffre'
    }
    return null
}

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            )
        }

        const passwordError = validatePassword(password)
        if (passwordError) {
            return NextResponse.json({ error: passwordError }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Un compte avec cet email existe déjà' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'client',
            },
        })

        return NextResponse.json(
            {
                message: 'Compte créé avec succès',
                user: { id: user.id, name: user.name, email: user.email },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de la création du compte' },
            { status: 500 }
        )
    }
}
