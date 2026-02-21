import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Truck, Shield, Store, Check, Lock, MapPin } from 'lucide-react'
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

    if (!product || !product.isPublished) {
        notFound()
    }

    const displayName = isFr ? product.nameFr : product.name
    const displayDescription = isFr ? product.descriptionFr : product.description
    const isOutOfStock = product.stock === 0

    return (
        <div className="bg-white min-h-screen py-4">
            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb (Amazon Style) */}
                <nav className="flex text-xs text-gray-500 mb-6">
                    <ol className="flex items-center space-x-1">
                        <li>
                            <Link href={`/${locale}`} className="hover:underline">Home</Link>
                        </li>
                        <li><span className="text-gray-400 font-bold mx-1">›</span></li>
                        <li>
                            <Link href={`/${locale}/vendors?category=${product.category.slug}`} className="hover:underline">
                                {isFr ? product.category.nameFr : product.category.name}
                            </Link>
                        </li>
                        <li><span className="text-gray-400 font-bold mx-1">›</span></li>
                        <li className="text-gray-500 truncate max-w-[300px]" aria-current="page">
                            {displayName}
                        </li>
                    </ol>
                </nav>

                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Image Gallery (Col 1-5) */}
                    <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
                        {/* Thumbnails (Left side on desktop) */}
                        <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-visible sm:w-16 shrink-0">
                            {product.images.map((img, i) => (
                                <button key={i} className={`w-12 h-12 rounded border ${i === 0 ? 'border-[#007185] shadow-sm' : 'border-gray-200'} hover:border-[#007185] bg-white p-1 relative`}>
                                    <Image src={img} fill alt="" className="object-contain p-1" />
                                </button>
                            ))}
                        </div>
                        {/* Main Image */}
                        <div className="flex-1 relative aspect-square sm:aspect-auto sm:min-h-[500px] rounded p-4 bg-white border border-gray-100/50">
                            {product.images[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={displayName}
                                    fill
                                    className="object-contain mix-blend-multiply"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                    No Image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column: Info & Details (Col 6-10) */}
                    <div className="lg:col-span-4 flex flex-col">

                        {/* Title Section */}
                        <div className="border-b border-gray-200 pb-2 mb-3">
                            <h1 className="text-[24px] font-medium text-gray-900 leading-tight mb-1">
                                {displayName}
                            </h1>
                            <Link href={`/${locale}/vendors/${product.vendor.id}`} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">
                                Visit the {product.vendor.businessName} Store
                            </Link>

                            {/* Ratings (Amazon Style) */}
                            <div className="flex items-center gap-4 mt-2 mb-2">
                                <div className="flex items-center gap-1 cursor-pointer group">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-[#ffa41c] text-[#ffa41c]' : 'fill-transparent text-[#ffa41c]'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[#007185] group-hover:text-[#c45500] group-hover:underline text-sm ml-2">
                                        {product.totalReviews} ratings
                                    </span>
                                </div>
                            </div>

                            <div className="mb-2">
                                <span className="inline-flex text-xs font-bold text-white bg-[#232f3e] px-1.5 py-0.5 relative before:absolute before:border-[5px] before:border-transparent before:border-l-[#232f3e] before:border-t-[#232f3e] before:-right-2.5 before:top-0 h-6 items-center">
                                    INOVAMARK <span className="text-[#f69a19] ml-1">Choice</span>
                                </span>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="mb-4">
                            <div className="flex items-start">
                                <span className="text-sm font-medium text-gray-900 mt-1">FCFA</span>
                                <span className="text-3xl font-medium text-gray-900 mx-1">
                                    {formatPrice(product.price).replace('£', '').replace('FCFA', '').trim()}
                                </span>
                            </div>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span>List Price: <span className="line-through">{formatPrice(product.compareAtPrice)}</span></span>
                                    <span className="text-[#cc0c39]">
                                        Save {formatPrice(product.compareAtPrice - product.price)}
                                    </span>
                                </div>
                            )}
                            <div className="text-sm text-gray-500 mt-1">
                                {isFr ? 'Taxes incluses.' : 'Taxes included.'}
                            </div>
                        </div>

                        {/* Faux Variations / Options */}
                        <div className="border-t border-gray-200 py-4 mt-2">
                            <div className="text-sm font-bold text-gray-900 mb-2">Category: {product.category.name}</div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="rounded-sm px-4 py-2 border-[#ffba00] bg-[#fffbf0] text-gray-900 shadow-[0_0_0_1px_#ffba00] cursor-pointer">
                                    Standard
                                </Badge>
                                {product.stock > 0 && product.stock <= 5 && (
                                    <Badge variant="outline" className="rounded-none px-2 py-1 border-[#cc0c39] text-[#cc0c39] ml-auto">
                                        Only {product.stock} left
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* About this item (Bullets) */}
                        <div className="border-t border-gray-200 py-4 mt-2">
                            <h3 className="font-bold text-gray-900 mb-2 text-base">
                                {isFr ? 'À propos de cet article' : 'About this item'}
                            </h3>
                            <div className="prose prose-sm text-gray-900 leading-snug">
                                {displayDescription ? (
                                    <ul className="list-disc pl-5 space-y-1.5 marker:text-gray-500">
                                        {/* Fake splitting text into bullets if no newlines exist, or just map lines */}
                                        {displayDescription.split('\n').filter(l => l.trim().length > 0).map((line, idx) => (
                                            <li key={idx}><span>{line}</span></li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="italic">{isFr ? 'Aucune description fournie.' : 'No description provided.'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: The Buy Box (Col 11-12) */}
                    <div className="lg:col-span-3">
                        <div className="border border-gray-300 rounded-lg p-4 bg-white sticky top-20 shadow-sm">

                            {/* Price */}
                            <div className="flex items-start mb-4">
                                <span className="text-sm font-bold text-gray-900 mt-1">FCFA</span>
                                <span className="text-3xl font-bold text-gray-900 mx-1">
                                    {formatPrice(product.price).replace('£', '').replace('FCFA', '').trim()}
                                </span>
                            </div>

                            {/* Delivery Mock */}
                            <div className="mb-4 text-sm">
                                <div className="text-gray-900">
                                    Delivery <span className="font-bold">Tomorrow</span>
                                </div>
                                <div className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer flex items-center gap-1 mt-1">
                                    <MapPin className="w-4 h-4 text-gray-600" />
                                    <span>Deliver to Cameroon</span>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-4">
                                {isOutOfStock ? (
                                    <span className="text-[#cc0c39] text-xl font-medium">{isFr ? 'Actuellement indisponible.' : 'Currently unavailable.'}</span>
                                ) : (
                                    <span className="text-[#007600] text-lg font-medium">{isFr ? 'En Stock' : 'In Stock'}</span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {!isOutOfStock && (
                                <div className="space-y-2.5 mb-4">
                                    {/* Quantity Dropdown Mock */}
                                    <div className="mb-3">
                                        <select className="bg-[#f0f2f2] border border-[#d5d9d9] rounded-[8px] px-2 py-1 text-sm shadow-sm hover:bg-[#e3e6e6] w-auto inline-block focus:outline-none focus:ring-2 focus:ring-[#007185]">
                                            <option value="1">Qty: 1</option>
                                            <option value="2">Qty: 2</option>
                                            <option value="3">Qty: 3</option>
                                        </select>
                                    </div>

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
                                        className="w-full rounded-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-sm shadow-none border border-[#fcd200] font-normal"
                                        fullWidth
                                        text={isFr ? 'Ajouter au panier' : 'Add to Cart'}
                                    />

                                    {/* Mock Buy Now Button */}
                                    <button className="w-full rounded-full py-2 bg-[#ffa41c] hover:bg-[#fa8900] text-gray-900 text-sm shadow-none border border-[#ff8f00] font-normal transition-colors">
                                        {isFr ? 'Acheter maintenant' : 'Buy Now'}
                                    </button>
                                </div>
                            )}

                            {/* Secure Transaction */}
                            <div className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer mb-4">
                                <Lock className="w-4 h-4 text-gray-500" />
                                Secure transaction
                            </div>

                            {/* Ships from / Sold By */}
                            <div className="text-xs text-gray-500 space-y-1 mb-4 border-b border-gray-200 pb-4">
                                <div className="grid grid-cols-[80px_1fr]">
                                    <span>Ships from</span>
                                    <span className="text-gray-900">INOVAMARK</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr]">
                                    <span>Sold by</span>
                                    <span className="text-[#007185] hover:underline cursor-pointer">{product.vendor.businessName}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr]">
                                    <span>Returns</span>
                                    <span className="text-[#007185] hover:underline cursor-pointer">Eligible for Return</span>
                                </div>
                            </div>

                            {/* Add to List Mock */}
                            <div className="mt-4">
                                <button className="w-full text-left text-sm py-1.5 px-3 border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors">
                                    Add to List
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <hr className="my-10 border-gray-200" />

                {/* Additional Information Section (Amazon lower page) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Vendor block */}
                    <div className="lg:col-span-1">
                        <div className="mb-4">
                            <h3 className="font-bold text-gray-900 mb-2">Buy it with</h3>
                            {/* Mock up-sell */}
                            <div className="p-4 border border-gray-200 rounded text-center">
                                <Image src={product.images[0] || '/placeholder.png'} alt="" width={80} height={80} className="mx-auto mb-2 mix-blend-multiply" />
                                <div className="text-[#cc0c39] font-bold text-lg">{formatPrice(product.price)}</div>
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
                                    className="w-full rounded-2xl py-1 mt-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-xs shadow-none border border-[#fcd200]"
                                    fullWidth
                                    text="Add to Cart"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Details Table Area */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-[#c45500] mb-4">Product details</h2>
                        <div className="bg-white p-4">
                            <table className="text-sm w-full sm:w-1/2">
                                <tbody>
                                    <tr className="border-b border-gray-100"><td className="py-2 text-gray-500 font-bold bg-gray-50 w-1/3 px-2">Brand</td><td className="py-2 px-2 text-gray-900">{product.vendor.businessName}</td></tr>
                                    <tr className="border-b border-gray-100"><td className="py-2 text-gray-500 font-bold bg-gray-50 w-1/3 px-2">Color</td><td className="py-2 px-2 text-gray-900">Standard</td></tr>
                                    <tr className="border-b border-gray-100"><td className="py-2 text-gray-500 font-bold bg-gray-50 w-1/3 px-2">Category</td><td className="py-2 px-2 text-gray-900">{product.category.name}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer reviews</h2>
                            <div className="flex items-center gap-4">
                                <div className="text-5xl font-normal text-gray-900">{product.rating.toFixed(1)}</div>
                                <div className="text-lg text-gray-500">out of 5</div>
                            </div>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`w-6 h-6 ${star <= Math.round(product.rating) ? 'fill-[#ffa41c] text-[#ffa41c]' : 'fill-transparent text-[#ffa41c]'}`} />
                                ))}
                            </div>
                            <p className="text-gray-500 text-sm mt-1">{product.totalReviews} global ratings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
