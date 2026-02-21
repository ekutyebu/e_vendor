'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ShoppingCart, Menu, X, Globe, Store, User, ChevronDown, Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { signOut } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cart'

function CartBadge() {
    const [mounted, setMounted] = useState(false)
    const itemsCount = useCartStore((state: any) => state.getTotalItems())

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500 text-white border-0">
                0
            </Badge>
        )
    }

    return (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500 text-white border-0">
            {itemsCount}
        </Badge>
    )
}

export default function Header({ user }: { user?: any }) {
    const t = useTranslations('nav')
    const locale = useLocale()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const otherLocale = locale === 'en' ? 'fr' : 'en'

    const megaMenuLinks = [
        { label: locale === 'fr' ? 'Soldes du jour' : "Today's Deals", href: `/${locale}/vendors` },
        { label: locale === 'fr' ? 'Boutiques' : 'Storefronts', href: `/${locale}/vendors` },
        { label: locale === 'fr' ? 'Vendre sur INOVAMARK' : 'Sell on INOVAMARK', href: `/${locale}/become-vendor` },
        { label: locale === 'fr' ? 'Service Client' : 'Customer Service', href: `#` },
    ]

    return (
        <header className="w-full relative z-50">
            {/* Top Tier - Main Nav (Amazon dark blue) */}
            <div className="bg-[#131921] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row h-auto sm:h-16 py-3 sm:py-0 items-center gap-4">

                        <div className="flex w-full sm:w-auto items-center justify-between">
                            {/* Logo */}
                            <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0 hover:outline hover:outline-1 hover:outline-white p-1 rounded transition-all">
                                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                                    <Store className="w-5 h-5 text-[#131921]" />
                                </div>
                                <span className="text-xl font-extrabold tracking-tight">
                                    INOVAMARK
                                </span>
                            </Link>

                            {/* Mobile Menu Button - shows only on mobile */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="sm:hidden text-white hover:bg-white/10 hover:text-white"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>

                        {/* Location / Deliver To (Hidden on very small screens) */}
                        <div className="hidden md:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white p-1 rounded cursor-pointer transition-all">
                            <MapPin className="w-4 h-4 mt-1 text-gray-300" />
                            <div className="flex flex-col leading-tight">
                                <span className="text-[10px] text-gray-300">Deliver to</span>
                                <span className="text-sm font-bold">Cameroon</span>
                            </div>
                        </div>

                        {/* Search Bar - Amazon style */}
                        <div className="flex-1 w-full flex items-center rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 bg-white">
                            <select className="bg-gray-100 text-gray-700 text-xs px-2 py-3 border-r outline-none cursor-pointer hidden md:block max-w-[120px]">
                                <option>All Categories</option>
                                <option>Electronics</option>
                                <option>Fashion</option>
                                <option>Groceries</option>
                            </select>
                            <input
                                type="text"
                                placeholder={locale === 'fr' ? 'Rechercher des produits, marques et boutiques' : 'Search INOVAMARK'}
                                className="flex-1 px-3 py-2 text-gray-900 outline-none w-full"
                            />
                            <button className="bg-orange-500 hover:bg-orange-400 text-[#131921] px-4 py-2 transition-colors flex items-center justify-center">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Right Actions */}
                        <div className="hidden sm:flex items-center gap-1">
                            {/* Language Toggle */}
                            <Link
                                href={`/${otherLocale}`}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs font-bold hover:outline hover:outline-1 hover:outline-white rounded transition-all"
                            >
                                <span>{otherLocale.toUpperCase()}</span>
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </Link>

                            {/* Account / Auth */}
                            {user ? (
                                <div className="group relative">
                                    <div className="flex flex-col px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded cursor-pointer leading-tight transition-all">
                                        <span className="text-[10px] text-gray-300">Hello, {user.name?.split(' ')[0]}</span>
                                        <span className="text-sm font-bold flex items-center gap-1">
                                            Account & Lists
                                            <ChevronDown className="w-3 h-3 text-gray-400" />
                                        </span>
                                    </div>
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white text-gray-900 rounded-md shadow-xl border p-2 hidden group-hover:block transition-all z-50">
                                        <Link href={`/${locale}/dashboard/${(user as any).role?.toLowerCase() || 'customer'}`} className="block px-3 py-2 text-sm hover:bg-gray-100 rounded">Dashboard</Link>
                                        <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded">Sign Out</button>
                                    </div>
                                </div>
                            ) : (
                                <Link href={`/${locale}/signin`}>
                                    <div className="flex flex-col px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded cursor-pointer leading-tight transition-all">
                                        <span className="text-[10px] text-gray-300">Hello, sign in</span>
                                        <span className="text-sm font-bold flex items-center gap-1">
                                            Account & Lists
                                            <ChevronDown className="w-3 h-3 text-gray-400" />
                                        </span>
                                    </div>
                                </Link>
                            )}

                            {/* Orders (Placeholder) */}
                            <Link href={`/${locale}/dashboard/customer`} className="flex flex-col px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded transition-all leading-tight">
                                <span className="text-[10px] text-gray-300">Returns</span>
                                <span className="text-sm font-bold">& Orders</span>
                            </Link>

                            {/* Cart */}
                            <Link href={`/${locale}/cart`}>
                                <div className="flex items-end px-2 py-1 hover:outline hover:outline-1 hover:outline-white rounded transition-all relative">
                                    <div className="relative">
                                        <ShoppingCart className="h-8 w-8 text-white" />
                                        <CartBadge />
                                    </div>
                                    <span className="text-sm font-bold hidden lg:block ml-1 mb-1">Cart</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tier - Mega Menu (lighter dark blue) */}
            <div className="bg-[#232f3e] text-white hidden sm:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-10 gap-4 text-sm font-medium">
                        <button className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded transition-all">
                            <Menu className="h-5 w-5" />
                            <span className="font-bold">All</span>
                        </button>
                        {megaMenuLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="sm:hidden bg-[#232f3e] text-white border-t border-gray-700 animate-fade-in shadow-xl absolute w-full z-40">
                    <div className="flex flex-col">
                        <div className="p-4 bg-[#131921] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {user ? (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-lg font-bold">
                                            {user.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold">Hello, {user.name}</div>
                                            <Link href={`/${locale}/dashboard/${(user as any).role?.toLowerCase() || 'customer'}`} className="text-xs text-orange-400">View Account</Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <User className="w-8 h-8" />
                                        <Link href={`/${locale}/signin`} className="font-bold text-lg">Sign In</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-2 space-y-1">
                            {megaMenuLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-4 py-3 text-base text-gray-200 hover:bg-white/10 hover:text-white rounded-md"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-700 my-2 mx-4" />
                            {user && (
                                <button
                                    onClick={() => { signOut(); setIsMenuOpen(false) }}
                                    className="block w-full text-left px-4 py-3 text-base text-red-400 hover:bg-white/10 hover:text-red-300 rounded-md"
                                >
                                    Sign Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
