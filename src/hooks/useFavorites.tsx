import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Favorite } from '@/types/database';
import { toast } from 'sonner';

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          properties:property_id (
            *,
            profiles:user_id (
              id,
              full_name,
              phone,
              email
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      setFavorites(data || []);
      setFavoriteIds(new Set(data?.map(f => f.property_id) || []));
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

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
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  return { favorites, favoriteIds, loading, toggleFavorite, refetch: fetchFavorites };
}
