import { prisma } from '@/lib/prisma'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight } from 'lucide-react'

export const metadata = {
    title: 'New Arrivals | INOVAMARK',
    description: 'The latest products from top INOVAMARK vendors.',
}

export default async function NewArrivalsPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'

    let newProducts: any[] = []
    try {
        newProducts = await prisma.product.findMany({
            where: { isActive: true },
            include: { vendor: true, category: true },
            orderBy: { createdAt: 'desc' },
            take: 24,
        })
    } catch (e) {
        console.error('New arrivals fetch error:', e)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white py-16 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-8 h-8 text-white/80" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-white/80">
                            {isFr ? 'Dernières arrivées' : 'Just Dropped'}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter italic uppercase leading-none">
                        {isFr ? 'NOUVELLES ARRIVÉES' : 'NEW ARRIVALS'}
                    </h1>
                    <p className="mt-4 text-white/80 max-w-md text-lg">
                        {isFr
                            ? 'Les toutes dernières créations de nos partenaires vendeurs.'
                            : 'The freshest drops from our elite vendor partners.'}
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {newProducts.length === 0 ? (
                    <div className="text-center py-24">
                        <Sparkles className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-gray-300 uppercase tracking-tighter">
                            {isFr ? 'Nouvelles arrivées bientôt' : 'New Arrivals Coming Soon'}
                        </h2>
                        <Link href={`/${locale}/vendors`} className="inline-flex items-center gap-2 mt-6 px-8 py-4 gold-gradient text-black rounded-2xl font-black text-xs uppercase tracking-widest">
                            {isFr ? 'Voir les boutiques' : 'View Storefronts'} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/${locale}/products/${product.id}`}
                                className="group bg-white dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all shadow-sm hover:shadow-xl"
                            >
                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                    <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                        {isFr ? 'Nouveau' : 'New'}
                                    </div>
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
                                    <div className="pt-2">
                                        <span className="text-xl font-black text-gray-900 dark:text-white">
                                            {product.price.toLocaleString()} FCFA
                                        </span>
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
