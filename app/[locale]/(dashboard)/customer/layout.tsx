'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, Settings, LogOut, Heart, ArrowLeft } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export default function CustomerDashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const locale = params.locale
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = session?.user

    const navItems = [
        { icon: User, label: 'Profile Settings', href: `/${locale}/dashboard/customer` },
        { icon: ShoppingBag, label: 'My Orders', href: `/${locale}/dashboard/customer/orders` },
        { icon: Heart, label: 'Wishlist', href: `/${locale}/dashboard/customer/wishlist` },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex flex-col">
                <div className="p-8">
                    <Link href={`/${locale}`} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-orange-500 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-xl">
                            {user?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{user?.name || 'Customer'}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest">Premium Member</div>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                                        isActive 
                                            ? 'bg-orange-50 text-orange-600' 
                                            : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
                
                <div className="mt-auto p-8 border-t border-gray-100">
                    <button
                        onClick={() => signOut({ callbackUrl: `/${locale}` })}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
