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

export interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  listing_limit: number;
  boost_limit: number;
  priority_lead_access: boolean;
  analytics_level: 'basic' | 'pro' | 'business';
  team_member_limit: number;
  features: string[];
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  razorpay_subscription_id: string | null;
  status: 'active' | 'paused' | 'canceled' | 'expired' | 'past_due';
  current_period_start: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  trial_end: string | null;
  plans?: Plan;
}

export interface Usage {
  id: string;
  user_id: string;
  listings_count: number;
  boosts_used: number;
  cycle_start: string;
  cycle_end: string | null;
  updated_at: string;
}

export interface Team {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string | null;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'invited';
  created_at: string;
  updated_at: string;
  teams?: Team;
  profiles?: Profile;
}

export interface AnalyticsEvent {
  id: string;
  type: 'view' | 'click' | 'lead' | 'search' | 'favorite';
  user_id: string;
  listing_id: string | null;
  meta: any;
  created_at: string;
}

export interface Lead {
  id: string;
  listing_id: string;
  owner_id: string;
  user_id: string;
  status: 'new' | 'contacted' | 'interested' | 'closed' | 'lost';
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile; // The user who is the lead
  properties?: Property;
}

