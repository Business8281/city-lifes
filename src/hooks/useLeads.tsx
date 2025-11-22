import { useState, useEffect } from 'react';
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
  status: 'new' | 'contacted' | 'interested' | 'not_interested' | 'closed';
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

  const fetchLeads = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, properties(*)')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    // Realtime subscription
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leads',
        filter: `owner_id=eq.${user?.id}`
      }, () => {
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createLead = async (leadData: any) => {
    try {
      // Validate required fields
      if (!leadData.owner_id) {
        console.error('Lead validation failed: missing owner_id');
        throw new Error('Owner information is missing. Please refresh and try again.');
      }
      if (!leadData.name?.trim()) {
        console.error('Lead validation failed: missing name');
        throw new Error('Please enter your name');
      }
      if (!leadData.phone?.trim()) {
        console.error('Lead validation failed: missing phone');
        throw new Error('Please enter your phone number');
      }
      
      // Ensure all required fields are present and properly formatted
      const sanitizedData = {
        listing_id: leadData.listing_id || null,
        owner_id: leadData.owner_id,
        user_id: user?.id || null, // Use current user if authenticated, null if not
        name: leadData.name.trim().substring(0, 100), // Limit to 100 chars
        phone: leadData.phone.trim().substring(0, 20), // Limit to 20 chars
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
      
      console.log('Creating lead with data:', { ...sanitizedData, phone: '***' }); // Log without sensitive data
      
      const { data, error } = await supabase
        .from('leads')
        .insert(sanitizedData as any)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        
        // Provide user-friendly error messages
        if (error.code === '23505') {
          throw new Error('You have already submitted an inquiry for this listing');
        } else if (error.code === '23503') {
          throw new Error('Invalid listing or owner information. Please refresh and try again.');
        } else if (error.message?.includes('JWT')) {
          throw new Error('Session expired. Please refresh the page and try again.');
        } else if (error.message?.includes('RLS')) {
          throw new Error('Database access error. Please try again or contact support.');
        } else {
          throw new Error(error.message || 'Failed to submit inquiry. Please try again.');
        }
      }
      
      if (!data) {
        console.error('No data returned from Supabase insert');
        throw new Error('Failed to save inquiry. Please try again.');
      }
      
      console.log('Lead created successfully:', (data as any).id);
      
      // Trigger refetch for owner's leads
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
      // @ts-ignore - Table types will be generated after migration
      const { error } = await supabase
        .from('leads')
        // @ts-ignore
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;
      toast.success('Lead status updated');
      fetchLeads();
    } catch (error: any) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead status');
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

  const fetchActivities = async () => {
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
  };

  useEffect(() => {
    fetchActivities();
  }, [leadId]);

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
