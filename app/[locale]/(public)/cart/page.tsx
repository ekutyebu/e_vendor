'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ArrowLeft, Loader2, CreditCard, Smartphone, Landmark, CheckCircle2, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useSession } from 'next-auth/react'

export default function CartPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string
    const isFr = locale === 'fr'

    const items = useCartStore((s) => s.items)
    const removeItem = useCartStore((s) => s.removeItem)
    const updateQuantity = useCartStore((s) => s.updateQuantity)
    const clearCart = useCartStore((s) => s.clearCart)
    const getTotalPrice = useCartStore((s) => s.getTotalPrice)
    const getTotalItems = useCartStore((s) => s.getTotalItems)

    const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart')
    const [paymentMethod, setPaymentMethod] = useState<'MTN' | 'ORANGE' | 'BANK' | null>(null)
    const [checkingOut, setCheckingOut] = useState(false)

    const handleCheckout = async () => {
        if (!session) {
            router.push(`/${locale}/signin?callbackUrl=/${locale}/cart`)
            return
        }
        setCheckoutStep('shipping')
    }

    const handlePlaceOrder = async () => {
        setCheckingOut(true)
        // Simulated order placement
        await new Promise(r => setTimeout(r, 2000))
        setCheckingOut(false)
        setCheckoutStep('success')
        clearCart()
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

                {items.length === 0 && checkoutStep !== 'success' ? (
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
                    </div>
                ) : checkoutStep === 'success' ? (
                    <div className="max-w-2xl mx-auto text-center py-20 space-y-8 animate-fade-in">
                        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
                                {isFr ? 'Commande Confirmée !' : 'Order Confirmed!'}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                {isFr 
                                    ? 'Merci pour votre achat. Vous recevrez un e-mail de confirmation sous peu.' 
                                    : 'Thank you for your purchase. You will receive a confirmation email shortly.'}
                            </p>
                        </div>
                        <Link
                            href={`/${locale}/dashboard/customer/orders`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
                        >
                            {isFr ? 'Voir mes commandes' : 'View My Orders'}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    /* ── CART WITH ITEMS ── */
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Main Content Area */}
                        <div className="flex-1 space-y-6">
                            {checkoutStep === 'cart' && (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-6 group hover:border-orange-200 dark:hover:border-orange-500/20 transition-all"
                                        >
                                            <Link href={`/${locale}/products/${item.productId}`} className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">{item.vendorName}</p>
                                                <h3 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight line-clamp-2">{item.name}</h3>
                                                <p className="text-lg font-black text-gray-900 dark:text-white mt-2">{(item.price * item.quantity).toLocaleString()} <span className="text-xs text-orange-500">FCFA</span></p>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button onClick={() => item.quantity > 1 ? updateQuantity(item.productId, item.quantity - 1) : removeItem(item.productId)} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-black">-</button>
                                                <span className="w-8 text-center font-black">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-black">+</button>
                                            </div>
                                            <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {checkoutStep === 'shipping' && (
                                <div className="bg-white dark:bg-[#111] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
                                        <Truck className="w-6 h-6 text-orange-500" /> {isFr ? 'Détails de Livraison' : 'Shipping Details'}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{isFr ? 'Ville' : 'City'}</label>
                                            <input type="text" defaultValue="Douala" className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl px-6 py-4 border-0 focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{isFr ? 'Quartier / Rue' : 'Neighborhood / Street'}</label>
                                            <input type="text" placeholder="Bonapriso" className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl px-6 py-4 border-0 focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{isFr ? 'Instructions Particulières' : 'Special Instructions'}</label>
                                            <textarea rows={3} className="w-full bg-gray-50 dark:bg-white/5 rounded-2xl px-6 py-4 border-0 focus:ring-2 focus:ring-orange-500" />
                                        </div>
                                    </div>
                                    <button onClick={() => setCheckoutStep('payment')} className="w-full h-16 gold-gradient rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                        {isFr ? 'Continuer vers le Paiement' : 'Continue to Payment'} <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {checkoutStep === 'payment' && (
                                <div className="bg-white dark:bg-[#111] rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm space-y-8 animate-fade-in">
                                    <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
                                        <CreditCard className="w-6 h-6 text-orange-500" /> {isFr ? 'Mode de Paiement' : 'Payment Method'}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button 
                                            onClick={() => setPaymentMethod('MTN')}
                                            className={`p-6 rounded-[2rem] border-2 transition-all text-center flex flex-col items-center gap-4 ${paymentMethod === 'MTN' ? 'border-orange-500 bg-orange-500/5' : 'border-gray-100 dark:border-white/5 hover:border-orange-500/50'}`}
                                        >
                                            <Smartphone className="w-10 h-10 text-yellow-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">MTN Mobile Money</span>
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod('ORANGE')}
                                            className={`p-6 rounded-[2rem] border-2 transition-all text-center flex flex-col items-center gap-4 ${paymentMethod === 'ORANGE' ? 'border-orange-500 bg-orange-500/5' : 'border-gray-100 dark:border-white/5 hover:border-orange-500/50'}`}
                                        >
                                            <Smartphone className="w-10 h-10 text-orange-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Orange Money</span>
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod('BANK')}
                                            className={`p-6 rounded-[2rem] border-2 transition-all text-center flex flex-col items-center gap-4 ${paymentMethod === 'BANK' ? 'border-orange-500 bg-orange-500/5' : 'border-gray-100 dark:border-white/5 hover:border-orange-500/50'}`}
                                        >
                                            <Landmark className="w-10 h-10 text-blue-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Bank Transfer</span>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handlePlaceOrder} 
                                        disabled={!paymentMethod || checkingOut}
                                        className="w-full h-16 gold-gradient rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {checkingOut ? <><Loader2 className="w-5 h-5 animate-spin" /> {isFr ? 'Traitement...' : 'Processing...'}</> : <>{isFr ? 'Confirmer et Payer' : 'Confirm and Pay'}</>}
                                    </button>
                                </div>
                            )}
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
                                        <span>{isFr ? 'Livraison' : 'Shipping'}</span>
                                        <span className="font-bold text-green-600">
                                            {isFr ? 'Calculée' : 'Calculated'}
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-white/5" />
                                    <div className="flex justify-between font-black text-lg dark:text-white">
                                        <span>{isFr ? 'Total' : 'Total'}</span>
                                        <span>{getTotalPrice().toLocaleString()} <span className="text-xs text-orange-500">FCFA</span></span>
                                    </div>
                                </div>

                                {checkoutStep === 'cart' && (
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full h-14 rounded-2xl gold-gradient text-black font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                    >
                                        {isFr ? 'Passer la commande' : 'Proceed to Checkout'} <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}

                                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Checkout</span>
                                    </div>
                                    {session && (
                                        <div className="flex items-center gap-3">
                                            <User className="w-5 h-5 text-blue-500 shrink-0" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{session.user?.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}
