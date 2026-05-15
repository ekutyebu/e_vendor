'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, Phone, Lock, Save, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function AdminProfilePage() {
    const { data: session } = useSession()
    const user = session?.user
    const [isLoading, setIsLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccessMsg('')
        
        await new Promise(r => setTimeout(r, 1000))
        
        setSuccessMsg('Admin credentials updated successfully.')
        setIsLoading(false)
    }

    if (!user) return null

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex items-center justify-between bg-gray-900 text-white p-8 rounded-2xl shadow-lg border border-gray-800">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-red-500" /> SYSTEM ADMIN CLEARANCE
                    </h2>
                    <p className="text-xs text-gray-400 mt-2">Manage root access and security credentials.</p>
                </div>
                <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                    <Lock className="w-8 h-8 text-red-500" />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-700">Administrator Name</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input defaultValue={user.name || ''} className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-gray-900" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-700">Root Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input defaultValue={user.email || ''} readOnly className="pl-12 h-12 rounded-xl bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-700">Emergency Contact</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="+237 600 000 000" className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-gray-900" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-700">Master Password Override</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input type="password" placeholder="••••••••" className="pl-12 h-12 rounded-xl bg-gray-50 border-gray-200 focus:border-gray-900" />
                            </div>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm font-bold text-green-700 text-center animate-fade-in">
                            {successMsg}
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl bg-gray-900 hover:bg-black text-white font-bold transition-all">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> UPDATE CLEARANCE</>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
