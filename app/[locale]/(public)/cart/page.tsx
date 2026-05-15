'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react'

// This is a client-side cart page. In production, cart state would come from
// a global store (Zustand/Redux) or server session. For now it shows a premium empty state.
export default function CartPage() {
    const params = useParams()
    const locale = params.locale as string
    const isFr = locale === 'fr'

    // Placeholder cart items — replace with real cart store in production
    const [cartItems] = useState<any[]>([])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-display font-black tracking-tighter italic uppercase mb-10 dark:text-white">
                    {isFr ? 'Votre Panier' : 'Your Cart'}
                </h1>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Empty Cart State */}
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

                        {/* Order Summary Sidebar */}
                        <div className="lg:w-80 space-y-4">
                            <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                                <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">
                                    {isFr ? 'Récapitulatif' : 'Order Summary'}
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>{isFr ? 'Sous-total' : 'Subtotal'}</span>
                                        <span className="font-bold dark:text-white">0 FCFA</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>{isFr ? 'Livraison' : 'Shipping'}</span>
                                        <span className="font-bold text-green-600">Free</span>
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-white/5" />
                                    <div className="flex justify-between font-black dark:text-white">
                                        <span>{isFr ? 'Total' : 'Total'}</span>
                                        <span>0 FCFA</span>
                                    </div>
                                </div>
                                <button
                                    disabled
                                    className="w-full h-14 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/30 font-black text-xs uppercase tracking-widest cursor-not-allowed"
                                >
                                    {isFr ? 'Passer la commande' : 'Proceed to Checkout'}
                                </button>
                            </div>

                            {/* Trust Badges */}
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
                    <p className="text-gray-500">{cartItems.length} items in cart</p>
                )}
            </div>
        </div>
    )
}
