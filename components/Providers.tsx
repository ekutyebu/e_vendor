'use client'

import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl'
import { ThemeProvider } from 'next-themes'

interface ProvidersProps {
    children: React.ReactNode
    messages: AbstractIntlMessages
    locale: string
}

export function Providers({ children, messages, locale }: ProvidersProps) {
    return (
        <SessionProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </NextIntlClientProvider>
        </SessionProvider>
    )
}
