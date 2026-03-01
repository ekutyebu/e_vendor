import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface CategoryGridProps {
    categories: any[]
    locale: string
}

export default function CategoryGrid({ categories, locale }: CategoryGridProps) {
    const isFr = locale === 'fr'
    
    return (
        <section className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.slice(0, 4).map((cat, index) => (
                    <div key={cat.id} className="card-elite p-8 rounded-[2.5rem] flex flex-col justify-between dark:bg-[#111] dark:border-white/5 group hover:border-primary/50 transition-all h-full">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter mb-1 italic uppercase truncate dark:text-white">
                                {isFr ? cat.nameFr : cat.name}
                            </h2>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">
                                {isFr ? 'DÉCOUVRIR LA SÉLECTION' : 'EXPLORE THE SELECTION'}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-white/5">
                                    <Image src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border border-white/5">
                                    <Image src={cat.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>

                        <Link href={`/${locale}/vendors?category=${cat.slug}`} className="group/link flex items-center justify-between mt-8 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">
                            {isFr ? 'VOIR PLUS' : 'SEE MORE'}
                            <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover/link:border-primary/50 group-hover/link:translate-x-1 transition-all">
                                <ArrowRight className="w-3 h-3" />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}
