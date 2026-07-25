import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/contact - Handle contact form submissions
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, subject, message } = body

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Adresse email invalide' },
                { status: 400 }
            )
        }

        const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
        if (!admin) {
            return NextResponse.json(
                { error: 'Erreur serveur : aucun administrateur trouvé' },
                { status: 500 }
            )
        }

        // Check if the sender has an account
        const sender = await prisma.user.findUnique({ where: { email } })

        await prisma.message.create({
            data: {
                senderId: sender ? sender.id : admin.id,
                receiverId: admin.id,
                subject: sender
                    ? `[Contact] ${subject}`
                    : `[Contact - Visiteur] ${subject}`,
                content: sender
                    ? message
                    : `De : ${name} (${email})\n\n${message}`,
                // Visiteur sans compte : on garde ses coordonnées pour que
                // l'admin puisse lui répondre par email.
                visitorName: sender ? null : name,
                visitorEmail: sender ? null : email,
                isRead: false,
            },
        })

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
        console.error('Error handling contact form:', error)
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        )
    }
}
