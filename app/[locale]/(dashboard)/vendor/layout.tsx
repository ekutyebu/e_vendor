import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Settings, ArrowLeft, Store, Bell, TrendingUp } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

export default function VendorDashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const locale = params.locale
    const isFr = locale === 'fr'

    const navItems = [
        { icon: LayoutDashboard, label: isFr ? 'Vue d\'ensemble' : 'Overview', href: `/${locale}/dashboard/vendor` },
        { icon: Package, label: isFr ? 'Produits' : 'Products', href: `/${locale}/dashboard/vendor/products` },
        { icon: ShoppingCart, label: isFr ? 'Commandes' : 'Orders', href: `/${locale}/dashboard/vendor/orders` },
        { icon: TrendingUp, label: isFr ? 'Analytique' : 'Analytics', href: `/${locale}/dashboard/vendor/analytics` },
        { icon: Settings, label: isFr ? 'Paramètres' : 'Settings', href: `/${locale}/dashboard/vendor/settings` },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col">
                {/* Logo */}
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                            <Store className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">INOVAMARK</div>
                            <div className="text-xs text-gray-500">{isFr ? 'Espace Vendeur' : 'Vendor Portal'}</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors group"
                            >
                                <Icon className="w-4 h-4 group-hover:text-blue-700" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <Separator />

                {/* Back to marketplace */}
                <div className="p-4">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {isFr ? 'Retour au marketplace' : 'Back to marketplace'}
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {isFr ? 'Tableau de bord Vendeur' : 'Vendor Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold">
                            V
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
