import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/database";

export interface NearbyProperty extends Property {
  distance_km: number;
}

export const useNearbyProperties = (
  latitude: number | null,
  longitude: number | null,
  radiusKm: number = 5,
  enabledProp = true
) => {
  const isEnabled = enabledProp && latitude !== null && longitude !== null;

  return useQuery({
    queryKey: ["nearby-properties", latitude, longitude, radiusKm],
    queryFn: async () => {
      if (!latitude || !longitude) {
        return [];
      }

      // @ts-ignore - RPC function
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

      return (data || []) as NearbyProperty[];
    },
    enabled: isEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
