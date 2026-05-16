'use client'

import { useState } from 'react'
import { Star, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from 'next-auth/react'

interface ReviewFormProps {
    type: 'PRODUCT' | 'VENDOR'
    id: string
    onSuccess?: () => void
}

export default function ReviewForm({ type, id, onSuccess }: ReviewFormProps) {
    const { data: session } = useSession()
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (!session) {
            setError('Please login to leave a review')
            return
        }
        if (rating === 0) {
            setError('Please select a rating')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    targetId: id,
                    rating,
                    comment
                })
            })

            if (res.ok) {
                setRating(0)
                setComment('')
                onSuccess?.()
            } else {
                const data = await res.json()
                setError(data.message || 'Failed to submit review')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tighter italic">
                    {type === 'PRODUCT' ? 'Review this Product' : 'Rate your Experience'}
                </h3>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Share your thoughts with the community</p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110 active:scale-95"
                        >
                            <Star 
                                className={`w-8 h-8 transition-colors ${
                                    (hover || rating) >= star ? 'fill-primary text-primary' : 'text-gray-200 dark:text-white/10'
                                }`} 
                            />
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    <Textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you think? (Optional)"
                        className="bg-gray-50 dark:bg-white/5 border-0 rounded-2xl p-6 min-h-[120px] focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>

                {error && <p className="text-xs text-red-500 font-bold italic">{error}</p>}

                <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-14 gold-gradient text-black font-black uppercase tracking-widest text-[10px] rounded-2xl gap-2 shadow-xl shadow-primary/20"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Review
                </Button>
            </div>
        </div>
    )
}
