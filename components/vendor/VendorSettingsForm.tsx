'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload, Store, MapPin, Truck, Shield, Mail, Phone, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const vendorSchema = z.object({
    businessName: z.string().min(2, 'Business name is required'),
    businessEmail: z.string().email('Valid business email is required'),
    businessPhone: z.string().min(8, 'Valid phone number is required'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    descriptionFr: z.string().min(20, 'French description must be at least 20 characters'),
    categoryId: z.string().min(1, 'Category is required'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    deliveryRadius: z.coerce.number().min(1, 'Radius must be at least 1km'),
    baseDeliveryFee: z.coerce.number().min(0, 'Delivery fee cannot be negative'),
})

type VendorFormData = z.infer<typeof vendorSchema>

interface VendorSettingsFormProps {
    locale: string
    categories: { id: string, name: string, nameFr: string }[]
    vendor?: any
}

export default function VendorSettingsForm({ locale, categories, vendor }: VendorSettingsFormProps) {
    const isFr = locale === 'fr'
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<VendorFormData>({
        resolver: zodResolver(vendorSchema),
        defaultValues: vendor || {
            deliveryRadius: 10,
            baseDeliveryFee: 1000,
        },
    })

    const onSubmit = async (data: VendorFormData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const res = await fetch('/api/vendor/profile', {
                method: vendor ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || 'Failed to save settings')
            }

            setSuccess(true)
            router.refresh()
            if (!vendor) {
                router.push(`/${locale}/dashboard/vendor`)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center animate-fade-in">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-500 text-center animate-fade-in">
                    {isFr ? 'PARAMÈTRES ENREGISTRÉS AVEC SUCCÈS' : 'MERCHANT IDENTITY UPDATED SUCCESSFULLY'}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Business Details */}
                <div className="space-y-8">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                        <Store className="w-3 h-3" /> BUSINESS CORE
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Business Name</Label>
                        <div className="relative">
                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <Input {...register('businessName')} className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" placeholder="E.g. Inova Flowers" />
                        </div>
                        {errors.businessName && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.businessName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Business Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input type="email" {...register('businessEmail')} className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Business Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input {...register('businessPhone')} className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Merchant Biography (EN)</Label>
                            <Textarea {...register('description')} className="min-h-[100px] rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold p-4" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Merchant Biography (FR)</Label>
                            <Textarea {...register('descriptionFr')} className="min-h-[100px] rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold p-4" />
                        </div>
                    </div>
                </div>

                {/* Operations & Logistics */}
                <div className="space-y-8">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                        <MapPin className="w-3 h-3" /> OPERATIONS & LOGISTICS
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Commercial Category</Label>
                        <Select onValueChange={(val) => setValue('categoryId', val)} defaultValue={vendor?.categoryId}>
                            <SelectTrigger className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold">
                                <SelectValue placeholder="Select Business Sector" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-[#111] border-white/5">
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id} className="text-[10px] font-black uppercase tracking-widest py-3">
                                        {isFr ? cat.nameFr : cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.categoryId.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Operating City</Label>
                            <Input {...register('city')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Street Address</Label>
                            <Input {...register('address')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Truck className="w-3 h-3 text-primary" />
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Delivery Radius (KM)</Label>
                            </div>
                            <Input type="number" {...register('deliveryRadius')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet className="w-3 h-3 text-primary" />
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Base Delivery Fee (FCFA)</Label>
                            </div>
                            <Input type="number" {...register('baseDeliveryFee')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">IDENTITY VERIFICATION</Label>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Changes are subject to platform compliance auditing</p>
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full md:w-auto h-14 px-12 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all min-w-[200px]"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (vendor ? 'UPDATE IDENTITY' : 'INITIALIZE EMPIRE')}
                </Button>
            </div>
        </form>
    )
}
