import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Store } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shared/ProductCard'

export default async function HomePage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'

    // Fetch data from DB
    const [featuredVendors, categories, topProducts] = await Promise.all([
        prisma.vendor.findMany({
            where: { isActive: true },
            include: { storeCategory: true },
            orderBy: { rating: 'desc' },
            take: 4
        }),
        prisma.category.findMany({
            take: 12
        }),
        prisma.product.findMany({
            where: { isActive: true },
            include: { vendor: true },
            orderBy: { rating: 'desc' },
            take: 10
        })
    ])

    return (
        <div className="bg-[#e3e6e6] min-h-screen pb-10">
            {/* ── HERO BANNER (Amazon Style) ──────────────────────────────────────── */}
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
                {/* Background Image Carousel Mock */}
                <Image
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"
                    alt="Hero Banner"
                    fill
                    className="object-cover object-top"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e3e6e6] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                {/* Hero Content */}
                <div className="absolute top-1/4 left-0 w-full">
                    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white max-w-2xl leading-tight drop-shadow-lg">
                            {isFr ? 'Découvrez des millions de produits locaux' : 'Discover millions of local products'}
                        </h1>
                        <p className="mt-4 text-white text-lg sm:text-2xl max-w-xl drop-shadow-md font-medium">
                            {isFr ? "La plus grande marketplace d'Afrique Centrale" : 'Central Africa\'s largest marketplace'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT AREA ──────────────────────────────────────────────── */}
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-40 relative z-10">

                {/* ── TOP 4-ITEM GRIDS (Amazon Style Cards) ────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Card 1: Categories */}
                    <div className="bg-white p-4 h-full flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            {isFr ? 'Achetez par Catégorie' : 'Shop by Category'}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 flex-grow content-start">
                            {categories.slice(0, 4).map(cat => (
                                <Link key={cat.id} href={`/${locale}/vendors?category=${cat.slug}`} className="group">
                                    <div className="relative aspect-square bg-gray-100 mb-1 rounded-sm overflow-hidden">
                                        <Image src={cat.image || '/images/placeholder.png'} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <span className="text-xs text-gray-700 group-hover:text-[#007185] line-clamp-1">{isFr ? cat.nameFr : cat.name}</span>
                                </Link>
                            ))}
                        </div>
                        <Link href={`/${locale}/categories`} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">
                            {isFr ? 'Voir toutes les catégories' : 'Shop all categories'}
                        </Link>
                    </div>

                    {/* Card 2: Fresh Produce Deal */}
                    <div className="bg-white p-4 h-full flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            {isFr ? 'Produits Frais & Bio' : 'Fresh & Organic Produce'}
                        </h2>
                        <div className="relative w-full flex-grow bg-gray-100 min-h-[200px] mb-4">
                            <Image src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" alt="Fresh Produce" fill className="object-cover object-center" />
                        </div>
                        <Link href={`/${locale}/vendors?category=food-grocery`} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">
                            {isFr ? 'Acheter maintenant' : 'Shop now'}
                        </Link>
                    </div>

                    {/* Card 3: Electronics */}
                    <div className="bg-white p-4 h-full flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            {isFr ? 'Électronique & Accessoires' : 'Electronics & Accessories'}
                        </h2>
                        <div className="grid grid-cols-2 gap-4 flex-grow content-start">
                            <div className="relative aspect-square bg-gray-100 mb-1 rounded-sm overflow-hidden"><Image src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400" alt="Phones" fill className="object-cover" /></div>
                            <div className="relative aspect-square bg-gray-100 mb-1 rounded-sm overflow-hidden"><Image src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" alt="Audio" fill className="object-cover" /></div>
                            <div className="relative aspect-square bg-gray-100 mb-1 rounded-sm overflow-hidden"><Image src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400" alt="Computers" fill className="object-cover" /></div>
                            <div className="relative aspect-square bg-gray-100 mb-1 rounded-sm overflow-hidden"><Image src="https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=400" alt="Gadgets" fill className="object-cover" /></div>
                        </div>
                        <Link href={`/${locale}/vendors?category=electronics`} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mt-4">
                            {isFr ? 'Voir plus' : 'See more'}
                        </Link>
                    </div>

                    {/* Card 4: Become a Vendor CTA */}
                    <div className="bg-white p-4 h-full flex flex-col justify-between items-center text-center border-2 border-orange-100">
                        <div className="w-full">
                            <h2 className="text-2xl font-bold mb-2 text-gray-900">
                                {isFr ? 'Vendez sur INOVAMARK' : 'Sell on INOVAMARK'}
                            </h2>
                            <p className="text-gray-600 text-sm mb-6">
                                {isFr ? "Atteignez des millions de clients au Cameroun et au-delà." : "Reach millions of customers in Cameroon and beyond."}
                            </p>
                        </div>
                        <div className="relative w-48 h-48 mb-6">
                            <Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80" alt="Vendor" fill className="object-cover rounded-full shadow-lg border-4 border-white" />
                        </div>
                        <Link href={`/${locale}/become-vendor`} className="w-full">
                            <button className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 border border-[#fcd200] rounded-xl font-medium shadow-sm transition-colors text-sm">
                                {isFr ? 'Commencer à vendre' : 'Start selling'}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ── ALIBABA STYLE CATEGORY STRIP ──────────────────────────────────── */}
                <div className="bg-white p-4 mb-4 flex gap-4 overflow-x-auto scrollbar-hide">
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/${locale}/vendors?category=${cat.slug}`} className="flex flex-col items-center gap-2 group min-w-[80px]">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 relative shadow-sm group-hover:shadow-md transition-all border border-gray-200">
                                {cat.image ? (
                                    <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">{cat.icon}</div>
                                )}
                            </div>
                            <span className="text-xs font-medium text-gray-700 whitespace-nowrap group-hover:text-[#ff4747]">
                                {isFr ? cat.nameFr : cat.name}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* ── TODAY'S DEALS SCROLLER ───────────────────────────────────────── */}
                <div className="bg-white p-4 mb-4">
                    <div className="flex items-end gap-4 mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isFr ? 'Ventes Flash' : 'Today\'s Deals'}
                        </h2>
                        <Link href={`/${locale}/vendors`} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline mb-1">
                            {isFr ? 'Voir toutes les offres' : 'See all deals'}
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                        {topProducts.map((product) => (
                            <ProductCard key={product.id} product={product} locale={locale} />
                        ))}
                    </div>
                </div>

                {/* ── ALIBABA STYLE STOREFRONTS ────────────────────────────────────── */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2">
                        {isFr ? 'Boutiques Officielles' : 'Official Storefronts'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {featuredVendors.map((vendor) => (
                            <Link key={vendor.id} href={`/${locale}/vendors/${vendor.id}`} className="group relative bg-white overflow-hidden border border-gray-200 hover:shadow-lg transition-all h-[250px]">
                                {/* Cover Image */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={vendor.coverImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'}
                                        alt={vendor.businessName}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-4 z-10 flex items-end gap-3">
                                    <div className="w-14 h-14 bg-white rounded-lg shadow-md p-1 flex-shrink-0">
                                        <div className="relative w-full h-full rounded bg-gray-100 overflow-hidden">
                                            {vendor.logo ? (
                                                <Image src={vendor.logo} alt="Logo" fill className="object-cover" />
                                            ) : (
                                                <Store className="w-6 h-6 m-auto mt-3 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 pb-1">
                                        <h3 className="text-white font-bold text-lg truncate group-hover:text-amber-400 transition-colors">
                                            {vendor.businessName}
                                        </h3>
                                        <p className="text-gray-300 text-xs flex items-center gap-1">
                                            <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">Official</span>
                                            {vendor.city}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors mb-2" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── MORE PRODUCTS GRID ───────────────────────────────────────────── */}
                <div className="bg-white p-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        {isFr ? 'Recommandé pour vous' : 'Recommended for you'}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                        {/* Render products again to fill space for demo purposes */}
                        {topProducts.slice().reverse().map((product) => (
                            <ProductCard key={`rec-${product.id}`} product={product} locale={locale} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
