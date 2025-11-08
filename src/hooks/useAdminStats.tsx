import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingProperties: number;
  totalMessages: number;
  totalFavorites: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProperties: 0,
    pendingProperties: 0,
    totalMessages: 0,
    totalFavorites: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [usersResult, propertiesResult, pendingResult, messagesResult, favoritesResult] = 
        await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('verified', false),
          supabase.from('messages').select('id', { count: 'exact', head: true }),
          supabase.from('favorites').select('id', { count: 'exact', head: true }),
        ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        pendingProperties: pendingResult.count || 0,
        totalMessages: messagesResult.count || 0,
        totalFavorites: favoritesResult.count || 0,
      });
    } catch (error: any) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time listeners for stats updates
    const propertiesChannel = supabase
      .channel('admin-stats-properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, fetchStats)
      .subscribe();

    const profilesChannel = supabase
      .channel('admin-stats-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  return { stats, loading, refetch: fetchStats };
}
