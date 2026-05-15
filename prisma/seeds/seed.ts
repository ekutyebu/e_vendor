// Absolute top of the file to ensure environment is loaded before ANY imports
try {
    // @ts-ignore
    if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile('.env')
    }
} catch (e) {}

import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
    console.log('🌱 Seeding INOVAMARK database with Elite Assets...')

    // ── CATEGORIES ──────────────────────────────────────────────
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'food-grocery' },
            update: {},
            create: { 
                name: 'Food & Grocery', 
                nameFr: 'Alimentation & Épicerie', 
                slug: 'food-grocery', 
                icon: '🛒', 
                color: '#10b981', 
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80', 
                description: 'Fresh food, produce and grocery items' 
            },
        }),
        prisma.category.upsert({
            where: { slug: 'fashion' },
            update: {},
            create: { 
                name: 'Fashion', 
                nameFr: 'Mode', 
                slug: 'fashion', 
                icon: '👗', 
                color: '#ec4899', 
                image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80', 
                description: 'Clothing, shoes and accessories' 
            },
        }),
        prisma.category.upsert({
            where: { slug: 'electronics' },
            update: {},
            create: { 
                name: 'Electronics', 
                nameFr: 'Électronique', 
                slug: 'electronics', 
                icon: '📱', 
                color: '#3b82f6', 
                image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80', 
                description: 'Smartphones, computers and gadgets' 
            },
        }),
    ])

    // ── VENDORS ────────────────────────────────────────────────
    const vendorPassword = await bcrypt.hash('Vendor@2024!', 12)
    
    const techUser = await prisma.user.upsert({
        where: { email: 'tech.elite@inovamark.cm' },
        update: {},
        create: { email: 'tech.elite@inovamark.cm', name: 'Tech Elite Admin', password: vendorPassword, role: 'VENDOR' }
    })

    const techVendor = await prisma.vendor.upsert({
        where: { userId: techUser.id },
        update: {},
        create: {
            businessName: "Elite Tech Solutions",
            businessEmail: "tech.elite@inovamark.cm",
            businessPhone: "+237600000001",
            address: "Rue de l'Innovation",
            categoryId: categories.find(c => c.slug === 'electronics')?.id!,
            description: "Premium electronics and high-performance gadgets.",
            city: "Yaoundé",
            isActive: true,
            verified: true,
            userId: techUser.id,
            logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop",
            coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=600&fit=crop"
        }
    })

    // ── PRODUCTS ───────────────────────────────────────────────
    const productData = [
        {
            name: "MacBook Pro M3 Max - 16\"",
            nameFr: "MacBook Pro M3 Max - 16\"",
            description: "The most advanced Mac laptop ever built.",
            descriptionFr: "Le MacBook Pro le plus avancé jamais construit.",
            price: 2450000,
            compareAtPrice: 2800000,
            sku: "MAC-M3-16",
            stock: 12,
            images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"],
            vendorId: techVendor.id,
            categoryId: techVendor.categoryId,
        },
        {
            name: "iPhone 15 Pro Max 512GB",
            nameFr: "iPhone 15 Pro Max 512Go",
            description: "Forged in titanium and featuring the groundbreaking A17 Pro chip.",
            descriptionFr: "Forgé en titane et doté de la puce révolutionnaire A17 Pro.",
            price: 1150000,
            compareAtPrice: 1300000,
            sku: "IPH-15PM-512",
            stock: 25,
            images: ["https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80"],
            vendorId: techVendor.id,
            categoryId: techVendor.categoryId,
        }
    ]

    for (const p of productData) {
        await prisma.product.upsert({
            where: { sku: p.sku },
            update: {},
            create: p
        })
    }

    // ── CUSTOMER & ORDERS ──────────────────────────────────────
    const customerPassword = await bcrypt.hash('Customer@2024!', 12)
    const customerUser = await prisma.user.upsert({
        where: { email: 'demo.customer@example.com' },
        update: {},
        create: { email: 'demo.customer@example.com', name: 'Demo Customer', password: customerPassword, role: 'CUSTOMER' }
    })

    const customerProfile = await prisma.customer.upsert({
        where: { userId: customerUser.id },
        update: {},
        create: { userId: customerUser.id, city: 'Yaoundé', address: 'Quartier Bastos' }
    })

    const p1 = await prisma.product.findUnique({ where: { sku: 'IPH-15PM-512' } })
    
    if (p1) {
        await prisma.order.upsert({
            where: { orderNumber: 'INV-2024-001' },
            update: {},
            create: {
                orderNumber: 'INV-2024-001',
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                paymentMethod: PaymentMethod.MOBILE_MONEY,
                subtotal: 1150000,
                deliveryFee: 2000,
                total: 1152000,
                deliveryAddress: 'Quartier Bastos, Rue 1.022',
                deliveryCity: 'Yaoundé',
                customerId: customerProfile.id,
                vendorId: techVendor.id,
                items: {
                    create: [
                        { productId: p1.id, quantity: 1, price: 1150000 }
                    ]
                }
            }
        })
    }

    console.log('✅ Seed Complete. Database is now ELITE.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
