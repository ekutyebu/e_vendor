import { z } from 'zod'

export const vendorStep1Schema = z.object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    businessEmail: z.string().email('Please enter a valid email'),
    businessPhone: z
        .string()
        .min(9, 'Phone number must be at least 9 digits')
        .regex(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format'),
})

export const vendorStep2Schema = z.object({
    address: z.string().min(5, 'Please enter a complete address'),
    city: z.string().min(2, 'City name required'),
    coordinates: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
})

export const vendorStep3Schema = z.object({
    deliveryRadius: z.number().min(1, 'Minimum radius is 1 km').max(100, 'Maximum radius is 100 km'),
    baseDeliveryFee: z.number().min(0, 'Delivery fee cannot be negative'),
})

export const vendorStep4Schema = z.object({
    categoryId: z.string().min(1, 'Please select a category'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    descriptionFr: z.string().optional(),
})

export const vendorStep5Schema = z.object({
    logo: z.string().url('Please upload a logo').optional(),
})

export const fullVendorSchema = vendorStep1Schema
    .merge(vendorStep2Schema)
    .merge(vendorStep3Schema)
    .merge(vendorStep4Schema)
    .merge(vendorStep5Schema)

export type VendorStep1Data = z.infer<typeof vendorStep1Schema>
export type VendorStep2Data = z.infer<typeof vendorStep2Schema>
export type VendorStep3Data = z.infer<typeof vendorStep3Schema>
export type VendorStep4Data = z.infer<typeof vendorStep4Schema>
export type VendorStep5Data = z.infer<typeof vendorStep5Schema>
export type FullVendorData = z.infer<typeof fullVendorSchema>
