'use client'

import { ShoppingCart } from 'lucide-react'
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
    const addItem = useCartStore((state: any) => state.addItem)
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
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={`${className} ${fullWidth ? 'w-full' : ''}`}
            onClick={handleAddToCart}
        >
            <ShoppingCart className={size === "icon" ? "w-5 h-5" : "w-4 h-4 mr-2"} />
            {size !== "icon" && (isFr && text === "Add to Cart" ? "Ajouter au panier" : text)}
        </Button>
    )
}
