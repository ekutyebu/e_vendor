import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import VendorSettingsForm from '@/components/vendor/VendorSettingsForm'

export default async function VendorSettingsPage({ params }: { params: { locale: string } }) {
    const session = await auth()
    const locale = params.locale
    const isFr = locale === 'fr'

    if (!session?.user) {
        redirect(`/${locale}/signin`)
    }

    // Get vendor profile
    const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id },
    })

    // Fetch categories for the form
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, nameFr: true }
    })

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="space-y-2">
                <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">CONFIGURATION HUB</div>
                <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                    {isFr ? 'VOTRE EMPIRE' : 'MERCHANT IDENTITY'}
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {isFr ? 'GÉREZ VOS PARAMÈTRES ET VOTRE VISIBILITÉ' : 'REFINE YOUR BUSINESS PARAMETERS & VISIBILITY'}
                </p>
            </div>

            <Card className="rounded-[2.5rem] bg-white dark:bg-[#111] border-gray-100 dark:border-white/5 overflow-hidden">
                <CardContent className="p-8 lg:p-12">
                    <VendorSettingsForm 
                        locale={locale} 
                        categories={categories} 
                        vendor={vendor}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
