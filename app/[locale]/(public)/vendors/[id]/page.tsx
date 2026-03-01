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
            category: true,
            products: {
                where: { isActive: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!vendor) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] pb-20">
            {/* Elite Cinematic Hero Section */}
            <div className="relative h-[400px] overflow-hidden bg-black flex items-center justify-center">
                <div className="absolute inset-0 gold-gradient opacity-30" />
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
                    <div className="inline-block px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-xl">
                        ELITE INSTITUTION
                    </div>
                    <h1 className="text-7xl font-display font-black tracking-tighter uppercase italic leading-[0.8] text-white">
                        {vendor.businessName}
                    </h1>
                    <div className="flex items-center justify-center gap-8 pt-4">
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="text-sm font-black text-white">{vendor.rating.toFixed(1)}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">({vendor.totalReviews} RATINGS)</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                            <Check className="w-4 h-4" /> VERIFIED BRAND
                        </div>
                    </div>
                </div>

                {/* Brand Mark */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-[2rem] bg-black border-4 border-[#fafafa] dark:border-[#080808] shadow-2xl overflow-hidden p-2">
                    <div className="relative w-full h-full rounded-2xl bg-white/5 overflow-hidden">
                        <Image src={vendor.logo || '/images/vendor-placeholder.png'} alt={vendor.businessName} fill className="object-cover" />
                    </div>
                </div>
            </div>

            {/* Elite Navbar / Buffer */}
            <div className="pt-24 pb-12 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#111]">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex flex-wrap items-center justify-between gap-8">
                    <nav className="flex gap-10">
                        {['COLLECTIONS', 'ABOUT', 'REVIEWS', 'STORY'].map((item) => (
                            <button key={item} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-all relative group">
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="SEARCH ARCHIVE..."
                                className="bg-gray-100 dark:bg-white/5 border-0 rounded-xl px-6 py-3 text-[9px] font-black uppercase tracking-widest w-[250px] focus:ring-1 focus:ring-primary"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Showroom */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Dossier Sidebar */}
                    <div className="lg:col-span-3 space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">DOSSIER</h3>
                            <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest italic">
                                {vendor.description || "The story of this institution is currently being archived."}
                            </p>
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="space-y-1">
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">ORIGIN</div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase">
                                        <MapPin className="w-3 h-3 text-primary" /> {vendor.city}
                                    </div>
                                </div>
                                <div className="space-y-1 border-t border-white/5 pt-4">
                                    <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">COMMUNICATION</div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase">
                                        <Phone className="w-3 h-3 text-primary" /> {vendor.phone || "STRICTLY DIGITAL"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-elite p-8 rounded-[2rem] dark:bg-[#111] dark:border-white/5 space-y-4">
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">LOYALTY PROGRAM</div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase leading-relaxed tracking-widest">
                                Join the {vendor.businessName} elite circle for priority releases.
                            </p>
                            <button className="w-full h-10 rounded-xl bg-primary text-black text-[9px] font-black uppercase tracking-widest hover:brightness-125 transition-all">
                                SUBSCRIBE
                            </button>
                        </div>
                    </div>

                    {/* Collection Grid */}
                    <div className="lg:col-span-9 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white">
                                {isFr ? 'LA COLLECTION' : 'THE COLLECTION'}
                                <span className="text-gray-400 text-sm font-bold ml-4 tracking-normal not-italic uppercase">({vendor.products.length} ASSETS)</span>
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">SORT BY:</span>
                                <Badge className="bg-white/5 border border-white/10 text-primary text-[9px] font-black rounded-lg px-3">SIGNATURE</Badge>
                            </div>
                        </div>

                        {vendor.products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                                {vendor.products.map(product => (
                                    <ProductCard key={product.id} product={product} locale={locale} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 rounded-[3rem] border border-dashed border-gray-100 dark:border-white/5 flex flex-col items-center justify-center gap-6">
                                <Store className="w-16 h-16 text-gray-200" />
                                <div className="text-center space-y-2">
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest">CURATING ASSETS</h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                        This institution is currently curating their next premier release.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
