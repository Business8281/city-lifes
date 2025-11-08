import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { toast } from 'sonner';

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

export const useSponsoredProperties = (location?: LocationFilter) => {
  const [sponsoredProperties, setSponsoredProperties] = useState<SponsoredProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsoredProperties();
  }, [location?.method, location?.value, location?.coordinates]);

  const fetchSponsoredProperties = async () => {
    try {
      setLoading(true);

      let filterCity = null;
      let filterArea = null;
      let filterPinCode = null;
      let filterLat = null;
      let filterLng = null;

      if (location?.method && location?.value) {
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

      const { data, error } = await supabase.rpc('get_sponsored_properties', {
        filter_city: filterCity,
        filter_area: filterArea,
        filter_pin_code: filterPinCode,
        filter_lat: filterLat,
        filter_lng: filterLng,
        radius_km: 10
      });

      if (error) throw error;

      setSponsoredProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching sponsored properties:', error);
      toast.error('Failed to load sponsored ads');
    } finally {
      setLoading(false);
    }
  };

  const incrementImpressions = async (campaignId: string) => {
    try {
      const { error } = await supabase.rpc('increment_campaign_impressions', {
        campaign_id: campaignId
      });
      if (error) console.error('Error incrementing impressions:', error);
    } catch (error) {
      console.error('Error incrementing impressions:', error);
    }
  };

  const incrementClicks = async (campaignId: string) => {
    try {
      const { error } = await supabase.rpc('increment_campaign_clicks', {
        campaign_id: campaignId
      });
      if (error) console.error('Error incrementing clicks:', error);
    } catch (error) {
      console.error('Error incrementing clicks:', error);
    }
  };

  return {
    sponsoredProperties,
    loading,
    incrementImpressions,
    incrementClicks,
    refetch: fetchSponsoredProperties
  };
};
