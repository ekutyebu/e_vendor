import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProductForm from '@/components/vendor/ProductForm'

export default async function NewProductPage({ params }: { params: { locale: string } }) {
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

    if (!vendor) {
        redirect(`/${locale}/dashboard/vendor`)
    }

    // Fetch categories for the form
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, nameFr: true }
    })

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="space-y-2">
                <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">ASSET DEPLOYMENT</div>
                <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                    {isFr ? 'NOUVEL ASSET' : 'NEW PRODUCT'}
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {isFr ? 'DÉFINISSEZ LES PARAMÈTRES DE VOTRE PRODUIT' : 'DEFINE YOUR PRODUCT PARAMETERS'}
                </p>
            </div>

            <Card className="rounded-[2.5rem] bg-white dark:bg-[#111] border-gray-100 dark:border-white/5 overflow-hidden">
                <CardContent className="p-8 lg:p-12">
                    <ProductForm 
                        locale={locale} 
                        categories={categories} 
                        vendorId={vendor.id}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
