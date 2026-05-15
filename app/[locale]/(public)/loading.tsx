import { Skeleton } from "@/components/ui/skeleton"

export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        {/* Skeleton Hero Section */}
        <div className="w-full h-[400px] bg-white border-b border-gray-100 flex items-center justify-center p-8 mb-12">
            <div className="w-full max-w-5xl space-y-6">
                <Skeleton className="h-12 w-3/4 max-w-2xl mx-auto rounded-xl" />
                <Skeleton className="h-4 w-1/2 max-w-md mx-auto" />
                <div className="flex justify-center gap-4 mt-8">
                    <Skeleton className="h-12 w-32 rounded-xl" />
                    <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
            </div>
        </div>

        {/* Skeleton Content Grid */}
        <div className="w-full max-w-[1600px] px-4 md:px-8 space-y-12 pb-24">
            
            {/* Section Title */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 space-y-4">
                        {/* Image Placeholder */}
                        <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
                        
                        {/* Content Placeholders */}
                        <div className="space-y-3 pt-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex justify-between items-center pt-4">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
