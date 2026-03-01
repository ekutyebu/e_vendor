'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ShoppingCart, Menu, X, Store, User, ChevronDown, Search, MapPin, ArrowRight, Settings, LogOut, Package, Heart, History, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { signOut } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cart'
import { useTheme } from 'next-themes'

interface Category {
    id: string
    name: string
    nameFr: string
    slug: string
    icon?: string | null
}

function CartBadge() {
    const [mounted, setMounted] = useState(false)
    const itemsCount = useCartStore((state) => state.getTotalItems())

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

export default function Header({ 
    user, 
    categories = [] 
}: { 
    user?: { name?: string | null; email?: string | null; image?: string | null; role?: string };
    categories?: Category[]
}) {
    const t = useTranslations('nav')
    const locale = useLocale()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
    const [searchCategory, setSearchCategory] = useState('all')
    const otherLocale = locale === 'en' ? 'fr' : 'en'

    useEffect(() => {
        setMounted(true)
    }, [])

    const megaMenuLinks = [
        { label: locale === 'fr' ? 'Soldes du jour' : "Today's Deals", href: `/${locale}/vendors` },
        { label: locale === 'fr' ? 'Boutiques' : 'Storefronts', href: `/${locale}/vendors` },
        { label: locale === 'fr' ? 'Vendre sur INOVAMARK' : 'Sell on INOVAMARK', href: `/${locale}/become-vendor` },
        { label: locale === 'fr' ? 'Service Client' : 'Customer Service', href: `#` },
    ]

    if (!mounted) return null

    return (
        <header className="w-full relative z-50">
            {/* Top Tier - Main Nav (Amazon dark blue) */}
            <div className="bg-[#131921] text-white">
                <div className="max-w-[1600px] mx-auto px-4">
                    <div className="flex h-16 items-center gap-2 lg:gap-4">
                        
                        {/* Left Section: Logo & Deliver To */}
                        <div className="flex items-center gap-2 lg:gap-4">
                            {/* Logo */}
                            <Link href={`/${locale}`} className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white p-1 rounded transition-all">
                                <span className="text-xl font-black tracking-tighter italic text-orange-500">INOVA</span>
                                <span className="text-xl font-black tracking-tighter uppercase">MARK</span>
                            </Link>

                            {/* Deliver To */}
                            <div className="hidden lg:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white p-2 rounded cursor-pointer leading-tight transition-all">
                                <MapPin className="w-4 h-4 mt-2 text-gray-300" />
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-gray-400">Deliver to</span>
                                    <span className="text-sm font-bold">Cameroon</span>
                                </div>
                            </div>
                        </div>

                        {/* Center Section: Search Bar */}
                        <div className="flex-1 flex items-center rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 bg-white">
                            <div className="group relative hidden md:block border-r border-gray-200">
                                <select 
                                    className="appearance-none bg-gray-100 text-gray-700 text-xs pl-3 pr-8 py-2.5 outline-none cursor-pointer h-full border-0"
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.slug}>{locale === 'fr' ? cat.nameFr : cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                            <input
                                type="text"
                                placeholder={locale === 'fr' ? 'Rechercher sur INOVAMARK...' : 'Search INOVAMARK...'}
                                className="flex-1 px-4 py-2.5 text-gray-900 outline-none w-full text-sm"
                            />
                            <button className="bg-orange-500 hover:bg-orange-600 text-[#131921] px-5 py-2.5 transition-colors">
                                <Search className="w-5 h-5 font-bold" />
                            </button>
                        </div>

                        {/* Right Section: Actions */}
                        <div className="flex items-center gap-1 lg:gap-2">
                            {/* Language & Theme Toggle */}
                            <div className="hidden xl:flex items-center gap-2">
                                <Link
                                    href={`/${otherLocale}`}
                                    className="flex items-center gap-1 px-2 py-2 hover:outline hover:outline-1 hover:outline-white rounded transition-all group"
                                >
                                    <span className="text-xs font-bold uppercase">{otherLocale}</span>
                                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-white" />
                                </Link>

                                <button 
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-2 hover:outline hover:outline-1 hover:outline-white rounded transition-all"
                                >
                                    <Globe className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Account & Lists */}
                            <div className="group relative">
                                <div className="flex flex-col px-3 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded cursor-pointer leading-tight transition-all">
                                    <span className="text-[11px] text-gray-400">Hello, {user ? user.name?.split(' ')[0] : 'sign in'}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-bold shrink-0">Account & Lists</span>
                                        <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-white" />
                                    </div>
                                </div>
                                
                                {/* Hover Card - Premium Amazon Style */}
                                <div className="absolute right-0 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                                    <div className="bg-white text-gray-900 rounded-sm shadow-2xl border w-[420px] overflow-hidden flex">
                                        {/* Left Side: Lists */}
                                        <div className="w-1/2 p-6 border-r border-gray-100">
                                            <h3 className="text-base font-black uppercase tracking-tighter mb-4 text-[#131921]">Your Lists</h3>
                                            <div className="space-y-2.5">
                                                <Link href="#" className="block text-[13px] hover:text-orange-600 hover:underline">Create a List</Link>
                                                <Link href="#" className="block text-[13px] hover:text-orange-600 hover:underline">Find a List or Registry</Link>
                                                <Link href="#" className="block text-[13px] hover:text-orange-600 hover:underline">Marketplace Gifting</Link>
                                            </div>
                                        </div>
                                        {/* Right Side: Account */}
                                        <div className="w-1/2 p-6 bg-gray-50/50">
                                            <h3 className="text-base font-black uppercase tracking-tighter mb-4 text-[#131921]">Your Account</h3>
                                            <div className="space-y-2.5">
                                                {user ? (
                                                    <>
                                                        <Link href={`/${locale}/dashboard/${user.role?.toLowerCase() || 'customer'}`} className="block text-[13px] hover:text-orange-600 hover:underline">Dashboard</Link>
                                                        <Link href="#" className="block text-[13px] hover:text-orange-600 hover:underline">Orders</Link>
                                                        <Link href="#" className="block text-[13px] hover:text-orange-600 hover:underline">Recommendations</Link>
                                                        <div className="h-px bg-gray-200 my-2" />
                                                        <button onClick={() => signOut()} className="flex items-center gap-2 text-[13px] text-red-600 font-bold hover:underline">
                                                            <LogOut className="w-3 h-3" /> Sign Out
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link href={`/${locale}/signin`} className="block w-full text-center bg-orange-400 hover:bg-orange-500 text-[#131921] py-2 rounded-md font-bold text-sm shadow-sm mb-4">Sign In</Link>
                                                        <div className="text-center text-[11px]">
                                                            New customer? <Link href={`/${locale}/signup`} className="text-blue-600 hover:underline hover:text-orange-600">Start here.</Link>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute right-10 top-0 -translate-y-1/2 w-3 h-3 bg-white border-t border-l rotate-45" />
                                </div>
                            </div>

                            {/* Returns & Orders */}
                            <Link href="#" className="hidden sm:flex flex-col px-3 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded transition-all leading-tight">
                                <span className="text-[11px] text-gray-400">Returns</span>
                                <span className="text-sm font-bold">& Orders</span>
                            </Link>

                            {/* Cart */}
                            <Link href={`/${locale}/cart`} className="flex items-end px-3 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded transition-all relative">
                                <div className="relative">
                                    <ShoppingCart className="h-8 w-8 text-white stroke-[1.5]" />
                                    <CartBadge />
                                </div>
                                <span className="text-sm font-bold hidden lg:block ml-1 mb-1">Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tier - Sub Nav */}
            <div className="bg-[#232f3e] text-white overflow-x-auto">
                <div className="max-w-[1600px] mx-auto px-4 flex items-center h-10 gap-1 whitespace-nowrap">
                    <button 
                        onClick={() => setIsMegaMenuOpen(true)}
                        className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-2 py-2 rounded transition-all mr-2"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="font-bold text-sm">All</span>
                    </button>
                    {megaMenuLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="hover:outline hover:outline-1 hover:outline-white px-3 py-2 rounded text-sm font-medium transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {/* Dynamic Categories Shortcut */}
                    <div className="hidden lg:flex items-center">
                        {categories.slice(0, 5).map(cat => (
                            <Link 
                                key={cat.id} 
                                href={`/${locale}/vendors?category=${cat.slug}`}
                                className="hover:outline hover:outline-1 hover:outline-white px-3 py-2 rounded text-sm transition-all"
                            >
                                {locale === 'fr' ? cat.nameFr : cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Amazon-Style Slide-In Mega Menu ── */}
            {isMegaMenuOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsMegaMenuOpen(false)}
                    />
                    
                    {/* Drawer */}
                    <div className="relative w-[365px] h-full bg-white dark:bg-[#111] animate-slide-in-left overflow-y-auto">
                        {/* Header */}
                        <div className="bg-[#232f3e] text-white p-6 flex items-center justify-between sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 border border-white/20 rounded-full">
                                    <User className="w-5 h-5 text-gray-300" />
                                </div>
                                <span className="text-lg font-black uppercase tracking-tighter italic">Hello, {user ? user.name : 'Sign In'}</span>
                            </div>
                            <button onClick={() => setIsMegaMenuOpen(false)}>
                                <X className="w-8 h-8 text-white hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-6">
                            {/* Trending Section */}
                            <div>
                                <h3 className="px-4 text-lg font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">Trending</h3>
                                <div className="space-y-1">
                                    <Link href="#" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm transition-colors">Best Sellers</Link>
                                    <Link href="#" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm transition-colors">New Releases</Link>
                                    <Link href="#" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm transition-colors">Movers & Shakers</Link>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 dark:bg-white/5 mx-4" />

                            {/* Categories Section */}
                            <div>
                                <h3 className="px-4 text-lg font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">Shop By Category</h3>
                                <div className="space-y-1">
                                    {categories.map(cat => (
                                        <Link 
                                            key={cat.id} 
                                            href={`/${locale}/vendors?category=${cat.slug}`}
                                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm transition-all group"
                                            onClick={() => setIsMegaMenuOpen(false)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg opacity-70 group-hover:scale-110 transition-transform">{cat.icon || '📦'}</span>
                                                <span>{locale === 'fr' ? cat.nameFr : cat.name}</span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 -rotate-90 opacity-40 group-hover:opacity-100" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 dark:bg-white/5 mx-4" />

                            {/* Help & Settings */}
                            <div>
                                <h3 className="px-4 text-lg font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">Help & Settings</h3>
                                <div className="space-y-1">
                                    <Link href={`/${locale}/dashboard/customer`} className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm">Your Account</Link>
                                    <Link href={`/${otherLocale}`} className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm">
                                        <Globe className="w-4 h-4" />
                                        {otherLocale === 'fr' ? 'Français' : 'English'}
                                    </Link>
                                    <Link href="#" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm">Customer Service</Link>
                                    {user && (
                                        <button 
                                            onClick={() => signOut()}
                                            className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 rounded-lg text-sm font-bold transition-all"
                                        >
                                            Sign Out
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
