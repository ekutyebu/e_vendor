import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { Shield, Globe, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react'

export const metadata = {
    title: 'About INOVAMARK | Our Vision',
    description: 'Learn about INOVAMARK — Central Africa\'s premier multi-vendor e-commerce platform.',
}

export default async function AboutPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'

    const stats = [
        { value: '500+', label: isFr ? 'Vendeurs Vérifiés' : 'Verified Vendors' },
        { value: '10K+', label: isFr ? 'Produits Listés' : 'Products Listed' },
        { value: '2', label: isFr ? 'Langues' : 'Languages' },
        { value: '100%', label: isFr ? 'Sécurisé' : 'Secure' },
    ]

    const values = [
        {
            icon: Shield,
            title: isFr ? 'Confiance & Sécurité' : 'Trust & Security',
            desc: isFr ? 'Chaque vendeur est vérifié et chaque transaction est protégée.' : 'Every vendor is verified and every transaction is protected.',
        },
        {
            icon: Globe,
            title: isFr ? 'Portée Pan-Africaine' : 'Pan-African Reach',
            desc: isFr ? 'Connecter les commerces locaux à une audience mondiale.' : 'Connecting local businesses to a global audience.',
        },
        {
            icon: Users,
            title: isFr ? 'Communauté d\'Élite' : 'Elite Community',
            desc: isFr ? 'Un réseau de marchands et de clients premium.' : 'A network of premium merchants and customers.',
        },
        {
            icon: Zap,
            title: isFr ? 'Innovation Continue' : 'Continuous Innovation',
            desc: isFr ? 'Toujours en avance pour offrir la meilleure expérience.' : 'Always ahead to deliver the best experience.',
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#131921] via-[#1a2332] to-[#232f3e] text-white py-24 px-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ff6600 0%, transparent 60%)' }} />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">
                        {isFr ? 'Notre Identité' : 'Our Identity'}
                    </span>
                    <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter italic uppercase mt-4 leading-none">
                        {isFr ? 'NOTRE VISION' : 'OUR VISION'}
                    </h1>
                    <p className="mt-8 text-gray-400 max-w-2xl mx-auto text-xl leading-relaxed">
                        {isFr
                            ? 'INOVAMARK est né d\'une vision simple : bâtir la place de marché la plus élite d\'Afrique Centrale, où chaque vendeur peut briller et chaque client peut découvrir l\'excellence.'
                            : 'INOVAMARK was born from a simple vision: to build Central Africa\'s most elite marketplace, where every vendor can shine and every customer can discover excellence.'}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-5xl mx-auto px-8 -mt-12 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-xl text-center">
                            <div className="text-4xl font-display font-black tracking-tighter text-orange-500">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Values */}
            <div className="max-w-5xl mx-auto px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic dark:text-white">
                        {isFr ? 'Nos Valeurs Fondamentales' : 'Our Core Values'}
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {values.map((v) => {
                        const Icon = v.icon
                        return (
                            <div key={v.title} className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm flex gap-6">
                                <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center shrink-0">
                                    <Icon className="w-7 h-7 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase tracking-tighter dark:text-white">{v.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-5xl mx-auto px-8 pb-20">
                <div className="bg-[#131921] rounded-[3rem] p-12 text-center text-white space-y-6">
                    <h2 className="text-4xl font-display font-black tracking-tighter italic uppercase">
                        {isFr ? 'Rejoignez l\'Empire' : 'Join the Empire'}
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        {isFr ? 'Devenez partenaire vendeur et touchez des millions de clients.' : 'Become a vendor partner and reach millions of customers.'}
                    </p>
                    <Link href={`/${locale}/become-vendor`} className="inline-flex items-center gap-2 px-10 py-5 gold-gradient text-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all">
                        {isFr ? 'DEVENIR PARTENAIRE' : 'BECOME A PARTNER'} <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
