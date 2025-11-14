import { useEffect, useState, useCallback } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
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

  const fetchProperties = useCallback(async () => {
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

      // Location-aware querying
      // 1) If we have live coordinates, use the geospatial RPC for distance filtering
      if (effectiveFilters.latitude && effectiveFilters.longitude) {
        const { data, error } = await supabase.rpc('search_properties_by_location', {
          search_city: effectiveFilters.city || null,
          search_area: effectiveFilters.area || null,
          search_pin_code: effectiveFilters.pinCode || null,
          search_latitude: effectiveFilters.latitude,
          search_longitude: effectiveFilters.longitude,
          radius_km: effectiveFilters.radiusKm || 10,
          property_type_filter: effectiveFilters.propertyType || null,
        });

        if (error) throw error;
        setProperties((data || []) as unknown as Property[]);
      }
      // 2) If we only have textual filters (city/area/pincode), use ILIKE/equals directly
      else if (effectiveFilters.city || effectiveFilters.area || effectiveFilters.pinCode) {
        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .eq('available', true);

        if (effectiveFilters.city) {
          query = query.ilike('city', `%${(effectiveFilters.city || '').trim()}%`);
        }
        if (effectiveFilters.area) {
          query = query.ilike('area', `%${(effectiveFilters.area || '').trim()}%`);
        }
        if (effectiveFilters.pinCode) {
          // Pin code should be an exact match, but allow partial starts-with
          const pin = (effectiveFilters.pinCode || '').trim();
          query = pin.length === 6 ? query.eq('pin_code', pin) : query.ilike('pin_code', `${pin}%`);
        }
        if (effectiveFilters.propertyType) {
          query = query.eq('property_type', effectiveFilters.propertyType);
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setProperties((data || []) as unknown as Property[]);
      } else {
        // Optimized query: only fetch necessary fields, add limit for initial load
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .eq('available', true)
          .order('created_at', { ascending: false })
          .limit(50); // Load first 50 properties quickly, implement pagination if needed

        if (error) throw error;
        setProperties((data || []) as unknown as Property[]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [
    location.method,
    location.value,
    location.coordinates,
    filters,
  ]);

  useEffect(() => {
    fetchProperties();

    // 1) Revalidate when app/tab becomes active again
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchProperties();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // 2) Revalidate when network returns
    const onOnline = () => fetchProperties();
    window.addEventListener('online', onOnline);

    // 3) Revalidate when app comes to foreground (native builds)
    const removeAppListener = CapacitorApp.addListener?.('appStateChange', ({ isActive }) => {
      if (isActive) fetchProperties();
    }) as unknown as PluginListenerHandle | undefined;

    // 4) Live updates: refetch on any change to properties table
    const channel = supabase
      .channel('properties-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        () => fetchProperties()
      )
      .subscribe();

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', onOnline);
      // remove AppState listener if present
      removeAppListener?.remove?.();
      supabase.removeChannel(channel);
    };
  }, [fetchProperties]);

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
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Increment view count
        await supabase
          .from('properties')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);

        setProperty(data as unknown as Property);
      } catch (error) {
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

  const fetchMyListings = useCallback(async () => {
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
      setProperties((data || []) as unknown as Property[]);
    } catch (error) {
      console.error('Error fetching my listings:', error);
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  const deleteProperty = async (propertyId: string) => {
    try {
      console.log('🗑️ deleteProperty called with ID:', propertyId);
      
      // Check current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id, user?.email);
      
      // Check property ownership
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('id, title, user_id')
        .eq('id', propertyId)
        .single();
      
      if (fetchError) {
        console.error('❌ Error fetching property:', fetchError);
        throw new Error(`Cannot find property: ${fetchError.message}`);
      }
      
      console.log('Property to delete:', property);
      console.log('Ownership check:', {
        propertyUserId: property.user_id,
        currentUserId: user?.id,
        matches: property.user_id === user?.id
      });
      
      // Attempt delete
      console.log('Attempting to delete property:', propertyId);
      const { error, data } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
        .select();

      if (error) {
        console.error('❌ Delete error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('✅ Delete successful:', data);
      toast.success('Property deleted successfully! All related data has been removed.');
      fetchMyListings();
    } catch (error) {
      console.error('❌ Error deleting property:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete property';
      toast.error(`Delete failed: ${errorMessage}`);
    }
  };

  const updatePropertyStatus = async (propertyId: string, newStatus: 'available' | 'rented' | 'unavailable') => {
    try {
      let updateData: { status: string; available: boolean };
      let statusMessage: string;

      switch (newStatus) {
        case 'available':
          // Property is live and visible to users
          updateData = { status: 'active', available: true };
          statusMessage = 'Property is now live and available to users';
          break;
        case 'rented':
          // Property is rented, not visible to users
          updateData = { status: 'rented', available: false };
          statusMessage = 'Property marked as rented (hidden from users)';
          break;
        case 'unavailable':
          // Property is in draft mode, not visible to users
          updateData = { status: 'inactive', available: false };
          statusMessage = 'Property saved as draft (hidden)';
          break;
      }

      // Optimistic UI: snapshot previous value for potential rollback
      const previous = properties.find((p) => p.id === propertyId) || null;

      // Apply optimistic update so UI reflects selection immediately
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: updateData.status, available: updateData.available } : p))
      );

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', propertyId);

      if (error) {
        // Rollback on failure
        if (previous) {
          setProperties((prev) => prev.map((p) => (p.id === propertyId ? previous : p)));
        }
        throw error;
      }

      toast.success(statusMessage);
      // Refresh from server to ensure consistency (and catch external updates)
      fetchMyListings();
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Failed to update property status');
    }
  };

  return { properties, loading, deleteProperty, updatePropertyStatus, refetch: fetchMyListings };
}
