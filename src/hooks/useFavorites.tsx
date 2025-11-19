import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Favorite } from '@/types/database';
import { toast } from 'sonner';
import { App as CapacitorApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          property_id,
          user_id,
          created_at
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
  setFavorites((data || []) as unknown as Favorite[]);
  setFavoriteIds(new Set(((data || []) as any[]).map((f: any) => f.property_id)));
    } catch (error: unknown) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();

    // Keep favorites fresh on app/tab activation and connection restore
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchFavorites();
    };
    const onOnline = () => fetchFavorites();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('online', onOnline);

    let appStateHandle: PluginListenerHandle | undefined;
    
    // Setup Capacitor app state listener if available
    if (CapacitorApp?.addListener) {
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) fetchFavorites();
      }).then((handle) => {
        appStateHandle = handle;
      }).catch((err) => {
        console.log('Capacitor App listener not available:', err);
      });
    }

    // Live updates when favorites table changes for this user
    const channel = userId
      ? supabase
          .channel('favorites-live')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'favorites', filter: `user_id=eq.${userId}` },
            () => fetchFavorites()
          )
          .subscribe()
      : null;

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', onOnline);
      if (appStateHandle?.remove) {
        appStateHandle.remove();
      }
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId, fetchFavorites]);

  const toggleFavorite = async (propertyId: string) => {
    if (!userId) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      if (favoriteIds.has(propertyId)) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('property_id', propertyId);

        if (error) throw error;
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, property_id: propertyId });

        if (error) throw error;
        toast.success('Added to favorites');
      }

      fetchFavorites();
    } catch (error: unknown) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  return { favorites, favoriteIds, loading, toggleFavorite, refetch: fetchFavorites };
}
