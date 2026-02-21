import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Store, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
    const t = useTranslations('footer')
    const locale = useLocale()

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">INOVAMARK</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4 max-w-sm">{t('tagline')}</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span>Yaoundé, Cameroun</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <a href="mailto:contact@inovamark.cm" className="hover:text-white transition-colors">
                                    contact@inovamark.cm
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Phone className="w-4 h-4 text-blue-400" />
                                <span>+237 6XX XXX XXX</span>
                            </div>
                        </div>
                        {/* Social */}
                        <div className="flex gap-3 mt-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Marketplace</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                { label: 'Browse Vendors', href: `/${locale}/vendors` },
                                { label: 'All Categories', href: `/${locale}/categories` },
                                { label: 'Special Deals', href: `/${locale}/deals` },
                                { label: 'New Arrivals', href: `/${locale}/new` },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-white hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sell */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">For Vendors</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                { label: 'Sell on INOVAMARK', href: `/${locale}/become-vendor` },
                                { label: 'Vendor Dashboard', href: `/${locale}/dashboard/vendor` },
                                { label: t('links.about'), href: `/${locale}/about` },
                                { label: t('links.contact'), href: `/${locale}/contact` },
                                { label: t('links.terms'), href: `/${locale}/terms` },
                                { label: t('links.privacy'), href: `/${locale}/privacy` },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-white hover:translate-x-1 inline-block transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">{t('legal')}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>🔒 Secured payments</span>
                        <span>·</span>
                        <span>🚀 Fast delivery</span>
                        <span>·</span>
                        <span>📞 24/7 Support</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
