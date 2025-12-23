import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Review {
  id: string;
  reviewer_id: string;
  owner_id: string;
  listing_id: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  review_type: 'business' | 'profile';
  created_at: string;
  updated_at: string;
  reviewer?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  verified_reviews: number;
}

export function useReviews(ownerId?: string, reviewType: 'business' | 'profile' = 'profile', listingId?: string) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!ownerId && !listingId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('review_type', reviewType)
        .order('created_at', { ascending: false });

      if (listingId) {
        query = query.eq('listing_id', listingId);
      } else if (ownerId) {
        query = query.eq('owner_id', ownerId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch reviewer profiles separately
      const reviewsWithProfiles = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', review.reviewer_id)
            .single();

          return {
            ...review,
            reviewer: profileData || { full_name: null, avatar_url: null }
          };
        })
      );

      setReviews(reviewsWithProfiles as any);

      // Check if user has already reviewed this owner
      if (user && ownerId) {
        const existingReview = reviewsWithProfiles.find((r: any) =>
          r.reviewer_id === user.id && r.owner_id === ownerId && r.review_type === reviewType
        );
        setUserReview(existingReview as any || null);
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [ownerId, listingId, reviewType, user]);

  const fetchStats = useCallback(async () => {
    if (!ownerId) return;

    try {
      // Calculate stats directly from reviews with review_type filter
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating, verified')
        .eq('owner_id', ownerId)
        .eq('review_type', reviewType);

      if (reviewsError) throw reviewsError;

      if (reviewsData && reviewsData.length > 0) {
        const totalReviews = reviewsData.length;
        const verifiedReviews = reviewsData.filter((r: any) => r.verified).length;
        const totalRating = reviewsData.reduce((sum: number, r: any) => sum + r.rating, 0);
        const avgRating = totalRating / totalReviews;

        setStats({
          average_rating: Number(avgRating.toFixed(1)) || 0,
          total_reviews: totalReviews,
          verified_reviews: verifiedReviews,
        });
      } else {
        setStats({
          average_rating: 0,
          total_reviews: 0,
          verified_reviews: 0,
        });
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      // Set default stats on error
      setStats({
        average_rating: 0,
        total_reviews: 0,
        verified_reviews: 0,
      });
    }
  }, [ownerId, reviewType]);

  const checkCanReview = useCallback(async () => {
    if (!user || !ownerId) {
      setCanReview(false);
      return;
    }

    // Don't allow self-review
    if (user.id === ownerId) {
      setCanReview(false);
      return;
    }

    try {
      // Check if user already has a review for this owner of this type
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('reviewer_id', user.id)
        .eq('owner_id', ownerId)
        .eq('review_type', reviewType)
        .maybeSingle();

      if (existingReview) {
        setCanReview(false);
        return;
      }

      // Check if user has interaction with this owner
      const { data: interaction, error } = await supabase
        .from('review_interaction')
        .select('id')
        .eq('reviewer_id', user.id)
        .eq('owner_id', ownerId)
        .limit(1);

      if (error) throw error;
      setCanReview((interaction?.length || 0) > 0);
    } catch (error: any) {
      console.error('Error checking review eligibility:', error);
      setCanReview(false);
    }
  }, [user, ownerId, reviewType]);

  const createReview = async (input: {
    owner_id: string;
    listing_id?: string | null;
    rating: number;
    title?: string;
    comment?: string;
    review_type: 'business' | 'profile';
  }): Promise<any> => {
    if (!user) {
      toast.error('You must be logged in to leave a review');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: user.id,
          owner_id: input.owner_id,
          listing_id: input.listing_id || null,
          rating: input.rating,
          title: input.title || null,
          comment: input.comment || null,
          review_type: input.review_type,
        } as any)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('You have already reviewed this owner. Edit your existing review instead.');
        } else if (error.message.includes('violates row-level security')) {
          toast.error('You must interact with this owner before leaving a review (e.g., send a message or lead)');
        } else {
          throw error;
        }
        return null;
      }

      toast.success('Review submitted successfully');
      fetchReviews();
      fetchStats();
      return data;
    } catch (error: any) {
      console.error('Error creating review:', error);
      toast.error('Failed to submit review');
      return null;
    }
  };

  const updateReview = async (reviewId: string, input: {
    rating: number;
    title?: string;
    comment?: string;
  }): Promise<any> => {
    if (!user) {
      toast.error('You must be logged in');
      return null;
    }

    try {
      const { data, error } = await (supabase
        .from('reviews') as any)
        .update({
          rating: input.rating,
          title: input.title || null,
          comment: input.comment || null,
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Review updated successfully');
      fetchReviews();
      fetchStats();
      return data;
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
      return null;
    }
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast.success('Review deleted successfully');
      fetchReviews();
      fetchStats();
      return true;
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
      return false;
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchStats();
    checkCanReview();

    // Set up real-time subscription for reviews
    const channelName = `reviews-${reviewType}-${ownerId || listingId || 'all'}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reviews',
        filter: ownerId ? `owner_id=eq.${ownerId}` : listingId ? `listing_id=eq.${listingId}` : undefined,
      }, (payload) => {
        console.log('Review changed:', payload);
        fetchReviews();
        fetchStats();
        checkCanReview();
      })
      .subscribe((status) => {
        console.log('Reviews subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, ownerId, reviewType, listingId, fetchReviews, fetchStats, checkCanReview]);

  return {
    reviews,
    userReview,
    stats,
    loading,
    canReview,
    createReview,
    updateReview,
    deleteReview,
    refetch: () => {
      fetchReviews();
      fetchStats();
      checkCanReview();
    },
  };
}

export function useMyReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyReviews = useCallback(async () => {
    if (!user) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          listing:properties(title, property_type),
          owner:profiles!reviews_owner_id_fkey(full_name, avatar_url)
        `)
        .eq('reviewer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error('Error fetching my reviews:', error);
      toast.error('Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyReviews();
  }, [user, fetchMyReviews]);

  return { reviews, loading, refetch: fetchMyReviews };
}
