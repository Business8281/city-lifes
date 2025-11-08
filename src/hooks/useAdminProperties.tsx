import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { toast } from 'sonner';

export function useAdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq('verified', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties((data || []) as unknown as Property[]);
    } catch (error: any) {
      console.error('Error fetching pending properties:', error);
      toast.error('Failed to load pending properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProperties();

    // Real-time listener for property changes
    const channel = supabase
      .channel('admin-properties')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        fetchPendingProperties
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const approveProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase.rpc('approve_property', {
        property_id: propertyId
      });

      if (error) throw error;
      toast.success('Property approved successfully');
      fetchPendingProperties();
    } catch (error: any) {
      console.error('Error approving property:', error);
      toast.error(error.message || 'Failed to approve property');
    }
  };

  const rejectProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase.rpc('reject_property', {
        property_id: propertyId
      });

      if (error) throw error;
      toast.success('Property rejected');
      fetchPendingProperties();
    } catch (error: any) {
      console.error('Error rejecting property:', error);
      toast.error(error.message || 'Failed to reject property');
    }
  };

  return {
    properties,
    loading,
    approveProperty,
    rejectProperty,
    refetch: fetchPendingProperties,
  };
}
