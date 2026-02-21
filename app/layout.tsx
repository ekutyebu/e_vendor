import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
    title: {
        default: 'INOVAMARK - Central Africa\'s Multi-Vendor Marketplace',
        template: '%s | INOVAMARK',
    },
    description:
        'INOVAMARK connects customers with hundreds of local vendors across Central Africa. Shop fashion, food, electronics, and more with local payment methods.',
    keywords: ['marketplace', 'e-commerce', 'Cameroon', 'Central Africa', 'vendors', 'online shopping'],
    openGraph: {
        title: 'INOVAMARK - Shop Local, Think Global',
        description: 'Central Africa\'s premier multi-vendor marketplace',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html suppressHydrationWarning>
            <body className={inter.className}>{children}</body>
        </html>
    )
}
