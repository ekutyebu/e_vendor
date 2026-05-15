import { getLocale, getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
    Package, 
    ChevronRight, 
    ShoppingBag,
    MapPin,
    Calendar,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

function OrderStatusIndicator({ status }: { status: string }) {
    const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
    const currentIndex = steps.indexOf(status)
    const isCancelled = status === 'CANCELLED'

    if (isCancelled) {
        return (
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase italic">
                <div className="w-2 h-2 rounded-full bg-red-600" /> Cancelled
            </div>
        )
    }

    return (
        <div className="flex items-center gap-1.5">
            {steps.map((step, i) => (
                <div key={step} className="flex items-center">
                    <div className={`h-1.5 w-1.5 rounded-full ${i <= currentIndex ? 'bg-orange-500' : 'bg-gray-200'}`} />
                    {i < steps.length - 1 && (
                        <div className={`h-[2px] w-4 ${i < currentIndex ? 'bg-orange-500' : 'bg-gray-200'}`} />
                    )}
                </div>
            ))}
            <span className="ml-2 text-[10px] uppercase font-black text-orange-600 italic tracking-tighter">
                {status.replace('_', ' ')}
            </span>
        </div>
    )
}

export default async function CustomerOrdersPage() {
    const locale = await getLocale()
    const session = await auth()

    if (!session?.user) {
        redirect(`/${locale}/signin`)
    }

    const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id }
    })

    if (!customer) {
        redirect(`/${locale}/`)
    }

    const orders = await prisma.order.findMany({
        where: { customerId: customer.id },
        include: {
            vendor: true,
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">Your Orders</h1>
                    <p className="text-muted-foreground text-sm">Track shipments and manage your purchases.</p>
                </div>
                <Link href={`/${locale}/vendors`}>
                    <Button variant="outline" size="sm" className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
                        <ShoppingBag className="w-4 h-4" /> Continue Shopping
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="bg-white dark:bg-white/5 border rounded-2xl p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-6 opacity-20 text-orange-500" />
                        <h2 className="text-xl font-bold mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Looks like you haven't placed any orders yet. Start exploring our marketplace!</p>
                        <Link href={`/${locale}/vendors`}>
                            <Button className="bg-[#131921] hover:bg-orange-500 text-white font-bold px-8 py-6 h-auto transition-all">
                                Explore Products
                            </Button>
                        </Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-white/5 border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="bg-gray-50/80 dark:bg-white/5 p-4 md:p-6 border-b flex flex-wrap gap-6 items-center justify-between text-sm">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Order Placed</p>
                                        <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total</p>
                                        <p className="font-bold text-orange-600">{order.total.toLocaleString()} CFA</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Ship To</p>
                                        <p className="font-bold">{order.deliveryCity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Order # {order.orderNumber}</p>
                                    <div className="flex items-center gap-4 text-xs font-bold text-blue-600">
                                        <Link href="#" className="hover:underline">View Details</Link>
                                        <span className="text-gray-300">|</span>
                                        <Link href="#" className="hover:underline">Invoice</Link>
                                    </div>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-lg font-black italic tracking-tighter uppercase">
                                            {order.status === 'DELIVERED' ? 'Delivered' : 'Arriving Soon'}
                                        </p>
                                        <OrderStatusIndicator status={order.status} />
                                    </div>

                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 group">
                                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border flex-shrink-0">
                                                    <Image 
                                                        src={item.product.images[0] || '/images/placeholder.png'} 
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Link href={`/${locale}/products/${item.product.id}`} className="font-bold hover:text-orange-600 transition-colors">
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground mt-1">Sold by: <span className="font-bold text-gray-900 dark:text-white underline decoration-orange-300">{order.vendor.businessName}</span></p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <Badge variant="outline" className="text-[10px] font-bold">Qty: {item.quantity}</Badge>
                                                        <span className="text-sm font-black">{item.price.toLocaleString()} CFA</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="w-full md:w-56 space-y-3 pt-4 md:pt-0">
                                    <Button className="w-full bg-orange-400 hover:bg-orange-500 text-[#131921] font-bold text-xs h-10 shadow-sm">
                                        Track Package
                                    </Button>
                                    <Button variant="outline" className="w-full font-bold text-xs h-10 border-gray-200">
                                        Write Product Review
                                    </Button>
                                    <Button variant="outline" className="w-full font-bold text-xs h-10 border-gray-200">
                                        Buy it again
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
