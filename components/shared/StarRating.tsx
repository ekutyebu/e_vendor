import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
    rating: number
    maxStars?: number
    size?: 'sm' | 'md' | 'lg'
    showCount?: boolean
    count?: number
    className?: string
}

export default function StarRating({
    rating,
    maxStars = 5,
    size = 'md',
    showCount = false,
    count = 0,
    className,
}: StarRatingProps) {
    const sizeClass = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    }[size]

    return (
        <div className={cn('flex items-center gap-1', className)}>
            {Array.from({ length: maxStars }).map((_, i) => {
                const filled = i < Math.floor(rating)
                const partial = !filled && i < rating

                return (
                    <div key={i} className="relative">
                        <Star className={cn(sizeClass, 'text-gray-200 fill-gray-200')} />
                        {(filled || partial) && (
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: partial ? `${(rating % 1) * 100}%` : '100%' }}
                            >
                                <Star className={cn(sizeClass, 'text-yellow-400 fill-yellow-400')} />
                            </div>
                        )}
                    </div>
                )
            })}
            {showCount && count > 0 && (
                <span className="text-xs text-gray-500 ml-1">({count})</span>
            )}
        </div>
    )
}
