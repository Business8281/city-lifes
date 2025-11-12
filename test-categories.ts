// Test file to verify all property categories work with form submission

import { z } from 'zod';

// This is the propertySchema from your validation schemas
const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  propertyType: z.string().min(1, "Property type is required"),
  price: z.number().positive("Price must be greater than 0"),
  priceType: z.enum(["monthly", "yearly", "one-time"]),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  pinCode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  address: z.string().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  areaSqft: z.number().optional(),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerPhone: z.string().min(10, "Valid phone number is required"),
  ownerEmail: z.string().optional(),
  isAgent: z.boolean(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
});

const testCategories = [
  { type: 'apartment', name: '3BHK Apartment', price: 25000 },
  { type: 'house', name: 'Independent House', price: 35000 },
  { type: 'flat', name: '2BHK Flat', price: 20000 },
  { type: 'commercial', name: 'Commercial Space', price: 50000 },
  { type: 'office', name: 'Office Space', price: 40000 },
  { type: 'farmland', name: 'Agricultural Land', price: 100000 },
  { type: 'pg', name: 'PG Accommodation', price: 8000 },
  { type: 'hostel', name: 'Hostel Room', price: 6000 },
  { type: 'restaurant', name: 'Restaurant Space', price: 60000 },
  { type: 'cafe', name: 'Cafe Space', price: 45000 },
  { type: 'farmhouse', name: 'Luxury Farmhouse', price: 80000 },
  { type: 'warehouse', name: 'Storage Warehouse', price: 70000 },
  { type: 'cars', name: 'Honda City 2023', price: 800000 },
  { type: 'bikes', name: 'Royal Enfield 2023', price: 200000 },
  { type: 'hotels', name: 'Boutique Hotel', price: 500000 },
  { type: 'business', name: 'Retail Business', price: 5000000 }
];

console.log('🧪 Testing all 16 property categories...\n');

let passed = 0;
let failed = 0;

for (const category of testCategories) {
  try {
    const testData = {
      title: category.name,
      description: `Test listing for ${category.name}`,
      propertyType: category.type,
      price: category.price,
      priceType: "monthly" as const,
      city: "Delhi",
      area: "Central Delhi",
      pinCode: "110001",
      address: "Test Address",
      ownerName: "Test Owner",
      ownerPhone: "+91 9876543210",
      ownerEmail: undefined,
      isAgent: false,
      amenities: ["Parking"],
      images: [],
      bedrooms: category.type.includes('apartment') || category.type.includes('house') ? 3 : undefined,
      bathrooms: category.type.includes('apartment') || category.type.includes('house') ? 2 : undefined,
      areaSqft: category.type === 'farmland' ? undefined : 1200,
    };

    propertySchema.parse(testData);
    console.log(`✅ ${category.type.padEnd(15)} - ${category.name}`);
    passed++;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(`❌ ${category.type.padEnd(15)} - ${error.errors[0].message}`);
      failed++;
    }
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCategories.length} categories`);

if (failed === 0) {
  console.log('\n✅ All categories validated successfully!');
} else {
  console.log('\n⚠️  Some categories have validation issues');
}
