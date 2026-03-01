import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Percent, Calendar, Tag, Trash2, Edit2, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function VendorPromotionsPage({ params }: { params: { locale: string } }) {
    const isFr = params.locale === 'fr'

    // Mock promotions for now
    const promotions = [
        {
            id: 'PROMO-001',
            name: 'Summer Flash Sale',
            type: 'PERCENTAGE',
            value: 20,
            status: 'ACTIVE',
            startDate: '2024-06-01',
            endDate: '2024-06-30',
            reach: 1250,
        },
        {
            id: 'PROMO-002',
            name: 'New Arrival Boost',
            type: 'FIXED',
            value: 5000,
            status: 'SCHEDULED',
            startDate: '2024-07-15',
            endDate: '2024-07-20',
            reach: 0,
        }
    ]

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Elite Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">MARKET AMPLIFICATION</div>
                    <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                        {isFr ? 'PROMOTIONS' : 'CAMPAIGNS'}
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {isFr ? 'BOOSTEZ VOTRE VISIBILITÉ ET VOS VENTES' : 'AMPLIFY YOUR REACH & CONVERSION METRICS'}
                    </p>
                </div>
                <Button className="h-14 px-8 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    <Plus className="w-4 h-4 mr-2" /> {isFr ? 'CRÉER UNE PROMO' : 'LAUNCH CAMPAIGN'}
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-elite p-8 rounded-[2rem] bg-white dark:bg-[#111] border-white/5">
                    <TrendingUp className="w-6 h-6 text-primary mb-4" />
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Avg. Conversion Boost</div>
                    <div className="text-3xl font-display font-black italic dark:text-white">+24.8%</div>
                </div>
                <div className="card-elite p-8 rounded-[2rem] bg-white dark:bg-[#111] border-white/5">
                    <Sparkles className="w-6 h-6 text-primary mb-4" />
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Active Promotions</div>
                    <div className="text-3xl font-display font-black italic dark:text-white">01</div>
                </div>
                <div className="card-elite p-8 rounded-[2rem] bg-white dark:bg-[#111] border-white/5 text-primary">
                    <Percent className="w-6 h-6 mb-4" />
                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Total Savings Generated</div>
                    <div className="text-3xl font-display font-black italic">450.0K FCFA</div>
                </div>
            </div>

            {/* Campaign Table */}
            <div className="rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">CAMPAIGN</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">VALUE</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">STATUS</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">TIMELINE</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">METRICS</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {promotions.map((promo) => (
                                <tr key={promo.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <Tag className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{promo.name}</div>
                                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">ID: {promo.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-display font-black italic text-primary">
                                            {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `-${promo.value} FCFA`}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge className={`${promo.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/30' : 'text-orange-500 border-orange-500/30'} bg-white/5 border text-[9px] font-black uppercase rounded-lg px-3`}>
                                            {promo.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            <Calendar className="w-3 h-3" />
                                            {promo.startDate} 
                                            <span className="mx-1">→</span>
                                            {promo.endDate}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{promo.reach.toLocaleString()} VIEWS</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-primary transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
