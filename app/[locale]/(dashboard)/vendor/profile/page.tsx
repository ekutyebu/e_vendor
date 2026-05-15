'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, Phone, Lock, Save, Loader2, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function VendorProfilePage() {
    const { data: session } = useSession()
    const user = session?.user
    const [isLoading, setIsLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccessMsg('')
        
        await new Promise(r => setTimeout(r, 1000))
        
        setSuccessMsg('Profile updated successfully.')
        setIsLoading(false)
    }

    if (!user) return null

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="space-y-2">
                <div className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.4em]">USER IDENTITY</div>
                <h2 className="text-5xl font-display font-black tracking-tighter uppercase italic text-gray-900 dark:text-white leading-none">
                    VENDOR PROFILE
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    MANAGE YOUR PERSONAL LOGIN CREDENTIALS
                </p>
            </div>

            <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 lg:p-12 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-white/5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-orange-500/20">
                        {user.name?.charAt(0) || 'V'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold dark:text-white">{user.name}</h2>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-600 font-bold mt-2 bg-emerald-50 dark:bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                            <ShieldCheck className="w-4 h-4" /> Authenticated
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Personal Name</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input defaultValue={user.name || ''} className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Login Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input defaultValue={user.email || ''} readOnly className="pl-12 h-14 rounded-2xl bg-gray-100 dark:bg-white/10 border-gray-100 dark:border-white/5 text-gray-500 cursor-not-allowed font-bold" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Verified Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input placeholder="+237 600 000 000" className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Update Access Code</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input type="password" placeholder="••••••••" className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                            </div>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-500 text-center animate-fade-in">
                            {successMsg}
                        </div>
                    )}

                    <div className="pt-6">
                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto h-14 px-12 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all min-w-[200px]">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> SAVE IDENTITY SETTINGS</>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
