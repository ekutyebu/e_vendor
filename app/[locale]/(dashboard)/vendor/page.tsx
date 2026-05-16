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
    Star,
    TrendingDown,
    User,
    MessageSquare,
    CheckCircle2
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
            products: { 
                orderBy: { totalReviews: 'desc' },
                take: 5 
            },
            orders: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { customer: { include: { user: true } } }
            },
            vendorReviews: {
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
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
                    <Link href={`/${params.locale}/become-vendor`}>
                        {isFr ? 'COMMENCER LA CONFIGURATION' : 'INITIALIZE CONFIGURATION'}
                    </Link>
                </Button>
            </div>
        )
    }

    // Onboarding Status Check
    if (vendor.onboardingStatus !== 'APPROVED') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in max-w-2xl mx-auto">
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-xl ${
                    vendor.onboardingStatus === 'REJECTED' ? 'bg-red-500/10 text-red-600' :
                    vendor.onboardingStatus === 'NEEDS_CORRECTION' ? 'bg-orange-500/10 text-orange-600' :
                    'bg-yellow-500/10 text-yellow-600 animate-pulse'
                }`}>
                    <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic dark:text-white">
                        {vendor.onboardingStatus === 'PENDING' ? (isFr ? 'EXAMEN EN COURS' : 'REVIEW IN PROGRESS') : 
                         vendor.onboardingStatus === 'REJECTED' ? (isFr ? 'DEMANDE REJETÉE' : 'APPLICATION REJECTED') :
                         (isFr ? 'CORRECTIONS REQUISES' : 'CORRECTIONS REQUIRED')}
                    </h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        {vendor.onboardingStatus === 'PENDING' 
                            ? (isFr ? 'Nos administrateurs vérifient vos documents. Vous recevrez un e-mail sous peu.' : 'Our administrators are verifying your identity and documents. You will receive an email shortly.')
                            : vendor.onboardingStatus === 'REJECTED'
                            ? (isFr ? `Malheureusement, votre demande a été rejetée: ${vendor.rejectionReason}` : `Unfortunately, your application was rejected: ${vendor.rejectionReason}`)
                            : (isFr ? `Veuillez corriger les points suivants: ${vendor.rejectionReason}` : `Please correct the following issues: ${vendor.rejectionReason}`)}
                    </p>
                </div>
                {vendor.onboardingStatus !== 'PENDING' && (
                    <Button asChild className="h-16 px-10 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-xs">
                        <Link href={`/${params.locale}/become-vendor`}>
                            {isFr ? 'METTRE À JOUR LES INFORMATIONS' : 'UPDATE INFORMATION'}
                        </Link>
                    </Button>
                )}
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
    const avgRating = await prisma.vendorReview.aggregate({
        where: { vendorId: vendor.id },
        _avg: { rating: true }
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
            title: 'Satisfaction',
            titleFr: 'Satisfaction',
            value: `${(avgRating._avg.rating || 0).toFixed(1)} / 5`,
            change: 'SYNCED',
            trend: 'up',
            icon: Star,
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

            {/* Analytics & Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sales Chart (Mock SVG) */}
                <div className="lg:col-span-2 rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em]">SALES TRAJECTORY</div>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[10px] font-black italic">+24% THIS MONTH</Badge>
                    </div>
                    <div className="h-64 w-full bg-gray-50 dark:bg-white/[0.02] rounded-3xl relative overflow-hidden flex items-end px-4 pb-4 gap-2">
                        {/* Mock SVG Chart */}
                        {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {(h * 1000).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                        <span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
                    </div>
                </div>

                {/* Best Reviews */}
                <div className="rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-8 space-y-6">
                    <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em]">ELITE FEEDBACK</div>
                    <div className="space-y-4">
                        {vendor.vendorReviews.length === 0 ? (
                            <p className="text-[10px] text-gray-500 font-bold uppercase italic text-center py-10">No reviews yet</p>
                        ) : (
                            vendor.vendorReviews.map(review => (
                                <div key={review.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 space-y-2 border border-transparent hover:border-primary/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-black">
                                                {review.user.name[0]}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tight">{review.user.name}</span>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-2 h-2 ${i < review.rating ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <Button variant="ghost" className="w-full h-12 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5">
                        VIEW ALL REVIEWS
                    </Button>
                </div>
            </div>

            {/* Recent Orders & Product Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Orders */}
                <div className="rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em]">ORDER MANIFEST</div>
                        <Link href={`/${params.locale}/vendor/orders`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:brightness-125 flex items-center gap-2">
                            ALL ORDERS <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">ID</th>
                                    <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">VALUATION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {vendor.orders.length === 0 ? (
                                    <tr><td colSpan={2} className="px-8 py-10 text-center text-[10px] font-bold text-gray-500 uppercase">Empty Manifest</td></tr>
                                ) : (
                                    vendor.orders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">#{order.id.slice(-6)}</div>
                                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">{order.customer.user.name}</div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-sm font-display font-black italic text-gray-900 dark:text-white">{order.total.toLocaleString()}</div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Product Performance */}
                <div className="rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em]">PRODUCT LEVELS</div>
                        <Link href={`/${params.locale}/vendor/products`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:brightness-125 flex items-center gap-2">
                            INVENTORY <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">PRODUCT</th>
                                    <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">RATING</th>
                                    <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">STOCK</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {vendor.products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">{product.name}</div>
                                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">SKU: {product.sku}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-primary text-primary" />
                                                <span className="text-[10px] font-black">{product.rating.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Badge variant="outline" className={`text-[9px] font-black border-white/10 ${product.stock < 10 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {product.stock} UNITS
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
