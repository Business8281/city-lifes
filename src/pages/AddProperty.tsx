import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Upload, X, MapPin, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { propertyTypes } from "@/data/propertyTypes";
import { allCities, areas, pinCodes } from "@/data/indianLocations";
import { useLocation } from "@/contexts/LocationContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Geolocation } from "@capacitor/geolocation";
import { propertySchema } from "@/schemas/validationSchemas";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { BusinessProfileForm } from "@/components/BusinessProfileForm";

const categoryConfigs = {
  house: { 
    amenities: ["Garden", "Parking", "Security", "Power Backup", "Water Supply", "Modular Kitchen", "Servant Quarter"],
    fields: ["bedrooms", "bathrooms", "area"],
    hasTargetAudience: true as const
  },
  apartment: { 
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Lift", "Power Backup", "Garden", "Club House", "Water Supply", "Maintenance Staff"],
    fields: ["bedrooms", "bathrooms", "area"],
    hasTargetAudience: true as const
  },
  flat: { 
    amenities: ["Parking", "Lift", "Security", "Water Supply", "Maintenance Staff", "Power Backup"],
    fields: ["bedrooms", "bathrooms", "area"],
    hasTargetAudience: true as const
  },
  commercial: { 
    amenities: ["Parking", "Security", "Water Supply", "Power Backup", "Loading Area", "Washrooms"],
    fields: ["area"],
    hasTargetAudience: false as const
  },
  office: { 
    amenities: ["Parking", "Cafeteria", "Conference Room", "High-Speed Internet", "Security", "AC", "Power Backup"],
    fields: ["area"],
    hasTargetAudience: false as const
  },
  farmland: { 
    amenities: ["Water Supply", "Power Backup", "Bore Well", "Fencing", "Irrigation System"],
    fields: ["area"],
    hasTargetAudience: false as const
  },
  pg: { 
    amenities: ["WiFi", "Parking", "Security", "Laundry", "Meals", "AC", "Water Supply", "Power Backup", "Housekeeping"],
    fields: ["bedrooms", "bathrooms"],
    hasPGType: true as const,
    hasTargetAudience: false as const
  },
  hotels: { 
    amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Lift", "Power Backup", "Restaurant", "Conference Room", "Room Service", "WiFi"],
    fields: ["rooms", "area"],
    hasTargetAudience: false as const
  },
  restaurant: { 
    amenities: ["Parking", "Kitchen Equipment", "Dining Area", "AC", "Water Supply", "Power Backup", "Washrooms"],
    fields: ["area", "seatingCapacity"],
    hasTargetAudience: false as const
  },
  cafe: { 
    amenities: ["WiFi", "Parking", "AC", "Outdoor Seating", "Coffee Machine", "Water Supply", "Power Backup"],
    fields: ["area", "seatingCapacity"],
    hasTargetAudience: false as const
  },
  farmhouse: { 
    amenities: ["Garden", "Parking", "Swimming Pool", "Security", "Power Backup", "Water Supply", "BBQ Area", "Lawn"],
    fields: ["bedrooms", "bathrooms", "area"],
    hasTargetAudience: false as const
  },
  warehouse: { 
    amenities: ["Loading Dock", "Security", "Power Backup", "Fire Safety", "Parking", "Storage Racks"],
    fields: ["area"],
    hasTargetAudience: false as const
  },
  cars: { 
    amenities: [],
    fields: ["brand", "model", "year", "fuelType", "transmission", "kmDriven", "owners"],
    hasTargetAudience: false as const
  },
  bikes: { 
    amenities: [],
    fields: ["brand", "model", "year", "fuelType", "kmDriven", "owners"],
    hasTargetAudience: false as const
  },
  electronics: {
    amenities: [],
    fields: ["brand", "model", "condition", "warranty", "electronicsType", "yearOfPurchase"],
    hasTargetAudience: false as const
  },
};

const businessTypes = [
  { value: "Retail Store", label: "🛍️ Retail Store" },
  { value: "E-commerce", label: "🛒 E-commerce / Online Store" },
  { value: "Supermarket", label: "🏪 Supermarket / Grocery" },
  { value: "Restaurant", label: "🍽️ Restaurant / Fine Dining" },
  { value: "Fast Food", label: "🍔 Fast Food / Quick Service" },
  { value: "Cafe", label: "☕ Cafe / Coffee Shop" },
  { value: "Bakery", label: "🥖 Bakery / Confectionery" },
  { value: "Cloud Kitchen", label: "🍱 Cloud Kitchen / Ghost Kitchen" },
  { value: "Hotel", label: "🏨 Hotel / Hospitality" },
  { value: "Resort", label: "🏖️ Resort / Vacation Property" },
  { value: "Salon", label: "💇 Salon / Beauty Parlor" },
  { value: "Spa", label: "💆 Spa / Wellness Center" },
  { value: "Gym", label: "💪 Gym / Fitness Center" },
  { value: "Yoga Studio", label: "🧘 Yoga Studio / Meditation Center" },
  { value: "Hospital", label: "🏥 Hospital / Medical Center" },
  { value: "Clinic", label: "⚕️ Clinic / Diagnostic Center" },
  { value: "Pharmacy", label: "💊 Pharmacy / Medical Store" },
  { value: "Dental Clinic", label: "🦷 Dental Clinic" },
  { value: "Veterinary", label: "🐾 Veterinary Clinic / Pet Care" },
  { value: "School", label: "🏫 School / Educational Institute" },
  { value: "Coaching Center", label: "📚 Coaching / Training Center" },
  { value: "Daycare", label: "👶 Daycare / Preschool" },
  { value: "Manufacturing", label: "🏭 Manufacturing Unit" },
  { value: "Factory", label: "⚙️ Factory / Production Unit" },
  { value: "Warehouse", label: "📦 Warehouse / Storage Facility" },
  { value: "Logistics", label: "🚚 Logistics / Transportation" },
  { value: "IT Services", label: "💻 IT Services / Software Company" },
  { value: "Digital Marketing", label: "📱 Digital Marketing Agency" },
  { value: "Consulting", label: "📊 Consulting / Advisory Services" },
  { value: "Real Estate", label: "🏘️ Real Estate Agency" },
  { value: "Construction", label: "🏗️ Construction / Civil Works" },
  { value: "Interior Design", label: "🎨 Interior Design / Architecture" },
  { value: "Event Management", label: "🎉 Event Management / Planning" },
  { value: "Photography", label: "📸 Photography Studio" },
  { value: "Printing Press", label: "🖨️ Printing Press / Graphics" },
  { value: "Laundry", label: "🧺 Laundry / Dry Cleaning" },
  { value: "Car Wash", label: "🚗 Car Wash / Detailing" },
  { value: "Auto Repair", label: "🔧 Auto Repair / Garage" },
  { value: "Electronics Repair", label: "📱 Electronics Repair" },
  { value: "Jewellery", label: "💎 Jewellery Store" },
  { value: "Furniture", label: "🛋️ Furniture Store / Showroom" },
  { value: "Electronics Store", label: "📺 Electronics / Appliances Store" },
  { value: "Fashion Boutique", label: "👗 Fashion Boutique / Clothing" },
  { value: "Footwear", label: "👟 Footwear / Shoe Store" },
  { value: "Books", label: "📖 Book Store / Stationery" },
  { value: "Toys", label: "🧸 Toys / Kids Store" },
  { value: "Sports Shop", label: "⚽ Sports Equipment / Fitness Store" },
  { value: "Hardware Store", label: "🔨 Hardware / Building Materials" },
  { value: "Paint Shop", label: "🎨 Paint / Hardware Store" },
  { value: "Gas Station", label: "⛽ Petrol Pump / Gas Station" },
  { value: "Travel Agency", label: "✈️ Travel Agency / Tours" },
  { value: "Insurance", label: "🛡️ Insurance Agency" },
  { value: "Bank Branch", label: "🏦 Bank Branch / Financial Services" },
  { value: "Co-working", label: "💼 Co-working Space" },
  { value: "Call Center", label: "📞 Call Center / BPO" },
  { value: "Security Services", label: "🔐 Security Services" },
  { value: "Pest Control", label: "🐜 Pest Control Services" },
  { value: "Cleaning Services", label: "🧹 Cleaning / Housekeeping Services" },
  { value: "Courier", label: "📮 Courier / Delivery Services" },
  { value: "Farm", label: "🌾 Farm / Agriculture Business" },
  { value: "Dairy", label: "🥛 Dairy / Milk Products" },
  { value: "Poultry", label: "🐔 Poultry Farm" },
  { value: "Fish Farm", label: "🐟 Fish Farm / Aquaculture" },
  { value: "Solar Energy", label: "☀️ Solar Energy / Renewable Energy" },
  { value: "Water Plant", label: "💧 Water Plant / Purification" },
  { value: "Recycling", label: "♻️ Recycling / Waste Management" },
  { value: "Theater", label: "🎭 Theater / Entertainment" },
  { value: "Gaming Arcade", label: "🎮 Gaming Arcade / Esports" },
  { value: "Pub", label: "🍻 Pub / Bar / Lounge" },
  { value: "Night Club", label: "🎵 Night Club / Disco" },
  { value: "Franchise", label: "🏢 Franchise Business" },
  { value: "Online Business", label: "🌐 Online Business / Startup" },
  { value: "Other", label: "📋 Other Business" },
];

const AddProperty = () => {
  const navigate = useNavigate();
  // const { toast } = useToast(); // unused
  const { location } = useLocation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editPropertyId = searchParams.get('edit');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(!!editPropertyId);
  const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    listingType: "", // 'sale', 'rent', or 'daily_rent'
    targetAudience: "", // 'bachelors', 'families', 'boys', 'girls', 'coliving', 'students', 'professionals'
    pgType: "", // for PG category
    price: "",
    priceType: "monthly", // 'monthly', 'yearly', 'daily', 'fixed'
    city: "",
    area: "",
    pinCode: "",
    address: "",
    latitude: "",
    longitude: "",
    bedrooms: "",
    bathrooms: "",
    areaSqft: "",
    description: "",
    amenities: [] as string[],
    ownerName: "",
    ownerPhone: "",
    // Vehicle fields
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    transmission: "",
    kmDriven: "",
    owners: "",
    // Electronics fields
    electronicsType: "",
    condition: "",
    warranty: "",
    yearOfPurchase: "",
    // Hotels/Restaurant fields
    rooms: "",
    seatingCapacity: "",
    // Business fields
    businessType: "",
    revenue: "",
    employees: "",
    // Google My Business style fields
    businessCategory: "",
    yearEstablished: "",
    services: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    businessLicense: "",
    gstNumber: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [operatingHours, setOperatingHours] = useState({
    monday: { isOpen: true, open: "09:00", close: "18:00" },
    tuesday: { isOpen: true, open: "09:00", close: "18:00" },
    wednesday: { isOpen: true, open: "09:00", close: "18:00" },
    thursday: { isOpen: true, open: "09:00", close: "18:00" },
    friday: { isOpen: true, open: "09:00", close: "18:00" },
    saturday: { isOpen: true, open: "09:00", close: "18:00" },
    sunday: { isOpen: false, open: "09:00", close: "18:00" },
  });

  // Roommate-specific state
  const [roommateData, setRoommateData] = useState({
    availableFrom: '',
    preferredGender: 'any',
    occupancyType: 'shared',
    roomType: 'private',
    foodIncluded: false,
    currentRoommates: 0,
    occupation: 'student',
    monthlyRent: '',
    smoking: 'no',
    drinking: 'no',
    foodPreference: 'veg',
  });

  // Load property data if editing
  useEffect(() => {
    const loadProperty = async () => {
      if (!editPropertyId || !user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', editPropertyId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            title: data.title || "",
            type: data.property_type || "",
            listingType: data.price_type || "",
            targetAudience: "",
            pgType: "",
            price: data.price?.toString() || "",
            priceType: data.price_type || "monthly",
            city: data.city || "",
            area: data.area || "",
            pinCode: data.pin_code || "",
            address: data.address || "",
            latitude: data.latitude?.toString() || "",
            longitude: data.longitude?.toString() || "",
            bedrooms: data.bedrooms?.toString() || "",
            bathrooms: data.bathrooms?.toString() || "",
            areaSqft: data.area_sqft?.toString() || "",
            description: data.description || "",
            amenities: data.amenities || [],
            ownerName: data.contact_name || "",
            ownerPhone: data.contact_phone || "",
            brand: "",
            model: "",
            year: "",
            fuelType: "",
            transmission: "",
            kmDriven: "",
            owners: "",
            electronicsType: "",
            condition: "",
            warranty: "",
            yearOfPurchase: "",
            rooms: "",
            seatingCapacity: "",
            businessType: "",
            revenue: "",
            employees: "",
            businessCategory: "",
            yearEstablished: "",
            services: "",
            website: "",
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
            businessLicense: "",
            gstNumber: "",
          });
          setImages(data.images || []);
          
          // Load business metadata if it's a business listing
          if (data.property_type === 'business' && (data as any).business_metadata) {
            const metadata = (data as any).business_metadata;
            setFormData(prev => ({
              ...prev,
              businessCategory: metadata?.category || '',
              yearEstablished: metadata?.yearEstablished || '',
              employees: metadata?.employees || '',
              services: metadata?.services || '',
              website: metadata?.website || '',
              facebook: metadata?.socialMedia?.facebook || '',
              instagram: metadata?.socialMedia?.instagram || '',
              twitter: metadata?.socialMedia?.twitter || '',
              linkedin: metadata?.socialMedia?.linkedin || '',
              businessLicense: metadata?.businessLicense || '',
              gstNumber: metadata?.gstNumber || '',
            }));
            if (metadata?.operatingHours) {
              setOperatingHours(metadata.operatingHours);
            }
          }

          // Load roommate data if it's a roommate listing
          if (data.property_type === 'roommate' && (data as any).business_metadata) {
            const metadata = (data as any).business_metadata;
            setRoommateData({
              availableFrom: metadata.availableFrom || '',
              preferredGender: metadata.preferredGender || 'any',
              occupancyType: metadata.occupancyType || 'shared',
              roomType: metadata.roomType || 'private',
              foodIncluded: metadata.foodIncluded || false,
              currentRoommates: metadata.currentRoommates || 0,
              occupation: metadata.occupation || 'student',
              monthlyRent: metadata.monthlyRent || '',
              smoking: metadata.smoking || 'no',
              drinking: metadata.drinking || 'no',
              foodPreference: metadata.foodPreference || 'veg',
            });
          }
          
          // Load electronics data if it's an electronics listing
          if (data.property_type === 'electronics' && (data as any).business_metadata) {
            const metadata = (data as any).business_metadata;
            setFormData(prev => ({
              ...prev,
              electronicsType: metadata?.electronicsType || '',
              brand: metadata?.brand || '',
              model: metadata?.model || '',
              condition: metadata?.condition || '',
              warranty: metadata?.warranty || '',
              year: metadata?.year || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error loading property:', error);
        sonnerToast.error("Failed to load property");
        navigate('/my-listings');
      } finally {
        setLoading(false);
      }
    };
    
    loadProperty();
  }, [editPropertyId, user, navigate]);

  // Pre-fill location data from context
  useEffect(() => {
    if (editPropertyId) return; // Don't override when editing
    
    if (location.method === 'city' && location.value) {
      setFormData(prev => ({ ...prev, city: location.value }));
    } else if (location.method === 'area' && location.value) {
      setFormData(prev => ({ ...prev, area: location.value }));
    } else if (location.method === 'pincode' && location.value) {
      setFormData(prev => ({ ...prev, pinCode: location.value }));
    } else if (location.method === 'live' && location.coordinates) {
      setFormData(prev => ({ 
        ...prev, 
        latitude: location.coordinates!.lat.toString(),
        longitude: location.coordinates!.lng.toString()
      }));
    }
  }, [location, editPropertyId]);

  // Auto-fill owner name and phone from user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || editPropertyId) return; // Don't override when editing
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          return;
        }
        
        if (data) {
          setFormData(prev => ({
            ...prev,
            ownerName: data.full_name || user.user_metadata?.full_name || "",
            ownerPhone: data.phone || user.user_metadata?.phone || "",
          }));
        } else {
          // Fallback to user_metadata if profile doesn't exist
          setFormData(prev => ({
            ...prev,
            ownerName: user.user_metadata?.full_name || "",
            ownerPhone: user.user_metadata?.phone || "",
          }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadUserProfile();
  }, [user, editPropertyId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const filesArray = Array.from(files);

    // Enforce maximum of 10 images total
    const remainingSlots = Math.max(0, 10 - images.length);
    if (remainingSlots === 0) {
      sonnerToast.error("You can upload up to 10 images only");
      return;
    }
    if (filesArray.length > remainingSlots) {
      sonnerToast.info(`Only ${remainingSlots} more image${remainingSlots > 1 ? 's' : ''} allowed (max 10)`);
    }
    const limitedFiles = filesArray.slice(0, remainingSlots);
    const processedImages: { preview: string; file: File }[] = [];

    for (const file of limitedFiles) {
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        sonnerToast.error(`Image ${file.name} is too large (max 10MB allowed)`);
        continue;
      }
      // Create preview URL
      const preview = URL.createObjectURL(file);
      // Compress image if it's too large (>1MB)
      let processedFile = file;
      if (file.size > 1024 * 1024) {
        try {
          processedFile = await compressImage(file);
          sonnerToast.success(`Compressed ${file.name}`);
        } catch (error) {
          console.error('Compression error:', error);
          // Use original file if compression fails
        }
      }
      processedImages.push({ preview, file: processedFile });
    }
    setImages([...images, ...processedImages.map(img => img.preview)]);
    setImageFiles([...imageFiles, ...processedImages.map(img => img.file)]);
  };

  // Helper function to compress images
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 1920px width/height)
          let width = img.width;
          let height = img.height;
          const maxDimension = 1920;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            0.85 // 85% quality
          );
        };
        img.onerror = () => reject(new Error('Image load failed'));
      };
      reader.onerror = () => reject(new Error('File read failed'));
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const getCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setFormData(prev => ({
        ...prev,
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
      }));
      sonnerToast.success("Location captured successfully");
    } catch {
      sonnerToast.error("Could not get your location");
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      sonnerToast.error("Please login to add a property");
      navigate("/auth");
      return;
    }

    try {
      setSubmitting(true);

      // Upload new images to Supabase Storage in parallel for faster processing
      let uploadedImageUrls: string[] = [];
      
      if (imageFiles.length > 0) {
        setUploadProgress(0);
        sonnerToast.info(`Uploading ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}...`);
        
        // Upload all images in parallel using Promise.all for maximum speed
        let completedUploads = 0;
        const uploadPromises = imageFiles.map(async (file, i) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}_${i}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { data, error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, file, {
              cacheControl: '31536000', // 1 year cache for better performance
              upsert: false
            });
          
          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(`Failed to upload image ${i + 1}`);
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(data.path);
          
          // Update progress
          completedUploads++;
          setUploadProgress(Math.round((completedUploads / imageFiles.length) * 100));
          
          return publicUrl;
        });
        
        // Wait for all uploads to complete simultaneously
        uploadedImageUrls = await Promise.all(uploadPromises);
        setUploadProgress(100);
        sonnerToast.success("All images uploaded successfully!");
      }
      
      // Keep existing images (when editing) and add new ones
      const allImageUrls = [
        ...images.filter(img => img.startsWith('http')), // Keep existing uploaded images
        ...uploadedImageUrls // Add newly uploaded images
      ];

      // Clean phone number - remove all non-digit characters
      const cleanedPhone = formData.ownerPhone.replace(/\D/g, '').slice(-10);
      
      // Determine price_type based on listing type
      let validationPriceType: 'monthly' | 'yearly' | 'fixed' | undefined = undefined;
      let dbPriceType = 'monthly';
      
      if (formData.type === 'roommate') {
        validationPriceType = undefined;
        dbPriceType = 'monthly';
      } else if (formData.listingType === 'sale') {
        validationPriceType = 'fixed';
        dbPriceType = 'fixed';
      } else if (formData.listingType === 'rent') {
        validationPriceType = 'monthly';
        dbPriceType = 'monthly';
      } else if (formData.listingType === 'daily_rent') {
        validationPriceType = 'fixed';
        dbPriceType = 'daily';
      }
      
      // Validate form data using zod
      const validationData = {
        title: formData.title,
        description: formData.description || undefined,
        propertyType: formData.type,
        price: (formData.type === 'business' || formData.type === 'roommate') ? undefined : parseFloat(formData.price),
        priceType: (formData.type === 'business' || formData.type === 'roommate') ? undefined : validationPriceType,
        city: formData.city,
        area: formData.area,
        pinCode: formData.pinCode,
        address: formData.address || undefined,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        areaSqft: formData.areaSqft ? parseInt(formData.areaSqft) : undefined,
        ownerName: formData.ownerName,
        ownerPhone: cleanedPhone,
        ownerEmail: undefined,
        isAgent: false,
        amenities: formData.amenities,
        images: allImageUrls,
      };

      try {
        propertySchema.parse(validationData);
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const firstError = validationError.errors[0];
          const fieldName = firstError.path.join('.');
          sonnerToast.error(`Validation Error`, {
            description: `${fieldName}: ${firstError.message}`
          });
          console.error('Validation errors:', validationError.errors);
          setSubmitting(false);
          return;
        }
      }

      // Prepare property data for database
      // For business category, append business details to description
      let finalDescription = formData.description;
      let businessMetadata = null;
      
      if (formData.type === 'business') {
        // Create comprehensive business metadata
        businessMetadata = {
          category: formData.businessCategory,
          yearEstablished: formData.yearEstablished,
          employees: formData.employees,
          services: formData.services,
          website: formData.website,
          socialMedia: {
            facebook: formData.facebook,
            instagram: formData.instagram,
            twitter: formData.twitter,
            linkedin: formData.linkedin,
          },
          businessLicense: formData.businessLicense,
          gstNumber: formData.gstNumber,
          operatingHours: operatingHours,
        };
        
        // Create a formatted description
        const businessDetails = [
          formData.businessCategory ? `Category: ${formData.businessCategory}` : '',
          formData.yearEstablished ? `Established: ${formData.yearEstablished}` : '',
          formData.employees ? `Team Size: ${formData.employees}` : '',
        ].filter(Boolean).join(' | ');
        
        const operatingHoursText = Object.entries(operatingHours)
          .filter(([_, hours]: any) => hours.isOpen)
          .map(([day, hours]: any) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.open} - ${hours.close}`)
          .join('\n');
        
        finalDescription = [
          businessDetails,
          formData.services ? `\n\nServices: ${formData.services}` : '',
          operatingHoursText ? `\n\nOperating Hours:\n${operatingHoursText}` : '',
          formData.description ? `\n\n${formData.description}` : '',
        ].filter(Boolean).join('');
      }
      
      // For cars/bikes, append vehicle details to description
      if ((formData.type === 'cars' || formData.type === 'bikes') && formData.brand) {
        const vehicleMetadata = {
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          kmDriven: formData.kmDriven,
          owners: formData.owners,
        };
        businessMetadata = vehicleMetadata;
        
        const vehicleDetails = [
          `Brand: ${formData.brand}`,
          `Model: ${formData.model}`,
          `Year: ${formData.year}`,
          `Fuel Type: ${formData.fuelType}`,
          formData.type === 'cars' && formData.transmission ? `Transmission: ${formData.transmission}` : '',
          `KM Driven: ${formData.kmDriven}`,
          `Owners: ${formData.owners}`,
        ].filter(Boolean).join(' | ');
        
        finalDescription = finalDescription 
          ? `${vehicleDetails}\n\n${formData.description}`
          : vehicleDetails;
      }
      
      // For electronics, create metadata and append details to description
      let electronicsMetadata = null;
      if (formData.type === 'electronics' && formData.brand) {
        electronicsMetadata = {
          electronicsType: formData.electronicsType,
          brand: formData.brand,
          model: formData.model,
          condition: formData.condition,
          warranty: formData.warranty,
          year: formData.year,
        };
        
        const electronicsDetails = [
          `Type: ${formData.electronicsType}`,
          `Brand: ${formData.brand}`,
          `Model: ${formData.model}`,
          `Condition: ${formData.condition}`,
          formData.warranty ? `Warranty: ${formData.warranty}` : '',
          formData.year ? `Year: ${formData.year}` : ''
        ].filter(Boolean).join(' | ');
        
        finalDescription = finalDescription 
          ? `${electronicsDetails}\n\n${formData.description}`
          : electronicsDetails;
      }
      
      // Determine price_type based on category and listing type
      let priceType = 'monthly'; // default
      if (formData.type === 'roommate') {
        priceType = 'monthly';
      } else if (formData.listingType === 'sale') {
        priceType = 'fixed';
      } else if (formData.listingType === 'rent') {
        priceType = 'monthly';
      } else if (formData.listingType === 'daily_rent') {
        priceType = 'daily';
      }
      
      const propertyData = {
        user_id: user.id,
        title: formData.title,
        description: finalDescription,
        property_type: formData.type,
        price: formData.type === 'roommate' ? 0 : parseFloat(formData.price),
        price_type: dbPriceType,
        city: formData.city,
        area: formData.area,
        pin_code: formData.pinCode,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area_sqft: formData.areaSqft ? parseInt(formData.areaSqft) : null,
        amenities: formData.amenities,
        images: allImageUrls,
        contact_name: formData.ownerName,
        contact_phone: cleanedPhone,
        contact_email: null,
        is_agent: false,
        status: 'active',
        available: true,
        verified: true,
        business_metadata: businessMetadata || electronicsMetadata || (formData.type === 'roommate' ? roommateData : null),
        created_by_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        created_by_email: user.email || null,
      };

      if (editPropertyId) {
        // Update existing property
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editPropertyId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Show success and navigate immediately (optimistic UI)
        sonnerToast.success("Property updated successfully!");
        navigate("/my-listings");
      } else {
        // Insert new property
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
        
        // Show success and navigate immediately (optimistic UI)
        sonnerToast.success("Property published successfully! 🎉", {
          description: "Your listing is now live and visible to users"
        });
        navigate("/my-listings");
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit property";
      sonnerToast.error("Submission Failed", {
        description: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid = true; // Images are optional
  
  // Step 2 validation: Basic fields + category-specific required fields
  const isStep2Valid = (() => {
    if (!formData.title || !formData.type) return false;
    
    // Listing type is required for all properties except roommate
    if (formData.type !== 'roommate' && !formData.listingType) return false;
    
    // Price is required for all properties except roommate
    if (formData.type !== 'roommate' && !formData.price) return false;
    
    // Target audience validation
    if (categoryConfigs[formData.type as keyof typeof categoryConfigs]?.hasTargetAudience && !formData.targetAudience) return false;
    
    // PG Type validation
    if (formData.type === 'pg' && !formData.pgType) return false;
    
    // Additional validation for cars/bikes
    if (formData.type === 'cars' || formData.type === 'bikes') {
      if (!formData.brand || !formData.model || !formData.year || !formData.fuelType || !formData.kmDriven || !formData.owners) return false;
      if (formData.type === 'cars' && !formData.transmission) return false;
    }
    
    // Additional validation for roommate
    if (formData.type === 'roommate') {
      if (!roommateData.availableFrom || !roommateData.monthlyRent || !roommateData.occupation) return false;
    }
    
    // Additional validation for electronics
    if (formData.type === 'electronics') {
      if (!formData.brand || !formData.model || !formData.electronicsType || !formData.condition) return false;
    }
    
    return true;
  })();
  
  const isStep3Valid = formData.city && formData.area && formData.pinCode && formData.description;
  const isStep4Valid = formData.ownerName && formData.ownerPhone;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading property...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8 overflow-x-hidden max-w-full">
      <div className="sticky top-0 z-40 bg-background border-b max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 overflow-x-hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">
                {editPropertyId ? 'Edit Property' : 'Add Property'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Step {step} of 4
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 overflow-x-hidden">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card className="p-6">
          {/* Step 1: Upload Images */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Upload Photos/Videos</h2>

              <div className="space-y-3">
                <Label>Upload Images</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={images.length >= 10}
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {images.length >= 10 ? "Maximum 10 images uploaded" : "Click to upload images"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{images.length}/10 images</p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!isStep1Valid}
              >
                Next
              </Button>
            </div>
          )}

          {/* Step 2: Basic Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Basic Details</h2>

              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Luxury 3BHK Apartment in South Delhi"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Property Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value, listingType: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px] overflow-y-auto">
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Listing Type - Dynamic based on property type */}
              {formData.type && formData.type !== "roommate" && propertyTypes.find(pt => pt.type === formData.type) && (
                <div className="space-y-2">
                  <Label htmlFor="listingType">Available For *</Label>
                  <Select
                    value={formData.listingType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, listingType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {propertyTypes.find(pt => pt.type === formData.type)?.availableFor.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === 'rent' && 'For Rent'}
                          {type === 'sale' && 'For Sale'}
                          {type === 'daily_rent' && 'For Daily Rent'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Target Audience - For residential properties */}
              {formData.type && categoryConfigs[formData.type as keyof typeof categoryConfigs]?.hasTargetAudience && (
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Suitable For *</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetAudience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {propertyTypes.find(pt => pt.type === formData.type)?.targetAudience?.map((audience) => (
                        <SelectItem key={audience} value={audience}>
                          {audience.charAt(0).toUpperCase() + audience.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* PG Type - For PG category */}
              {formData.type === 'pg' && (
                <div className="space-y-2">
                  <Label htmlFor="pgType">PG Type *</Label>
                  <Select
                    value={formData.pgType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, pgType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select PG type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      <SelectItem value="boys">Boys PG</SelectItem>
                      <SelectItem value="girls">Girls PG</SelectItem>
                      <SelectItem value="coliving">Co-living Space</SelectItem>
                      <SelectItem value="students">Student Hostel</SelectItem>
                      <SelectItem value="professionals">Working Professional Hostel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.type !== "roommate" && formData.listingType && (
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {formData.listingType === "sale" ? "Sale Price" : 
                     formData.listingType === "daily_rent" ? "Daily Rent" :
                     formData.listingType === "rent" ? "Monthly Rent" : "Price"} *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder={
                      formData.listingType === "sale" ? "₹75,00,000" : 
                      formData.listingType === "daily_rent" ? "₹2,000" :
                      "₹25,000"
                    }
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                  {formData.listingType === "rent" && (
                    <p className="text-xs text-muted-foreground">Enter monthly rent amount</p>
                  )}
                  {formData.listingType === "daily_rent" && (
                    <p className="text-xs text-muted-foreground">Enter daily rent amount</p>
                  )}
                </div>
              )}

              {/* Dynamic fields based on property type */}
              {formData.type && categoryConfigs[formData.type as keyof typeof categoryConfigs] && (
                <>
                  {categoryConfigs[formData.type as keyof typeof categoryConfigs].fields.includes("bedrooms") && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          placeholder="3"
                          value={formData.bedrooms}
                          onChange={(e) =>
                            setFormData({ ...formData, bedrooms: e.target.value })
                          }
                        />
                      </div>
                      {categoryConfigs[formData.type as keyof typeof categoryConfigs].fields.includes("bathrooms") && (
                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            placeholder="2"
                            value={formData.bathrooms}
                            onChange={(e) =>
                              setFormData({ ...formData, bathrooms: e.target.value })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {categoryConfigs[formData.type as keyof typeof categoryConfigs].fields.includes("area") && (
                    <div className="space-y-2">
                      <Label htmlFor="areaSqft">
                        {formData.type === "farmland" ? "Area (Acres)" : "Area (sq.ft)"}
                      </Label>
                      <Input
                        id="areaSqft"
                        type="number"
                        placeholder={formData.type === "farmland" ? "5" : "1200"}
                        value={formData.areaSqft}
                        onChange={(e) =>
                          setFormData({ ...formData, areaSqft: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {/* Vehicle fields */}
                  {(formData.type === "cars" || formData.type === "bikes") && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="brand">Brand *</Label>
                          <Input
                            id="brand"
                            placeholder="e.g., Honda, Maruti"
                            value={formData.brand}
                            onChange={(e) =>
                              setFormData({ ...formData, brand: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model *</Label>
                          <Input
                            id="model"
                            placeholder="e.g., City, Swift"
                            value={formData.model}
                            onChange={(e) =>
                              setFormData({ ...formData, model: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="year">Year *</Label>
                          <Input
                            id="year"
                            placeholder="2023"
                            value={formData.year}
                            onChange={(e) =>
                              setFormData({ ...formData, year: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fuelType">Fuel Type *</Label>
                          <Select
                            value={formData.fuelType}
                            onValueChange={(value) =>
                              setFormData({ ...formData, fuelType: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="petrol">Petrol</SelectItem>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="electric">Electric</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                              <SelectItem value="cng">CNG</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {formData.type === "cars" && (
                        <div className="space-y-2">
                          <Label htmlFor="transmission">Transmission *</Label>
                          <Select
                            value={formData.transmission}
                            onValueChange={(value) =>
                              setFormData({ ...formData, transmission: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="automatic">Automatic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="kmDriven">KM Driven *</Label>
                          <Input
                            id="kmDriven"
                            type="number"
                            placeholder="50000"
                            value={formData.kmDriven}
                            onChange={(e) =>
                              setFormData({ ...formData, kmDriven: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="owners">Number of Owners *</Label>
                          <Select
                            value={formData.owners}
                            onValueChange={(value) =>
                              setFormData({ ...formData, owners: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1st Owner</SelectItem>
                              <SelectItem value="2">2nd Owner</SelectItem>
                              <SelectItem value="3">3rd Owner</SelectItem>
                              <SelectItem value="4+">4+ Owners</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Hotels fields */}
                  {formData.type === "hotels" && (
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Input
                        id="rooms"
                        type="number"
                        placeholder="50"
                        value={formData.rooms}
                        onChange={(e) =>
                          setFormData({ ...formData, rooms: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {/* Electronics fields */}
                  {formData.type === "electronics" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="electronicsType">Electronics Type *</Label>
                        <Select
                          value={formData.electronicsType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, electronicsType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mobile">Mobile Phone</SelectItem>
                            <SelectItem value="laptop">Laptop</SelectItem>
                            <SelectItem value="tablet">Tablet</SelectItem>
                            <SelectItem value="tv">Television</SelectItem>
                            <SelectItem value="camera">Camera</SelectItem>
                            <SelectItem value="smartwatch">Smartwatch</SelectItem>
                            <SelectItem value="headphones">Headphones</SelectItem>
                            <SelectItem value="speaker">Speaker</SelectItem>
                            <SelectItem value="gaming">Gaming Console</SelectItem>
                            <SelectItem value="appliance">Home Appliance</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="brand">Brand *</Label>
                          <Input
                            id="brand"
                            placeholder="Apple, Samsung, Sony..."
                            value={formData.brand}
                            onChange={(e) =>
                              setFormData({ ...formData, brand: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="model">Model *</Label>
                          <Input
                            id="model"
                            placeholder="iPhone 15, Galaxy S24..."
                            value={formData.model}
                            onChange={(e) =>
                              setFormData({ ...formData, model: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="condition">Condition *</Label>
                          <Select
                            value={formData.condition}
                            onValueChange={(value) =>
                              setFormData({ ...formData, condition: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Brand New</SelectItem>
                              <SelectItem value="like-new">Like New</SelectItem>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="refurbished">Refurbished</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="warranty">Warranty Status</Label>
                          <Select
                            value={formData.warranty}
                            onValueChange={(value) =>
                              setFormData({ ...formData, warranty: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select warranty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-warranty">Under Warranty</SelectItem>
                              <SelectItem value="expired">Warranty Expired</SelectItem>
                              <SelectItem value="no-warranty">No Warranty</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year of Purchase</Label>
                        <Input
                          id="year"
                          placeholder="2023"
                          value={formData.year}
                          onChange={(e) =>
                            setFormData({ ...formData, year: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* Restaurant/Cafe fields */}
                  {(formData.type === "restaurant" || formData.type === "cafe") && (
                    <div className="space-y-2">
                      <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                      <Input
                        id="seatingCapacity"
                        type="number"
                        placeholder="50"
                        value={formData.seatingCapacity}
                        onChange={(e) =>
                          setFormData({ ...formData, seatingCapacity: e.target.value })
                        }
                      />
                    </div>
                  )}

                  {/* Business fields - Google My Business style */}
                  {formData.type === "business" && (
                    <BusinessProfileForm
                      formData={formData}
                      setFormData={setFormData}
                      operatingHours={operatingHours}
                      setOperatingHours={setOperatingHours}
                    />
                  )}

                  {/* Roommate-specific fields */}
                  {formData.type === "roommate" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Roommate Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="availableFrom">Available From *</Label>
                          <Input
                            id="availableFrom"
                            type="date"
                            value={roommateData.availableFrom}
                            onChange={(e) => setRoommateData({ ...roommateData, availableFrom: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="monthlyRent">Monthly Rent *</Label>
                          <Input
                            id="monthlyRent"
                            type="number"
                            placeholder="₹8,000"
                            value={roommateData.monthlyRent}
                            onChange={(e) => setRoommateData({ ...roommateData, monthlyRent: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation *</Label>
                          <select
                            id="occupation"
                            className="w-full h-10 px-3 border border-input rounded-md bg-background"
                            value={roommateData.occupation}
                            onChange={(e) => setRoommateData({ ...roommateData, occupation: e.target.value })}
                          >
                            <option value="student">Student</option>
                            <option value="working">Working Professional</option>
                            <option value="business">Business</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="preferredGender">Preferred Gender *</Label>
                          <select
                            id="preferredGender"
                            className="w-full h-10 px-3 border border-input rounded-md bg-background"
                            value={roommateData.preferredGender}
                            onChange={(e) => setRoommateData({ ...roommateData, preferredGender: e.target.value })}
                          >
                            <option value="any">Any</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="occupancyType">Occupancy Type *</Label>
                          <select
                            id="occupancyType"
                            className="w-full h-10 px-3 border border-input rounded-md bg-background"
                            value={roommateData.occupancyType}
                            onChange={(e) => setRoommateData({ ...roommateData, occupancyType: e.target.value })}
                          >
                            <option value="shared">Shared Room</option>
                            <option value="private">Private Room</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="roomType">Room Type *</Label>
                          <select
                            id="roomType"
                            className="w-full h-10 px-3 border border-input rounded-md bg-background"
                            value={roommateData.roomType}
                            onChange={(e) => setRoommateData({ ...roommateData, roomType: e.target.value })}
                          >
                            <option value="private">Private Room</option>
                            <option value="shared">Shared Room</option>
                            <option value="master">Master Bedroom</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentRoommates">Current Roommates</Label>
                          <Input
                            id="currentRoommates"
                            type="number"
                            min="0"
                            value={roommateData.currentRoommates}
                            onChange={(e) => setRoommateData({ ...roommateData, currentRoommates: parseInt(e.target.value) || 0 })}
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-8">
                          <input
                            type="checkbox"
                            id="foodIncluded"
                            className="h-4 w-4 rounded border-input"
                            checked={roommateData.foodIncluded}
                            onChange={(e) => setRoommateData({ ...roommateData, foodIncluded: e.target.checked })}
                          />
                          <Label htmlFor="foodIncluded" className="cursor-pointer">
                            Food Included
                          </Label>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mt-6">Lifestyle & Preferences</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smoking">Do you smoke?</Label>
                          <select
                            id="smoking"
                            className="w-full h-10 px-3 border border-input rounded-md bg-background"
                            value={roommateData.smoking}
                            onChange={(e) => setRoommateData({ ...roommateData, smoking: e.target.value })}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="drinking">Do you drink?</Label>
                          <select
                            id="drinking"
                            className="w-full h-10 px-3 border border-input rounded-md bg-background"
                            value={roommateData.drinking}
                            onChange={(e) => setRoommateData({ ...roommateData, drinking: e.target.value })}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="foodPreference">Food Preference</Label>
                          <select
                            id="foodPreference"
                            className="w-full h-10 px-3 border border-input rounded-md bg-background"
                            value={roommateData.foodPreference}
                            onChange={(e) => setRoommateData({ ...roommateData, foodPreference: e.target.value })}
                          >
                            <option value="veg">Veg</option>
                            <option value="nonveg">Non-Veg</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {formData.type && categoryConfigs[formData.type as keyof typeof categoryConfigs]?.amenities.length > 0 && (
                <div className="space-y-3">
                  <Label>Select Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categoryConfigs[formData.type as keyof typeof categoryConfigs].amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label
                          htmlFor={amenity}
                          className="text-sm cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1"
                  disabled={!isStep2Valid}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Location & Description */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Location & Description</h2>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  list="cities-list"
                  placeholder="Type or select city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                <datalist id="cities-list">
                  {allCities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area/Locality *</Label>
                <Input
                  id="area"
                  list="areas-list"
                  placeholder="Type or select area"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                />
                <datalist id="areas-list">
                  {areas.map((area) => (
                    <option key={area} value={area} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code *</Label>
                <Input
                  id="pinCode"
                  list="pincode-list"
                  placeholder="Type or select PIN code"
                  value={formData.pinCode}
                  onChange={(e) =>
                    setFormData({ ...formData, pinCode: e.target.value })
                  }
                  maxLength={6}
                />
                <datalist id="pincode-list">
                  {pinCodes.map((pin) => (
                    <option key={pin} value={pin} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address (Optional)</Label>
                <Textarea
                  id="address"
                  placeholder="Building name, street, landmark..."
                  rows={2}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <Label>GPS Coordinates (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Latitude"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Longitude"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use Current Location
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1"
                  disabled={!isStep3Valid}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Details */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Contact Details</h2>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Your Name *</Label>
                <Input
                  id="ownerName"
                  placeholder="Enter your name"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Phone Number *</Label>
                <Input
                  id="ownerPhone"
                  placeholder="+91 98765 43210"
                  value={formData.ownerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerPhone: e.target.value })
                  }
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Review Your Listing</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.title || "Property Title"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.area || "Area"}, {formData.city || "City"} - {formData.pinCode || "PIN"}
                </p>
                <p className="text-sm font-semibold text-primary">
                  ₹{formData.price || "Price"}/month
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1" disabled={submitting}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 relative"
                  disabled={!isStep4Valid || submitting}
                >
                  {submitting ? (
                    <>
                      {uploadProgress > 0 && uploadProgress < 100 ? (
                        <>
                          <span className="mr-2">Uploading {uploadProgress}%</span>
                        </>
                      ) : (
                        <>{editPropertyId ? "Publishing..." : "Publishing..."}</>
                      )}
                    </>
                  ) : (
                    <>{editPropertyId ? "Update Property" : "Publish Now"}</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AddProperty;
