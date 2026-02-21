'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { signIn } from 'next-auth/react'

export default function SignUpPage() {
    const params = useParams()
    const locale = params.locale as string
    const isFr = locale === 'fr'
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
                body: JSON.stringify({ name: data.name, email: data.email, password: data.password, phone: data.phone }),
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
                callbackUrl: `/${locale}/dashboard/customer`,
            })
        } catch {
            setError(isFr ? 'Une erreur est survenue' : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">
                    {isFr ? 'Créer un compte' : 'Create your account'}
                </CardTitle>
                <CardDescription>
                    {isFr ? 'Rejoignez INOVAMARK gratuitement' : 'Join INOVAMARK — it\'s free'}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">{isFr ? 'Nom complet' : 'Full name'}</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input id="name" placeholder={isFr ? 'Jean Dupont' : 'John Doe'} className="pl-9" {...register('name')} />
                        </div>
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">{isFr ? 'Adresse e-mail' : 'Email address'}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input id="email" type="email" placeholder="you@example.com" className="pl-9" {...register('email')} />
                        </div>
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="phone">{isFr ? 'Téléphone (optionnel)' : 'Phone (optional)'}</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input id="phone" type="tel" placeholder="+237 6XX XXX XXX" className="pl-9" {...register('phone')} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password">{isFr ? 'Mot de passe' : 'Password'}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input id="password" type="password" placeholder="••••••••" className="pl-9" {...register('password')} />
                        </div>
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword">{isFr ? 'Confirmer le mot de passe' : 'Confirm password'}</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-9" {...register('confirmPassword')} />
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                    </div>

                    <Button type="submit" className="w-full gradient-brand text-white" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                        {isFr ? 'Créer votre compte' : 'Create your account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-5">
                    {isFr ? 'Vous avez déjà un compte ?' : 'Already have an account?'}{' '}
                    <Link href={`/${locale}/signin`} className="text-blue-600 font-medium hover:underline">
                        {isFr ? 'Se connecter' : 'Sign in'}
                    </Link>
                </p>
            </CardContent>
        </Card>
    )
}
