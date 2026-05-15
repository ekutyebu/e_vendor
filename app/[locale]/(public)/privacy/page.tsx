import { getLocale } from 'next-intl/server'
import { Lock } from 'lucide-react'

export const metadata = {
    title: 'Privacy Policy | INOVAMARK',
}

export default async function PrivacyPage() {
    const locale = await getLocale()
    const isFr = locale === 'fr'

    const sections = isFr ? [
        { title: '1. Données collectées', content: 'Nous collectons les informations que vous nous fournissez lors de la création de compte (nom, email, téléphone), ainsi que les données de navigation et de transaction nécessaires au fonctionnement de la plateforme.' },
        { title: '2. Utilisation des données', content: 'Vos données sont utilisées pour gérer votre compte, traiter vos commandes, améliorer nos services et vous envoyer des communications pertinentes. Nous ne vendons jamais vos données à des tiers.' },
        { title: '3. Sécurité', content: 'Nous utilisons un chiffrement SSL/TLS et un hachage bcrypt pour protéger vos mots de passe. Toutes les connexions à la base de données sont cryptées. La vérification en 2 étapes est obligatoire lors de l\'inscription.' },
        { title: '4. Vos droits', content: 'Vous avez le droit d\'accéder, de modifier ou de supprimer vos données personnelles à tout moment depuis votre tableau de bord. Pour toute demande, contactez-nous à privacy@inovamark.cm.' },
        { title: '5. Cookies', content: 'Nous utilisons des cookies essentiels au fonctionnement de la plateforme et des cookies analytiques anonymes pour améliorer l\'expérience utilisateur. Vous pouvez les désactiver dans les paramètres de votre navigateur.' },
    ] : [
        { title: '1. Data We Collect', content: 'We collect information you provide when creating an account (name, email, phone), as well as browsing and transaction data necessary for the platform\'s operation.' },
        { title: '2. Data Usage', content: 'Your data is used to manage your account, process your orders, improve our services, and send you relevant communications. We never sell your data to third parties.' },
        { title: '3. Security', content: 'We use SSL/TLS encryption and bcrypt hashing to protect your passwords. All database connections are encrypted. Two-step verification is mandatory upon registration.' },
        { title: '4. Your Rights', content: 'You have the right to access, modify or delete your personal data at any time from your dashboard. For any request, contact us at privacy@inovamark.cm.' },
        { title: '5. Cookies', content: 'We use cookies essential to the platform\'s operation and anonymous analytical cookies to improve user experience. You can disable them in your browser settings.' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="bg-[#131921] text-white py-20 px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">Legal</span>
                    </div>
                    <h1 className="text-5xl font-display font-black tracking-tighter italic uppercase">
                        {isFr ? 'POLITIQUE DE CONFIDENTIALITÉ' : 'PRIVACY POLICY'}
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
