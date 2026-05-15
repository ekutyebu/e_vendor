import { getLocale } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
    Plus, 
    MoreHorizontal, 
    Layers, 
    Edit2, 
    Trash2, 
    Image as ImageIcon,
    Tag,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

export default async function AdminCategoriesPage() {
    const locale = await getLocale()
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect(`/${locale}/signin`)
    }

    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true, vendors: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic">Marketplace Segments</h1>
                    <p className="text-muted-foreground text-sm">Organize your store with categories and collections.</p>
                </div>
                <Button className="bg-[#131921] hover:bg-orange-500 text-white font-bold gap-2 shadow-lg transition-all">
                    <Plus className="w-4 h-4" /> Add New Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white dark:bg-white/5 border rounded-2xl overflow-hidden group hover:border-orange-200 transition-all shadow-sm">
                        <div className="relative h-32 w-full bg-gray-100 overflow-hidden">
                            <Image 
                                src={cat.image || '/images/placeholder.png'} 
                                alt={cat.name} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                <div className="p-2 bg-white rounded-lg shadow-lg">
                                    <span className="text-lg">{cat.icon || '📦'}</span>
                                </div>
                                <h3 className="text-white font-black uppercase tracking-tighter text-sm italic">{cat.name}</h3>
                            </div>
                        </div>
                        
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 dark:text-white text-base font-black">{cat._count.products}</span>
                                        <span className="uppercase tracking-widest text-[9px]">Products</span>
                                    </div>
                                    <div className="w-px h-6 bg-gray-100" />
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 dark:text-white text-base font-black">{cat._count.vendors}</span>
                                        <span className="uppercase tracking-widest text-[9px]">Vendors</span>
                                    </div>
                                </div>
                                <div className="p-1 h-2 w-12 rounded-full" style={{ backgroundColor: cat.color || '#eee' }} />
                            </div>

                            <p className="text-[11px] text-muted-foreground line-clamp-2 min-h-[2rem]">
                                {cat.description || 'No description provided for this category segment.'}
                            </p>

                            <div className="pt-4 border-t flex items-center justify-between gap-2">
                                <Button variant="outline" size="sm" className="flex-1 font-bold text-[10px] uppercase gap-2 hover:bg-gray-50 border-gray-100 h-9">
                                    <Edit2 className="w-3 h-3" /> Edit
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Placeholder */}
                <button className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-gray-50 dark:hover:bg-white/5 transition-all group min-h-[300px]">
                    <div className="p-4 bg-gray-50 dark:bg-white/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <p className="font-black uppercase tracking-tighter italic text-gray-400 group-hover:text-gray-600">Create Category</p>
                    <p className="text-[10px] max-w-[150px] mt-2">Add a new market segment to attract more vendors.</p>
                </button>
            </div>
        </div>
    )
}
