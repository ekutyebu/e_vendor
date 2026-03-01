import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Store, Sparkles, TrendingUp, ShieldCheck, Globe, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import HeroCarousel from '@/components/home/HeroCarousel'
import ProductCarousel from '@/components/home/ProductCarousel'
import CategoryGrid from '@/components/home/CategoryGrid'

export default async function HomePage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'
    const session = await auth()
    const user = session?.user

    // Fetch dynamic data
    let featuredVendors: any[] = []
    let categories: any[] = []
    let deals: any[] = []
    let bestSellers: any[] = []
    let trending: any[] = []

    try {
        const [v, c, p] = await Promise.all([
            prisma.vendor.findMany({
                where: { isActive: true },
                include: { category: true },
                orderBy: { rating: 'desc' },
                take: 8
            }),
            prisma.category.findMany({
                take: 12
            }),
            prisma.product.findMany({
                where: { isActive: true, compareAtPrice: { gt: 0 } },
                include: { vendor: true, category: true },
                orderBy: { rating: 'desc' },
                take: 12
            })
        ])
        
        featuredVendors = v
        categories = c
        deals = p
        bestSellers = [...p].sort(() => 0.5 - Math.random()) // Simulated for now
        trending = [...p].reverse()
    } catch (error) {
        console.error("Home Data Fetch Error:", error)
    }

    return (
        <div className="bg-[#fafafa] dark:bg-[#0a0a0a] min-h-screen pb-20 font-sans selection:bg-primary selection:text-black animate-fade-in">
            
            {/* ── HERO ECOSYSTEM ────────────────────────────────────────── */}
            <HeroCarousel locale={locale} />

            {/* ── MOSAIC OVERLAY (Category Grid & Trust) ──────────────────── */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <CategoryGrid categories={categories} locale={locale} />
                
                {/* ── TRUST & AUTHENTICITY ──────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2 card-elite p-8 rounded-[2.5rem] bg-black text-white border-0 flex flex-col md:flex-row justify-between items-center gap-8 shadow-3xl group">
                        <div className="space-y-4 text-center md:text-left">
                            <h2 className="text-3xl font-display font-black tracking-tighter italic text-primary uppercase">INOVA PRO GUARANTEE</h2>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-md">Our diplomatic-grade verification ensures every vendor is authenticated and every product is genuine.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest">VERIFIED</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest">PAN-AFRICAN</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-elite p-8 rounded-[2.5rem] dark:bg-[#111] dark:border-white/5 flex flex-col justify-center text-center space-y-4">
                        <h2 className="text-2xl font-black tracking-tighter italic uppercase">Scale Your Empire</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Join 500+ Elite Merchants</p>
                        <Link href={`/${locale}/become-vendor`} className="inline-block p-4 gold-gradient text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                            Become a Vendor
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── DYNAMIC PRODUCT FLOWS ──────────────────── */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
                <ProductCarousel 
                    title={isFr ? "OFFRES ÉCLAIR" : "FLASH DEALS"} 
                    subtitle="Limited time opportunities"
                    products={deals}
                    locale={locale}
                    viewAllLink={`/${locale}/vendors`}
                />

                <ProductCarousel 
                    title={isFr ? "MEILLEURES VENTES" : "BEST SELLERS"} 
                    subtitle="Most requested assets"
                    products={bestSellers}
                    locale={locale}
                    viewAllLink={`/${locale}/vendors`}
                />

                {/* ── MID-PAGE BANNER ──────────────────── */}
                <div className="relative w-full h-[400px] rounded-[3rem] overflow-hidden group">
                    <Image 
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?w=1600&q=80" 
                        alt="Join Inova" 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-[10s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-12 lg:p-24">
                        <div className="max-w-xl space-y-6">
                            <h2 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter italic uppercase leading-none">The <span className="text-primary">Future</span> of Commerce</h2>
                            <p className="text-gray-300 font-medium text-lg leading-relaxed">INOVAMARK provides the ultimate infrastructure for vendors to scale globally. Connect with millions of high-intent customers today.</p>
                            <Link href={`/${locale}/signup?role=VENDOR`} className="inline-block px-10 py-5 gold-gradient text-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl">
                                INITIATE ONBOARDING
                            </Link>
                        </div>
                    </div>
                </div>

                <ProductCarousel 
                    title={isFr ? "TENDANCES" : "TRENDING NOW"} 
                    subtitle="Cultural peak selection"
                    products={trending}
                    locale={locale}
                    viewAllLink={`/${locale}/vendors`}
                />
            </div>

            {/* ── FLAGSHIP SHOWCASE ──────────────────── */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                 <div className="bg-[#10141d] rounded-[3rem] p-12 relative overflow-hidden shadow-3xl">
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-end gap-12 mb-16">
                        <div className="max-w-xl border-l-4 border-primary pl-8">
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
                                    <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500 relative">
                                        <Image src={vendor.logo || '/images/vendor-placeholder.png'} alt="Logo" fill className="object-contain p-2" />
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
        </div>
    )
}
