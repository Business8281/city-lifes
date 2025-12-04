import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface City {
  id: string;
  name: string;
  state: string;
  tier: string;
}

interface Area {
  id: string;
  name: string;
  pincode_list: string[];
}

interface Pincode {
  id: string;
  pincode: string;
}

export const useCities = (tier?: string) => {
  return useQuery({
    queryKey: ["cities", tier],
    queryFn: async () => {
      let query = supabase
        .from("cities")
        .select("*")
        .order("name");

      if (tier) {
        query = query.eq("tier", tier);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as City[];
    },
  });
};

export const useAreas = (cityId: string | null) => {
  return useQuery({
    queryKey: ["areas", cityId],
    queryFn: async () => {
      if (!cityId) return [];

      const { data, error } = await supabase
        .from("areas")
        .select("*")
        .eq("city_id", cityId)
        .order("name");

      if (error) throw error;
      return data as Area[];
    },
    enabled: !!cityId,
  });
};

export const usePincodes = (areaId: string | null) => {
  return useQuery({
    queryKey: ["pincodes", areaId],
    queryFn: async () => {
      if (!areaId) return [];

      const { data, error } = await supabase
        .from("pincodes")
        .select("*")
        .eq("area_id", areaId)
        .order("pincode");

      if (error) throw error;
      return data as Pincode[];
    },
    enabled: !!areaId,
  });
};

export const useResolveLocation = () => {
  const resolveLocation = async (lat: number, lng: number) => {
    // @ts-expect-error - Fix type error - RPC function not yet in generated types
    const { data, error } = await supabase.rpc("resolve_location_from_coords", {
      lat,
      lng,
      max_distance_km: 50,
    });

    if (error) throw error;
    return data;
  };

  return { resolveLocation };
};

// Cache cities in localStorage for faster access
export const useCachedCities = () => {
  const CACHE_KEY = "citylifes_cities_cache";
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  const getCachedCities = (): City[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  };

  const setCachedCities = (cities: City[]) => {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: cities, timestamp: Date.now() })
      );
    } catch {
      // Ignore cache errors
    }
  };

  return useQuery({
    queryKey: ["cities_cached"],
    queryFn: async () => {
      const cached = getCachedCities();
      if (cached) return cached;

      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("name");

      if (error) throw error;
      
      setCachedCities(data as City[]);
      return data as City[];
    },
    staleTime: CACHE_DURATION,
  });
};
