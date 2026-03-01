'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'

export default function SignInPage() {
    const params = useParams()
    const locale = params.locale as string
    const isFr = locale === 'fr'
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                setError(isFr ? 'Email ou mot de passe incorrect' : 'Invalid email or password')
            } else {
                // In a real app, we'd fetch the user role here or handle it in the middleware
                // For now, redirecting to the main page or dash
                window.location.href = `/${locale}`
            }
        } catch {
            setError(isFr ? 'Une erreur est survenue' : 'An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="card-elite p-12 rounded-[3rem] dark:bg-[#111] dark:border-white/5 shadow-3xl">
            <div className="text-center mb-10">
                <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                    <Lock className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-4xl font-display font-black tracking-tighter italic uppercase mb-2">
                    {isFr ? 'AUTHENTIFICATION' : 'PORTAL ENTRY'}
                </h1>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {isFr ? 'Accédez à votre compte INOVAMARK' : 'Enter your INOVAMARK credentials'}
                </p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4">{isFr ? 'Identité (Email)' : 'Identity (Email)'}</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="elite@inovamark.cm"
                            className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 transition-all font-bold"
                            {...register('email')}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-[10px] text-red-500 font-bold ml-4">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-4 mr-4">
                        <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{isFr ? 'Code d\'Accès' : 'Access Code'}</Label>
                        <Link href={`/${locale}/auth/forgot-password`} className="text-[10px] font-black uppercase tracking-widest text-primary hover:brightness-125">
                            {isFr ? 'Perdu ?' : 'Lost Code?'}
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-12 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 transition-all"
                            {...register('password')}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-[10px] text-red-500 font-bold ml-4">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl gold-gradient text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <><ArrowRight className="h-4 w-4 mr-2" /> {isFr ? 'S\'IDENTIFIER' : 'AUTHORIZE ENTRY'}</>
                    )}
                </Button>
            </form>

            <div className="mt-12 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100 dark:border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 bg-white dark:bg-[#111] px-4">
                        OR JOIN THE GUILD
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Link href={`/${locale}/signup`} className="flex items-center justify-center h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black text-[10px] uppercase tracking-widest hover:brightness-125 transition-all">
                        {isFr ? 'S\'INSCRIRE' : 'NEW MEMBER'}
                    </Link>
                    <Link href={`/${locale}/become-vendor`} className="flex items-center justify-center h-14 rounded-2xl border border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-all">
                        {isFr ? 'VENDEUR' : 'PARTNER'}
                    </Link>
                </div>
            </div>
        </div>
    )
}
