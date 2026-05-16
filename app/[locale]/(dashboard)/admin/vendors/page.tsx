import { getLocale } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
    Store, 
    ShieldCheck, 
    ShieldAlert, 
    MoreHorizontal, 
    ExternalLink, 
    Mail, 
    Phone,
    MapPin,
    Search,
    TrendingUp,
    ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminVendorsPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect(`/${locale}/signin`)
    }

    const vendors = await prisma.vendor.findMany({
        include: {
            user: true,
            category: true,
            _count: {
                select: { products: true, orders: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                        {isFr ? 'Gestion des Vendeurs' : 'Vendor Management'}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {isFr ? 'Surveiller et approuver les marchands du marché.' : 'Monitor and approve marketplace merchants.'}
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                    <ShieldCheck className="w-4 h-4" /> {isFr ? 'Approbation en Masse' : 'Bulk Approve'}
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-white/5 border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg">
                            <Store className="w-6 h-6" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-0">+12%</Badge>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        {isFr ? 'Total Vendeurs' : 'Total Vendors'}
                    </p>
                    <p className="text-3xl font-black">{vendors.length}</p>
                </div>
                <div className="bg-white dark:bg-white/5 border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-lg">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-green-600 italic">{isFr ? 'Vérifié' : 'Verified'}</p>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        {isFr ? 'Partenaires Vérifiés' : 'Verified Partners'}
                    </p>
                    <p className="text-3xl font-black">{vendors.filter(v => v.onboardingStatus === 'APPROVED').length}</p>
                </div>
                <div className="bg-white dark:bg-white/5 border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 rounded-lg">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                            {isFr ? 'Action Requise' : 'Action Required'}
                        </Badge>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        {isFr ? 'En attente' : 'Pending Approval'}
                    </p>
                    <p className="text-3xl font-black">{vendors.filter(v => v.onboardingStatus === 'PENDING' || v.onboardingStatus === 'NEEDS_CORRECTION').length}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-white/5 border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b bg-gray-50/30 dark:bg-white/5 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder={isFr ? "Rechercher par nom, email ou ville..." : "Search by name, email or city..."} 
                            className="pl-9 bg-white dark:bg-transparent" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-gray-50/50 dark:bg-white/5 border-b">
                                <th className="px-6 py-4">{isFr ? 'Vendeur' : 'Vendor'}</th>
                                <th className="px-6 py-4">{isFr ? 'Statut' : 'Status'}</th>
                                <th className="px-6 py-4">{isFr ? 'Inventaire' : 'Inventory'}</th>
                                <th className="px-6 py-4">{isFr ? 'Ventes' : 'Sales'}</th>
                                <th className="px-6 py-4">{isFr ? 'Localisation' : 'Location'}</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50/30 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-gray-50 flex-shrink-0">
                                                <Image src={vendor.logo || '/images/placeholder.png'} alt={vendor.businessName} fill className="object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm leading-tight">{vendor.businessName}</span>
                                                <span className="text-[11px] text-muted-foreground">{vendor.businessEmail}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {vendor.onboardingStatus === 'APPROVED' ? (
                                            <Badge className="bg-green-100 text-green-700 border-0 text-[10px] gap-1 font-bold uppercase">
                                                <ShieldCheck className="w-3 h-3" /> {isFr ? 'VÉRIFIÉ' : 'VERIFIED'}
                                            </Badge>
                                        ) : vendor.onboardingStatus === 'REJECTED' ? (
                                            <Badge className="bg-red-100 text-red-700 border-0 text-[10px] gap-1 font-bold uppercase">
                                                <ShieldAlert className="w-3 h-3" /> {isFr ? 'REJETÉ' : 'REJECTED'}
                                            </Badge>
                                        ) : vendor.onboardingStatus === 'NEEDS_CORRECTION' ? (
                                            <Badge className="bg-orange-100 text-orange-700 border-0 text-[10px] gap-1 font-bold uppercase">
                                                <ShieldAlert className="w-3 h-3" /> {isFr ? 'CORRECTION' : 'CORRECTION'}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 text-[10px] gap-1 font-bold bg-yellow-50 uppercase">
                                                <ShieldAlert className="w-3 h-3" /> {isFr ? 'EN ATTENTE' : 'PENDING'}
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{vendor._count.products} {isFr ? 'Produits' : 'Products'}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {isFr ? vendor.category.nameFr : vendor.category.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-bold">
                                            <TrendingUp className="w-3 h-3 text-green-500" />
                                            <span>{vendor._count.orders}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3" /> {vendor.city}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/${locale}/admin/vendors/${vendor.id}/review`}>
                                                <Button variant="outline" size="sm" className="h-8 font-black text-[10px] uppercase tracking-widest gap-2">
                                                    {isFr ? 'Examiner' : 'Review Application'} <ArrowRight className="w-3 h-3" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
