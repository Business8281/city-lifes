import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Report } from './useReports';

export interface ReportStats {
  total_reports: number;
  new_reports: number;
  in_review: number;
  action_taken: number;
  dismissed: number;
  fraud_reports: number;
  spam_reports: number;
}

export function useAdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:profiles!reports_reporter_id_fkey(full_name, email, phone),
          reported_user:profiles!reports_reported_user_id_fkey(full_name, email, phone, safety_score, suspended_until, is_banned),
          listing:properties(title, property_type, city, area)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching admin reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // @ts-ignore - RPC function not yet in types
      const { data, error } = await supabase.rpc('get_report_stats');
      if (error) throw error;
      setStats(data as any as ReportStats);
    } catch (error: any) {
      console.error('Error fetching report stats:', error);
    }
  };

  const applyAdminAction = async (
    reportId: string,
    actionType: string,
    adminNotes: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // @ts-ignore - RPC function not yet in types
      const { error } = await supabase.rpc('apply_admin_action', {
        p_report_id: reportId,
        p_admin_id: user.id,
        p_action_type: actionType,
        p_admin_notes: adminNotes
      });

      if (error) throw error;

      toast.success('Action applied successfully');
      fetchReports();
      fetchStats();
    } catch (error: any) {
      console.error('Error applying admin action:', error);
      toast.error('Failed to apply action');
    }
  };

  useEffect(() => {
    fetchReports();
    fetchStats();

    const channel = supabase
      .channel('admin-reports-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reports'
      }, () => {
        fetchReports();
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { reports, loading, stats, applyAdminAction, refetch: fetchReports };
}
