import { getLocale } from 'next-intl/server'

export default async function TestEnvPage() {
    const locale = await getLocale()
    
    return (
        <div className="p-10 font-mono">
            <h1>Environment Test (No DB)</h1>
            <p>Locale: {locale}</p>
            <p>Status: If you can see this, the basic Next.js + i18n setup is working!</p>
            <div className="mt-4">
                <p>Checked vars:</p>
                <pre>
                    NODE_ENV: {process.env.NODE_ENV}
                    NEXTAUTH_URL: {process.env.NEXTAUTH_URL}
                </pre>
            </div>
        </div>
    )
}
