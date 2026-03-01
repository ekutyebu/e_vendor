import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Lock, MapPin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/shared/AddToCartButton'

export default async function ProductDetailsPage({
    params,
}: {
    params: { locale: string; id: string }
}) {
    const locale = params.locale
    const isFr = locale === 'fr'

    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: {
            vendor: true,
            category: true,
        }
    })

    if (!product || !product.isActive) {
        notFound()
    }

    const displayName = isFr ? product.nameFr : product.name
    const displayDescription = isFr ? product.descriptionFr : product.description
    const isOutOfStock = product.stock === 0

    return (
        <div className="bg-[#fafafa] dark:bg-[#080808] min-h-screen pb-20">
            {/* Elite Breadcrumb */}
            <div className="bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5 py-3 mb-8">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
                    <nav className="flex text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <ol className="flex items-center space-x-3">
                            <li><Link href={`/${locale}`} className="hover:text-primary transition-colors">HOME</Link></li>
                            <li className="text-primary">•</li>
                            <li>
                                <Link href={`/${locale}/vendors?category=${product.category.slug}`} className="hover:text-primary transition-colors">
                                    {isFr ? product.category.nameFr : product.category.name}
                                </Link>
                            </li>
                            <li className="text-primary">•</li>
                            <li className="text-gray-900 dark:text-white truncate max-w-[200px] italic">
                                {displayName}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Visual Showcase (Col 1-7) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 shadow-2xl group">
                            <Image
                                src={product.images[0] || '/images/product-placeholder.png'}
                                alt={displayName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                priority
                            />
                            {/* Elite Badges Overlay */}
                            <div className="absolute top-8 left-8 flex flex-col gap-3">
                                <div className="bg-black/80 backdrop-blur-xl text-primary px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-2xl flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> PREMIER ASSET
                                </div>
                                {product.rating >= 4.5 && (
                                    <div className="gold-gradient text-black px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                        TRUSTED SELECTION
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Strip Elite */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {product.images.map((img, i) => (
                                <button key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all bg-white dark:bg-[#111] shrink-0">
                                    <Image src={img} fill alt="" className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Elite Specifications & Selection (Col 8-12) */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-4">
                            <Link href={`/${locale}/vendors/${product.vendor.id}`} className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:brightness-125 transition-all">
                                OFFICIAL STORE: {product.vendor.businessName}
                            </Link>
                            <h1 className="text-5xl font-display font-black tracking-tighter uppercase italic leading-[0.9] text-gray-900 dark:text-white">
                                {displayName}
                            </h1>
                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-primary text-primary" />
                                    <span className="text-sm font-black text-gray-900 dark:text-white">{product.rating.toFixed(1)}</span>
                                    <span className="text-[10px] font-bold text-gray-400 ml-1">({product.totalReviews} REVIEWS)</span>
                                </div>
                                <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <MapPin className="w-3 h-3 text-primary" />
                                    Ships to {product.vendor.city}
                                </div>
                            </div>
                        </div>

                        {/* Price & Acquisition Box */}
                        <div className="card-elite p-10 rounded-[3rem] space-y-8 dark:bg-[#111] dark:border-white/5">
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-black text-primary">FCFA</span>
                                    <span className="text-6xl font-display font-black tracking-tighter italic text-gray-900 dark:text-white">
                                        {product.price.toLocaleString()}
                                    </span>
                                </div>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-400 line-through font-bold">
                                            FCFA {product.compareAtPrice.toLocaleString()}
                                        </span>
                                        <Badge className="bg-red-500 text-white text-[10px] font-black rounded-full border-0">
                                            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>AVAILABILITY</span>
                                    {isOutOfStock ? (
                                        <span className="text-red-500">DEPLETED</span>
                                    ) : (
                                        <span className="text-emerald-500">SECURED STOCK ({product.stock})</span>
                                    )}
                                </div>
                                
                                {!isOutOfStock && (
                                    <div className="space-y-4 pt-2">
                                        <AddToCartButton
                                            product={{
                                                id: product.id,
                                                name: product.name,
                                                nameFr: product.nameFr,
                                                price: product.price,
                                                images: product.images,
                                                vendor: {
                                                    id: product.vendor.id,
                                                    businessName: product.vendor.businessName
                                                }
                                            }}
                                            locale={locale}
                                            fullWidth
                                            className="h-16 text-xs"
                                        />
                                        <button className="w-full h-16 rounded-2xl border border-white/10 bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest text-[10px] hover:brightness-125 transition-all">
                                            INSTANT ACQUISITION
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                                    {displayDescription || "No detailed dossier available for this asset."}
                                </p>
                            </div>
                        </div>

                        {/* Technical Dossier (Specs) */}
                        <div className="space-y-6 pt-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">SPECIFICATIONS</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">ORIGIN</span>
                                    <p className="text-[11px] font-black uppercase text-gray-900 dark:text-white">{product.vendor.businessName}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">CLASSIFICATION</span>
                                    <p className="text-[11px] font-black uppercase text-gray-900 dark:text-white">{product.category.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">SHIPPING</span>
                                    <p className="text-[11px] font-black uppercase text-gray-900 dark:text-white italic">Elite Logistics</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">AUTHENTICITY</span>
                                    <p className="text-[11px] font-black uppercase text-primary italic">Verified</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
