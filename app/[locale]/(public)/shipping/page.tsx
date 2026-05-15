import { getLocale } from 'next-intl/server'
import { Truck, Clock, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata = {
    title: 'Shipping & Delivery | INOVAMARK',
    description: 'Learn about INOVAMARK shipping options, delivery times, and coverage areas.',
}

export default async function ShippingPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'

    const zones = [
        { city: 'Yaoundé', time: '1-2h', price: '500 FCFA' },
        { city: 'Douala', time: '2-4h', price: '1,000 FCFA' },
        { city: 'Bafoussam', time: '4-6h', price: '2,000 FCFA' },
        { city: 'Garoua', time: '1-2 jours', price: '3,500 FCFA' },
        { city: 'Bertoua', time: '1-2 jours', price: '3,000 FCFA' },
        { city: 'Buea', time: '3-5h', price: '2,500 FCFA' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Hero */}
            <div className="bg-[#131921] text-white py-20 px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <Truck className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">
                            {isFr ? 'Logistique Mondiale' : 'Global Logistics'}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter italic uppercase leading-none">
                        {isFr ? 'LIVRAISON' : 'SHIPPING'}
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-16 space-y-12">
                {/* How it works */}
                <div className="bg-white dark:bg-[#111] rounded-3xl p-10 border border-gray-100 dark:border-white/5 shadow-sm">
                    <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white mb-8">
                        {isFr ? 'Comment ça fonctionne' : 'How It Works'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Package, step: '01', title: isFr ? 'Passez votre commande' : 'Place Your Order', desc: isFr ? 'Choisissez vos produits et payez en toute sécurité.' : 'Choose your products and pay securely.' },
                            { icon: Truck, step: '02', title: isFr ? 'Expédition' : 'Dispatch', desc: isFr ? 'Le vendeur prépare et expédie votre colis.' : 'The vendor prepares and ships your package.' },
                            { icon: CheckCircle, step: '03', title: isFr ? 'Livraison' : 'Delivery', desc: isFr ? 'Recevez votre commande à l\'adresse indiquée.' : 'Receive your order at your address.' },
                        ].map((item) => {
                            const Icon = item.icon
                            return (
                                <div key={item.step} className="text-center space-y-4">
                                    <div className="text-5xl font-black text-gray-100 dark:text-white/10">{item.step}</div>
                                    <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto -mt-4">
                                        <Icon className="w-7 h-7 text-black" />
                                    </div>
                                    <h3 className="font-black uppercase tracking-tighter dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Delivery Zones */}
                <div className="bg-white dark:bg-[#111] rounded-3xl p-10 border border-gray-100 dark:border-white/5 shadow-sm">
                    <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white mb-8">
                        {isFr ? 'Zones de Livraison' : 'Delivery Zones'} 🇨🇲
                    </h2>
                    <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5">
                        {zones.map((zone, i) => (
                            <div key={zone.city} className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? 'bg-gray-50 dark:bg-white/5' : 'bg-white dark:bg-transparent'}`}>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    <span className="font-bold dark:text-white">{zone.city}</span>
                                </div>
                                <div className="flex items-center gap-8 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {zone.time}</span>
                                    <span className="font-black text-orange-600">{zone.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {isFr ? 'Les délais peuvent varier selon le vendeur et la localisation exacte.' : 'Delivery times may vary by vendor and exact location.'}
                    </p>
                </div>
            </div>
        </div>
    )
}
