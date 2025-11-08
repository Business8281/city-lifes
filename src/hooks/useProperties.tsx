import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { toast } from 'sonner';
import { useLocation } from '@/contexts/LocationContext';

interface PropertyFilters {
  city?: string;
  area?: string;
  pinCode?: string;
  propertyType?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

export function useProperties(filters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { location } = useLocation();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Use location context if no filters provided
      const effectiveFilters = filters || {};
      
      // Apply location context
      if (location.method === 'city' && location.value) {
        effectiveFilters.city = location.value;
      } else if (location.method === 'area' && location.value) {
        effectiveFilters.area = location.value;
      } else if (location.method === 'pincode' && location.value) {
        effectiveFilters.pinCode = location.value;
      } else if (location.method === 'live' && location.coordinates) {
        effectiveFilters.latitude = location.coordinates.lat;
        effectiveFilters.longitude = location.coordinates.lng;
        effectiveFilters.radiusKm = effectiveFilters.radiusKm || 10;
      }

      // Use the search function for location-based filtering
      if (effectiveFilters.city || effectiveFilters.area || effectiveFilters.pinCode || 
          (effectiveFilters.latitude && effectiveFilters.longitude)) {
        const { data, error } = await supabase.rpc('search_properties_by_location', {
          search_city: effectiveFilters.city || null,
          search_area: effectiveFilters.area || null,
          search_pin_code: effectiveFilters.pinCode || null,
          search_latitude: effectiveFilters.latitude || null,
          search_longitude: effectiveFilters.longitude || null,
          radius_km: effectiveFilters.radiusKm || 10,
          property_type_filter: effectiveFilters.propertyType || null,
        });

        if (error) throw error;
        setProperties((data || []) as Property[]);
      } else {
        // Fallback to regular query if no location filter
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .eq('available', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties((data || []) as Property[]);
      }
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [
    location.method,
    location.value,
    location.coordinates?.lat,
    location.coordinates?.lng,
    filters?.city,
    filters?.area,
    filters?.pinCode,
    filters?.propertyType,
  ]);

  return { properties, loading, refetch: fetchProperties };
}

export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            profiles:user_id (
              id,
              full_name,
              phone,
              email
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        // Increment view count
        await supabase
          .from('properties')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);

        setProperty(data as Property);
      } catch (error: any) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading };
}

export function useMyListings(userId: string | undefined) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties((data || []) as Property[]);
    } catch (error: any) {
      console.error('Error fetching my listings:', error);
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [userId]);

  const deleteProperty = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      
      toast.success('Property deleted successfully');
      fetchMyListings();
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  return { properties, loading, deleteProperty, refetch: fetchMyListings };
}
