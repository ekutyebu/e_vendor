import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding INOVAMARK database...')

    // ── CATEGORIES ──────────────────────────────────────────────
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'food-grocery' },
            update: {},
            create: { name: 'Food & Grocery', nameFr: 'Alimentation & Épicerie', slug: 'food-grocery', icon: '🛒', color: '#10b981', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80', description: 'Fresh food, produce and grocery items' },
        }),
        prisma.category.upsert({
            where: { slug: 'fashion' },
            update: {},
            create: { name: 'Fashion', nameFr: 'Mode', slug: 'fashion', icon: '👗', color: '#ec4899', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80', description: 'Clothing, shoes and accessories' },
        }),
        prisma.category.upsert({
            where: { slug: 'electronics' },
            update: {},
            create: { name: 'Electronics', nameFr: 'Électronique', slug: 'electronics', icon: '📱', color: '#3b82f6', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80', description: 'Smartphones, computers and gadgets' },
        }),
        prisma.category.upsert({
            where: { slug: 'beauty-health' },
            update: {},
            create: { name: 'Beauty & Health', nameFr: 'Beauté & Santé', slug: 'beauty-health', icon: '💄', color: '#a855f7', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54c28?w=800&q=80', description: 'Cosmetics, skincare and wellness' },
        }),
        prisma.category.upsert({
            where: { slug: 'home-living' },
            update: {},
            create: { name: 'Home & Living', nameFr: 'Maison & Décoration', slug: 'home-living', icon: '🏠', color: '#f97316', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', description: 'Furniture, decor and household items' },
        }),
        prisma.category.upsert({
            where: { slug: 'agriculture' },
            update: {},
            create: { name: 'Agriculture', nameFr: 'Agriculture', slug: 'agriculture', icon: '🌱', color: '#22c55e', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80', description: 'Farm products and agricultural supplies' },
        }),
        prisma.category.upsert({
            where: { slug: 'services' },
            update: {},
            create: { name: 'Services', nameFr: 'Services', slug: 'services', icon: '🔧', color: '#06b6d4', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', description: 'Professional and business services' },
        }),
        prisma.category.upsert({
            where: { slug: 'sports' },
            update: {},
            create: { name: 'Sports & Outdoors', nameFr: 'Sports & Loisirs', slug: 'sports', icon: '⚽', color: '#ef4444', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80', description: 'Sports equipment and outdoor gear' },
        }),
    ])

    console.log(`✅ Created ${categories.length} categories`)

    // ── ADMIN USER ──────────────────────────────────────────────
    const adminPassword = await bcrypt.hash('Admin@2024!', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@inovamark.cm' },
        update: {},
        create: {
            email: 'admin@inovamark.cm',
            name: 'INOVAMARK Admin',
            password: adminPassword,
            role: 'ADMIN',
            phone: '+237600000000',
        },
    })
    console.log(`✅ Admin user created: ${admin.email}`)

    // ── SAMPLE VENDOR USERS ────────────────────────────────────
    const vendorPassword = await bcrypt.hash('Vendor@2024!', 12)

    const vendor1User = await prisma.user.upsert({
        where: { email: 'marche.bio@gmail.com' },
        update: {},
        create: {
            email: 'marche.bio@gmail.com',
            name: 'Jean-Baptiste Fouda',
            password: vendorPassword,
            role: 'VENDOR',
            phone: '+237677001122',
        },
    })

    const vendor2User = await prisma.user.upsert({
        where: { email: 'elegance.boutique@gmail.com' },
        update: {},
        create: {
            email: 'elegance.boutique@gmail.com',
            name: 'Marie Ngo Bilong',
            password: vendorPassword,
            role: 'VENDOR',
            phone: '+237699334455',
        },
    })

    const vendor3User = await prisma.user.upsert({
        where: { email: 'techshop.cm@gmail.com' },
        update: {},
        create: {
            email: 'techshop.cm@gmail.com',
            name: 'Paul Mbida',
            password: vendorPassword,
            role: 'VENDOR',
            phone: '+237655667788',
        },
    })

    // ── SAMPLE VENDORS ─────────────────────────────────────────
    const foodCat = categories[0]
    const fashionCat = categories[1]
    const electronicsCat = categories[2]

    const vendor1 = await prisma.vendor.upsert({
        where: { userId: vendor1User.id },
        update: {},
        create: {
            businessName: "Marché Bio Yaoundé",
            businessEmail: 'marche.bio@gmail.com',
            businessPhone: '+237677001122',
            logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1200&h=400&fit=crop',
            description: 'Fresh organic produce and dairy products directly from local farms. We partner with 20+ farmers in the Yaoundé region to bring you the freshest seasonal vegetables and fruits.',
            descriptionFr: 'Produits frais biologiques directement des fermes locales. Nous partenons avec 20+ agriculteurs de la région de Yaoundé.',
            categoryId: foodCat.id,
            address: 'Marché Central, Avenue Kennedy',
            city: 'Yaoundé',
            coordinates: { lat: 3.8480, lng: 11.5021 },
            deliveryRadius: 15,
            baseDeliveryFee: 1000,
            isActive: true,
            verified: true,
            rating: 4.9,
            totalReviews: 234,
            userId: vendor1User.id,
        },
    })

    const vendor2 = await prisma.vendor.upsert({
        where: { userId: vendor2User.id },
        update: {},
        create: {
            businessName: "Elegance Boutique",
            businessEmail: "elegance.boutique@gmail.com",
            businessPhone: "+237699334455",
            logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop',
            description: 'Contemporary African fashion meets global trends. Our boutique offers handpicked clothing, accessories and shoes for the modern Cameroonian woman.',
            descriptionFr: 'La mode africaine contemporaine rencontre les tendances mondiales. Mode pour la femme camerounaise moderne.',
            categoryId: fashionCat.id,
            address: 'Boulevard de la Liberté, Akwa',
            city: 'Douala',
            coordinates: { lat: 4.0511, lng: 9.7679 },
            deliveryRadius: 20,
            baseDeliveryFee: 1500,
            isActive: true,
            verified: true,
            rating: 4.8,
            totalReviews: 189,
            userId: vendor2User.id,
        },
    })

    const vendor3 = await prisma.vendor.upsert({
        where: { userId: vendor3User.id },
        update: {},
        create: {
            businessName: "TechShop Cameroun",
            businessEmail: "techshop.cm@gmail.com",
            businessPhone: "+237655667788",
            logo: 'https://images.unsplash.com/photo-1611174743420-3d7df880ce32?w=200&h=200&fit=crop',
            coverImage: 'https://images.unsplash.com/photo-1531297122539-5692b6982eb3?w=1200&h=400&fit=crop',
            description: 'Your trusted source for smartphones, accessories, and electronics in Yaoundé. We offer genuine products with 6-month warranty and after-sales service.',
            descriptionFr: 'Votre source de confiance pour smartphones et électronique à Yaoundé. Produits authentiques avec garantie 6 mois.',
            categoryId: electronicsCat.id,
            address: 'Quartier Mokolo, Rue des Électroniques',
            city: 'Yaoundé',
            coordinates: { lat: 3.8617, lng: 11.5150 },
            deliveryRadius: 12,
            baseDeliveryFee: 800,
            isActive: true,
            verified: true,
            rating: 4.7,
            totalReviews: 156,
            userId: vendor3User.id,
        },
    })

    console.log(`✅ Created 3 sample vendors`)

    // ── SAMPLE PRODUCTS ────────────────────────────────────────
    const products = await Promise.all([
        // Vendor 1 - Food products
        prisma.product.upsert({
            where: { sku: 'MBY-TOM-001' },
            update: {},
            create: {
                name: 'Fresh Organic Tomatoes 5kg',
                nameFr: 'Tomates Biologiques Fraîches 5kg',
                description: 'Sun-ripened organic tomatoes harvested daily from our partner farms. Perfect for sauces, salads and cooking.',
                descriptionFr: 'Tomates biologiques mûries au soleil récoltées quotidiennement de nos fermes partenaires.',
                price: 4500,
                compareAtPrice: 6000,
                stock: 50,
                sku: 'MBY-TOM-001',
                images: [
                    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop',
                ],
                vendorId: vendor1.id,
                categoryId: foodCat.id,
                rating: 4.8,
                totalReviews: 67,
            },
        }),
        prisma.product.upsert({
            where: { sku: 'MBY-PLM-001' },
            update: {},
            create: {
                name: 'Red Palm Oil 5L Premium',
                nameFr: 'Huile de Palme Rouge 5L Premium',
                description: 'Pure, unrefined red palm oil rich in vitamins A and E. Extracted from fresh palm fruits with traditional methods.',
                descriptionFr: "Huile de palme rouge pure, non raffinée riche en vitamines A et E. Extractée de fruits de palme frais.",
                price: 12000,
                stock: 25,
                sku: 'MBY-PLM-001',
                images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop'],
                vendorId: vendor1.id,
                categoryId: foodCat.id,
                rating: 4.9,
                totalReviews: 89,
            },
        }),
        // Vendor 2 - Fashion products
        prisma.product.upsert({
            where: { sku: 'ELG-DRS-001' },
            update: {},
            create: {
                name: 'African Wax Print Dress - Ankara',
                nameFr: 'Robe Imprimé Wax Africain - Ankara',
                description: 'Beautiful handcrafted Ankara dress with vibrant patterns. Made from premium quality cotton wax fabric. Available in sizes S-3XL.',
                descriptionFr: 'Belle robe Ankara artisanale avec des motifs vibrants. Tissu coton wax de qualité premium. Disponible en tailles S-3XL.',
                price: 25000,
                compareAtPrice: 35000,
                stock: 15,
                sku: 'ELG-DRS-001',
                images: [
                    'https://images.unsplash.com/photo-1594938298603-7554e97a5b0a?w=600&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=600&h=600&fit=crop',
                ],
                vendorId: vendor2.id,
                categoryId: fashionCat.id,
                rating: 4.7,
                totalReviews: 43,
            },
        }),
        // Vendor 3 - Electronics
        prisma.product.upsert({
            where: { sku: 'TSH-PHN-001' },
            update: {},
            create: {
                name: 'Samsung Galaxy A34 5G - 128GB',
                nameFr: 'Samsung Galaxy A34 5G - 128Go',
                description: 'Samsung Galaxy A34 5G with 6.6" display, 48MP camera, 5000mAh battery. Comes with 6-month warranty. Genuine product.',
                descriptionFr: 'Samsung Galaxy A34 5G avec écran 6.6", caméra 48MP, batterie 5000mAh. Garantie 6 mois incluse.',
                price: 185000,
                stock: 8,
                sku: 'TSH-PHN-001',
                images: [
                    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
                    'https://images.unsplash.com/photo-1592950630581-03cb41342cc5?w=600&h=600&fit=crop',
                ],
                vendorId: vendor3.id,
                categoryId: electronicsCat.id,
                rating: 4.6,
                totalReviews: 31,
            },
        }),
        prisma.product.upsert({
            where: { sku: 'TSH-ACC-002' },
            update: {},
            create: {
                name: 'Wireless Earbuds Pro - Noise Cancelling',
                nameFr: 'Écouteurs Sans Fil Pro - Réduction de Bruit',
                description: 'Premium wireless earbuds with active noise cancellation, 30h battery life, and IPX5 water resistance.',
                descriptionFr: 'Écouteurs sans fil premium avec réduction de bruit active, 30h d\'autonomie, résistance à l\'eau IPX5.',
                price: 45000,
                compareAtPrice: 65000,
                stock: 20,
                sku: 'TSH-ACC-002',
                images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop'],
                vendorId: vendor3.id,
                categoryId: electronicsCat.id,
                rating: 4.5,
                totalReviews: 18,
            },
        }),
    ])

    console.log(`✅ Created ${products.length} sample products`)

    // ── CUSTOMER USER ─────────────────────────────────────────
    const customerPassword = await bcrypt.hash('Customer@2024!', 12)
    const customerUser = await prisma.user.upsert({
        where: { email: 'customer@example.cm' },
        update: {},
        create: {
            email: 'customer@example.cm',
            name: 'Awa Kamga',
            password: customerPassword,
            role: 'CUSTOMER',
            phone: '+237677112233',
        },
    })

    await prisma.customer.upsert({
        where: { userId: customerUser.id },
        update: {},
        create: {
            userId: customerUser.id,
            city: 'Yaoundé',
        },
    })

    console.log(`✅ Demo customer created: ${customerUser.email}`)

    console.log(`
🎉 Database seeded successfully!

📋 Test Credentials:
  Admin:    admin@inovamark.cm    / Admin@2024!
  Vendor 1: marche.bio@gmail.com  / Vendor@2024!
  Vendor 2: elegance.boutique@gmail.com / Vendor@2024!
  Customer: customer@example.cm  / Customer@2024!
  `)
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
