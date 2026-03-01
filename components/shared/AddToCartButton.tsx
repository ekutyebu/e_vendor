'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'

interface AddToCartButtonProps {
    product: {
        id: string
        name: string
        nameFr: string
        price: number
        images: string[]
        vendor: { id: string; businessName: string }
    }
    locale: string
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    fullWidth?: boolean
    text?: string
    size?: "default" | "sm" | "lg" | "icon"
}

export function AddToCartButton({
    product,
    locale,
    className = "",
    variant = "default",
    fullWidth = false,
    text = "Add to Cart",
    size = "default"
}: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem)
    const [isAdded, setIsAdded] = useState(false)
    const isFr = locale === 'fr'

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        addItem({
            productId: product.id,
            name: isFr ? product.nameFr : product.name,
            price: product.price,
            image: product.images[0] || '/images/product-placeholder.png',
            vendorId: product.vendor.id,
            vendorName: product.vendor.businessName,
            quantity: 1
        })
        
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={`${className} ${fullWidth ? 'w-full' : ''} !rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all duration-300 transform active:scale-95 ${
                isAdded 
                ? "bg-green-500 hover:bg-green-600 !text-white" 
                : "gold-gradient text-black hover:brightness-110 hover:shadow-primary/40 border-0"
            }`}
            onClick={handleAddToCart}
        >
            {isAdded ? (
                <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 ml-1" /> {isFr ? "SÉCURISÉ" : "SECURED"}
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    <ShoppingCart className={size === "icon" ? "w-4 h-4" : "w-3 h-3 ml-1"} />
                    {size !== "icon" && (isFr && text === "Add to Cart" ? "ACQUÉRIR" : text.toUpperCase())}
                </span>
            )}
        </Button>
    )
}
