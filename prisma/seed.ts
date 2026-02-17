import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await prisma.message.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()

    // Create Users
    console.log('👥 Creating users...')
    const hashedPassword = await bcrypt.hash('password123', 10)

    const admin = await prisma.user.create({
        data: {
            email: 'admin@custompro.com',
            name: 'Admin Dololka',
            password: hashedPassword,
            role: 'admin',
        },
    })

    const client1 = await prisma.user.create({
        data: {
            email: 'client@example.com',
            name: 'Marie Dupont',
            password: hashedPassword,
            role: 'client',
        },
    })

    console.log(`✅ Created ${2} users`)

    // Create Products
    console.log('📦 Creating products...')
    const tshirt = await prisma.product.create({
        data: {
            name: 'T-Shirt Blanc Personnalisable',
            description: 'T-shirt 100% coton blanc de haute qualité. Personnalisez le recto et le verso avec vos propres designs, logos ou images. Tailles disponibles de XS à XXL.',
            price: 19.99,
            category: 'tshirt',
            imageUrl: '/products/tshirt-front.png',
            mockupUrl: '/products/tshirt-back.png',
        },
    })

    const hoodie = await prisma.product.create({
        data: {
            name: 'Hoodie Blanc Personnalisable',
            description: 'Hoodie premium confortable avec capuche. Personnalisez le recto et le verso avec vos designs. Tailles disponibles de XS à XXL.',
            price: 34.99,
            category: 'hoodie',
            imageUrl: '/products/hoodie-front.png',
            mockupUrl: '/products/hoodie-back.png',
        },
    })

    const sweatshirt = await prisma.product.create({
        data: {
            name: 'Sweatshirt Blanc Personnalisable',
            description: 'Sweatshirt col rond 100% coton de qualité supérieure. Confortable et durable, parfait pour vos designs personnalisés. Tailles disponibles de XS à XXL.',
            price: 29.99,
            category: 'sweatshirt',
            imageUrl: '/products/sweatshirt-front.png',
            mockupUrl: '/products/sweatshirt-back.png',
        },
    })

    const cap = await prisma.product.create({
        data: {
            name: 'Casquette Personnalisable',
            description: 'Casquette confortable et résistante, parfaite pour vos logos et designs. Taille ajustable, idéale pour un usage quotidien.',
            price: 14.99,
            category: 'cap',
            imageUrl: '/products/cap-front.png.png',
            mockupUrl: '/products/cap-back.png.png',
        },
    })

    const toteBag = await prisma.product.create({
        data: {
            name: 'Tote Bag Personnalisable',
            description: 'Tote bag en toile solide, parfait pour vos visuels. Léger, pratique et réutilisable au quotidien.',
            price: 12.99,
            category: 'bag',
            imageUrl: '/products/tote-bag.png.png',
            mockupUrl: '/products/tote-bag.png.png',
        },
    })

    const mug = await prisma.product.create({
        data: {
            name: 'Mug Personnalisable',
            description: 'Mug en céramique pour vos designs. Impression durable, idéal pour le bureau ou la maison.',
            price: 11.99,
            category: 'mug',
            imageUrl: '/products/mug-left.png.png',
            mockupUrl: '/products/mug-right.png.png',
        },
    })

    const vestSleeveless = await prisma.product.create({
        data: {
            name: 'Gilet Sans Manches Personnalisable',
            description: 'Gilet sans manches confortable, idéal pour vos logos et visuels. Coupe moderne et tissu agréable.',
            price: 24.99,
            category: 'vest',
            imageUrl: '/products/giletsm-front.png.png',
            mockupUrl: '/products/giletsm-back.png.png',
        },
    })

    const vestLongSleeve = await prisma.product.create({
        data: {
            name: 'Gilet Manches Longues Personnalisable',
            description: 'Gilet manches longues de qualité, parfait pour les personnalisations. Confortable et durable.',
            price: 27.99,
            category: 'vest',
            imageUrl: '/products/giletml-front.png.png',
            mockupUrl: '/products/giletml-back.png.png',
        },
    })

    const car = await prisma.product.create({
        data: {
            name: 'Covering Voiture Personnalisable',
            description: 'Covering complet pour voiture. Personnalisez les 4 faces de votre véhicule avec vos designs. Installation professionnelle recommandée. Qualité premium garantie.',
            price: 499.99,
            category: 'car',
            imageUrl: '/products/car-front.png',
            mockupUrl: '/products/car-back.png',
        },
    })

    console.log(`✅ Created ${9} products`)

    // Create Sample Orders
    console.log('🛒 Creating sample orders...')

    const order1 = await prisma.order.create({
        data: {
            userId: client1.id,
            productId: tshirt.id,
            status: 'completed',
            totalPrice: 19.99,
            designFileName: 'logo-company.png',
            designFileUrl: '/uploads/designs/logo-company.png',
            position: 'front-center',
            designX: 150,
            designY: 120,
            designWidth: 200,
            designHeight: 200,
            designRotation: 0,
            customNotes: 'Logo de mon entreprise, qualité maximale SVP',
        },
    })

    const order2 = await prisma.order.create({
        data: {
            userId: client1.id,
            productId: tshirt.id,
            status: 'pending',
            totalPrice: 19.99,
            designFileName: 'design-custom.png',
            designFileUrl: '/uploads/designs/design-custom.png',
            position: 'back-center',
            designX: 100,
            designY: 80,
            designWidth: 300,
            designHeight: 250,
            designRotation: 0,
        },
    })

    console.log(`✅ Created ${2} sample orders`)

    // Create Sample Messages
    console.log('💬 Creating messages...')

    await prisma.message.create({
        data: {
            senderId: client1.id,
            receiverId: admin.id,
            orderId: order1.id,
            subject: 'Question sur ma commande',
            content: 'Bonjour, quand est-ce que ma commande sera expédiée ?',
            isRead: true,
        },
    })

    await prisma.message.create({
        data: {
            senderId: admin.id,
            receiverId: client1.id,
            orderId: order1.id,
            content: 'Bonjour Marie, votre commande a été expédiée ce matin. Vous recevrez un email de suivi.',
            isRead: true,
        },
    })

    console.log(`✅ Created ${2} messages`)

    console.log('✨ Database seed completed successfully!')
    console.log('')
    console.log('📊 Summary:')
    console.log('   - 2 users (1 admin, 1 client)')
    console.log('   - 9 products (T-Shirt, Hoodie, Sweatshirt, Casquette, Tote Bag, Mug, Gilet SM, Gilet ML, Voiture)')
    console.log('   - 2 orders (1 completed, 1 pending)')
    console.log('   - 2 messages')
    console.log('')
    console.log('🔑 Login credentials:')
    console.log('   Admin: admin@custompro.com / password123')
    console.log('   Client: client@example.com / password123')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
