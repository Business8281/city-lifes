import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Lead {
  id: string;
  listing_id: string | null;
  owner_id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'interested' | 'lost' | 'closed';
  source: 'listing' | 'chat' | 'whatsapp' | 'call';
  lead_type?: 'organic' | 'paid';
  category?: string | null;
  subcategory?: string | null;
  source_page?: 'listing_page' | 'category_page' | 'internal_ad';
  campaign_id?: string | null;
  created_at: string;
  updated_at: string;
  properties?: any;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  action_type: 'status_change' | 'note_added' | 'contact_made';
  note: string | null;
  created_at: string;
}

export const useLeads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    if (!user) {
      setLeads([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch all organic leads including business listings
      const { data, error } = await supabase
        .from('leads')
        .select(`
          id, listing_id, owner_id, user_id, name, phone, email, message, status, source, lead_type, category, created_at, campaign_id,
          properties:listing_id (
            id,
            title,
            property_type,
            city,
            area
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads((data || []) as Lead[]);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeads();

    if (!user) return;



    // Realtime subscription for instant updates
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads',
        filter: `owner_id=eq.${user.id}`
      }, (payload) => {

        fetchLeads();
      })
      .subscribe((status) => {

      });

    return () => {

      supabase.removeChannel(channel);
    };
  }, [user, fetchLeads]);

  const createLead = async (leadData: any) => {
    try {
      // Validate required fields
      if (!leadData.owner_id) {
        throw new Error('Owner information is missing');
      }
      if (!leadData.name?.trim()) {
        throw new Error('Please enter your name');
      }
      if (!leadData.phone?.trim()) {
        throw new Error('Please enter your phone number');
      }

      // Sanitize and format data
      const sanitizedData = {
        listing_id: leadData.listing_id || null,
        owner_id: leadData.owner_id,
        user_id: user?.id || null,
        name: leadData.name.trim().substring(0, 100),
        phone: leadData.phone.trim().substring(0, 20),
        email: leadData.email?.trim()?.substring(0, 255) || null,
        message: leadData.message?.trim()?.substring(0, 1000) || null,
        status: leadData.status || 'new',
        source: leadData.source || 'listing',
        lead_type: leadData.lead_type || 'organic',
        category: leadData.category || null,
        subcategory: leadData.subcategory || null,
        source_page: leadData.source_page || 'listing_page',
        campaign_id: leadData.campaign_id || null,
      };

      const { data, error } = await supabase
        .from('leads')
        .insert(sanitizedData as any)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('You have already submitted an inquiry for this listing');
        } else if (error.code === '23503') {
          throw new Error('Invalid listing information');
        }
        throw new Error(error.message || 'Failed to submit inquiry');
      }

      if (!data) {
        throw new Error('Failed to save inquiry');
      }

      // Refresh leads if user is the owner
      if (user?.id === leadData.owner_id) {
        fetchLeads();
      }

      return data;
    } catch (error: any) {
      console.error('Create lead error:', error);
      throw error;
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
    try {


      // Verify user is authenticated
      if (!user) {
        console.error('❌ No user found');
        toast.error('Please log in to update lead status');
        return;
      }

      // Optimistic UI update
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId
            ? { ...lead, status, updated_at: new Date().toISOString() }

            : lead
        )
      );

      // Update in database
      const { data, error } = await supabase
        .from('leads')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .select()
        .single();



      if (error) {
        // Revert optimistic update
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            lead.id === leadId
              ? { ...lead, status: prevLeads.find(l => l.id === leadId)?.status as Lead['status'] }
              : lead
          )
        );

        console.error('Error updating lead status:', error);
        if (error.code === 'PGRST116') {
          toast.error('Lead not found or you do not have permission to update it');
        } else {
          toast.error(`Failed to update status: ${error.message}`);
        }
        return;
      }

      if (!data) {

        fetchLeads();
        toast.error('Update failed. Please try again.');
        return;
      }


      toast.success(`Status changed to "${status.replace('_', ' ')}"`, {
        duration: 2000,
      });

    } catch (error: any) {
      console.error('❌ Unexpected error:', error);
      fetchLeads(); // Revert
      toast.error('Failed to update. Please try again.');
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;
      toast.success('Lead deleted');
      fetchLeads();
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  return {
    leads,
    loading,
    createLead,
    updateLeadStatus,
    deleteLead,
    refetch: fetchLeads
  };
};

export const useLeadActivity = (leadId: string) => {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('lead_activity')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchActivities();
  }, [leadId, fetchActivities]);

  const addActivity = async (actionType: LeadActivity['action_type'], note: string) => {
    try {
      const { error } = await supabase
        .from('lead_activity')
        .insert([{
          lead_id: leadId,
          action_type: actionType,
          note
        }] as any);

      if (error) throw error;
      toast.success('Activity added');
      fetchActivities();
    } catch (error: any) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    }
  };

  return {
    activities,
    loading,
    addActivity,
    refetch: fetchActivities
  };
};