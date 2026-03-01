import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Phone, Check, Store, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/shared/ProductCard'

export default async function VendorStorefrontPage({
    params,
}: {
    params: { locale: string; id: string }
}) {
    const locale = params.locale
    const isFr = locale === 'fr'

    const vendor = await prisma.vendor.findUnique({
        where: { id: params.id },
        include: {
            user: {
                select: { name: true, email: true }
            },
            storeCategory: true,
            category: true,
            products: {
                where: { isPublished: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!vendor) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-[#eaeded] pb-20">

            {/* Amazon Style Store Header / Banner */}
            <div className="bg-white border-b border-gray-300 shadow-sm relative z-10">
                <div className="max-w-[1500px] mx-auto">
                    {/* Banner Image Placeholder */}
                    <div className="h-32 md:h-48 bg-gray-900 relative overflow-hidden group">
                        {/* Could be an actual banner image, using a pattern for now */}
                        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                        <div className="absolute bottom-4 left-4 sm:left-6 lg:left-8 flex items-end gap-4 z-10">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded shadow-md overflow-hidden border-2 border-white shrink-0 flex items-center justify-center">
                                {vendor.storeLogo ? (
                                    <Image src={vendor.storeLogo} alt={vendor.storeName} width={96} height={96} className="object-cover w-full h-full" />
                                ) : (
                                    <Store className="w-10 h-10 text-gray-400" />
                                )}
                            </div>
                            <div className="pb-1 text-white">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-md">
                                    {vendor.storeName}
                                </h1>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-200">
                                    <Badge variant="outline" className="border-gray-400 text-gray-200 bg-black/30 hover:bg-black/50 transition-colors">
                                        {vendor.storeCategory?.name || 'Store'}
                                    </Badge>
                                    <div className="flex items-center text-[#ffa41c]">
                                        <Star className="w-4 h-4 fill-current mr-1 text-[#ffa41c]" />
                                        <span className="font-bold">{vendor.rating.toFixed(1)}</span>
                                        <span className="text-gray-300 font-normal ml-1">({vendor.totalReviews} ratings)</span>
                                    </div>
                                    <div className="hidden sm:flex items-center text-emerald-400 font-medium">
                                        <Check className="w-4 h-4 mr-0.5" /> Verified Brand
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Navbar */}
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-12 border-b border-gray-200 bg-white">
                        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto scrollbar-hide h-full">
                            <Link href="#" className="flex items-center px-2 h-full border-b-2 border-[#e77600] text-[#e77600] font-bold text-sm whitespace-nowrap">
                                {isFr ? 'Accueil' : 'Home'}
                            </Link>
                            <Link href="#" className="flex items-center px-2 h-full border-b-2 border-transparent text-gray-700 hover:text-[#e77600] hover:border-gray-300 font-medium text-sm whitespace-nowrap transition-colors">
                                {isFr ? 'Tous les produits' : 'All Products'}
                            </Link>
                            <Link href="#" className="flex items-center px-2 h-full border-b-2 border-transparent text-gray-700 hover:text-[#e77600] hover:border-gray-300 font-medium text-sm whitespace-nowrap transition-colors">
                                {isFr ? 'À propos' : 'About'}
                            </Link>
                            <Link href="#" className="flex items-center px-2 h-full border-b-2 border-transparent text-gray-700 hover:text-[#e77600] hover:border-gray-300 font-medium text-sm whitespace-nowrap transition-colors">
                                {isFr ? 'Avis' : 'Reviews'}
                            </Link>
                        </nav>

                        <div className="hidden md:flex items-center relative">
                            <input
                                type="text"
                                placeholder={isFr ? 'Rechercher dans cette boutique...' : 'Search in this store...'}
                                className="pl-3 pr-8 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-sm w-48 lg:w-64"
                            />
                            <Search className="h-4 w-4 text-gray-500 absolute right-2" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Content */}
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Left Sidebar (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white border border-gray-300 p-4 sticky top-4">
                            <h3 className="font-bold text-gray-900 mb-2 border-b border-gray-200 pb-2">
                                {isFr ? 'À propos de cette boutique' : 'About this Store'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                {vendor.storeDescription || (isFr ? 'Aucune description fournie.' : 'No description provided.')}
                            </p>

                            <div className="space-y-3 text-sm text-gray-600 border-t border-gray-200 pt-3">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                    <span>{vendor.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span>{vendor.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Products Grid */}
                    <div className="lg:col-span-3">
                        <div className="bg-white p-4 mb-4 border border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">
                                {isFr ? 'Tous les produits' : 'All Products'} <span className="text-gray-500 text-sm font-normal">({vendor.products.length})</span>
                            </h2>
                            <Button variant="outline" size="sm" className="hidden sm:flex text-sm">
                                {isFr ? 'Trier par : En vedette' : 'Sort by: Featured'}
                            </Button>
                        </div>

                        {vendor.products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {vendor.products.map(product => (
                                    <ProductCard key={product.id} product={product} locale={locale} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-white border border-gray-200">
                                <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    {isFr ? 'Aucun produit trouvé' : 'No products found'}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {isFr ? 'Ce vendeur n\'a pas encore publié de produits.' : 'This seller hasn\'t published any products yet.'}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
