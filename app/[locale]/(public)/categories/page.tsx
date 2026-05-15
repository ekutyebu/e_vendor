import { prisma } from '@/lib/prisma'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutGrid, ArrowRight } from 'lucide-react'

export const metadata = {
    title: 'All Categories | INOVAMARK',
    description: 'Browse all product categories on INOVAMARK.',
}

export default async function CategoriesPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'

    let categories: any[] = []
    try {
        categories = await prisma.category.findMany({
            include: {
                _count: { select: { vendors: true, products: true } }
            },
            orderBy: { name: 'asc' },
        })
    } catch (e) {
        console.error('Categories fetch error:', e)
    }

    const categoryImages = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Header */}
            <div className="bg-[#131921] text-white py-16 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <LayoutGrid className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">
                            {isFr ? 'Tous les rayons' : 'All Departments'}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter italic uppercase leading-none">
                        {isFr ? 'CATÉGORIES' : 'CATEGORIES'}
                    </h1>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {categories.length === 0 ? (
                    <div className="text-center py-24">
                        <LayoutGrid className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                        <p className="text-gray-400 uppercase tracking-widest font-bold">
                            {isFr ? 'Aucune catégorie disponible' : 'No categories available yet'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((cat, idx) => (
                            <Link
                                key={cat.id}
                                href={`/${locale}/vendors?category=${cat.slug}`}
                                className="group relative bg-white dark:bg-[#111] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all shadow-sm hover:shadow-xl"
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <Image
                                        src={cat.image || categoryImages[idx % categoryImages.length]}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="text-2xl">{cat.icon || '📦'}</span>
                                    </div>
                                </div>
                                <div className="p-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                                            {isFr ? cat.nameFr : cat.name}
                                        </h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                            {cat._count.vendors} {isFr ? 'boutiques' : 'vendors'} · {cat._count.products} {isFr ? 'produits' : 'products'}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
