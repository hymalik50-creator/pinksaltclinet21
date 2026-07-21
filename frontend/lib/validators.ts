import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  company: z.string().max(120).optional().or(z.literal('')),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone number')
    .max(30, 'Phone number is too long'),
  country: z.string().min(2, 'Please select your country'),
  quantity: z.string().min(1, 'Please specify a quantity'),
  packagingRequirement: z.string().max(200).optional().or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
  productName: z.string().optional(),
  productId: z.string().optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(30).optional().or(z.literal('')),
  subject: z.string().min(2, 'Subject is required').max(120),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const bulkOrderSchema = z.object({
  name: z.string().min(2, 'Name is required').max(80),
  company: z.string().max(120).optional().or(z.literal('')),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Valid phone is required').max(30),
  country: z.string().min(2, 'Country is required'),
  productCategory: z.string().min(2, 'Product category is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  packaging: z.string().max(200).optional().or(z.literal('')),
  message: z.string().min(10, 'Please provide details').max(2000),
});

export type BulkOrderFormValues = z.infer<typeof bulkOrderSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .max(140)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  category: z.string().min(1, 'Category is required'),
  shortDescription: z.string().min(10, 'Short description is required').max(200),
  description: z.string().min(20, 'Description is required').max(5000),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  origin: z.string().min(2, 'Origin is required').max(120),
  usage: z.string().min(10, 'Usage is required').max(2000),
  packaging: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  availability: z.enum(['in-stock', 'out-of-stock', 'made-to-order']),
  minimumOrderQuantity: z.string().min(1, 'MOQ is required'),
  exportInformation: z.string().max(2000).optional().or(z.literal('')),
  specifications: z.record(z.string(), z.string()).default({}),
});

export type ProductFormValues = z.infer<typeof productSchema>;
