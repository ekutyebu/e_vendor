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

export default auth((req) => {
    const pathname = req.nextUrl.pathname

    // Extract locale-stripped path
    const segments = pathname.split('/')
    const maybeLocale = segments[1]
    const isLocalePrefix = ['en', 'fr'].includes(maybeLocale)
    const localeFreePathname = isLocalePrefix ? '/' + segments.slice(2).join('/') : pathname

    const isDashboardRoute = protectedRoutes.some((route) =>
        localeFreePathname.startsWith(`/dashboard${route}`)
    )

    if (isDashboardRoute) {
        const isLoggedIn = !!req.auth

        if (!isLoggedIn) {
            const locale = isLocalePrefix ? maybeLocale : 'en'
            return NextResponse.redirect(new URL(`/${locale}/signin`, req.url))
        }

        const userRole = req.auth?.user?.role

        const isAdminRoute = adminRoutes.some((route) =>
            localeFreePathname.startsWith(`/dashboard${route}`)
        )
        if (isAdminRoute && userRole !== 'ADMIN') {
            const locale = isLocalePrefix ? maybeLocale : 'en'
            return NextResponse.redirect(new URL(`/${locale}/dashboard/customer`, req.url))
        }

        const isVendorRoute = vendorRoutes.some((route) =>
            localeFreePathname.startsWith(`/dashboard${route}`)
        )
        if (isVendorRoute && userRole !== 'VENDOR' && userRole !== 'ADMIN') {
            const locale = isLocalePrefix ? maybeLocale : 'en'
            return NextResponse.redirect(new URL(`/${locale}/dashboard/customer`, req.url))
        }
    }

    return intlMiddleware(req)
})

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
