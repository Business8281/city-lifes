// Minimal Supabase Database types for the City Lifes app
// This is a cleaned version to ensure TypeScript compiles without errors.
// If you regenerate types from Supabase in the future, replace this file entirely.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          listing_id: string | null
          owner_id: string
          user_id: string | null
          name: string
          phone: string
          email: string | null
          message: string | null
          status: string
          source: string
          lead_type: string | null
          category: string | null
          subcategory: string | null
          source_page: string | null
          campaign_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id?: string | null
          owner_id: string
          user_id?: string | null
          name: string
          phone: string
          email?: string | null
          message?: string | null
          status?: string
          source?: string
          lead_type?: string | null
          category?: string | null
          subcategory?: string | null
          source_page?: string | null
          campaign_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string | null
          owner_id?: string
          user_id?: string | null
          name?: string
          phone?: string
          email?: string | null
          message?: string | null
          status?: string
          source?: string
          lead_type?: string | null
          category?: string | null
          subcategory?: string | null
          source_page?: string | null
          campaign_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          property_type: string
          price: number
          price_type: string | null
          city: string
          area: string
          pin_code: string
          address: string | null
          latitude: number | null
          longitude: number | null
          bedrooms: number | null
          bathrooms: number | null
          area_sqft: number | null
          images: string[] | null
          amenities: string[] | null
          status: string | null
          verified: boolean | null
          available: boolean | null
          contact_name: string | null
          contact_phone: string | null
          contact_email: string | null
          is_agent: boolean | null
          views: number | null
          created_at: string | null
          updated_at: string | null
          created_by_name?: string | null
          created_by_email?: string | null
          location?: unknown
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          property_type: string
          price: number
          price_type?: string | null
          city: string
          area: string
          pin_code: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          area_sqft?: number | null
          images?: string[] | null
          amenities?: string[] | null
          status?: string | null
          verified?: boolean | null
          available?: boolean | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          is_agent?: boolean | null
          views?: number | null
          created_at?: string | null
          updated_at?: string | null
          created_by_name?: string | null
          created_by_email?: string | null
          location?: unknown
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          property_type?: string
          price?: number
          price_type?: string | null
          city?: string
          area?: string
          pin_code?: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          area_sqft?: number | null
          images?: string[] | null
          amenities?: string[] | null
          status?: string | null
          verified?: boolean | null
          available?: boolean | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          is_agent?: boolean | null
          views?: number | null
          created_at?: string | null
          updated_at?: string | null
          created_by_name?: string | null
          created_by_email?: string | null
          location?: unknown
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          property_id: string | null
          content: string
          read: boolean
          created_at: string
          sender_name: string | null
          sender_email: string | null
          edited?: boolean | null
          edited_at?: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          property_id?: string | null
          content: string
          read?: boolean
          created_at?: string
          sender_name?: string | null
          sender_email?: string | null
          edited?: boolean | null
          edited_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          property_id?: string | null
          content?: string
          read?: boolean
          created_at?: string
          sender_name?: string | null
          sender_email?: string | null
          edited?: boolean | null
          edited_at?: string | null
        }
        Relationships: []
      }
      ad_campaigns: {
        Row: {
          id: string
          user_id: string
          property_id: string
          title: string
          status: string
          budget: number
          spent: number
          impressions: number
          clicks: number
          start_date: string
          end_date: string
          created_at: string
          updated_at: string
          created_by_name: string | null
          created_by_email: string | null
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          title: string
          status?: string
          budget?: number
          spent?: number
          impressions?: number
          clicks?: number
          start_date?: string
          end_date: string
          created_at?: string
          updated_at?: string
          created_by_name?: string | null
          created_by_email?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          title?: string
          status?: string
          budget?: number
          spent?: number
          impressions?: number
          clicks?: number
          start_date?: string
          end_date?: string
          created_at?: string
          updated_at?: string
          created_by_name?: string | null
          created_by_email?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
          created_at?: string | null
        }
        Insert: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
          created_at?: string | null
        }
        Update: {
          user_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          created_at?: string | null
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          id: string
          property_id: string
          sender_id: string
          receiver_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          sender_id: string
          receiver_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          link: string | null
          read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          link?: string | null
          read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          link?: string | null
          read?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          subject: string | null
          description: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject?: string | null
          description: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string | null
          description?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_ticket_attachments: {
        Row: {
          id: string
          ticket_id: string
          path: string
          mime_type: string | null
          size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          path: string
          mime_type?: string | null
          size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          path?: string
          mime_type?: string | null
          size?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string
          listing_id: string | null
          reason_type: Database["public"]["Enums"]["report_reason_type"]
          description: string
          evidence_urls: string[] | null
          status: Database["public"]["Enums"]["report_status"]
          admin_action: Database["public"]["Enums"]["admin_action_type"] | null
          admin_id: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id: string
          listing_id?: string | null
          reason_type: Database["public"]["Enums"]["report_reason_type"]
          description: string
          evidence_urls?: string[] | null
          status?: Database["public"]["Enums"]["report_status"]
          admin_action?: Database["public"]["Enums"]["admin_action_type"] | null
          admin_id?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string
          listing_id?: string | null
          reason_type?: Database["public"]["Enums"]["report_reason_type"]
          description?: string
          evidence_urls?: string[] | null
          status?: Database["public"]["Enums"]["report_status"]
          admin_action?: Database["public"]["Enums"]["admin_action_type"] | null
          admin_id?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
      user_actions: {
        Row: {
          id: string
          admin_id: string
          user_id: string
          action_type: Database["public"]["Enums"]["admin_action_type"]
          action_reason: string
          report_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          user_id: string
          action_type: Database["public"]["Enums"]["admin_action_type"]
          action_reason: string
          report_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          user_id?: string
          action_type?: Database["public"]["Enums"]["admin_action_type"]
          action_reason?: string
          report_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [key: string]: never
    }
    Functions: {
      has_role: { Args: { _user_id: string; _role: Database["public"]["Enums"]["app_role"] }; Returns: boolean }
      get_user_role: { Args: { _user_id: string }; Returns: Database["public"]["Enums"]["app_role"] | null }
      get_admin_dashboard_stats: { Args: Record<string, never>; Returns: Json }
      get_admin_users_list: {
        Args: Record<string, never>
        Returns: {
          id: string
          email: string
          full_name: string
          created_at: string
          properties_count: number
          favorites_count: number
          messages_sent: number
          last_active: string
        }[]
      }
      approve_property: { Args: { property_id: string }; Returns: void }
      reject_property: { Args: { property_id: string }; Returns: void }
      get_sponsored_properties: {
        Args: {
          filter_area?: string
          filter_city?: string
          filter_lat?: number
          filter_lng?: number
          filter_pin_code?: string
          radius_km?: number
        }
        Returns: {
          id: string
          user_id: string
          title: string
          description: string | null
          property_type: string
          price: number
          price_type: string | null
          city: string
          area: string
          pin_code: string
          address: string | null
          latitude: number | null
          longitude: number | null
          bedrooms: number | null
          bathrooms: number | null
          area_sqft: number | null
          images: string[] | null
          amenities: string[] | null
          status: string | null
          verified: boolean | null
          available: boolean | null
          contact_name: string | null
          contact_phone: string | null
          contact_email: string | null
          is_agent: boolean | null
          views: number | null
          created_at: string | null
          updated_at: string | null
          campaign_id: string | null
          distance_km: number | null
        }[]
      }
      search_properties_by_location: {
        Args: {
          property_type_filter?: string
          radius_km?: number
          search_area?: string
          search_city?: string
          search_latitude?: number
          search_longitude?: number
          search_pin_code?: string
        }
        Returns: {
          id: string
          title: string
          description: string | null
          property_type: string
          price: number
          city: string
          area: string
          pin_code: string
          latitude: number | null
          longitude: number | null
          bedrooms: number | null
          bathrooms: number | null
          area_sqft: number | null
          images: string[] | null
          amenities: string[] | null
          verified: boolean | null
          available: boolean | null
          distance_km: number | null
          created_at: string
        }[]
      }
      increment_campaign_impressions: { Args: { campaign_id: string }; Returns: void }
      increment_campaign_clicks: { Args: { campaign_id: string }; Returns: void }
      get_report_stats: { Args: Record<string, never>; Returns: Json }
      apply_admin_action: { 
        Args: { 
          p_report_id: string
          p_admin_id: string
          p_action_type: Database["public"]["Enums"]["admin_action_type"]
          p_admin_notes: string
        }
        Returns: void 
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      report_reason_type: "fraud" | "cheating" | "misleading" | "inactive_owner" | "spam" | "abuse" | "other"
      report_status: "new" | "in_review" | "action_taken" | "dismissed"
      admin_action_type: "warning" | "suspend_7d" | "suspend_30d" | "suspend_permanent" | "ban" | "listing_removed" | "dismissed"
    }
    CompositeTypes: {
      [key: string]: never
    }
  }
}
