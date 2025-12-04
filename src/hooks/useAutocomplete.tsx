import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AutocompleteResult {
  label: string;
  type: "city" | "area" | "pincode" | "category" | "place";
  city_id?: string;
  area_id?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  relevance: number;
}

export function useAutocomplete(query: string, enabled = true) {
  return useQuery({
    queryKey: ["autocomplete", query] as const,
    queryFn: async () => {
      if (!query || query.length < 2) {
        return [] as AutocompleteResult[];
      }

      // @ts-expect-error - Fix type error - RPC function not in generated types yet
      const { data, error } = await supabase.rpc("autocomplete_search", {
        query_text: query,
        limit_count: 10,
      });

      if (error) {
        console.error("Autocomplete error:", error);
        throw error;
      }

      return (data ?? []) as unknown as AutocompleteResult[];
    },
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
