'use client'

import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/shared/ProductCard'
import Link from 'next/link'

interface ProductCarouselProps {
    title: string
    subtitle?: string
    products: any[]
    locale: string
    viewAllLink?: string
}

export default function ProductCarousel({ title, subtitle, products, locale, viewAllLink }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth * 0.8 
                : scrollLeft + clientWidth * 0.8
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
        }
    }

    return (
        <section className="py-12 relative animate-fade-in">
            <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-8">
                <div className="border-l-4 border-primary pl-6">
                    <h2 className="text-3xl font-display font-black tracking-tighter italic uppercase text-gray-900 dark:text-white">{title}</h2>
                    {subtitle && <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">{subtitle}</p>}
                </div>
                {viewAllLink && (
                    <Link href={viewAllLink} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all">
                        VIEW MANIFEST <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                )}
            </div>

            <div className="relative group">
                <div 
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_22%] min-w-0 snap-start">
                            <ProductCard product={product} locale={locale} />
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-xl text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-all hidden lg:flex items-center justify-center hover:scale-110 active:scale-95 z-30"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={() => scroll('right')}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 shadow-xl text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-all hidden lg:flex items-center justify-center hover:scale-110 active:scale-95 z-30"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </section>
    )
}
