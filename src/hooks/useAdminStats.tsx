import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  totalProperties: number;
  activeProperties: number;
  pendingProperties: number;
  verifiedProperties: number;
  newPropertiesToday: number;
  totalMessages: number;
  messagesToday: number;
  unreadMessages: number;
  totalFavorites: number;
  favoritesToday: number;
  totalInquiries: number;
  inquiriesToday: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalViews: number;
  avgPropertyPrice: number;
  propertiesByType: Record<string, number>;
  topCities: Record<string, number>;
  recentActivity: Array<{
    type: string;
    description: string;
    created_at: string;
    user_id: string;
  }>;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    totalProperties: 0,
    activeProperties: 0,
    pendingProperties: 0,
    verifiedProperties: 0,
    newPropertiesToday: 0,
    totalMessages: 0,
    messagesToday: 0,
    unreadMessages: 0,
    totalFavorites: 0,
    favoritesToday: 0,
    totalInquiries: 0,
    inquiriesToday: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalViews: 0,
    avgPropertyPrice: 0,
    propertiesByType: {},
    topCities: {},
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');

      if (error) throw error;

      if (data) {
        const statsData = data as any;
        setStats({
          totalUsers: statsData.total_users || 0,
          newUsersToday: statsData.new_users_today || 0,
          newUsersThisWeek: statsData.new_users_this_week || 0,
          totalProperties: statsData.total_properties || 0,
          activeProperties: statsData.active_properties || 0,
          pendingProperties: statsData.pending_properties || 0,
          verifiedProperties: statsData.verified_properties || 0,
          newPropertiesToday: statsData.new_properties_today || 0,
          totalMessages: statsData.total_messages || 0,
          messagesToday: statsData.messages_today || 0,
          unreadMessages: statsData.unread_messages || 0,
          totalFavorites: statsData.total_favorites || 0,
          favoritesToday: statsData.favorites_today || 0,
          totalInquiries: statsData.total_inquiries || 0,
          inquiriesToday: statsData.inquiries_today || 0,
          totalCampaigns: statsData.total_campaigns || 0,
          activeCampaigns: statsData.active_campaigns || 0,
          totalViews: statsData.total_views || 0,
          avgPropertyPrice: parseFloat(statsData.avg_property_price || 0),
          propertiesByType: statsData.properties_by_type || {},
          topCities: statsData.top_cities || {},
          recentActivity: statsData.recent_activity || [],
        });
      }
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time listeners for live updates
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorites' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ad_campaigns' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading, refetch: fetchStats };
}
