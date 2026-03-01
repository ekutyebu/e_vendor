import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Package, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { truncate } from '@/lib/utils'

interface VendorCardProps {
    vendor: {
        id: string
        businessName: string
        logo: string
        description: string
        city: string
        rating: number
        totalReviews: number
        category: { name: string; nameFr: string; color?: string | null }
        _count?: { products: number }
        isActive: boolean
    }
    locale: string
}

export default function VendorCard({ vendor, locale }: VendorCardProps) {
    return (
        <Link href={`/${locale}/vendors/${vendor.id}`} className="group block h-full">
            <div className="relative h-full bg-[#111] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 flex flex-col">
                {/* Elite Header Area */}
                <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 gold-gradient opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10" />
                    
                    {/* Floating Elements */}
                    <div className="absolute top-6 right-6">
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Elite Logo Branding */}
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-24 h-24 rounded-3xl bg-black border-4 border-[#111] shadow-2xl overflow-hidden p-2">
                            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/5">
                                <Image
                                    src={vendor.logo || '/images/vendor-placeholder.png'}
                                    alt={vendor.businessName}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section Elite */}
                <div className="pt-14 pb-8 px-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-display font-black tracking-tighter uppercase italic text-white group-hover:text-primary transition-colors">
                            {vendor.businessName}
                        </h3>
                        {vendor.isActive && (
                            <ShieldCheck className="w-4 h-4 text-primary" />
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <Badge className="bg-white/5 text-gray-400 text-[10px] font-black tracking-widest uppercase border-0 rounded-full px-3">
                            {vendor.category.name}
                        </Badge>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span className="text-[10px] font-black text-white">{vendor.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed font-medium mb-8 line-clamp-2">
                        {vendor.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <MapPin className="w-3 h-3 text-primary" />
                            {vendor.city}
                        </div>
                        {vendor._count && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <Package className="w-3 h-3 text-primary" />
                                {vendor._count.products} ITEMS
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
