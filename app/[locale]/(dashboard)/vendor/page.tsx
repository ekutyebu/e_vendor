import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ShoppingCart,
    Package,
    DollarSign,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
} from 'lucide-react'
import Link from 'next/link'

const STATS = [
    {
        title: 'Total Revenue',
        titleFr: 'Chiffre d\'affaires',
        value: '2,450,000 FCFA',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'Total Orders',
        titleFr: 'Total Commandes',
        value: '124',
        change: '+8.2%',
        trend: 'up',
        icon: ShoppingCart,
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Active Products',
        titleFr: 'Produits actifs',
        value: '38',
        change: '+3',
        trend: 'up',
        icon: Package,
        color: 'text-purple-600 bg-purple-50',
    },
    {
        title: 'Pending Orders',
        titleFr: 'Commandes en attente',
        value: '7',
        change: '-2',
        trend: 'down',
        icon: Clock,
        color: 'text-orange-600 bg-orange-50',
    },
]

const RECENT_ORDERS = [
    { id: 'INV-2024-0247', customer: 'Awa Kamga', product: 'Organic Tomatoes x5', amount: '4,500 FCFA', status: 'PENDING', time: '5 min ago' },
    { id: 'INV-2024-0246', customer: 'Paul Mbida', product: 'Palm Oil 5L', amount: '12,000 FCFA', status: 'CONFIRMED', time: '1 hour ago' },
    { id: 'INV-2024-0245', customer: 'Sophie Nkeng', product: 'Fresh Yam Bag 10kg', amount: '8,500 FCFA', status: 'DELIVERED', time: '3 hours ago' },
    { id: 'INV-2024-0244', customer: 'Thierry Biya', product: 'Plantains Bunch', amount: '3,000 FCFA', status: 'PROCESSING', time: '5 hours ago' },
]

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'warning',
    CONFIRMED: 'default',
    PROCESSING: 'secondary',
    SHIPPED: 'outline',
    DELIVERED: 'success',
    CANCELLED: 'destructive',
}

export default function VendorOverviewPage({ params }: { params: { locale: string } }) {
    const isFr = params.locale === 'fr'

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Elite Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">MERCHANT COMMAND</div>
                    <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                        {isFr ? 'SALUTATIONS, COMMERÇANT' : 'GREETINGS, MERCHANT'}
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {isFr ? 'VOTRE EMPIRE EST SOUS CONTRÔLE' : 'YOUR EMPIRE IS UNDER OPTIMAL CONTROL'}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-[#111] border border-white/5 px-6 py-3 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_emerald]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">SYSTEM OPERATIONAL</span>
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
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
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

            {/* Critical Alert Elite */}
            <div className="relative overflow-hidden rounded-[2rem] bg-orange-500/10 border border-orange-500/20 p-6 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-black shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 font-display">RESOURCE DEFICIT DETECTED</div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">
                        <strong>3 assets</strong> are approaching depletion threshold. 
                        <a href="#" className="text-white hover:text-primary transition-colors ml-2 underline">INITIATE REPLENISHMENT →</a>
                    </p>
                </div>
            </div>

            {/* Recent Orders Elite */}
            <div className="rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="text-[10px] font-black text-white uppercase tracking-[0.4em]">ORDER MANIFEST</div>
                    <Link href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:brightness-125 flex items-center gap-2">
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
                            {RECENT_ORDERS.map((order) => (
                                <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="text-[10px] font-black text-white uppercase tracking-widest">{order.id}</div>
                                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">{order.time}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-[10px] font-black text-white uppercase italic">{order.customer}</div>
                                        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 line-clamp-1">{order.product}</div>
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
                                        <div className="text-sm font-display font-black italic text-white">{order.amount}</div>
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
