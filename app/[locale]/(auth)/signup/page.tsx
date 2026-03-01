'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, Lock, User, Phone, ArrowRight, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { signIn } from 'next-auth/react'

export default function SignUpPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const locale = params.locale as string
    const isFr = locale === 'fr'
    const roleParam = searchParams.get('role')?.toUpperCase() === 'VENDOR' ? 'VENDOR' : 'CUSTOMER'
    
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: data.name, 
                    email: data.email, 
                    password: data.password, 
                    phone: data.phone,
                    role: roleParam
                }),
            })

            const json = await res.json()
            if (!res.ok) {
                setError(json.error || (isFr ? 'Erreur lors de la création du compte' : 'Account creation failed'))
                return
            }

            // Auto sign in after registration
            await signIn('credentials', {
                email: data.email,
                password: data.password,
                callbackUrl: `/${locale}/dashboard/${roleParam.toLowerCase()}`,
            })
        } catch {
            setError(isFr ? 'Une erreur est survenue' : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="card-elite p-12 rounded-[3rem] dark:bg-[#111] dark:border-white/5 shadow-3xl">
            <div className="text-center mb-10">
                <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                    {roleParam === 'VENDOR' ? <Store className="w-8 h-8 text-black" /> : <User className="w-8 h-8 text-black" />}
                </div>
                <h1 className="text-4xl font-display font-black tracking-tighter italic uppercase mb-2">
                    {roleParam === 'VENDOR' 
                        ? (isFr ? 'DEVENIR VENDEUR' : 'BECOME A VENDOR')
                        : (isFr ? 'REJOINDRE LA GUILDE' : 'JOIN THE GUILD')}
                </h1>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {roleParam === 'VENDOR'
                        ? (isFr ? 'Lancez votre boutique sur INOVAMARK' : 'Launch your shop on INOVAMARK')
                        : (isFr ? 'Créez votre identité INOVAMARK' : 'Create your INOVAMARK identity')}
                </p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">{isFr ? 'Nom Complet' : 'Full Name'}</Label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input id="name" placeholder="John Doe" className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 transition-all font-bold" {...register('name')} />
                        </div>
                        {errors.name && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">{isFr ? 'Téléphone' : 'Phone'}</Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input id="phone" type="tel" placeholder="+237 ..." className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 transition-all font-bold" {...register('phone')} />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">{isFr ? 'Identité (Email)' : 'Identity (Email)'}</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input id="email" type="email" placeholder="elite@inovamark.cm" className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 transition-all font-bold" {...register('email')} />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">{isFr ? 'Code d\'Accès' : 'Access Code'}</Label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input id="password" type="password" placeholder="••••••••" className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 transition-all" {...register('password')} />
                        </div>
                        {errors.password && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">{isFr ? 'Confirmation' : 'Confirmation'}</Label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 transition-all" {...register('confirmPassword')} />
                        </div>
                        {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl gold-gradient text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ArrowRight className="h-4 w-4 mr-2" /> {isFr ? 'CRÉER L\'IDENTITÉ' : 'CREATE IDENTITY'}</>}
                </Button>
            </form>

            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-10">
                {isFr ? 'Déjà membre ?' : 'Already a member?'}{' '}
                <Link href={`/${locale}/signin`} className="text-primary hover:brightness-125 ml-2">
                    {isFr ? 'SE CONNECTER' : 'LOG IN'}
                </Link>
            </p>
        </div>
    )
}
