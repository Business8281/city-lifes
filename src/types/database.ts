export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  property_type: string;
  price: number;
  price_type: string;
  // Location fields
  city: string;
  area: string;
  pin_code: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  // Property details
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  images: string[];
  amenities: string[];
  business_metadata?: any;
  // Status
  status: string;
  verified: boolean;
  available: boolean;
  // Contact info
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  is_agent: boolean;
  // Metadata
  views: number;
  created_at: string;
  updated_at: string;
  // User tracking
  created_by_name: string | null;
  created_by_email: string | null;
  // Relations
  profiles?: Profile;
  // Distance (from search function)
  distance_km?: number;
  // Ad campaign
  campaign_id?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  properties?: Property;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id: string | null;
  content: string;
  read: boolean;
  created_at: string;
  sender_name: string | null;
  sender_email: string | null;
  deleted?: boolean;
  edited?: boolean;
  edited_at?: string;
  sender?: Profile;
  receiver?: Profile;
  properties?: Property;
}

// Notification interface removed as in-app notifications feature was deprecated.

export interface Inquiry {
  id: string;
  property_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
  properties?: Property;
}

export interface AdCampaign {
  id: string;
  user_id: string;
  property_id: string;
  title: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  created_by_name: string | null;
  created_by_email: string | null;
  properties?: Property;
}
