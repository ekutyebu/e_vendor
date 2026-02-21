import { Search, MapPin, Star, ChevronRight, Store } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
    const categoryFilter = searchParams.category

    // Fetch vendors from DB, including top 4 products for the preview
    const vendors = await prisma.vendor.findMany({
        where: {
            isActive: true,
            ...(categoryFilter && categoryFilter !== 'all' ? {
                storeCategory: {
                    slug: categoryFilter
                }
            } : {})
        },
        include: {
            storeCategory: true,
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
        <div className="bg-[#eaeded] min-h-screen py-4">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search & Header Strip (Amazon Style) */}
                <div className="bg-white p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-gray-900">
                            {isFr ? 'Boutiques Officielles' : 'Official Storefronts'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {isFr ? 'Découvrez des marques et boutiques locales' : 'Discover top local brands and shops'}
                        </p>
                    </div>

                    <div className="flex-1 max-w-xl w-full flex items-center gap-2">
                        <div className="relative flex-1 flex items-center">
                            <input
                                type="text"
                                placeholder={isFr ? 'Rechercher une boutique...' : 'Search stores...'}
                                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-sm"
                            />
                            <div className="absolute right-0 top-0 bottom-0 w-12 bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center rounded-r-md cursor-pointer border border-[#febd69]">
                                <Search className="h-5 w-5 text-gray-900" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar: Filters */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="bg-white p-4 border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3 text-sm">Category</h3>
                            <ul className="space-y-2 text-sm">
                                {FILTER_CATEGORIES.map((cat) => {
                                    const isActive = categoryFilter === cat.slug || (!categoryFilter && cat.slug === 'all')
                                    return (
                                        <li key={cat.slug}>
                                            <Link
                                                href={`/${locale}/vendors?category=${cat.slug}`}
                                                className={`hover:text-[#c45500] hover:underline ${isActive ? 'font-bold text-[#c45500]' : 'text-gray-900'}`}
                                            >
                                                {cat.name}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>

                            <hr className="my-4 border-gray-200" />

                            <h3 className="font-bold text-gray-900 mb-3 text-sm">Customer Reviews</h3>
                            <div className="space-y-2">
                                <Link href="#" className="flex items-center gap-1 hover:text-[#c45500]">
                                    <div className="flex"><Star className="w-4 h-4 fill-[#ffa41c] text-[#ffa41c]" /><Star className="w-4 h-4 fill-[#ffa41c] text-[#ffa41c]" /><Star className="w-4 h-4 fill-[#ffa41c] text-[#ffa41c]" /><Star className="w-4 h-4 fill-[#ffa41c] text-[#ffa41c]" /><Star className="w-4 h-4 text-[#ffa41c]" /></div>
                                    <span className="text-sm text-gray-900">& Up</span>
                                </Link>
                                <Link href="#" className="flex items-center gap-1 hover:text-[#c45500]">
                                    <div className="flex"><Star className="w-4 h-4 fill-[#ffa41c] text-[#ffa41c]" /><Star className="w-4 h-4 fill-[#ffa41c] text-[#ffa41c]" /><Star className="w-4 h-4 fill-[#ffa41c] text-[#ffa41c]" /><Star className="w-4 h-4 text-[#ffa41c]" /><Star className="w-4 h-4 text-[#ffa41c]" /></div>
                                    <span className="text-sm text-gray-900">& Up</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Vendor List */}
                    <div className="lg:col-span-10 flex flex-col gap-4">
                        {vendors.map((vendor) => (
                            <div key={vendor.id} className="bg-white border border-gray-200 hover:shadow-sm transition-shadow">
                                <div className="flex flex-col md:flex-row p-4 gap-6">

                                    {/* Vendor Info Details (Left) */}
                                    <div className="flex items-start gap-4 md:w-1/3 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-4">
                                        {/* Logo */}
                                        <div className="w-20 h-20 shrink-0 border border-gray-200 rounded-full flex items-center justify-center bg-gray-50 overflow-hidden relative">
                                            {vendor.logo ? (
                                                <Image src={vendor.logo} alt={vendor.businessName} fill className="object-cover" />
                                            ) : (
                                                <Store className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col h-full justify-center">
                                            <Link href={`/${locale}/vendors/${vendor.id}`} className="hover:underline">
                                                <h2 className="text-lg font-bold text-[#007185] hover:text-[#c45500] leading-tight mb-1">
                                                    {vendor.businessName}
                                                </h2>
                                            </Link>

                                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>{vendor.city}</span>
                                            </div>

                                            <div className="flex items-center gap-1 mb-2">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(vendor.rating) ? 'fill-[#ffa41c] text-[#ffa41c]' : 'fill-transparent text-[#ffa41c]'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-[#007185] ml-1">{vendor.totalReviews}</span>
                                            </div>

                                            <Link href={`/${locale}/vendors/${vendor.id}`} className="mt-auto">
                                                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded shadow-sm border-gray-300 bg-gray-50 hover:bg-gray-100 mt-2">
                                                    {isFr ? 'Visiter la boutique' : 'Visit Storefront'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Top Products Showcase (Right) */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                                                {isFr ? 'Meilleurs Produits' : 'Featured Items'}
                                            </span>
                                            <Link href={`/${locale}/vendors/${vendor.id}`} className="text-xs text-[#007185] hover:text-[#c45500] hover:underline flex items-center">
                                                {isFr ? 'Voir tout' : 'See all'} <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {vendor.products && vendor.products.length > 0 ? (
                                                vendor.products.map(product => (
                                                    <Link key={product.id} href={`/${locale}/products/${product.id}`} className="group block border border-transparent hover:border-gray-200 p-1 transition-colors rounded">
                                                        <div className="aspect-square bg-[#f7f7f7] relative rounded overflow-hidden mb-2">
                                                            <Image
                                                                src={product.images[0] || '/images/product-placeholder.png'}
                                                                alt={isFr ? product.nameFr : product.name}
                                                                fill
                                                                className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                                                            />
                                                        </div>
                                                        <div className="text-[11px] text-[#007185] group-hover:text-[#c45500] group-hover:underline line-clamp-2 leading-tight flex-grow">
                                                            {isFr ? product.nameFr : product.name}
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="col-span-4 flex items-center justify-center p-6 bg-gray-50 text-sm text-gray-500 italic border border-dashed border-gray-200 rounded">
                                                    {isFr ? 'Aucun produit publié.' : 'No items published yet.'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {vendors.length === 0 && (
                            <div className="py-12 text-center text-gray-500 bg-white border border-gray-200">
                                {isFr ? "Aucun vendeur trouvé pour cette catégorie." : "No vendors found for this category."}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
