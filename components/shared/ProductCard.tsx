import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronDown } from 'lucide-react'
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
        <div className="group flex flex-col bg-white overflow-hidden relative border border-gray-100/50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-200">
            {/* Image Section */}
            <Link href={`/${locale}/products/${product.id}`} className="block relative aspect-square bg-[#f7f7f7] p-4 flex items-center justify-center">
                <div className="relative w-full h-full mix-blend-multiply">
                    <Image
                        src={product.images[0] || '/images/product-placeholder.png'}
                        alt={displayName}
                        fill
                        className="object-contain"
                    />
                </div>
                {/* Discount Badge (Alibaba style) */}
                {discount > 0 && (
                    <div className="absolute top-0 right-0">
                        <Badge className="bg-[#ff4747] text-white text-[10px] font-bold px-1.5 py-1 rounded-none rounded-bl-lg border-0">
                            -{discount}%
                        </Badge>
                    </div>
                )}
                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm z-10">
                        <span className="text-gray-900 text-sm font-bold bg-gray-100 px-4 py-2 border border-gray-300">
                            Currently unavailable.
                        </span>
                    </div>
                )}
            </Link>

            {/* Info Section */}
            <div className="p-3 flex flex-col flex-grow">
                {/* Title */}
                <Link href={`/${locale}/products/${product.id}`} className="group-hover:underline text-[#007185] hover:text-[#c45500]">
                    <h3 className="text-[15px] font-medium leading-tight line-clamp-2 mb-1">
                        {displayName}
                    </h3>
                </Link>

                <p className="text-[11px] text-gray-500 mb-1 truncate block hover:underline">
                    <Link href={`/${locale}/vendors/${product.vendor.id}`}>
                        {product.vendor.businessName}
                    </Link>
                </p>

                {/* Rating (Amazon style) */}
                {product.totalReviews >= 0 && (
                    <div className="flex items-center gap-1 mb-1">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-[#ffa41c] text-[#ffa41c]' : 'fill-transparent text-[#ffa41c]'}`}
                                />
                            ))}
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer ml-1">
                            {product.totalReviews}
                        </span>
                    </div>
                )}

                {/* "Amazon's Choice" equivalent */}
                {product.rating >= 4.5 && product.totalReviews > 10 && (
                    <div className="mb-2">
                        <span className="inline-flex text-[10px] font-bold text-white bg-[#232f3e] px-1.5 py-0.5 relative before:absolute before:border-[4px] before:border-transparent before:border-l-[#232f3e] before:border-t-[#232f3e] before:-right-2 before:top-0">
                            INOVAMARK <span className="text-[#f69a19] ml-1">Choice</span>
                        </span>
                    </div>
                )}

                {/* Price (Amazon bold integer format) */}
                <div className="mt-auto pt-2">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-900">FCFA</span>
                        <span className="text-[22px] font-bold text-gray-900 leading-none">
                            {formatPrice(product.price).replace('£', '').replace('FCFA', '').trim()}
                        </span>
                    </div>

                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <div className="text-xs text-gray-500 mt-1">
                            List: <span className="line-through">{formatPrice(product.compareAtPrice)}</span>
                        </div>
                    )}

                    {/* Delivery Estimate Mock */}
                    <div className="text-xs text-gray-900 mt-2">
                        Delivery <span className="font-bold">Tomorrow</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                        Ships to Cameroon
                    </div>
                </div>

                {/* Quick Add to Cart */}
                {!isOutOfStock && (
                    <div className="mt-3">
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
                            className="w-full rounded-2xl py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-xs shadow-none border border-[#fcd200]"
                            fullWidth
                            text={locale === 'fr' ? 'Ajouter au panier' : 'Add to cart'}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
