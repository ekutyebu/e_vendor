import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-in pb-20 p-8 w-full">
        {/* Header Skeleton */}
        <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-12 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-full" />
        </div>

        {/* Content Box Skeleton */}
        <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 lg:p-12 border border-gray-100 dark:border-white/5 shadow-sm space-y-12">
            
            {/* Top Profile Header */}
            <div className="flex items-center gap-6 pb-10 border-b border-gray-100 dark:border-white/5">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-3">
                    <Skeleton className="h-8 w-48 rounded-xl" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
                <Skeleton className="h-14 w-48 rounded-2xl" />
            </div>
        </div>
    </div>
  )
}
