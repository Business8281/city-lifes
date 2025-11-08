import { z } from 'zod';

// Authentication validation schemas
export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must be less than 100 characters' }),
  fullName: z
    .string()
    .trim()
    .min(1, { message: 'Full name is required' })
    .max(100, { message: 'Full name must be less than 100 characters' })
    .optional(),
});

// Property validation schema
export const propertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  description: z
    .string()
    .trim()
    .max(2000, { message: 'Description must be less than 2000 characters' })
    .optional(),
  propertyType: z.string().min(1, { message: 'Property type is required' }),
  price: z
    .number()
    .positive({ message: 'Price must be positive' })
    .max(99999999, { message: 'Price is too high' }),
  priceType: z.enum(['monthly', 'yearly'], { message: 'Invalid price type' }),
  city: z
    .string()
    .trim()
    .min(1, { message: 'City is required' })
    .max(100, { message: 'City name too long' }),
  area: z
    .string()
    .trim()
    .min(1, { message: 'Area is required' })
    .max(100, { message: 'Area name too long' }),
  pinCode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, { message: 'PIN code must be 6 digits' }),
  address: z
    .string()
    .trim()
    .max(500, { message: 'Address must be less than 500 characters' })
    .optional(),
  bedrooms: z
    .number()
    .int()
    .min(0)
    .max(50, { message: 'Invalid number of bedrooms' })
    .optional(),
  bathrooms: z
    .number()
    .int()
    .min(0)
    .max(50, { message: 'Invalid number of bathrooms' })
    .optional(),
  areaSqft: z
    .number()
    .int()
    .positive()
    .max(999999, { message: 'Area too large' })
    .optional(),
  ownerName: z
    .string()
    .trim()
    .min(1, { message: 'Owner name is required' })
    .max(100, { message: 'Owner name too long' }),
  ownerPhone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits' }),
  ownerEmail: z
    .string()
    .trim()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email too long' })
    .optional()
    .or(z.literal('')),
  isAgent: z.boolean(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type PropertyFormData = z.infer<typeof propertySchema>;
