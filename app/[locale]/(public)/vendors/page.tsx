import { Search, MapPin, Star, ChevronRight, Store } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

import { prisma } from '@/lib/prisma'

const FILTER_CATEGORIES = [
    { slug: 'all', name: 'All Categories' },
    { slug: 'food', name: 'Food & Grocery' },
    { slug: 'fashion', name: 'Fashion' },
    { slug: 'electronics', name: 'Electronics' },
    { slug: 'beauty', name: 'Beauty & Health' },
    { slug: 'home', name: 'Home & Living' },
    { slug: 'agriculture', name: 'Agriculture' },
    { slug: 'services', name: 'Services' },
]

export default async function VendorsPage({
    params,
    searchParams,
}: {
    params: { locale: string }
    searchParams: { category?: string }
}) {
    const locale = params.locale
    const isFr = locale === 'fr'
    const categoryFilter = Array.isArray(searchParams.category) 
        ? searchParams.category[0] 
        : searchParams.category

    // Fetch vendors from DB, including top 4 products for the preview
    const vendors = await prisma.vendor.findMany({
        where: {
            isActive: true,
            ...(categoryFilter && categoryFilter !== 'all' ? {
                category: {
                    slug: categoryFilter
                }
            } : {})
        },
        include: {
            category: true,
            products: {
                where: { isActive: true },
                take: 4,
                orderBy: { rating: 'desc' }
            },
            _count: {
                select: { products: true, reviews: true }
            }
        },
        orderBy: {
            rating: 'desc'
        }
    })

    return (
        <div className="bg-[#fafafa] dark:bg-[#080808] min-h-screen pb-20">
            {/* Elite Header Strip */}
            <div className="bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5 py-10 mb-12">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">DISTINGUISHED PARTNERS</div>
                        <h1 className="text-6xl font-display font-black tracking-tighter uppercase italic leading-none text-gray-900 dark:text-white">
                            {isFr ? 'BOUTIQUES D\'ÉLITE' : 'ELITE STOREFRONTS'}
                        </h1>
                    </div>
                    
                    <div className="w-full md:w-[400px] relative">
                        <input
                            type="text"
                            placeholder={isFr ? 'RECHERCHER...' : 'SEARCH INSTITUTIONS...'}
                            className="w-full bg-gray-100 dark:bg-white/5 border-0 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all"
                        />
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Sidebar: Elite Filters */}
                    <div className="hidden lg:block lg:col-span-3 space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">CLASSIFICATION</h3>
                            <div className="space-y-2">
                                {FILTER_CATEGORIES.map((cat) => {
                                    const isActive = categoryFilter === cat.slug || (!categoryFilter && cat.slug === 'all')
                                    return (
                                        <Link
                                            key={cat.slug}
                                            href={`/${locale}/vendors?category=${cat.slug}`}
                                            className={`block text-[11px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-primary italic translate-x-2' : 'text-gray-400 hover:text-white hover:translate-x-1'}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="card-elite p-8 rounded-[2rem] dark:bg-[#111] dark:border-white/5 space-y-4">
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">ELITE STATUS</div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                                    <span>VERIFIED ONLY</span>
                                    <div className="w-8 h-4 rounded-full bg-primary/20 p-1 flex justify-end">
                                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_primary]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Elite Vendor List */}
                    <div className="lg:col-span-9 space-y-8">
                        {vendors.map((vendor) => (
                            <div key={vendor.id} className="group relative overflow-hidden rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-all duration-500">
                                <div className="flex flex-col xl:flex-row">
                                    {/* Brand Identity */}
                                    <div className="p-10 xl:w-[350px] shrink-0 border-b xl:border-b-0 xl:border-r border-gray-100 dark:border-white/5 flex flex-col">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative w-20 h-20 rounded-3xl bg-black overflow-hidden border border-white/10 shadow-2xl p-2 shrink-0">
                                                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                                    <Image src={vendor.logo || '/images/vendor-placeholder.png'} alt={vendor.businessName} fill className="object-cover" />
                                                </div>
                                            </div>
                                            <div>
                                                <Link href={`/${locale}/vendors/${vendor.id}`}>
                                                    <h2 className="text-xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                        {vendor.businessName}
                                                    </h2>
                                                </Link>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                                                    <MapPin className="w-3 h-3" /> {vendor.city}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 mt-auto">
                                            <div className="flex items-center gap-6">
                                                <div className="space-y-1">
                                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">RATING</div>
                                                    <div className="flex items-center gap-1 font-black text-white">
                                                        <Star className="w-3 h-3 fill-primary text-primary" /> {vendor.rating.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">ASSETS</div>
                                                    <div className="font-black text-white uppercase text-[10px]">{vendor._count.products} ITEMS</div>
                                                </div>
                                            </div>
                                            <Link href={`/${locale}/vendors/${vendor.id}`} className="block">
                                                <div className="w-full h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all flex items-center justify-center">
                                                    ENTER PAVILION
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Assets Preview */}
                                    <div className="p-10 flex-grow">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">PREMIER RELEASES</span>
                                            <Link href={`/${locale}/vendors/${vendor.id}`} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                                VIEW ALL <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                            {vendor.products.map(product => (
                                                <Link key={product.id} href={`/${locale}/products/${product.id}`} className="group/item block space-y-3">
                                                    <div className="aspect-square rounded-2xl bg-gray-50 dark:bg-black/40 overflow-hidden relative border border-transparent group-item-hover:border-primary/20 transition-all p-2">
                                                        <Image
                                                            src={product.images[0] || '/images/product-placeholder.png'}
                                                            alt={isFr ? product.nameFr : product.name}
                                                            fill
                                                            className="object-contain group-hover/item:scale-110 transition-transform duration-700 p-2"
                                                        />
                                                    </div>
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover/item:text-white transition-colors line-clamp-1">
                                                        {isFr ? product.nameFr : product.name}
                                                    </div>
                                                </Link>
                                            ))}
                                            {vendor.products.length === 0 && (
                                                <div className="col-span-full h-24 rounded-2xl border border-dashed border-gray-100 dark:border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                    PREPARING RELEASES...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
