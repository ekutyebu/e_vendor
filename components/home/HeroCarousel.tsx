'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80",
        title: "THE ELITE SUMMER COLLECTION",
        subtitle: "Experience luxury in every detail. Curated for the modern African lifestyle.",
        cta: "Explore Now",
        link: "/vendors",
        color: "text-primary"
    },
    {
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
        title: "SMART TECH REVOLUTION",
        subtitle: "Global brands delivered to your doorstep. Stay ahead with INOVAMARK.",
        cta: "Shop Electronics",
        link: "/vendors?category=electronics",
        color: "text-blue-400"
    },
    {
        image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&q=80",
        title: "FRESH FROM THE SOURCE",
        subtitle: "Supporting 500+ local farmers. Quality you can trust, prices you'll love.",
        cta: "View Produce",
        link: "/vendors?category=grocery",
        color: "text-emerald-400"
    }
]

export default function HeroCarousel({ locale }: { locale: string }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1))
    }, [])

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000)
        return () => clearInterval(timer)
    }, [nextSlide])

    return (
        <div className="relative group overflow-hidden h-[600px] lg:h-[750px]">
            {SLIDES.map((slide, index) => (
                <div 
                    key={index} 
                    className={`absolute inset-0 transition-opacity duration-1000 ${currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className={`object-cover object-center transition-transform duration-[10s] ${currentIndex === index ? 'scale-110' : 'scale-100'}`}
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#fafafa] dark:to-[#0a0a0a]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent" />

                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div className="max-w-3xl space-y-8 animate-fade-in">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full obsidian-glass text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                                    <Sparkles className="w-4 h-4" />
                                    INOVAMARK EXCLUSIVE
                                </div>
                                
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.9] tracking-tighter italic uppercase">
                                    {slide.title.split(' ').map((word, i) => (
                                        <span key={i} className={i === 1 ? slide.color : ''}>{word} </span>
                                    ))}
                                </h1>
                                
                                <p className="text-lg md:text-2xl text-gray-300 max-w-xl font-medium leading-relaxed">
                                    {slide.subtitle}
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button asChild size="lg" className="h-16 px-10 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-sm shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all border-0">
                                        <Link href={`/${locale}${slide.link}`}>
                                            {slide.cta}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Controls */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl obsidian-glass text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 active:scale-95 border border-white/10 z-20"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl obsidian-glass text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 active:scale-95 border border-white/10 z-20"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-12 h-1.5 rounded-full transition-all ${currentIndex === i ? 'bg-primary w-20' : 'bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    )
}
