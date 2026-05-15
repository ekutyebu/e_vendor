import { getLocale } from 'next-intl/server'
import { FileText } from 'lucide-react'

export const metadata = {
    title: 'Terms of Service | INOVAMARK',
}

export default async function TermsPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'

    const sections = isFr ? [
        { title: '1. Acceptation des conditions', content: 'En utilisant INOVAMARK, vous acceptez d\'être lié par les présentes conditions. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.' },
        { title: '2. Utilisation de la plateforme', content: 'Vous vous engagez à utiliser INOVAMARK uniquement à des fins légales et conformément à toutes les lois applicables. Toute utilisation frauduleuse entraînera la suspension immédiate de votre compte.' },
        { title: '3. Comptes vendeurs', content: 'Les vendeurs doivent fournir des informations exactes et à jour. INOVAMARK se réserve le droit de vérifier et de suspendre les comptes non conformes.' },
        { title: '4. Paiements et remboursements', content: 'Tous les paiements sont traités de manière sécurisée. Les remboursements sont traités dans un délai de 5 à 10 jours ouvrables selon le mode de paiement utilisé.' },
        { title: '5. Confidentialité', content: 'Nous respectons votre vie privée. Vos données personnelles sont protégées conformément à notre politique de confidentialité et aux lois applicables.' },
        { title: '6. Modifications', content: 'INOVAMARK se réserve le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur la plateforme.' },
    ] : [
        { title: '1. Acceptance of Terms', content: 'By using INOVAMARK, you agree to be bound by these terms. If you do not accept these terms, please do not use our platform.' },
        { title: '2. Platform Usage', content: 'You agree to use INOVAMARK only for lawful purposes and in accordance with all applicable laws. Any fraudulent use will result in immediate account suspension.' },
        { title: '3. Vendor Accounts', content: 'Vendors must provide accurate and up-to-date information. INOVAMARK reserves the right to verify and suspend non-compliant accounts.' },
        { title: '4. Payments & Refunds', content: 'All payments are processed securely. Refunds are processed within 5-10 business days depending on the payment method used.' },
        { title: '5. Privacy', content: 'We respect your privacy. Your personal data is protected in accordance with our privacy policy and applicable laws.' },
        { title: '6. Modifications', content: 'INOVAMARK reserves the right to modify these terms at any time. Modifications take effect upon publication on the platform.' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="bg-[#131921] text-white py-20 px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">Legal</span>
                    </div>
                    <h1 className="text-5xl font-display font-black tracking-tighter italic uppercase">
                        {isFr ? 'CONDITIONS D\'UTILISATION' : 'TERMS OF SERVICE'}
                    </h1>
                    <p className="text-gray-400 mt-4 text-sm">
                        {isFr ? 'Dernière mise à jour : Mai 2026' : 'Last updated: May 2026'}
                    </p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-8 py-16 space-y-8">
                {sections.map((s) => (
                    <div key={s.title} className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                        <h2 className="text-lg font-black uppercase tracking-tighter dark:text-white mb-4">{s.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{s.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
