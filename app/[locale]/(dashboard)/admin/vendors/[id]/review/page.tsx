import { getLocale } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { 
    ShieldCheck, 
    ShieldAlert, 
    ArrowLeft, 
    FileText, 
    User, 
    Building2, 
    MapPin, 
    CheckCircle2, 
    XCircle, 
    MessageSquare,
    Truck
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import ReviewActions from './ReviewActions'

export default async function VendorReviewPage({ params }: { params: { id: string } }) {
    const locale = await getLocale()
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect(`/${locale}/signin`)
    }

    const vendor = await prisma.vendor.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            category: true
        }
    })

    if (!vendor) {
        notFound()
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`/${locale}/admin/vendors`} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Review Application</h1>
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                            Vendor ID: <span className="font-mono text-xs">{vendor.id}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={`h-8 px-4 font-black text-[10px] uppercase tracking-widest border-0 ${
                        vendor.onboardingStatus === 'APPROVED' ? 'bg-green-500/10 text-green-600' :
                        vendor.onboardingStatus === 'REJECTED' ? 'bg-red-500/10 text-red-600' :
                        'bg-yellow-500/10 text-yellow-600'
                    }`}>
                        {vendor.onboardingStatus}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Vendor Info */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-8">
                        <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic">
                            <Building2 className="w-5 h-5 text-blue-500" /> Business Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business Name</p>
                                <p className="font-bold text-lg">{vendor.businessName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</p>
                                <p className="font-bold">{vendor.category.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Owner / User</p>
                                <p className="font-bold">{vendor.user.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Email</p>
                                <p className="font-bold">{vendor.businessEmail}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address</p>
                                <p className="font-bold flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-500" /> {vendor.address}, {vendor.city}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tax ID</p>
                                <p className="font-bold text-blue-600">{vendor.taxId || 'NOT PROVIDED'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Identity Verification */}
                    <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-8">
                        <h3 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic">
                            <ShieldCheck className="w-5 h-5 text-green-500" /> Identity Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID Front Side ({vendor.idType})</p>
                                <div className="aspect-[16/10] bg-gray-50 dark:bg-white/5 rounded-3xl relative overflow-hidden group">
                                    {vendor.idFrontImage ? (
                                        <Image src={vendor.idFrontImage} alt="ID Front" fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                            <FileText className="w-10 h-10 opacity-20" />
                                            <span className="text-[10px] font-black">DOCUMENT PREVIEW</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID Back Side</p>
                                <div className="aspect-[16/10] bg-gray-50 dark:bg-white/5 rounded-3xl relative overflow-hidden">
                                    {vendor.idBackImage ? (
                                        <Image src={vendor.idBackImage} alt="ID Back" fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                            <FileText className="w-10 h-10 opacity-20" />
                                            <span className="text-[10px] font-black">DOCUMENT PREVIEW</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                            <div className="space-y-4 text-center max-w-sm mx-auto">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Biometric Match Check</p>
                                <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-full relative overflow-hidden border-4 border-white dark:border-black shadow-xl">
                                    {vendor.facialScanImage ? (
                                        <Image src={vendor.facialScanImage} alt="Facial Scan" fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                            <User className="w-10 h-10 opacity-20" />
                                            <span className="text-[10px] font-black italic">FACIAL SCAN</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground font-medium italic">
                                    Please verify that the facial scan matches the photo on the identity document provided.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-6">
                    
                    {/* Fulfillment Details */}
                    <div className="bg-white dark:bg-[#111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-tighter flex items-center gap-2 italic">
                            <Truck className="w-4 h-4 text-orange-500" /> Logistics
                        </h3>
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(vendor.deliveryServices) ? (
                                    (vendor.deliveryServices as string[]).map(s => (
                                        <Badge key={s} variant="outline" className="text-[9px] font-black border-orange-500/20 text-orange-600 bg-orange-500/5">{s}</Badge>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-muted-foreground italic">No delivery services specified</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Decision Box */}
                    <ReviewActions 
                        vendorId={vendor.id} 
                        currentStatus={vendor.onboardingStatus} 
                        rejectionReason={vendor.rejectionReason}
                    />

                </div>

            </div>
        </div>
    )
}
