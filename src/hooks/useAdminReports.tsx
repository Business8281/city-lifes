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
      
      // Fetch all reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      if (!reportsData || reportsData.length === 0) {
        setReports([]);
        setLoading(false);
        return;
      }

      // Fetch related profiles
      const reporterIds = [...new Set(reportsData.map((r: any) => r.reporter_id))];
      const reportedUserIds = [...new Set(reportsData.map((r: any) => r.reported_user_id))];
      const allUserIds = [...new Set([...reporterIds, ...reportedUserIds])];

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', allUserIds);

      // Fetch related listings
      const listingIds = reportsData.filter((r: any) => r.listing_id).map((r: any) => r.listing_id);
      const { data: listingsData } = listingIds.length > 0 ? await supabase
        .from('properties')
        .select('id, title, property_type, city, area')
        .in('id', listingIds) : { data: [] };

      // Map data together
      const profilesMap = new Map<string, any>();
      profilesData?.forEach(p => profilesMap.set(p.id, p));
      
      const listingsMap = new Map<string, any>();
      listingsData?.forEach((l: any) => listingsMap.set(l.id, l));

      const enrichedReports = reportsData.map((report: any) => ({
        ...report,
        reporter: profilesMap.get(report.reporter_id) || null,
        reported_user: profilesMap.get(report.reported_user_id) || null,
        listing: report.listing_id ? listingsMap.get(report.listing_id) || null : null,
      }));

      setReports(enrichedReports as any);
    } catch (error: any) {
      console.error('Error fetching admin reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_report_stats' as any);
      if (error) throw error;
      setStats(data as any as ReportStats);
    } catch (error: any) {
      console.error('Error fetching report stats:', error);
    }
  };

  const applyAdminAction = async (
    reportId: string,
    actionType: 'warning' | 'suspend_7d' | 'suspend_30d' | 'suspend_permanent' | 'ban' | 'listing_removed' | 'dismissed',
    adminNotes: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
