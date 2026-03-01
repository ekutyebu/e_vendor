'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { CheckCircle2, Rocket, ShieldCheck, Wallet, BarChart3, Globe, ArrowRight, Store, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BecomeVendorPage() {
    const t = useTranslations('becomeVendor')
    const locale = useLocale()

    const benefits = [
        {
            title: t('benefits.feature1Title'),
            desc: t('benefits.feature1Desc'),
            icon: <Users className="w-8 h-8 text-orange-500" />,
        },
        {
            title: t('benefits.feature2Title'),
            desc: t('benefits.feature2Desc'),
            icon: <Wallet className="w-8 h-8 text-orange-500" />,
        },
        {
            title: t('benefits.feature3Title'),
            desc: t('benefits.feature3Desc'),
            icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
        },
        {
            title: t('benefits.feature4Title'),
            desc: t('benefits.feature4Desc'),
            icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
        },
    ]

    const steps = [
        {
            title: t('steps.step1Title'),
            desc: t('steps.step1Desc'),
            icon: "1",
        },
        {
            title: t('steps.step2Title'),
            desc: t('steps.step2Desc'),
            icon: "2",
        },
        {
            title: t('steps.step3Title'),
            desc: t('steps.step3Desc'),
            icon: "3",
        },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a]">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden border-b border-gray-100 dark:border-white/5">
                <div className="absolute inset-0 premium-gradient opacity-10 dark:opacity-20 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in shadow-sm">
                            <Rocket className="w-4 h-4" />
                            Launch Your Business Today
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter italic mb-6 animate-fade-in dark:text-white leading-[0.9]">
                            {t('hero.title')}
                        </h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 font-medium">
                            {t('hero.subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="h-16 px-10 rounded-2xl gold-gradient text-[#131921] font-black uppercase tracking-wider shadow-2xl shadow-orange-500/20 hover:scale-105 transition-all text-base border-0">
                                <Link href={`/${locale}/signup?role=VENDOR`}>
                                    {t('hero.cta')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-24 bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4 dark:text-white">{t('benefits.title')}</h2>
                        <div className="w-20 h-1.5 gold-gradient mx-auto rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="card-elite p-8 rounded-[2rem] dark:bg-[#111] dark:border-white/5 group hover:bg-white dark:hover:bg-black transition-all duration-500">
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 inline-block mb-6 group-hover:bg-orange-500/10 transition-colors">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-3 dark:text-white italic">{benefit.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-y border-gray-100 dark:border-white/5 py-24">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4 dark:text-white">{t('steps.title')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Easy 1-2-3 Process</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gray-100 dark:bg-white/5 z-0" />
                        
                        {steps.map((step, i) => (
                            <div key={i} className="relative z-10 text-center flex flex-col items-center group">
                                <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111] border-2 border-orange-500 flex items-center justify-center text-2xl font-black text-orange-500 mb-8 shadow-xl group-hover:scale-110 transition-transform bg-white dark:bg-[#111]">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 dark:text-white italic">{step.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card-elite p-12 lg:p-20 rounded-[3rem] dark:bg-[#111] text-center relative overflow-hidden group">
                        <div className="absolute inset-0 premium-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                        <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter italic mb-8 dark:text-white leading-[0.9]">
                            Ready to grow your <span className="text-orange-500">Business?</span>
                        </h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
                            Join over 500 successful businesses on INOVAMARK. No hidden fees, just growth.
                        </p>
                        <Button asChild size="lg" className="h-16 px-12 rounded-2xl gold-gradient text-[#131921] font-black uppercase tracking-wider shadow-2xl shadow-orange-500/20 hover:scale-105 transition-all text-lg border-0">
                            <Link href={`/${locale}/signup?role=VENDOR`}>
                                Create Your Shop
                                <Zap className="ml-2 w-5 h-5 fill-current" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
