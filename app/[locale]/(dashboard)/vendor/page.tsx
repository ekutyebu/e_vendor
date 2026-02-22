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
        <div className="space-y-6 animate-fade-in">
            {/* Welcome */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {isFr ? 'Bonjour, Vendeur 👋' : 'Welcome back, Vendor 👋'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    {isFr ? 'Voici un aperçu de votre activité' : "Here's what's happening with your store today."}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{isFr ? stat.titleFr : stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {stat.change} {isFr ? 'ce mois' : 'this month'}
                                        </div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Stock Alert */}
            <Card className="border-0 shadow-sm bg-orange-50 border-l-4 border-l-orange-400">
                <CardContent className="p-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <p className="text-sm text-orange-700">
                        <strong>3 products</strong> are running low on stock (less than 5 units). {' '}
                        <a href="#" className="underline font-medium">View products →</a>
                    </p>
                </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                            {isFr ? 'Commandes récentes' : 'Recent Orders'}
                        </CardTitle>
                        <a href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            {isFr ? 'Voir tout' : 'View all'}
                            <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-3">
                        {RECENT_ORDERS.map((order) => (
                            <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-500">{order.id}</span>
                                        <Badge variant={STATUS_COLORS[order.status] as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 truncate">{order.customer}</p>
                                    <p className="text-xs text-gray-500 truncate">{order.product}</p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                                    <p className="text-xs text-gray-400">{order.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
