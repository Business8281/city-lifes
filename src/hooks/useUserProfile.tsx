import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface UserStats {
  properties_count: number;
  average_rating: number | null;
  total_reviews: number;
}

interface UserReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  created_at: string;
  reviewer: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchUserData();
  }, [userId, fetchUserData]);

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch rating stats
      const { data: statsData } = await supabase
        .rpc('get_owner_rating_stats' as any, { owner_user_id: userId });

      setStats((statsData as any)?.[0] || { properties_count: 0, average_rating: null, total_reviews: 0 });

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          comment,
          verified,
          created_at,
          reviewer:profiles!reviews_reviewer_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Reviews fetch error:', reviewsError);
        setReviews([]);
      } else {
        setReviews((reviewsData as any) || []);
      }

      // Fetch user properties - RLS handles visibility
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(6);

      if (propertiesError) {
        console.error('Properties fetch error:', propertiesError);
      } else {
        console.log('Fetched properties:', propertiesData);
        setProperties(propertiesData || []);
      }

    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    profile,
    stats,
    reviews,
    properties,
    loading,
    refetch: fetchUserData,
  };
}
