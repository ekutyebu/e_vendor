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
                window.location.href = `/${locale}/dashboard/vendor`
            }
        } catch {
            setError(isFr ? 'Une erreur est survenue' : 'An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">
                    {isFr ? 'Connectez-vous' : 'Welcome back'}
                </CardTitle>
                <CardDescription>
                    {isFr ? 'Accédez à votre compte INOVAMARK' : 'Sign in to your INOVAMARK account'}
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
                        <Label htmlFor="email">{isFr ? 'Adresse e-mail' : 'Email address'}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-9"
                                {...register('email')}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">{isFr ? 'Mot de passe' : 'Password'}</Label>
                            <Link href={`/${locale}/auth/forgot-password`} className="text-xs text-blue-600 hover:underline">
                                {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9"
                                {...register('password')}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full gradient-brand text-white" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <ArrowRight className="h-4 w-4 mr-2" />
                        )}
                        {isFr ? 'Se connecter' : 'Sign in to your account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    {isFr ? "Vous n'avez pas de compte ?" : "Don't have an account?"}{' '}
                    <Link href={`/${locale}/signup`} className="text-blue-600 font-medium hover:underline">
                        {isFr ? "S'inscrire" : 'Sign up'}
                    </Link>
                </p>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase text-gray-400 bg-white px-3">
                        or
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500">
                    {isFr ? 'Vous êtes vendeur ?' : 'Are you a vendor?'}{' '}
                    <Link href={`/${locale}/become-vendor`} className="text-emerald-600 font-medium hover:underline">
                        {isFr ? 'Inscrivez votre business' : 'Register your business'}
                    </Link>
                </p>
            </CardContent>
        </Card>
    )
}
