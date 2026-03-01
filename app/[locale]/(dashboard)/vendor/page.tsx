import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ShoppingCart,
    Package,
    DollarSign,
    AlertTriangle,
    ArrowUpRight,
    Clock,
    LayoutDashboard,
} from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function VendorOverviewPage({ params }: { params: { locale: string } }) {
    const session = await auth()
    const isFr = params.locale === 'fr'
    
    // Get vendor profile
    const vendor = await prisma.vendor.findUnique({
        where: { userId: session?.user?.id },
        include: {
            products: { take: 5 },
            orders: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { customer: { include: { user: true } } }
            }
        }
    })

    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                    <LayoutDashboard className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">
                        {isFr ? 'BIENVENUE, FUTUR COMMERÇANT' : 'WELCOME, FUTURE MERCHANT'}
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        {isFr ? 'VOTRE EMPIRE ATTEND SON ARCHITECTE. CONFIGURONS VOTRE BOUTIQUE.' : 'YOUR EMPIRE AWAITS ITS ARCHITECT. LET\'S CONFIGURE YOUR STOREFRONT.'}
                    </p>
                </div>
                <Button asChild className="h-14 px-8 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    <Link href={`/${params.locale}/dashboard/vendor/settings`}>
                        {isFr ? 'COMMENCER LA CONFIGURATION' : 'INITIALIZE CONFIGURATION'}
                    </Link>
                </Button>
            </div>
        )
    }

    // Dynamic stats (real data)
    const totalProducts = await prisma.product.count({ where: { vendorId: vendor.id } })
    const totalOrders = await prisma.order.count({ where: { vendorId: vendor.id } })
    const pendingOrders = await prisma.order.count({ where: { vendorId: vendor.id, status: 'PENDING' } })
    const totalRevenue = await prisma.order.aggregate({
        where: { vendorId: vendor.id, paymentStatus: 'PAID' },
        _sum: { total: true }
    })

    const STATS = [
        {
            title: 'Total Revenue',
            titleFr: 'Chiffre d\'affaires',
            value: `${(totalRevenue._sum.total || 0).toLocaleString()} FCFA`,
            change: 'LIVE',
            trend: 'up',
            icon: DollarSign,
        },
        {
            title: 'Total Orders',
            titleFr: 'Total Commandes',
            value: totalOrders.toString(),
            change: 'SYNCED',
            trend: 'up',
            icon: ShoppingCart,
        },
        {
            title: 'Active Products',
            titleFr: 'Produits actifs',
            value: totalProducts.toString(),
            change: 'MANAGED',
            trend: 'up',
            icon: Package,
        },
        {
            title: 'Pending Orders',
            titleFr: 'Commandes en attente',
            value: pendingOrders.toString(),
            change: pendingOrders > 5 ? 'URGENT' : 'STABLE',
            trend: pendingOrders > 0 ? 'up' : 'down',
            icon: Clock,
        },
    ]

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Elite Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">MERCHANT COMMAND</div>
                    <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                        {isFr ? `SALUTATIONS, ${vendor.businessName.toUpperCase()}` : `GREETINGS, ${vendor.businessName.toUpperCase()}`}
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {isFr ? 'VOTRE EMPIRE EST SOUS CONTRÔLE' : 'YOUR EMPIRE IS UNDER OPTIMAL CONTROL'}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-[#111] border border-white/5 px-6 py-3 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_emerald]" />
                    <span className="text-[10px] font-black text-white dark:text-white uppercase tracking-widest">SYSTEM OPERATIONAL</span>
                </div>
            </div>

            {/* Elite Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.title} className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-8 transition-all hover:border-primary/30">
                            <div className="absolute inset-0 gold-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-black dark:bg-white/5 flex items-center justify-center text-primary">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{isFr ? stat.titleFr : stat.title}</div>
                                    <div className="text-3xl font-display font-black tracking-tighter text-gray-900 dark:text-white italic">
                                        {stat.value}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recent Orders Elite */}
            <div className="rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em]">ORDER MANIFEST</div>
                    <Link href={`/${params.locale}/dashboard/vendor/orders`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:brightness-125 flex items-center gap-2">
                        ALL TRANSACTIONS <ArrowUpRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">IDENTIFIER</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">CLIENT</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">STATUS</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">VALUATION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {vendor.orders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                        {isFr ? 'Aucune commande pour le moment' : 'No transactions recorded in the current cycle'}
                                    </td>
                                </tr>
                            ) : (
                                vendor.orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{order.id}</div>
                                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic">{order.customer.user.name}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge className={`bg-white/5 border border-white/10 text-[9px] font-black uppercase rounded-lg px-3 ${
                                                order.status === 'DELIVERED' ? 'text-emerald-500 border-emerald-500/30' : 
                                                order.status === 'PENDING' ? 'text-orange-500 border-orange-500/30' : 'text-primary'
                                            }`}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="text-sm font-display font-black italic text-gray-900 dark:text-white">{order.total.toLocaleString()} FCFA</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
