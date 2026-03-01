'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload, X, Plus, Trash2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'

const productSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    nameFr: z.string().min(2, 'French name is required'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    descriptionFr: z.string().min(20, 'French description must be at least 20 characters'),
    price: z.coerce.number().min(1, 'Price must be at least 1 FCFA'),
    compareAtPrice: z.coerce.number().optional(),
    stock: z.coerce.number().min(0).int(),
    sku: z.string().min(2, 'SKU is required'),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    categoryId: z.string().min(1, 'Category is required'),
    isActive: z.boolean().default(true),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
    locale: string
    categories: { id: string, name: string, nameFr: string }[]
    vendorId: string
    initialData?: any
}

export default function ProductForm({ locale, categories, vendorId, initialData }: ProductFormProps) {
    const isFr = locale === 'fr'
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [images, setImages] = useState<string[]>(initialData?.images || [])
    const [imageUrlInput, setImageUrlInput] = useState('')

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            isActive: true,
            images: [],
        },
    })

    const onAddImage = () => {
        if (imageUrlInput && !images.includes(imageUrlInput)) {
            const newImages = [...images, imageUrlInput]
            setImages(newImages)
            setValue('images', newImages)
            setImageUrlInput('')
        }
    }

    const onRemoveImage = (url: string) => {
        const newImages = images.filter(img => img !== url)
        setImages(newImages)
        setValue('images', newImages)
    }

    const onSubmit = async (data: ProductFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/products', {
                method: initialData ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || 'Failed to save product')
            }

            router.push(`/${locale}/dashboard/vendor/products`)
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Basic Info */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                            <Info className="w-3 h-3" /> CORE ATTRIBUTES
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Name (EN)</Label>
                                <Input {...register('name')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" placeholder="E.g. Fresh Tomatoes" />
                                {errors.name && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Name (FR)</Label>
                                <Input {...register('nameFr')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" placeholder="Ex. Tomates Fraîches" />
                                {errors.nameFr && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.nameFr.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Description (EN)</Label>
                            <Textarea {...register('description')} className="min-h-[120px] rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold p-4" placeholder="Describe your product in English..." />
                            {errors.description && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.description.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Description (FR)</Label>
                            <Textarea {...register('descriptionFr')} className="min-h-[120px] rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold p-4" placeholder="Décrivez votre produit en français..." />
                            {errors.descriptionFr && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.descriptionFr.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Inventory & Pricing */}
                <div className="space-y-8">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                        <Package className="w-3 h-3" /> LOGISTICS & VALUATION
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Price (FCFA)</Label>
                            <Input type="number" {...register('price')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                            {errors.price && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Discount Price (FCFA)</Label>
                            <Input type="number" {...register('compareAtPrice')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Stock Level</Label>
                            <Input type="number" {...register('stock')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold" />
                            {errors.stock && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.stock.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">SKU ID</Label>
                            <Input {...register('sku')} className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold uppercase" placeholder="E.g. TOM-001" />
                            {errors.sku && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.sku.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Category</Label>
                        <Select onValueChange={(val) => setValue('categoryId', val)} defaultValue={initialData?.categoryId}>
                            <SelectTrigger className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold">
                                <SelectValue placeholder="Select Deployment Class" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-[#111] border-white/5">
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id} className="text-[10px] font-black uppercase tracking-widest py-3">
                                        {isFr ? cat.nameFr : cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.categoryId.message}</p>}
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                    <Upload className="w-3 h-3" /> VISUAL ASSETS
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                    {images.map((url, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/5 group">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => onRemoveImage(url)}
                                className="absolute inset-0 bg-red-500/80 items-center justify-center opacity-0 group-hover:flex transition-opacity"
                            >
                                <Trash2 className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    ))}
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500">
                        <Upload className="w-6 h-6" />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Input 
                        value={imageUrlInput} 
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Paste elite image URL..."
                        className="h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 focus:border-primary/50 font-bold"
                    />
                    <Button 
                        type="button" 
                        onClick={onAddImage}
                        className="h-14 px-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-primary transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                        ADD
                    </Button>
                </div>
                {errors.images && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.images.message}</p>}
            </div>

            <div className="flex items-center justify-between p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                    <Switch 
                        checked={watch('isActive')} 
                        onCheckedChange={(val) => setValue('isActive', val)}
                    />
                    <div className="space-y-0.5">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white">LIVE DEPLOYMENT</Label>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Visibility on marketplace toggle</p>
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="h-14 px-12 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all min-w-[200px]"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? 'UPDATE ASSET' : 'DEPLOY PRODUCT')}
                </Button>
            </div>
        </form>
    )
}
