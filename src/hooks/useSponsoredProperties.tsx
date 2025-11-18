import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { toast } from 'sonner';
import { App as CapacitorApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';

interface SponsoredProperty extends Property {
  campaign_id?: string;
}

interface LocationFilter {
  method?: string;
  value?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Updated: fetch sponsored properties unconditionally (active campaigns) used on Listings page only.
export const useSponsoredProperties = (location?: LocationFilter) => {
  const [sponsoredProperties, setSponsoredProperties] = useState<SponsoredProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch once on mount or when basic location filter changes if future logic needs it
    fetchSponsoredProperties();

    // Refresh when tab/app becomes active again or when network returns
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchSponsoredProperties();
      }
    };
    const onOnline = () => fetchSponsoredProperties();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('online', onOnline);

    // Native builds foreground
    let appHandle: PluginListenerHandle | undefined;
    if (CapacitorApp.addListener) {
      appHandle = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) fetchSponsoredProperties();
      }) as unknown as PluginListenerHandle;
    }

    // Live updates from campaigns table
    const channel = supabase
      .channel('ad-campaigns-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ad_campaigns' },
        () => fetchSponsoredProperties()
      )
      .subscribe();

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', onOnline);
      if (appHandle?.remove) {
        appHandle.remove();
      }
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.method, location?.value]);

  const fetchSponsoredProperties = async () => {
    try {
      setLoading(true);

      // We now allow sponsored ads without requiring a location filter.

      let filterCity = null;
      let filterArea = null;
      let filterPinCode = null;
      let filterLat = null;
      let filterLng = null;

      if (location?.method) {
        switch (location.method) {
          case 'city':
            filterCity = location.value;
            break;
          case 'area':
            filterArea = location.value;
            break;
          case 'pincode':
            filterPinCode = location.value;
            break;
          case 'live':
            if (location.coordinates) {
              filterLat = location.coordinates.lat;
              filterLng = location.coordinates.lng;
            }
            break;
        }
      }

      // If no filters present, call RPC with null filters to get generic sponsored ads.

      const { data, error } = await supabase.rpc('get_sponsored_properties', {
        filter_city: filterCity,
        filter_area: filterArea,
        filter_pin_code: filterPinCode,
        filter_lat: filterLat,
        filter_lng: filterLng,
        radius_km: 10
      });

      if (error) throw error;

  setSponsoredProperties((data || []) as unknown as SponsoredProperty[]);
    } catch (error) {
      console.error('Error fetching sponsored properties:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sponsored ads';
      toast.error(errorMessage);
      setSponsoredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const incrementImpressions = (campaignId: string) => {
    // Fire and forget - don't await to prevent blocking UI
    supabase.rpc('increment_campaign_impressions', {
      campaign_id: campaignId
    }).then(({ error }) => {
      if (error) console.error('Error incrementing impressions:', error);
    });
  };

  const incrementClicks = (campaignId: string) => {
    // Fire and forget - don't await to prevent blocking navigation
    supabase.rpc('increment_campaign_clicks', {
      campaign_id: campaignId
    }).then(({ error }) => {
      if (error) console.error('Error incrementing clicks:', error);
    });
  };

  return {
    sponsoredProperties,
    loading,
    incrementImpressions,
    incrementClicks,
    refetch: fetchSponsoredProperties
  };
};
