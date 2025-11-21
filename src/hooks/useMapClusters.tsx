import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MapCluster {
  cluster_lat: number;
  cluster_lng: number;
  property_count: number;
  avg_price: number;
  property_ids: string[];
}

export interface MapBounds {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
  zoom: number;
  category?: string;
}

export function useMapClusters(bounds: MapBounds | null, enabled = true) {
  return useQuery({
    queryKey: ["map-clusters", bounds] as const,
    queryFn: async () => {
      if (!bounds) {
        return [] as MapCluster[];
      }

      // @ts-ignore - RPC function not in generated types yet
      const { data, error } = await supabase.rpc("get_map_clusters", {
        min_lat: bounds.minLat,
        min_lng: bounds.minLng,
        max_lat: bounds.maxLat,
        max_lng: bounds.maxLng,
        zoom_level: bounds.zoom,
        category_filter: bounds.category || null,
      });

      if (error) {
        console.error("Map clusters error:", error);
        throw error;
      }

      return (data ?? []) as unknown as MapCluster[];
    },
    enabled: enabled && bounds !== null,
    staleTime: 60 * 1000, // 1 minute
  });
}
