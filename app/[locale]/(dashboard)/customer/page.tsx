'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, Phone, Lock, Save, Loader2, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function CustomerProfilePage() {
    const { data: session, update } = useSession()
    const user = session?.user
    const [isLoading, setIsLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    // Example handler - In a real app this would call an API
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setSuccessMsg('')
        
        // Simulate network delay
        await new Promise(r => setTimeout(r, 1000))
        
        setSuccessMsg('Profile updated successfully.')
        setIsLoading(false)
    }

    if (!user) return null

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Profile Settings</h1>
                <p className="text-gray-500 mt-2">Manage your account details and security preferences.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-4xl shadow-xl shadow-orange-500/20">
                        {user.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-green-600 font-bold mt-1 bg-green-50 w-fit px-3 py-1 rounded-full">
                            <ShieldCheck className="w-4 h-4" /> Identity Verified
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input defaultValue={user.name || ''} className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-200" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input defaultValue={user.email || ''} readOnly className="pl-12 h-14 rounded-2xl bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="+237 600 000 000" className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-200" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-500">New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input type="password" placeholder="••••••••" className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-200" />
                            </div>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold text-center">
                            {successMsg}
                        </div>
                    )}

                    <div className="pt-6">
                        <Button type="submit" disabled={isLoading} className="h-14 px-8 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-widest">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
