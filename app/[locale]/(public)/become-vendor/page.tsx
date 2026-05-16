'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { 
    CheckCircle2, Rocket, ShieldCheck, Wallet, BarChart3, 
    Globe, ArrowRight, Store, Zap, Users, Camera, FileText, 
    Upload, AlertCircle, Loader2, Landmark, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type OnboardingStep = 'MARKETING' | 'IDENTITY' | 'BIOMETRICS' | 'LEGAL' | 'PENDING'

export default function BecomeVendorPage() {
    const { data: session } = useSession()
    const t = useTranslations('becomeVendor')
    const locale = useLocale()
    
    const [step, setStep] = useState<OnboardingStep>('MARKETING')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [idType, setIdType] = useState('National ID')
    const [idNumber, setIdNumber] = useState('')
    const [taxId, setTaxId] = useState('')
    const [deliveryServices, setDeliveryServices] = useState<string[]>([])
    const [agreed, setAgreed] = useState(false)

    const handleStart = () => {
        if (!session) {
            window.location.href = `/${locale}/signup?role=VENDOR`
            return
        }
        setStep('IDENTITY')
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        // Simulated API call
        await new Promise(r => setTimeout(r, 2500))
        setIsSubmitting(false)
        setStep('PENDING')
    }

    const toggleDelivery = (service: string) => {
        setDeliveryServices(prev => 
            prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
        )
    }

    if (step === 'MARKETING') {
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
                                <Button onClick={handleStart} size="lg" className="h-16 px-10 rounded-2xl gold-gradient text-[#131921] font-black uppercase tracking-wider shadow-2xl shadow-orange-500/20 hover:scale-105 transition-all text-base border-0">
                                    {session ? "Start Verification" : t('hero.cta')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
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
                            {[
                                { title: t('benefits.feature1Title'), desc: t('benefits.feature1Desc'), icon: <Users className="w-8 h-8 text-orange-500" /> },
                                { title: t('benefits.feature2Title'), desc: t('benefits.feature2Desc'), icon: <Wallet className="w-8 h-8 text-orange-500" /> },
                                { title: t('benefits.feature3Title'), desc: t('benefits.feature3Desc'), icon: <BarChart3 className="w-8 h-8 text-orange-500" /> },
                                { title: t('benefits.feature4Title'), desc: t('benefits.feature4Desc'), icon: <ShieldCheck className="w-8 h-8 text-orange-500" /> }
                            ].map((benefit, i) => (
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
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#080808] py-20 px-4">
            <div className="max-w-3xl mx-auto">
                
                {/* Progress Bar */}
                <div className="flex gap-2 mb-12">
                    {['IDENTITY', 'BIOMETRICS', 'LEGAL'].map((s, i) => (
                        <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                            step === s ? 'bg-orange-500 w-2/3 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 
                            (i < ['IDENTITY', 'BIOMETRICS', 'LEGAL'].indexOf(step) ? 'bg-green-500' : 'bg-gray-200 dark:bg-white/10')
                        }`} />
                    ))}
                </div>

                <div className="bg-white dark:bg-[#111] rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 premium-gradient opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />

                    {step === 'IDENTITY' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">Identity Verification</h2>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Step 1 of 3</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Identification Type</label>
                                    <select 
                                        value={idType}
                                        onChange={(e) => setIdType(e.target.value)}
                                        className="w-full h-16 bg-gray-50 dark:bg-white/5 rounded-2xl px-6 border-0 focus:ring-2 focus:ring-orange-500 font-bold dark:text-white appearance-none"
                                    >
                                        <option>National ID</option>
                                        <option>Passport</option>
                                        <option>Driving License</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID Number</label>
                                    <input 
                                        type="text"
                                        value={idNumber}
                                        onChange={(e) => setIdNumber(e.target.value)}
                                        placeholder="Enter your document number"
                                        className="w-full h-16 bg-gray-50 dark:bg-white/5 rounded-2xl px-6 border-0 focus:ring-2 focus:ring-orange-500 font-bold dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-center gap-4 hover:border-orange-500/50 transition-colors cursor-pointer group">
                                        <input type="file" className="hidden" accept="image/*" />
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">ID Front Side</span>
                                    </label>
                                    <label className="p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-center gap-4 hover:border-orange-500/50 transition-colors cursor-pointer group">
                                        <input type="file" className="hidden" accept="image/*" />
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">ID Back Side</span>
                                    </label>
                                </div>
                            </div>

                            <Button onClick={() => setStep('BIOMETRICS')} className="w-full h-16 gold-gradient rounded-2xl font-black uppercase tracking-widest text-xs">
                                Continue to Biometrics
                            </Button>
                        </div>
                    )}

                    {step === 'BIOMETRICS' && (
                        <div className="space-y-8 animate-fade-in text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">Bio-Verification</h2>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Step 2 of 3</p>
                            </div>

                            <div className="relative w-48 h-48 mx-auto">
                                <div className="absolute inset-0 rounded-full border-4 border-orange-500 animate-pulse" />
                                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center border-4 border-white dark:border-[#111]">
                                    <Camera className="w-16 h-16 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-4 max-w-sm mx-auto">
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    Please take a clear selfie holding your ID card next to your face for verification.
                                </p>
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-gray-200 dark:border-white/10 font-black uppercase tracking-widest text-[10px]">
                                    Open Camera
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-white/5"></div></div>
                                    <span className="relative bg-white dark:bg-[#111] px-4 text-[10px] font-black text-gray-400">OR</span>
                                </div>
                                <label className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center bg-transparent border-2 border-gray-100 dark:border-white/5 hover:bg-white/5 cursor-pointer transition-all">
                                    <input type="file" className="hidden" accept="image/*" />
                                    Upload Photo
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setStep('IDENTITY')} className="flex-1 h-16 font-black uppercase tracking-widest text-xs">Back</Button>
                                <Button onClick={() => setStep('LEGAL')} className="flex-[2] h-16 gold-gradient rounded-2xl font-black uppercase tracking-widest text-xs">Next Step</Button>
                            </div>
                        </div>
                    )}

                    {step === 'LEGAL' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">Legal & Compliance</h2>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Step 3 of 3</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tax Registration ID (optional)</label>
                                    <input 
                                        type="text"
                                        value={taxId}
                                        onChange={(e) => setTaxId(e.target.value)}
                                        placeholder="Enter your NIU or Business Tax ID"
                                        className="w-full h-16 bg-gray-50 dark:bg-white/5 rounded-2xl px-6 border-0 focus:ring-2 focus:ring-orange-500 font-bold dark:text-white"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Services Offered</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['In-House Delivery', 'Pick-up Point', 'Standard Shipping', 'Express 24h'].map(s => (
                                            <button 
                                                key={s}
                                                onClick={() => toggleDelivery(s)}
                                                className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${
                                                    deliveryServices.includes(s) ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-100 dark:border-white/10 text-gray-500'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-orange-500/5 rounded-3xl border border-orange-500/10 flex gap-4">
                                    <input 
                                        type="checkbox" 
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="w-5 h-5 mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer" 
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        I agree to the <Link href="/terms" className="text-orange-500 hover:underline">Vendor Terms of Service</Link> and <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>. I certify that all provided information is accurate and authentic.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setStep('BIOMETRICS')} className="flex-1 h-16 font-black uppercase tracking-widest text-xs">Back</Button>
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={!agreed || isSubmitting}
                                    className="flex-[2] h-16 gold-gradient rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'PENDING' && (
                        <div className="space-y-8 animate-fade-in text-center py-10">
                            <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-12 h-12 text-blue-500" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">Application Under Review</h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
                                    Your documents have been successfully submitted for manual review. Our team will verify your identity and tax details within 24-48 hours.
                                </p>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-white/5" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">You will receive an email once your account is active.</p>
                            <Link href={`/${locale}`}>
                                <Button variant="outline" className="w-full h-16 rounded-2xl border-2 border-gray-100 dark:border-white/10 font-black uppercase tracking-widest text-xs">
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    )}

                </div>

                {/* Trust Footer */}
                <div className="mt-12 flex items-center justify-center gap-12 grayscale opacity-40">
                    <ShieldCheck className="w-8 h-8" />
                    <Landmark className="w-8 h-8" />
                    <Building2 className="w-8 h-8" />
                </div>
            </div>
        </div>
    )
}
