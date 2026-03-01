import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronDown, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { AddToCartButton } from '@/components/shared/AddToCartButton'

interface ProductCardProps {
    product: {
        id: string
        name: string
        nameFr: string
        price: number
        compareAtPrice?: number | null
        images: string[]
        rating: number
        totalReviews: number
        stock: number
        isActive: boolean
        vendor: { businessName: string; id: string }
    }
    locale: string
}

export default function ProductCard({ product, locale }: ProductCardProps) {
    const displayName = locale === 'fr' ? product.nameFr : product.name
    const discount = product.compareAtPrice ? calculateDiscount(product.price, product.compareAtPrice) : 0
    const isOutOfStock = product.stock === 0

    return (
        <div className="group flex flex-col bg-white dark:bg-[#111] rounded-[2rem] overflow-hidden relative border border-gray-100 dark:border-white/5 hover:border-primary/50 hover:shadow-2xl transition-all duration-500">
            {/* Image Section Elite */}
            <Link href={`/${locale}/products/${product.id}`} className="block relative aspect-[4/5] bg-gray-50 dark:bg-white/5 overflow-hidden">
                <Image
                    src={product.images[0] || '/images/product-placeholder.png'}
                    alt={displayName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {discount > 0 && (
                        <Badge className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full border-0 shadow-lg">
                            -{discount}%
                        </Badge>
                    )}
                    {product.rating >= 4.8 && (
                        <div className="bg-black/80 backdrop-blur-md text-primary p-1.5 rounded-full shadow-xl">
                            <Sparkles className="w-4 h-4" />
                        </div>
                    )}
                </div>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10 p-6 text-center">
                        <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/20 px-4 py-2 rounded-xl">
                            Depleted
                        </span>
                    </div>
                )}
            </Link>

            {/* Elite Info Section */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="space-y-1">
                    <Link href={`/${locale}/vendors/${product.vendor.id}`} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:brightness-125 transition-all">
                        {product.vendor.businessName}
                    </Link>
                    <Link href={`/${locale}/products/${product.id}`} className="block">
                        <h3 className="text-sm font-black leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                            {displayName}
                        </h3>
                    </Link>
                </div>

                {/* Rating & Trust */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span className="text-[10px] font-black text-gray-900 dark:text-white">{product.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">({product.totalReviews})</span>
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">Critical Stock</span>
                    )}
                </div>

                {/* Price Section */}
                <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xs font-black text-primary">FCFA</span>
                        <span className="text-2xl font-display font-black tracking-tighter italic">
                            {product.price.toLocaleString()}
                        </span>
                    </div>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-[10px] text-gray-400 line-through font-bold">
                            FCFA {product.compareAtPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Secure Acquisition */}
                {!isOutOfStock && (
                    <div className="pt-2 mt-auto">
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
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
