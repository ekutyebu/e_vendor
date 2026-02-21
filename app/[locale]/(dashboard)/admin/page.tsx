import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'

const ADMIN_STATS = [
    { title: 'Total Vendors', value: '127', change: '+8', trend: 'up', icon: Store, color: 'text-blue-600 bg-blue-50' },
    { title: 'Pending Approvals', value: '3', change: 'new', trend: 'neutral', icon: Clock, color: 'text-orange-600 bg-orange-50' },
    { title: 'Total Users', value: '5,842', change: '+143', trend: 'up', icon: Users, color: 'text-purple-600 bg-purple-50' },
    { title: 'Platform Revenue', value: '1.2M FCFA', change: '+18%', trend: 'up', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
]

const PENDING_VENDORS = [
    { id: '1', name: 'Boulangerie Centrale', owner: 'Pierre Ekotto', category: 'Food & Grocery', city: 'Yaoundé', date: '2024-01-15' },
    { id: '2', name: 'Mode Africaine SARL', owner: 'Honorine Tabi', category: 'Fashion', city: 'Douala', date: '2024-01-14' },
    { id: '3', name: 'Auto Parts Ngaoundéré', owner: 'Ibrahim Oumarou', category: 'Services', city: 'Ngaoundéré', date: '2024-01-13' },
]

export default function AdminOverviewPage({ params }: { params: { locale: string } }) {
    const isFr = params.locale === 'fr'

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {isFr ? 'Tableau de bord Admin' : 'Platform Overview'}
                </h2>
                <p className="text-gray-500 text-sm">
                    {isFr ? 'Gestion de la plateforme INOVAMARK' : 'INOVAMARK platform management'}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {ADMIN_STATS.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="border-0 shadow-sm">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <div className="text-xs text-emerald-600 font-medium mt-1">{stat.change}</div>
                                    </div>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Pending Vendor Approvals */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            {isFr ? 'Approbations en attente' : 'Pending Vendor Approvals'}
                            <Badge className="bg-orange-500 text-white text-xs">{PENDING_VENDORS.length}</Badge>
                        </CardTitle>
                        <a href="#" className="text-xs text-blue-600 hover:underline">
                            {isFr ? 'Voir tout' : 'View all'}
                        </a>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-3">
                        {PENDING_VENDORS.map((vendor) => (
                            <div key={vendor.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                        {vendor.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{vendor.name}</p>
                                        <p className="text-xs text-gray-500">{vendor.owner} · {vendor.city} · {vendor.category}</p>
                                        <p className="text-xs text-gray-400">{isFr ? 'Soumis le' : 'Submitted'} {vendor.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-8">
                                        <XCircle className="w-3 h-3 mr-1" />
                                        {isFr ? 'Rejeter' : 'Reject'}
                                    </Button>
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {isFr ? 'Approuver' : 'Approve'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { icon: Store, label: isFr ? 'Gérer vendors' : 'Manage Vendors', href: 'vendors', color: 'bg-blue-600' },
                    { icon: Users, label: isFr ? 'Gérer users' : 'Manage Users', href: 'users', color: 'bg-purple-600' },
                    { icon: TrendingUp, label: isFr ? 'Analytiques' : 'Analytics', href: 'analytics', color: 'bg-emerald-600' },
                    { icon: ShoppingCart, label: isFr ? 'Toutes commandes' : 'All Orders', href: 'orders', color: 'bg-orange-600' },
                ].map((action) => {
                    const Icon = action.icon
                    return (
                        <a
                            key={action.label}
                            href={action.href}
                            className={`${action.color} text-white rounded-xl p-4 flex flex-col gap-2 hover:opacity-90 transition-opacity`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{action.label}</span>
                            <ArrowUpRight className="w-4 h-4 self-end" />
                        </a>
                    )
                })}
            </div>
        </div>
    )
}
