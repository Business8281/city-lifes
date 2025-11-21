import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/types/database";

export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
  area?: string;
  pincode?: string;
  minPrice?: number;
  maxPrice?: number;
  userLat?: number;
  userLng?: number;
  radiusKm?: number;
  minLat?: number;
  minLng?: number;
  maxLat?: number;
  maxLng?: number;
  page?: number;
  pageSize?: number;
}

export interface SearchProperty extends Property {
  distance_km?: number | null;
  relevance_score: number;
  total_count: number;
}

export function useAdvancedSearch(filters: SearchFilters, enabled = true) {
  return useQuery({
    queryKey: ["advanced-search", filters] as const,
    queryFn: async () => {
      // @ts-ignore - RPC function not in generated types yet
      const { data, error } = await supabase.rpc("search_properties", {
        query_text: filters.query || null,
        category_filter: filters.category || null,
        city_filter: filters.city || null,
        area_filter: filters.area || null,
        pincode_filter: filters.pincode || null,
        min_price: filters.minPrice || null,
        max_price: filters.maxPrice || null,
        user_lat: filters.userLat || null,
        user_lng: filters.userLng || null,
        radius_km: filters.radiusKm || null,
        min_lat: filters.minLat || null,
        min_lng: filters.minLng || null,
        max_lat: filters.maxLat || null,
        max_lng: filters.maxLng || null,
        page_number: filters.page || 1,
        page_size: filters.pageSize || 20,
      });

      if (error) {
        console.error("Search error:", error);
        throw error;
      }

      return (data ?? []) as SearchProperty[];
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}
