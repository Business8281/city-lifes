import { useEffect, useState } from 'react';
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
  review_text: string | null;
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
  }, [userId]);

  const fetchUserData = async () => {
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
        .rpc('get_user_rating_stats' as any, { _user_id: userId });

      setStats((statsData as any)?.[0] || { properties_count: 0, average_rating: null, total_reviews: 0 });

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('user_reviews')
        .select(`
          id,
          rating,
          review_text,
          created_at,
          reviewer:reviewer_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('reviewed_user_id', userId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);

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
  };

  return {
    profile,
    stats,
    reviews,
    properties,
    loading,
    refetch: fetchUserData,
  };
}
