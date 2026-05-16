import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { 
    Store, 
    Users, 
    ShoppingCart, 
    DollarSign, 
    ArrowUpRight, 
    CheckCircle, 
    XCircle, 
    Clock, 
    TrendingUp, 
    BarChart3,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    Activity
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function AdminOverviewPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect(`/${locale}/signin`)
    }

    // Fetch real data
    const totalVendors = await prisma.vendor.count()
    const pendingVendors = await prisma.vendor.count({ where: { onboardingStatus: 'PENDING' } })
    const totalUsers = await prisma.user.count()
    const totalRevenue = await prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true }
    })

    const pendingApprovals = await prisma.vendor.findMany({
        where: { onboardingStatus: 'PENDING' },
        include: { user: true, category: true },
        take: 3,
        orderBy: { createdAt: 'desc' }
    })

    const STATS = [
        { 
            title: isFr ? 'Total Vendeurs' : 'Total Vendors', 
            value: totalVendors.toString(), 
            change: '+5%', 
            icon: Store, 
            color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' 
        },
        { 
            title: isFr ? 'Révisions en attente' : 'Pending Reviews', 
            value: pendingVendors.toString(), 
            change: pendingVendors > 0 ? (isFr ? 'Action Requise' : 'Action Required') : (isFr ? 'Tout est clair' : 'All Clear'), 
            icon: Clock, 
            color: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10' 
        },
        { 
            title: isFr ? 'Utilisateurs Actifs' : 'Active Users', 
            value: totalUsers.toString(), 
            change: '+12%', 
            icon: Users, 
            color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10' 
        },
        { 
            title: isFr ? 'Volume Brut' : 'Gross Volume', 
            value: `${(totalRevenue._sum.total || 0).toLocaleString()} FCFA`, 
            change: '+18%', 
            icon: DollarSign, 
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' 
        },
    ]

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Elite Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-block text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">
                        {isFr ? 'Commandement Central' : 'Central Command'}
                    </div>
                    <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                        {isFr ? 'Contrôle Plateforme' : 'Platform Control'}
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {isFr ? 'Surveillance de la santé du marché mondial' : 'Monitoring global marketplace health'}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-[#111] border border-white/5 px-6 py-3 rounded-2xl shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_emerald]" />
                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">
                        {isFr ? 'Systèmes Connectés' : 'Core Systems Online'}
                    </span>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.title} className="group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-8 transition-all hover:shadow-2xl hover:shadow-blue-500/5">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[10px] font-black italic">{stat.change}</Badge>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
                                    <p className="text-3xl font-black tracking-tighter italic">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Platform Growth Chart */}
                <div className="lg:col-span-2 rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                                {isFr ? 'Analyse de Croissance' : 'Growth Analysis'}
                            </h3>
                            <p className="text-2xl font-black italic">
                                {isFr ? 'Acquisition & Ventes' : 'User Acquisition & Sales'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase">
                                {isFr ? 'Utilisateurs' : 'Users'}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase">
                                {isFr ? 'Revenu' : 'Revenue'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-72 w-full flex items-end justify-between px-2 pb-6 relative group">
                        {/* Grid lines */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gray-100 dark:bg-white/5" />
                        <div className="absolute inset-x-0 top-1/4 h-px bg-gray-100 dark:bg-white/5" />
                        <div className="absolute inset-x-0 top-2/4 h-px bg-gray-100 dark:bg-white/5" />
                        <div className="absolute inset-x-0 top-3/4 h-px bg-gray-100 dark:bg-white/5" />

                        {/* Mock SVG Chart bars */}
                        {[30, 45, 25, 60, 40, 85, 55, 90, 70, 95, 65, 100].map((h, i) => (
                            <div key={i} className="flex-1 max-w-[40px] flex flex-col items-center gap-1 group/bar">
                                <div className="w-full flex gap-1 items-end h-full">
                                    <div className="flex-1 bg-blue-500/20 rounded-t-lg transition-all group-hover/bar:bg-blue-500" style={{ height: `${h * 0.7}%` }} />
                                    <div className="flex-1 bg-emerald-500/20 rounded-t-lg transition-all group-hover/bar:bg-emerald-500" style={{ height: `${h}%` }} />
                                </div>
                                <span className="text-[8px] font-black text-gray-400">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Actions */}
                <div className="rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-8 space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                            {isFr ? 'File d\'attente Critique' : 'Critical Queue'}
                        </h3>
                        <p className="text-xl font-black italic">
                            {isFr ? 'Vérification Vendeurs' : 'Vendor Verification'}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {pendingApprovals.length === 0 ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    {isFr ? 'La file est vide' : 'Queue is currently empty'}
                                </p>
                            </div>
                        ) : (
                            pendingApprovals.map((v) => (
                                <div key={v.id} className="p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-blue-500/20 transition-all group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-sm italic shadow-lg">
                                                {v.businessName[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight line-clamp-1">{v.businessName}</p>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase">
                                                    {isFr ? v.category.nameFr : v.category.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/${locale}/admin/vendors/${v.id}/review`}>
                                        <Button variant="outline" className="w-full h-10 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 border-blue-500/10 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                            {isFr ? 'Examiner la demande' : 'Review Application'}
                                        </Button>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    <Link href={`/${locale}/admin/vendors`}>
                        <Button variant="ghost" className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                            {isFr ? 'Voir tout' : 'View All Requests'} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Command Shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: isFr ? 'Contrôle Marchands' : 'Merchant Control', href: `/${locale}/admin/vendors`, icon: Store, color: 'from-blue-600 to-blue-800' },
                    { label: isFr ? 'Opérations Utilisateurs' : 'User Operations', href: `/${locale}/admin/users`, icon: Users, color: 'from-purple-600 to-purple-800' },
                    { label: isFr ? 'Performance' : 'Performance', href: `/${locale}/admin/analytics`, icon: Activity, color: 'from-emerald-600 to-emerald-800' },
                    { label: isFr ? 'Manifeste Commandes' : 'Order Manifest', href: `/${locale}/admin/orders`, icon: ShoppingCart, color: 'from-orange-600 to-orange-800' },
                ].map((action) => (
                    <Link key={action.label} href={action.href}>
                        <div className={`relative h-32 rounded-[2rem] bg-gradient-to-br ${action.color} p-6 overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl`}>
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                <action.icon className="w-24 h-24" />
                            </div>
                            <action.icon className="w-6 h-6 text-white mb-4" />
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none">
                                {isFr ? 'Exécuter' : 'Execute'}
                            </p>
                            <p className="text-sm font-black text-white uppercase italic tracking-tighter">{action.label}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
