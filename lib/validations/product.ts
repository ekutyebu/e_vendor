import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(2, 'Product name required'),
    nameFr: z.string().min(2, 'French name required'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    descriptionFr: z.string().min(20, 'French description must be at least 20 characters'),
    price: z.number().min(1, 'Price must be at least 1 FCFA'),
    compareAtPrice: z.number().optional(),
    stock: z.number().min(0, 'Stock cannot be negative').int(),
    sku: z.string().min(2, 'SKU required'),
    images: z.array(z.string().url()).min(1, 'At least one image required'),
    categoryId: z.string().min(1, 'Please select a category'),
    isActive: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productSchema>
