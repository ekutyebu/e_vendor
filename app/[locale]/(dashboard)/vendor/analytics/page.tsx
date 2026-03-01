import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
    TrendingUp, 
    Users, 
    ShoppingCart, 
    DollarSign, 
    BarChart3, 
    LineChart, 
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'

export default async function VendorAnalyticsPage({ params }: { params: { locale: string } }) {
    const isFr = params.locale === 'fr'

    const METRICS = [
        { label: isFr ? 'Revenue Total' : 'Gross Revenue', value: '2,450,000 FCFA', trend: '+12.5%', icon: DollarSign },
        { label: isFr ? 'Ventes Net' : 'Net Sales', value: '1,980,000 FCFA', trend: '+8.2%', icon: ShoppingCart },
        { label: isFr ? 'Clients Actifs' : 'Active Customers', value: '842', trend: '+15.1%', icon: Users },
        { label: isFr ? 'Taux de Conversion' : 'Conversion Rate', value: '3.2%', trend: '-1.4%', icon: TrendingUp },
    ]

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Elite Header */}
            <div className="space-y-2">
                <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">DATA INTELLIGENCE</div>
                <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                    {isFr ? 'ANALYTIQUE' : 'PERFORMANCE'}
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {isFr ? 'VOTRE CROISSANCE EN TEMPS RÉEL' : 'REAL-TIME METRICS & STRATEGIC INSIGHTS'}
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {METRICS.map((metric) => (
                    <div key={metric.label} className="card-elite p-8 rounded-[2.5rem] bg-white dark:bg-[#111] border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <metric.icon className="w-5 h-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black ${metric.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                {metric.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {metric.trend}
                            </div>
                        </div>
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{metric.label}</div>
                        <div className="text-2xl font-display font-black italic dark:text-white">{metric.value}</div>
                    </div>
                ))}
            </div>

            {/* Visual Charts (Placeholders with Premium Look) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[3rem] bg-white dark:bg-[#111] border-white/5 overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5">
                        <CardTitle className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] flex items-center gap-3">
                            <LineChart className="w-4 h-4 text-primary" /> REVENUE PROJECTION
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="h-[300px] w-full bg-gray-50 dark:bg-white/5 rounded-3xl flex items-end justify-between p-8 gap-2">
                            {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-lg relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {h * 10}K
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 px-4">
                            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(m => (
                                <span key={m} className="text-[8px] font-black text-gray-500 tracking-tighter">{m}</span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[3rem] bg-white dark:bg-[#111] border-white/5 overflow-hidden">
                    <CardHeader className="p-10 border-b border-white/5">
                        <CardTitle className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] flex items-center gap-3">
                            <BarChart3 className="w-4 h-4 text-primary" /> PERFORMANCE BY CATEGORY
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="space-y-6">
                            {[
                                { name: 'Electronics', nameFr: 'Électronique', val: 75 },
                                { name: 'Fashion', nameFr: 'Mode', val: 55 },
                                { name: 'Home & Kitchen', nameFr: 'Maison', val: 40 },
                                { name: 'Grocery', nameFr: 'Épicerie', val: 90 },
                            ].map(cat => (
                                <div key={cat.name} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                                        <span>{isFr ? cat.nameFr : cat.name}</span>
                                        <span>{cat.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full gold-gradient rounded-full transition-all duration-1000" style={{ width: `${cat.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
