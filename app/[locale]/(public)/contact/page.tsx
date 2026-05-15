'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
    const params = useParams()
    const locale = params.locale as string
    const isFr = locale === 'fr'
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 1200))
        setSent(true)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            {/* Hero */}
            <div className="bg-[#131921] text-white py-20 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="w-8 h-8 text-orange-400" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">
                            {isFr ? 'Assistance Premium' : 'Premium Support'}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter italic uppercase leading-none">
                        {isFr ? 'CONCIERGE' : 'CONCIERGE'}
                    </h1>
                    <p className="mt-4 text-gray-400 max-w-md text-lg">
                        {isFr
                            ? 'Notre équipe d\'élite est disponible 24h/24 pour vous accompagner.'
                            : 'Our elite team is available 24/7 to assist you.'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        {[
                            {
                                icon: Mail,
                                label: isFr ? 'Email Concierge' : 'Concierge Email',
                                value: 'concierge@inovamark.cm',
                                sub: isFr ? 'Réponse en moins de 2h' : 'Response within 2 hours',
                            },
                            {
                                icon: Phone,
                                label: isFr ? 'Support Téléphonique' : 'Phone Support',
                                value: '+237 XXX XXX XXX',
                                sub: isFr ? 'Lun-Ven, 8h-20h' : 'Mon-Fri, 8am-8pm',
                            },
                            {
                                icon: MapPin,
                                label: isFr ? 'Siège Social' : 'Headquarters',
                                value: 'Yaoundé, Cameroun',
                                sub: 'Centre Ville',
                            },
                        ].map((item) => {
                            const Icon = item.icon
                            return (
                                <div key={item.label} className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm flex gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-7 h-7 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</p>
                                        <p className="font-black text-gray-900 dark:text-white mt-1">{item.value}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-3xl p-8 lg:p-12 border border-gray-100 dark:border-white/5 shadow-sm">
                        {sent ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                                <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center">
                                    <Send className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">
                                    {isFr ? 'Message Envoyé !' : 'Message Sent!'}
                                </h2>
                                <p className="text-gray-500 max-w-sm">
                                    {isFr
                                        ? 'Notre équipe concierge vous répondra dans les 2 prochaines heures.'
                                        : 'Our concierge team will respond within the next 2 hours.'}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white mb-2">
                                        {isFr ? 'Envoyez-nous un message' : 'Send Us a Message'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {isFr ? 'Remplissez le formulaire ci-dessous.' : 'Fill out the form below.'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-gray-500">
                                            {isFr ? 'Nom complet' : 'Full Name'}
                                        </Label>
                                        <Input required placeholder="John Doe" className="h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-gray-500">
                                            {isFr ? 'Adresse Email' : 'Email Address'}
                                        </Label>
                                        <Input required type="email" placeholder="you@email.com" className="h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">
                                        {isFr ? 'Sujet' : 'Subject'}
                                    </Label>
                                    <Input required placeholder={isFr ? "Comment pouvons-nous vous aider?" : "How can we help you?"} className="h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">
                                        {isFr ? 'Votre Message' : 'Your Message'}
                                    </Label>
                                    <Textarea required rows={5} placeholder={isFr ? "Décrivez votre demande en détail..." : "Describe your inquiry in detail..."} className="rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 resize-none" />
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-xs shadow-xl hover:scale-[1.02] transition-all">
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> {isFr ? 'ENVOYER AU CONCIERGE' : 'SEND TO CONCIERGE'}</>}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
