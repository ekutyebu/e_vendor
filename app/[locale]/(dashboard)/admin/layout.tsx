import Link from 'next/link'
import { LayoutDashboard, Users, Package, Tag, Settings, ArrowLeft, Store, Shield, Bell } from 'lucide-react'


export default function AdminDashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const locale = params.locale
    const isFr = locale === 'fr'

    const navItems = [
        { icon: LayoutDashboard, label: isFr ? 'Vue d\'ensemble' : 'Overview', href: `/${locale}/dashboard/admin`, badge: null },
        { icon: Store, label: isFr ? 'Vendeurs' : 'Vendors', href: `/${locale}/dashboard/admin/vendors`, badge: '3' },
        { icon: Package, label: isFr ? 'Produits' : 'Products', href: `/${locale}/dashboard/admin/products`, badge: null },
        { icon: Tag, label: isFr ? 'Catégories' : 'Categories', href: `/${locale}/dashboard/admin/categories`, badge: null },
        { icon: Users, label: isFr ? 'Utilisateurs' : 'Users', href: `/${locale}/dashboard/admin/users`, badge: null },
        { icon: Settings, label: isFr ? 'Paramètres' : 'Settings', href: `/${locale}/dashboard/admin/settings`, badge: null },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col">
                {/* Logo */}
                <div className="p-5 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                            <Store className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">INOVAMARK</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                {isFr ? 'Admin' : 'Admin Panel'}
                            </div>
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
                                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </div>
                                {item.badge && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Link
                        href={`/${locale}`}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {isFr ? 'Retour au site' : 'Back to site'}
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            {isFr ? 'Administration' : 'Admin Dashboard'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">
                                A
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-sm font-medium text-gray-900">Admin</div>
                                <div className="text-xs text-gray-500">admin@inovamark.cm</div>
                            </div>
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
