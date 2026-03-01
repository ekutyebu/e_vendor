'use client'

import Link from 'next/link'
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Settings, 
    ArrowLeft, 
    Store, 
    Bell, 
    TrendingUp,
    LogOut,
    Menu,
    ChevronRight
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function VendorDashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const locale = params.locale
    const isFr = locale === 'fr'
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = session?.user

    const navItems = [
        { icon: LayoutDashboard, label: isFr ? 'Vue d\'ensemble' : 'Overview', href: `/${locale}/dashboard/vendor` },
        { icon: Package, label: isFr ? 'Produits' : 'Products', href: `/${locale}/dashboard/vendor/products` },
        { icon: ShoppingCart, label: isFr ? 'Commandes' : 'Orders', href: `/${locale}/dashboard/vendor/orders` },
        { icon: Sparkles, label: isFr ? 'Promotions' : 'Promotions', href: `/${locale}/dashboard/vendor/promotions` },
        { icon: TrendingUp, label: isFr ? 'Analytique' : 'Analytics', href: `/${locale}/dashboard/vendor/analytics` },
        { icon: Settings, label: isFr ? 'Paramètres' : 'Settings', href: `/${locale}/dashboard/vendor/settings` },
    ]

    return (
        <div className="flex h-screen bg-[#fafafa] dark:bg-[#080808] overflow-hidden">
            {/* Elite Sidebar */}
            <aside className="hidden lg:flex w-[320px] bg-white dark:bg-[#111] border-r border-gray-100 dark:border-white/5 flex-col overflow-y-auto">
                <div className="p-10">
                    <Link href={`/${locale}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_primary]">
                            <Store className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            INOVAMARK
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    isActive 
                                        ? 'bg-primary text-black shadow-2xl translate-x-1' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6">
                    <div className="bg-black/5 rounded-3xl p-6 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">
                                {user?.name?.charAt(0) || 'V'}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-[10px] font-black text-white truncate">{user?.name || 'Vendor'}</div>
                                <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">MASTER VENDOR</div>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                        >
                            <LogOut className="w-3 h-3" /> TERMINATE SESSION
                        </button>
                    </div>
                </div>
            </aside>

            {/* Elite Center Stage */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-24 bg-white dark:bg-[#080808]/80 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5 sticky top-0 z-30 px-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Menu className="w-5 h-5 text-white" />
                        </button>
                        <div className="h-4 w-px bg-white/10 hidden lg:block" />
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest hidden lg:block italic">
                            ELITE DASHBOARD V2.0 // SYNCED
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_primary]" />
                        </button>
                        <Link href={`/${locale}`} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-white flex items-center gap-2">
                            <ArrowLeft className="w-3 h-3" /> MARKETPLACE
                        </Link>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
