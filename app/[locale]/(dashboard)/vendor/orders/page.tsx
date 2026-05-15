import { getLocale, getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
    Package, 
    Search, 
    Filter, 
    ChevronRight, 
    Clock, 
    CheckCircle2, 
    Truck, 
    AlertCircle,
    Eye,
    MoreHorizontal
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'PENDING':
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1"><Clock className="w-3 h-3" /> Pending</Badge>
        case 'CONFIRMED':
            return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</Badge>
        case 'SHIPPED':
            return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1"><Truck className="w-3 h-3" /> Shipped</Badge>
        case 'DELIVERED':
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</Badge>
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}

export default async function VendorOrdersPage() {
    const locale = await getLocale()
    const session = await auth()
    const t = await getTranslations('vendor')

    if (!session?.user || session.user.role !== 'VENDOR') {
        redirect(`/${locale}/signin`)
    }

    const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id }
    })

    if (!vendor) {
        redirect(`/${locale}/become-vendor`)
    }

    const orders = await prisma.order.findMany({
        where: { vendorId: vendor.id },
        include: {
            customer: {
                include: { user: true }
            },
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter italic">Manage Orders</h1>
                    <p className="text-muted-foreground text-sm">Track and fulfill your customer requests.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-600' },
                    { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: 'text-yellow-600' },
                    { label: 'To Ship', value: orders.filter(o => o.status === 'CONFIRMED').length, icon: Truck, color: 'text-purple-600' },
                    { label: 'Completed', value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle2, color: 'text-green-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-white/5 border rounded-xl p-4 flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-gray-50 dark:bg-white/10 ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                            <p className="text-xl font-black">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & List */}
            <div className="bg-white dark:bg-white/5 border rounded-xl overflow-hidden">
                <div className="p-4 border-b bg-gray-50/50 dark:bg-white/5 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search order ID or customer..." className="pl-9 h-9 bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 text-[11px] uppercase font-bold text-muted-foreground tracking-widest border-b">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="font-bold">No orders found</p>
                                        <p className="text-xs">Incoming orders will appear here.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-orange-600">
                                            #{order.orderNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{order.customer.user.name}</span>
                                                <span className="text-[10px] text-muted-foreground">{order.deliveryCity}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black">
                                            {order.total.toLocaleString()} <span className="text-[10px] font-bold text-muted-foreground">CFA</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-orange-50 hover:text-orange-600 rounded-lg">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </div>
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
