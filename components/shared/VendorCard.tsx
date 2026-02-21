import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Package } from 'lucide-react'
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
        <Link href={`/${locale}/vendors/${vendor.id}`} className="group block">
            <Card className="h-full overflow-hidden card-hover border-0 shadow-md group-hover:shadow-xl transition-all duration-300">
                {/* Cover / Logo Area */}
                <div className="relative h-32 gradient-brand overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 to-cyan-600/60" />
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                            backgroundSize: '30px 30px',
                        }}
                    />
                    {/* Logo */}
                    <div className="absolute -bottom-6 left-4">
                        <div className="w-14 h-14 rounded-xl bg-white shadow-lg overflow-hidden border-2 border-white">
                            <Image
                                src={vendor.logo || '/images/vendor-placeholder.png'}
                                alt={vendor.businessName}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    {/* Status */}
                    {vendor.isActive && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="success" className="text-xs">✓ Verified</Badge>
                        </div>
                    )}
                </div>

                <CardContent className="pt-8 pb-4 px-4">
                    <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                            {vendor.businessName}
                        </h3>
                    </div>

                    <Badge
                        variant="outline"
                        className="text-xs mb-2 border-blue-200 text-blue-700 bg-blue-50"
                    >
                        {vendor.category.name}
                    </Badge>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {truncate(vendor.description, 80)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{vendor.city}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {vendor._count && (
                                <div className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    <span>{vendor._count.products}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-gray-700 font-medium">
                                    {vendor.rating > 0 ? vendor.rating.toFixed(1) : 'New'}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
