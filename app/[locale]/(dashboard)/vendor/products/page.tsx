import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, ExternalLink, Package } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import Image from 'next/image'

export default async function VendorProductsPage({ params }: { params: { locale: string } }) {
    const session = await auth()
    const isFr = params.locale === 'fr'
    
    // Get vendor profile
    const vendor = await prisma.vendor.findUnique({
        where: { userId: session?.user?.id },
    })

    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-orange-500/10 flex items-center justify-center">
                    <Package className="w-10 h-10 text-orange-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic dark:text-white">
                        {isFr ? 'PROFIL NON CONFIGURÉ' : 'PROFILE NOT CONFIGURED'}
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        {isFr ? 'Veuillez configurer votre boutique pour gérer les produits' : 'Please set up your storefront to manage products'}
                    </p>
                </div>
                <Button asChild className="h-14 px-8 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-[10px]">
                    <Link href={`/${params.locale}/dashboard/vendor/settings`}>
                        {isFr ? 'CONFIGURER LA BOUTIQUE' : 'CONFIGURE STOREFRONT'}
                    </Link>
                </Button>
            </div>
        )
    }

    const products = await prisma.product.findMany({
        where: { vendorId: vendor.id },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">INVENTORY CONTROL</div>
                    <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                        {isFr ? 'VOS PRODUITS' : 'YOUR PRODUCTS'}
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {isFr ? `${products.length} ASSETS DÉPLOYÉS` : `${products.length} ACTIVE ASSETS DEPLOYED`}
                    </p>
                </div>
                <Button asChild className="h-14 px-8 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                    <Link href={`/${params.locale}/dashboard/vendor/products/new`}>
                        <Plus className="w-4 h-4 mr-2" /> {isFr ? 'AJOUTER UN PRODUIT' : 'ADD NEW ASSET'}
                    </Link>
                </Button>
            </div>

            {/* Products Table */}
            <div className="rounded-[3rem] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder={isFr ? "Rechercher un produit..." : "Search assets..."} 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">PRODUCT</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">CATEGORY</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">STATUS</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">STOCK</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">PRICE</th>
                                <th className="px-8 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                        {isFr ? "Aucun produit trouvé. Commencez par en ajouter un !" : "No assets discovered. Initiate deployment!"}
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 overflow-hidden flex-shrink-0 relative">
                                                    <Image 
                                                        src={product.images[0] || '/images/placeholder.png'} 
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest line-clamp-1">{isFr ? product.nameFr : product.name}</div>
                                                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">SKU: {product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant="outline" className="border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg px-3">
                                                {isFr ? product.category.nameFr : product.category.name}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge className={`${product.isActive ? 'text-emerald-500 border-emerald-500/30' : 'text-red-500 border-red-500/30'} bg-white/5 border text-[9px] font-black uppercase rounded-lg px-3`}>
                                                {product.isActive ? (isFr ? 'ACTIF' : 'ACTIVE') : (isFr ? 'INACTIF' : 'INACTIVE')}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className={`text-[11px] font-black ${product.stock < 10 ? 'text-orange-500' : 'text-gray-900 dark:text-white'}`}>
                                                    {product.stock}
                                                </span>
                                                <div className="w-16 h-1 bg-gray-200 dark:bg-white/5 rounded-full mt-2 overflow-hidden">
                                                    <div className={`h-full ${product.stock < 10 ? 'bg-orange-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="text-sm font-display font-black italic text-gray-900 dark:text-white">
                                                {product.price.toLocaleString()} FCFA
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-primary transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
