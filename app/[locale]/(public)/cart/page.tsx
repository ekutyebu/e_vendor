'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ArrowLeft, Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export default function CartPage() {
    const params = useParams()
    const locale = params.locale as string
    const isFr = locale === 'fr'

    const items = useCartStore((s) => s.items)
    const removeItem = useCartStore((s) => s.removeItem)
    const updateQuantity = useCartStore((s) => s.updateQuantity)
    const clearCart = useCartStore((s) => s.clearCart)
    const getTotalPrice = useCartStore((s) => s.getTotalPrice)
    const getTotalItems = useCartStore((s) => s.getTotalItems)

    const [checkingOut, setCheckingOut] = useState(false)

    const handleCheckout = async () => {
        setCheckingOut(true)
        // TODO: Hook into Campay payment gateway
        await new Promise(r => setTimeout(r, 1500))
        setCheckingOut(false)
        alert(isFr ? 'Intégration de paiement à venir !' : 'Payment integration coming soon!')
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Page Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <Link href={`/${locale}/vendors`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" /> {isFr ? 'Continuer les achats' : 'Continue Shopping'}
                        </Link>
                        <h1 className="text-4xl font-display font-black tracking-tighter italic uppercase dark:text-white">
                            {isFr ? 'Votre Panier' : 'Your Cart'}
                        </h1>
                        {items.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                                {getTotalItems()} {isFr ? 'article(s)' : 'item(s)'}
                            </p>
                        )}
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                        >
                            {isFr ? 'Vider le panier' : 'Clear Cart'}
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    /* ── EMPTY STATE ── */
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="flex-1 bg-white dark:bg-[#111] rounded-3xl p-16 border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
                            <div className="w-32 h-32 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                                <ShoppingCart className="w-16 h-16 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
                                    {isFr ? 'Votre panier est vide' : 'Your cart is empty'}
                                </h2>
                                <p className="text-gray-500 mt-2 max-w-sm">
                                    {isFr
                                        ? 'Découvrez nos produits exclusifs et ajoutez-les à votre panier.'
                                        : 'Explore our exclusive products and add them to your cart.'}
                                </p>
                            </div>
                            <Link
                                href={`/${locale}/vendors`}
                                className="inline-flex items-center gap-2 px-8 py-4 gold-gradient text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                            >
                                {isFr ? 'Explorer les boutiques' : 'Explore Storefronts'}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Sidebar stays visible even when empty */}
                        <div className="lg:w-80">
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                    <span className="font-bold text-xs uppercase tracking-widest">
                                        {isFr ? 'Paiement 100% Sécurisé' : '100% Secure Payment'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Truck className="w-5 h-5 text-orange-500 shrink-0" />
                                    <span className="font-bold text-xs uppercase tracking-widest">
                                        {isFr ? 'Livraison rapide disponible' : 'Fast Delivery Available'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── CART WITH ITEMS ── */
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Cart Items List */}
                        <div className="flex-1 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-6 group hover:border-orange-200 dark:hover:border-orange-500/20 transition-all"
                                >
                                    {/* Product Image */}
                                    <Link href={`/${locale}/products/${item.productId}`} className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">
                                            {item.vendorName}
                                        </p>
                                        <Link href={`/${locale}/products/${item.productId}`}>
                                            <h3 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight line-clamp-2 hover:text-orange-600 transition-colors">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-lg font-black text-gray-900 dark:text-white mt-2">
                                            {(item.price * item.quantity).toLocaleString()} <span className="text-xs text-orange-500">FCFA</span>
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => item.quantity > 1 ? updateQuantity(item.productId, item.quantity - 1) : removeItem(item.productId)}
                                            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-orange-500/10 hover:text-orange-600 transition-all font-black text-gray-600 dark:text-white"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-black text-gray-900 dark:text-white text-sm">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-orange-500/10 hover:text-orange-600 transition-all font-black text-gray-600 dark:text-white"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-80 space-y-4">
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-6 sticky top-24">
                                <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">
                                    {isFr ? 'Récapitulatif' : 'Order Summary'}
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>{isFr ? 'Sous-total' : 'Subtotal'} ({getTotalItems()} {isFr ? 'articles' : 'items'})</span>
                                        <span className="font-bold dark:text-white">{getTotalPrice().toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>{isFr ? 'Livraison estimée' : 'Est. Shipping'}</span>
                                        <span className="font-bold text-green-600">
                                            {isFr ? 'Calculée à la commande' : 'Calculated at order'}
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-white/5" />
                                    <div className="flex justify-between font-black text-lg dark:text-white">
                                        <span>{isFr ? 'Total' : 'Total'}</span>
                                        <span>{getTotalPrice().toLocaleString()} <span className="text-xs text-orange-500">FCFA</span></span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={checkingOut}
                                    className="w-full h-14 rounded-2xl gold-gradient text-black font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                                >
                                    {checkingOut
                                        ? <><Loader2 className="w-5 h-5 animate-spin" /> {isFr ? 'Traitement...' : 'Processing...'}</>
                                        : <>{isFr ? 'Passer la commande' : 'Proceed to Checkout'} <ArrowRight className="w-4 h-4" /></>
                                    }
                                </button>

                                {/* Trust Badges */}
                                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {isFr ? 'Paiement sécurisé' : 'Secure Checkout'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-orange-500 shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {isFr ? 'Livraison rapide' : 'Fast Delivery'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}
