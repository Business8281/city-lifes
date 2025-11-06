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
  type: string;
  price: number;
  location: string;
  city: string;
  state: string;
  images: string[];
  description: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  amenities: string[];
  status: 'active' | 'pending' | 'expired';
  views: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
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
  sender?: Profile;
  receiver?: Profile;
  properties?: Property;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'inquiry' | 'favorite' | 'listing';
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  created_at: string;
}

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
