'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Store, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
    const t = useTranslations('footer')
    const locale = useLocale()

    return (
        <footer className="bg-[#10141d] text-gray-400 mt-auto border-t border-white/5">
            {/* Elite Back to Top */}
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-[#1a1f29] hover:bg-[#232f3e] py-4 text-xs font-black uppercase tracking-widest text-white transition-all border-b border-white/5"
            >
                Back to the Summit
            </button>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Elite */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-lg">
                                <Store className="w-6 h-6 text-[#0a0a0a]" />
                            </div>
                            <span className="text-2xl font-display font-black text-white tracking-tighter italic">
                                INOVA<span className="text-primary">MARK</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm">
                            {t('tagline')} — Elevating the commerce landscape of Central Africa through elite partnership and world-class logistics.
                        </p>
                        <div className="space-y-4 text-xs font-bold uppercase tracking-wider">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary transition-all">
                                    <MapPin className="w-4 h-4 text-primary group-hover:text-black" />
                                </div>
                                <span className="group-hover:text-white transition-colors">Yaoundé HQ, Cameroon</span>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary transition-all">
                                    <Mail className="w-4 h-4 text-primary group-hover:text-black" />
                                </div>
                                <a href="mailto:concierge@inovamark.cm" className="group-hover:text-white transition-colors">
                                    concierge@inovamark.cm
                                </a>
                            </div>
                        </div>
                        {/* Elite Socials */}
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black hover:-translate-y-1 transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Elite Nav Columns */}
                    <div>
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">The Market</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            {[
                                { label: 'Elite Vendors', href: `/${locale}/vendors` },
                                { label: 'Grand Categories', href: `/${locale}/categories` },
                                { label: 'Prime Deals', href: `/${locale}/deals` },
                                { label: 'New Arrivals', href: `/${locale}/new` },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Partnership</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            {[
                                { label: 'Become a Partner', href: `/${locale}/become-vendor` },
                                { label: 'Partner Portal', href: `/${locale}/dashboard/vendor` },
                                { label: 'Our Vision', href: `/${locale}/about` },
                                { label: 'Global Logistics', href: `/${locale}/shipping` },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 border-l-2 border-primary pl-4">Foundation</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            {[
                                { label: 'Concierge', href: `/${locale}/contact` },
                                { label: 'Elite Terms', href: `/${locale}/terms` },
                                { label: 'Privacy Protocols', href: `/${locale}/privacy` },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Secure Payment Strip */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t('legal')}</p>
                        <div className="flex gap-4">
                            <span className="text-[10px] text-primary/50 font-bold italic tracking-tighter">Obsidian & Gold Edition</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">System Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
