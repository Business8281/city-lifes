import { useState, useEffect, useCallback } from 'react';
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

  const fetchAnalytics = useCallback(async () => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase.rpc as any)(
        'get_campaign_analytics',
        { p_campaign_id: campaignId }
      );

      if (error) throw error;

      if (data && Array.isArray(data) && data.length > 0) {
        setAnalytics(data[0] as unknown as CampaignAnalytics);
      }
    } catch (error: any) {
      console.error('Error fetching campaign analytics:', error);
      toast.error('Failed to fetch campaign analytics');
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

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
  }, [campaignId, fetchAnalytics]);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics
  };
};