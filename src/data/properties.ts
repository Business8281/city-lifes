import apartmentImg from "@/assets/sample-apartment.jpg";
import houseImg from "@/assets/sample-house.jpg";
import officeImg from "@/assets/sample-office.jpg";

export interface Property {
  id: string;
  title: string;
  type: string;
  icon: string;
  price: string;
  location: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  images: string[];
  description: string;
  amenities: string[];
  verified: boolean;
  available: boolean;
  owner: {
    name: string;
    phone: string;
    isAgent: boolean;
  };
  postedDate: string;
}

export const propertyTypes = [
  { type: "apartment", icon: "🏢", label: "Apartment" },
  { type: "house", icon: "🏠", label: "House" },
  { type: "flat", icon: "🏘️", label: "Flat" },
  { type: "commercial", icon: "🏬", label: "Commercial" },
  { type: "office", icon: "🏢", label: "Office" },
  { type: "farmland", icon: "🌾", label: "Farmland" },
  { type: "pg", icon: "🛏️", label: "PG" },
  { type: "hostel", icon: "🏨", label: "Hostel" },
  { type: "restaurant", icon: "🍽️", label: "Restaurant" },
  { type: "cafe", icon: "☕", label: "Cafe" },
  { type: "farmhouse", icon: "🏡", label: "Farmhouse" },
  { type: "warehouse", icon: "📦", label: "Warehouse" },
  { type: "cars", icon: "🚗", label: "Cars" },
  { type: "bikes", icon: "🏍️", label: "Bikes" },
  { type: "hotels", icon: "🏨", label: "Hotels" },
  { type: "business", icon: "💼", label: "Business" },
];

export const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Luxury 3BHK Apartment in South Delhi",
    type: "apartment",
    icon: "🏢",
    price: "₹45,000",
    location: "Green Park, South Delhi",
    city: "Delhi",
    bedrooms: 3,
    bathrooms: 2,
    area: "1,850 sq.ft",
    images: [apartmentImg, apartmentImg],
    description: "Beautiful spacious apartment with modern amenities, modular kitchen, and 24/7 security. Located in prime location with easy access to metro and markets.",
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Lift", "Power Backup"],
    verified: true,
    available: true,
    owner: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      isAgent: true,
    },
    postedDate: "2 days ago",
  },
  {
    id: "2",
    title: "Independent House with Garden",
    type: "house",
    icon: "🏠",
    price: "₹75,000",
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    bedrooms: 4,
    bathrooms: 3,
    area: "2,500 sq.ft",
    images: [houseImg, houseImg],
    description: "Standalone house with beautiful garden, perfect for families. Semi-furnished with spacious rooms and ample natural light.",
    amenities: ["Garden", "Parking", "Security", "Power Backup", "Water Supply"],
    verified: true,
    available: true,
    owner: {
      name: "Priya Sharma",
      phone: "+91 98765 43211",
      isAgent: false,
    },
    postedDate: "1 week ago",
  },
  {
    id: "3",
    title: "Modern Office Space in Tech Park",
    type: "office",
    icon: "🏢",
    price: "₹1,25,000",
    location: "Whitefield, Bangalore",
    city: "Bangalore",
    area: "3,000 sq.ft",
    images: [officeImg, officeImg],
    description: "Premium office space in IT hub with modern infrastructure. Ideal for startups and tech companies. Ready to move in.",
    amenities: ["Parking", "Cafeteria", "Conference Room", "High-Speed Internet", "24/7 Access", "Security"],
    verified: true,
    available: true,
    owner: {
      name: "Metro Properties",
      phone: "+91 98765 43212",
      isAgent: true,
    },
    postedDate: "3 days ago",
  },
  {
    id: "4",
    title: "Cozy 2BHK Flat Near Metro",
    type: "flat",
    icon: "🏘️",
    price: "₹28,000",
    location: "Malviya Nagar, Delhi",
    city: "Delhi",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,200 sq.ft",
    images: [apartmentImg, apartmentImg],
    description: "Well-maintained flat with excellent connectivity. Walking distance from metro station. Family-friendly society.",
    amenities: ["Parking", "Lift", "Security", "Water Supply", "Maintenance Staff"],
    verified: false,
    available: true,
    owner: {
      name: "Amit Verma",
      phone: "+91 98765 43213",
      isAgent: false,
    },
    postedDate: "5 days ago",
  },
  {
    id: "5",
    title: "Spacious Villa with Pool",
    type: "house",
    icon: "🏠",
    price: "₹1,50,000",
    location: "Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    bedrooms: 5,
    bathrooms: 4,
    area: "4,000 sq.ft",
    images: [houseImg, houseImg],
    description: "Luxurious villa with private swimming pool and landscaped garden. Premium location with all modern amenities.",
    amenities: ["Swimming Pool", "Garden", "Parking", "Gym", "Security", "Power Backup", "Club House"],
    verified: true,
    available: true,
    owner: {
      name: "Elite Estates",
      phone: "+91 98765 43214",
      isAgent: true,
    },
    postedDate: "1 day ago",
  },
  {
    id: "6",
    title: "Commercial Shop in Market Area",
    type: "commercial",
    icon: "🏬",
    price: "₹60,000",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    area: "800 sq.ft",
    images: [officeImg, officeImg],
    description: "Prime commercial space in high footfall area. Suitable for retail, showroom, or office. Excellent visibility.",
    amenities: ["Parking", "Security", "Water Supply", "Power Backup"],
    verified: true,
    available: true,
    owner: {
      name: "City Properties",
      phone: "+91 98765 43215",
      isAgent: true,
    },
    postedDate: "4 days ago",
  },
];
