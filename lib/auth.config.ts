import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
    providers: [], // Providers added in auth.ts
    pages: {
        signIn: '/signin',
        error: '/auth/error',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isDashboard = nextUrl.pathname.includes('/dashboard')
            if (isDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }
            return true
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role?: string }).role
                token.language = (user as { language?: string }).language
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.language = token.language as string
            }
            return session
        },
    },
} satisfies NextAuthConfig
