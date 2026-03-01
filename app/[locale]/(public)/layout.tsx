import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="min-h-screen flex flex-col">
            <Header user={session?.user} categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
