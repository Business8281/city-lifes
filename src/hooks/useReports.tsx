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
      
      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .eq('reporter_id', user.id)
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
        .select('id, full_name, email')
        .in('id', allUserIds);

      // Fetch related listings
      const listingIds = reportsData.filter((r: any) => r.listing_id).map((r: any) => r.listing_id);
      const { data: listingsData } = listingIds.length > 0 ? await supabase
        .from('properties')
        .select('id, title, property_type')
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
      const { data, error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          reported_user_id: input.reported_user_id,
          listing_id: input.listing_id || null,
          reason_type: input.reason_type,
          description: input.description,
          evidence_urls: input.evidence_urls || []
        })
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
    if (!user) return;

    fetchReports();

    // Real-time subscription for instant updates
    const channel = supabase
      .channel(`user-reports-${user.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'reports',
        filter: `reporter_id=eq.${user.id}`
      }, (payload) => {
        console.log('New report created in real-time:', payload);
        fetchReports(); // Instant update
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'reports',
        filter: `reporter_id=eq.${user.id}`
      }, (payload) => {
        console.log('Report updated in real-time:', payload);
        fetchReports(); // Instant update when admin changes status
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time reports subscription active for user:', user.id);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Real-time reports subscription error');
        }
      });

    return () => {
      console.log('Cleaning up reports subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { reports, loading, createReport, refetch: fetchReports };
}
