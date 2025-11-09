import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdCampaign {
  id: string;
  user_id: string;
  property_id: string;
  title: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  properties?: {
    id: string;
    title: string;
    property_type: string;
    city: string;
    area: string;
  };
}

export function useAdCampaigns(businessOnly: boolean = false) {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCampaigns([]);
        return;
      }

      let query = supabase
        .from('ad_campaigns')
        .select(`
          *,
          properties (
            id,
            title,
            property_type,
            city,
            area
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];
      
      // Filter for business-only campaigns if requested
      if (businessOnly && filteredData.length > 0) {
        filteredData = filteredData.filter(
          (campaign: any) => campaign.properties?.property_type === 'business'
        );
      }

      setCampaigns(filteredData as AdCampaign[]);
    } catch (error: any) {
      console.error('Error fetching ad campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();

    // Real-time listener for campaign changes
    const channel = supabase
      .channel('ad-campaigns')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ad_campaigns' },
        fetchCampaigns
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessOnly]);

  const createCampaign = async (campaignData: {
    property_id: string;
    title: string;
    budget: number;
    end_date: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('ad_campaigns')
        .insert({
          user_id: user.id,
          ...campaignData,
        });

      if (error) throw error;
      toast.success('Campaign created successfully');
      fetchCampaigns();
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || 'Failed to create campaign');
    }
  };

  const updateCampaignStatus = async (campaignId: string, status: 'active' | 'paused' | 'completed') => {
    try {
      const { error } = await supabase
        .from('ad_campaigns')
        .update({ status })
        .eq('id', campaignId);

      if (error) throw error;
      toast.success(`Campaign ${status}`);
      fetchCampaigns();
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      toast.error(error.message || 'Failed to update campaign');
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('ad_campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
      toast.success('Campaign deleted');
      fetchCampaigns();
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      toast.error(error.message || 'Failed to delete campaign');
    }
  };

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaignStatus,
    deleteCampaign,
    refetch: fetchCampaigns,
  };
}
