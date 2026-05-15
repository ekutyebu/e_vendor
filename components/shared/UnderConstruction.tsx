import { Construction } from 'lucide-react'
import Link from 'next/link'

export default function UnderConstruction({ title }: { title: string }) {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-8 animate-pulse">
                <Construction className="w-12 h-12 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-center">
                {title} <span className="text-orange-500">Coming Soon</span>
            </h1>
            <p className="text-gray-500 max-w-md text-center mb-8">
                We are actively building the ultimate elite experience for this section. Please check back shortly.
            </p>
            <Link 
                href="/"
                className="bg-[#131921] hover:bg-[#232f3e] text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
            >
                Return to Marketplace
            </Link>
        </div>
    )
}
