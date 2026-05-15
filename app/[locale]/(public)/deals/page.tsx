import { prisma } from '@/lib/prisma'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Tag } from 'lucide-react'

export const metadata = {
    title: 'Prime Deals | INOVAMARK',
    description: 'Exclusive limited-time deals from top INOVAMARK vendors across Central Africa.',
}

export default async function DealsPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'

    let dealProducts: any[] = []
    try {
        dealProducts = await prisma.product.findMany({
            where: { isActive: true, compareAtPrice: { gt: 0 } },
            include: { vendor: true, category: true },
            orderBy: { rating: 'desc' },
            take: 24,
        })
    } catch (e) {
        console.error('Deals fetch error:', e)
    }

    const discount = (price: number, compareAt: number) =>
        Math.round(((compareAt - price) / compareAt) * 100)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#131921] to-[#232f3e] text-white py-16 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <Tag className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">
                            {isFr ? 'Offres limitées' : 'Limited Time Offers'}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter italic uppercase leading-none">
                        {isFr ? 'OFFRES ÉCLAIR' : 'PRIME DEALS'}
                    </h1>
                    <p className="mt-4 text-gray-400 max-w-md text-lg">
                        {isFr
                            ? 'Des remises exclusives sur les meilleurs produits. Dépêchez-vous.'
                            : 'Exclusive discounts on the finest products. Act fast.'}
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {dealProducts.length === 0 ? (
                    <div className="text-center py-24">
                        <Tag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-gray-300 uppercase tracking-tighter">
                            {isFr ? 'Nouvelles offres bientôt disponibles' : 'New Deals Coming Soon'}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {isFr ? 'Consultez nos boutiques en attendant.' : 'Check our vendor storefronts in the meantime.'}
                        </p>
                        <Link href={`/${locale}/vendors`} className="inline-flex items-center gap-2 mt-6 px-8 py-4 gold-gradient text-black rounded-2xl font-black text-xs uppercase tracking-widest">
                            {isFr ? 'Voir les boutiques' : 'View Storefronts'} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dealProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/${locale}/products/${product.id}`}
                                className="group bg-white dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all shadow-sm hover:shadow-xl"
                            >
                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                    {product.compareAtPrice && (
                                        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">
                                            -{discount(product.price, product.compareAtPrice)}%
                                        </div>
                                    )}
                                    <Image
                                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                                        {product.vendor?.businessName}
                                    </p>
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm leading-snug group-hover:text-orange-600 transition-colors">
                                        {isFr ? (product.nameFr || product.name) : product.name}
                                    </h3>
                                    <div className="flex items-baseline gap-2 pt-2">
                                        <span className="text-xl font-black text-gray-900 dark:text-white">
                                            {product.price.toLocaleString()} FCFA
                                        </span>
                                        {product.compareAtPrice && (
                                            <span className="text-xs text-gray-400 line-through">
                                                {product.compareAtPrice.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
