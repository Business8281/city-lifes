import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CampaignAnalytics {
  total_leads: number;
  organic_leads: number;
  paid_leads: number;
  conversion_rate: number;
  cpl: number;
}

export const useCampaignAnalytics = (campaignId: string | null) => {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    try {
      // @ts-ignore - Function types will be generated after migration
      const { data, error } = await supabase
        // @ts-ignore
        .rpc('get_campaign_analytics', { p_campaign_id: campaignId });

      if (error) throw error;
      
      // @ts-ignore
      if (data && data.length > 0) {
        setAnalytics(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching campaign analytics:', error);
      toast.error('Failed to fetch campaign analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Realtime subscription for campaign updates
    if (campaignId) {
      const channel = supabase
        .channel(`campaign-analytics-${campaignId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `campaign_id=eq.${campaignId}`
        }, () => {
          fetchAnalytics();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [campaignId]);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics
  };
};
