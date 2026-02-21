import Link from 'next/link'
import { Store } from 'lucide-react'

export default function AuthLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href={`/${params.locale}`} className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">INOVAMARK</span>
                    </Link>
                </div>
                {children}
            </div>
        </div>
    )
}
