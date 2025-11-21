import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/types/database";

export interface NearbyProperty extends Property {
  distance_km: number;
}

export function useNearbyProperties(
  latitude: number | null,
  longitude: number | null,
  radiusKm = 5,
  enabledProp = true
) {
  const queryEnabled = enabledProp && latitude != null && longitude != null;
  
  return useQuery({
    queryKey: ["nearby-properties", latitude, longitude, radiusKm] as const,
    queryFn: async () => {
      if (latitude == null || longitude == null) {
        return [] as NearbyProperty[];
      }

      // @ts-ignore - RPC function not in generated types yet
      const { data, error } = await supabase.rpc("search_properties_nearby", {
        user_lat: latitude,
        user_lng: longitude,
        radius_km: radiusKm,
        limit_count: 100,
      });

      if (error) {
        console.error("Error fetching nearby properties:", error);
        throw error;
      }

      return (data ?? []) as NearbyProperty[];
    },
    enabled: queryEnabled,
    staleTime: 5 * 60 * 1000,
  });
}
