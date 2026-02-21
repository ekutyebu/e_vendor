import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { auth } from '@/lib/auth'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    return (
        <div className="min-h-screen flex flex-col">
            <Header user={session?.user} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
