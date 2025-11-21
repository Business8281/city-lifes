import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  listing_id: string | null;
  reason_type: 'fraud' | 'cheating' | 'misleading' | 'inactive_owner' | 'spam' | 'abuse' | 'other';
  description: string;
  evidence_urls: string[] | null;
  status: 'new' | 'in_review' | 'action_taken' | 'dismissed';
  admin_action: string | null;
  admin_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  reporter?: {
    full_name: string | null;
    email: string;
  };
  reported_user?: {
    full_name: string | null;
    email: string;
  };
  listing?: {
    title: string;
    property_type: string;
  };
}

export interface CreateReportInput {
  reported_user_id: string;
  listing_id?: string;
  reason_type: Report['reason_type'];
  description: string;
  evidence_urls?: string[];
}

export function useReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!user) {
      setReports([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:profiles!reports_reporter_id_fkey(full_name, email),
          reported_user:profiles!reports_reported_user_id_fkey(full_name, email),
          listing:properties(title, property_type)
        `)
        .eq('reporter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (input: CreateReportInput) => {
    if (!user) {
      toast.error('You must be logged in to submit a report');
      return null;
    }

    try {
      // @ts-ignore - Using insert with proper typing
      const { data, error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          reported_user_id: input.reported_user_id,
          listing_id: input.listing_id || null,
          reason_type: input.reason_type,
          description: input.description,
          evidence_urls: input.evidence_urls || []
        } as any)
        .select()
        .single();

      if (error) {
        if (error.message.includes('48 hours')) {
          toast.error('You can only report the same user once every 48 hours');
        } else {
          throw error;
        }
        return null;
      }

      toast.success('Report submitted successfully. Our safety team will review it.');
      fetchReports();
      return data;
    } catch (error: any) {
      console.error('Error creating report:', error);
      toast.error('Failed to submit report');
      return null;
    }
  };

  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel('user-reports-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reports',
        filter: `reporter_id=eq.${user?.id}`
      }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { reports, loading, createReport, refetch: fetchReports };
}
