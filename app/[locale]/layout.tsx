import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

export const metadata: Metadata = {
    title: {
        default: "INOVAMARK - Central Africa's Multi-Vendor Marketplace",
        template: '%s | INOVAMARK',
    },
    description:
        "Shop from hundreds of verified local vendors across Central Africa. Pay with Orange Money, Mobile Money, or Cash on Delivery.",
}

import { Providers } from '@/components/Providers'

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const locale = params.locale;

    if (!routing.locales.includes(locale as 'en' | 'fr')) {
        notFound()
    }

    const messages = await getMessages()

    return (
        <Providers locale={locale} messages={messages}>
            {children}
        </Providers>
    )
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}
