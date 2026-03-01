import createMiddleware from 'next-intl/middleware'
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)
const { auth } = NextAuth(authConfig)

const protectedRoutes = ['/vendor', '/admin', '/customer']
const adminRoutes = ['/admin']
const vendorRoutes = ['/vendor']

export default function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname

    // Extract locale-stripped path
    const segments = pathname.split('/')
    const maybeLocale = segments[1]
    const isLocalePrefix = ['en', 'fr'].includes(maybeLocale)
    
    // Handle locale redirect
    const pathnameIsMissingLocale = routing.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (pathnameIsMissingLocale) {
        return NextResponse.redirect(
            new URL(`/${routing.defaultLocale}${pathname}`, req.url)
        )
    }

    return intlMiddleware(req)
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
