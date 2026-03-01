import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Store, Sparkles, TrendingUp, ShieldCheck, Globe, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shared/ProductCard'
import { auth } from '@/lib/auth'

export default async function HomePage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'
    const session = await auth()
    const user = session?.user

    // Fetch elite data from DB with stability fallbacks
    let featuredVendors: any[] = []
    let categories: any[] = []
    let topProducts: any[] = []

    try {
        const [v, c, p] = await Promise.all([
            prisma.vendor.findMany({
                where: { isActive: true },
                include: { category: true },
                orderBy: { rating: 'desc' },
                take: 4
            }),
            prisma.category.findMany({
                take: 12
            }),
            prisma.product.findMany({
                where: { isActive: true },
                include: { vendor: true },
                orderBy: { rating: 'desc' },
                take: 12
            })
        ])
        featuredVendors = v
        categories = c
        topProducts = p
    } catch (error) {
        console.error("Critical stability alert: Database fetch failed", error)
    }

    return (
        <div className="bg-[#fafafa] dark:bg-[#0a0a0a] min-h-screen pb-20 font-sans selection:bg-primary selection:text-black">
            
            {/* ── ELITE HERO ECOSYSTEM ────────────────────────────────────────── */}
            <div className="relative w-full h-[600px] lg:h-[750px] overflow-hidden">
                {/* Cinematic Background */}
                <Image
                    src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&q=80"
                    alt="Elite Lifestyle"
                    fill
                    className="object-cover object-center scale-105 animate-pulse-slow active:scale-100 transition-transform duration-[10s]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#fafafa] dark:to-[#0a0a0a]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent" />

                {/* Personalized Hero Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-3xl space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full obsidian-glass text-primary text-xs font-black uppercase tracking-widest border border-primary/20 animate-fade-in">
                                <Sparkles className="w-4 h-4" />
                                {isFr ? 'L\'Excellence à votre portée' : 'Excellence within reach'}
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter italic">
                                {user ? (
                                    <>
                                        {isFr ? 'RE-BIENVENUE,' : 'WELCOME BACK,'} <br/><span className="text-primary">{(user.name?.split(' ')[0] || '').toUpperCase()}</span>
                                    </>
                                ) : (
                                    <>
                                        {isFr ? 'VIVEZ' : 'CRAFTING'} <br/><span className="text-primary italic">THE ELITE</span> MARKET
                                    </>
                                )}
                            </h1>
                            
                            <p className="text-lg md:text-2xl text-gray-300 max-w-xl font-medium leading-relaxed">
                                {isFr 
                                    ? "Découvrez une curation méticuleuse des meilleurs vendeurs d'Afrique Centrale dans un écosystème de prestige." 
                                    : "Experience a meticulous curation of Central Africa's finest vendors within a prestigious commerce ecosystem."}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href={`/${locale}/vendors`} className="gold-gradient text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:-translate-y-1 hover:shadow-primary/60 transition-all">
                                    {isFr ? 'Explorer la Collection' : 'Explore Collection'}
                                </Link>
                                {!user && (
                                    <Link href={`/${locale}/signup`} className="px-8 py-4 rounded-2xl obsidian-glass text-white font-black uppercase tracking-widest text-sm border border-white/20 hover:bg-white/10 transition-all">
                                        {isFr ? 'Devenir Membre' : 'Become a Member'}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ELITE MOSAIC SECTION (Amazon+Alibaba Fusion) ────────────────── */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Personalized Status Card (Context Aware) */}
                    <div className="card-elite p-8 rounded-[2.5rem] flex flex-col justify-between dark:bg-[#111] dark:border-white/5">
                        {user ? (
                            <>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter mb-2 italic">YOUR STATUS</h2>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Elite Session Active</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-[#fafafa] dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Recent Activity</p>
                                            <p className="text-sm font-black mt-1">Pending Orders: 0</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/${locale}/dashboard/${user.role?.toLowerCase()}`} className="group flex items-center justify-between mt-8 text-sm font-black uppercase tracking-widest hover:text-primary transition-colors">
                                    Enter Dashboard <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tighter mb-4 italic">JOIN THE GUILD</h2>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Unlock exclusive pricing and prioritized logistics across the continent.</p>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <Link href={`/${locale}/signin`} className="flex w-full items-center justify-center p-4 gold-gradient text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Sign In</Link>
                                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase py-2">or</p>
                                    <Link href={`/${locale}/signup`} className="flex w-full items-center justify-center p-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform">Create Account</Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Elite Category Mosaic */}
                    <div className="lg:col-span-2 card-elite p-8 rounded-[2.5rem] dark:bg-[#111] dark:border-white/5">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter italic uppercase">The Gallery</h2>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Curation by Category</p>
                            </div>
                            <Link href={`/${locale}/categories`} className="text-xs font-black uppercase tracking-widest hover:text-primary underline-offset-8 hover:underline">All Sectors</Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {categories.slice(0, 4).map(cat => (
                                <Link key={cat.id} href={`/${locale}/vendors?category=${cat.slug}`} className="group space-y-3">
                                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all group-hover:border-primary/50 group-hover:shadow-2xl">
                                        <Image src={cat.image || '/images/placeholder.png'} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </div>
                                    <span className="block text-[10px] font-black text-center uppercase tracking-widest group-hover:text-primary transition-colors truncate">
                                        {isFr ? cat.nameFr : cat.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Elite Trust Widget */}
                    <div className="card-elite p-8 rounded-[2.5rem] bg-black text-white border-0 flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black tracking-tighter italic text-primary uppercase">INOVA PRO</h2>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">Our verified vendor program ensures 100% authenticity and diplomatic-grade logistics.</p>
                            
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Origins</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Global Standards</span>
                                </div>
                            </div>
                        </div>
                        <Link href={`/${locale}/become-vendor`} className="p-4 border border-primary/30 rounded-2xl text-center text-[10px] font-black uppercase tracking-wider hover:bg-primary hover:text-black transition-all">
                            Partner With Us
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── PRIME SELECTION SCROLLER (Amazon Influence) ──────────────────── */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-12 border-l-4 border-primary pl-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic uppercase">Prime Selections</h2>
                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">The Absolute Peak of Value & Quality</p>
                    </div>
                    <Link href={`/${locale}/vendors`} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all">
                        View Complete Inventory <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {topProducts.map((product) => (
                        <ProductCard key={product.id} product={product} locale={locale} />
                    ))}
                </div>
            </div>

            {/* ── ALIBABA STYLE STOREFRONT SHOWCASE ────────────────────────────── */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                 <div className="bg-[#10141d] rounded-[3rem] p-12 relative overflow-hidden shadow-3xl">
                    <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                        <TrendingUp className="w-96 h-96 text-primary" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-12 mb-16">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter italic uppercase leading-none">Global <span className="text-primary">Flagships</span></h2>
                            <p className="mt-6 text-gray-400 font-medium text-lg leading-relaxed">Engage directly with the visionary founders and verified official stores of the region.</p>
                        </div>
                        <Link href={`/${locale}/vendors`} className="gold-gradient text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                            Discover All Flagships
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {featuredVendors.map((vendor) => (
                            <Link key={vendor.id} href={`/${locale}/vendors/${vendor.id}`} className="group relative bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/50 transition-all h-[350px]">
                                <Image
                                    src={vendor.coverImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'}
                                    alt={vendor.businessName}
                                    fill
                                    className="object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 w-full p-8 space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500">
                                         <div className="relative w-full h-full rounded-xl bg-gray-50 overflow-hidden">
                                            {vendor.logo ? (
                                                <Image src={vendor.logo} alt="Logo" fill className="object-cover" />
                                            ) : (
                                                <Store className="w-8 h-8 m-auto mt-2 text-gray-300" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tighter truncate italic group-hover:text-primary transition-colors">
                                            {vendor.businessName.toUpperCase()}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{vendor.city}</span>
                                            <div className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Flagship</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                 </div>
            </div>

            {/* ── DYNAMIC RECOMMENDATION ENGINE ───────────────────────────────── */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-black tracking-tighter italic uppercase">Personalized Curations</h2>
                    <div className="h-px flex-1 bg-gray-100 dark:bg-white/5 mx-8" />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {topProducts.slice().reverse().map((product) => (
                        <ProductCard key={`rec-${product.id}`} product={product} locale={locale} />
                    ))}
                </div>
            </div>

        </div>
    )
}
