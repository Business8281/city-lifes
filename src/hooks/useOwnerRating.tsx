import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OwnerRating {
  average_rating: number;
  total_reviews: number;
}

export function useOwnerRating(ownerId?: string) {
  const [rating, setRating] = useState<OwnerRating | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ownerId) {
      setRating(null);
      return;
    }

    const fetchRating = async () => {
      try {
        setLoading(true);
        
        // Try RPC function first
        const { data: rpcData, error: rpcError } = await (supabase.rpc as any)('get_owner_rating_stats', {
          owner_user_id: ownerId
        });

        if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
          const statsData = rpcData[0] as any;
          setRating({
            average_rating: Number(statsData.average_rating) || 0,
            total_reviews: Number(statsData.total_reviews) || 0,
          });
          return;
        }

        // Fallback: Calculate directly from reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('owner_id', ownerId);

        if (reviewsError) throw reviewsError;

        if (reviewsData && reviewsData.length > 0) {
          const totalReviews = reviewsData.length;
          const totalRating = reviewsData.reduce((sum: number, r: any) => sum + r.rating, 0);
          const avgRating = totalRating / totalReviews;

          setRating({
            average_rating: Number(avgRating.toFixed(1)) || 0,
            total_reviews: totalReviews,
          });
        } else {
          setRating({
            average_rating: 0,
            total_reviews: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching owner rating:', error);
        setRating({
          average_rating: 0,
          total_reviews: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRating();

    // Subscribe to real-time updates for this owner's reviews
    const channel = supabase
      .channel(`owner-reviews-${ownerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `owner_id=eq.${ownerId}`,
        },
        () => {
          fetchRating();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownerId]);

  return { rating, loading };
}
