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

export default async function LocaleLayout(
    props: {
        children: React.ReactNode
        params: Promise<{ locale: string }>
    }
) {
    const params = await props.params;
    const locale = params.locale;

    if (!routing.locales.includes(locale as 'en' | 'fr')) {
        notFound()
    }

    const messages = await getMessages()

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    )
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}
