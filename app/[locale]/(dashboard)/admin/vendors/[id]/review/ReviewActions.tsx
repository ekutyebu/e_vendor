'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    Loader2,
    ShieldCheck,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ReviewActionsProps {
    vendorId: string
    currentStatus: string
    rejectionReason?: string | null
}

export default function ReviewActions({ vendorId, currentStatus, rejectionReason }: ReviewActionsProps) {
    const router = useRouter()
    const [status, setStatus] = useState(currentStatus)
    const [reason, setReason] = useState(rejectionReason || '')
    const [isLoading, setIsLoading] = useState(false)
    const [showReasonField, setShowReasonField] = useState(false)
    const [pendingAction, setPendingAction] = useState<'APPROVE' | 'REJECT' | 'CORRECTION' | null>(null)

    const handleAction = async (action: 'APPROVE' | 'REJECT' | 'CORRECTION') => {
        if ((action === 'REJECT' || action === 'CORRECTION') && !reason) {
            setShowReasonField(true)
            setPendingAction(action)
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/admin/vendors/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorId,
                    action,
                    reason: (action === 'REJECT' || action === 'CORRECTION') ? reason : null
                })
            })

            if (res.ok) {
                router.refresh()
                setStatus(action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'NEEDS_CORRECTION')
                setPendingAction(null)
                setShowReasonField(false)
            }
        } catch (error) {
            console.error('Failed to update vendor status:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-[#111] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl space-y-6">
            <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-tighter italic flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" /> Admin Decision
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Select an action for this merchant</p>
            </div>

            <div className="space-y-3">
                <Button 
                    onClick={() => handleAction('APPROVE')}
                    disabled={isLoading || status === 'APPROVED'}
                    className="w-full h-14 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-green-500/20"
                >
                    {isLoading && pendingAction === null ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Approve Merchant
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <Button 
                        variant="outline"
                        onClick={() => {
                            setShowReasonField(true)
                            setPendingAction('CORRECTION')
                        }}
                        disabled={isLoading}
                        className="h-14 border-2 border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/5 text-orange-600 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2"
                    >
                        <MessageSquare className="w-4 h-4" /> Correction
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => {
                            setShowReasonField(true)
                            setPendingAction('REJECT')
                        }}
                        disabled={isLoading}
                        className="h-14 border-2 border-red-500/20 hover:border-red-500 hover:bg-red-500/5 text-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-2"
                    >
                        <XCircle className="w-4 h-4" /> Reject
                    </Button>
                </div>
            </div>

            {showReasonField && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-orange-500" /> 
                            {pendingAction === 'REJECT' ? 'Reason for Rejection' : 'Required Corrections'}
                        </label>
                        <Textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={pendingAction === 'REJECT' ? "Explain why this vendor was rejected..." : "Tell the vendor what needs to be fixed..."}
                            className="bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 min-h-[120px] text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="ghost" 
                            onClick={() => setShowReasonField(false)}
                            className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => handleAction(pendingAction!)}
                            disabled={isLoading || !reason}
                            className={`flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] text-white shadow-lg ${pendingAction === 'REJECT' ? 'bg-red-500 shadow-red-500/20' : 'bg-orange-500 shadow-orange-500/20'}`}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Decision'}
                        </Button>
                    </div>
                </div>
            )}

            {status === 'APPROVED' && !showReasonField && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <p className="text-xs text-green-700 font-bold">This merchant is verified and active on the marketplace.</p>
                </div>
            )}
        </div>
    )
}
