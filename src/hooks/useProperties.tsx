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
  searchQuery?: string;
  sortBy?: 'recent' | 'price-low' | 'price-high';
}

export function useProperties(filters?: PropertyFilters) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { location } = useLocation();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);

      // Use location context if no filters provided
      const effectiveFilters = { ...filters };

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
      // (Note: RPC needs update to support text search if we want robust search + geo, 
      // but standard approach: filter by geo first)
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
        // Client-side sort/filter for RPC results (limitation of current RPC)
        let filtered = (data || []) as unknown as Property[];

        if (effectiveFilters.searchQuery) {
          const q = effectiveFilters.searchQuery.toLowerCase();
          filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.area.toLowerCase().includes(q)
          );
        }

        if (effectiveFilters.sortBy) {
          if (effectiveFilters.sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
          else if (effectiveFilters.sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
          // recent is default
        }

        setProperties(filtered);
      }
      // 2) Standard Database Query
      else {
        let query = supabase
          .from('properties')
          .select('id, title, price, price_type, city, area, pin_code, property_type, status, available, verified, images, bedrooms, bathrooms, area_sqft, created_at, latitude, longitude')
          .eq('status', 'active')
          .eq('available', true);

        // Text Search (Server Side)
        if (effectiveFilters.searchQuery) {
          const q = effectiveFilters.searchQuery;
          // Use search across multiple columns
          query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,area.ilike.%${q}%,pin_code.ilike.%${q}%`);
        }

        if (effectiveFilters.city) {
          query = query.ilike('city', `%${(effectiveFilters.city || '').trim()}%`);
        }
        if (effectiveFilters.area) {
          query = query.ilike('area', `%${(effectiveFilters.area || '').trim()}%`);
        }
        if (effectiveFilters.pinCode) {
          const pin = (effectiveFilters.pinCode || '').trim();
          query = pin.length === 6 ? query.eq('pin_code', pin) : query.ilike('pin_code', `${pin}%`);
        }
        if (effectiveFilters.propertyType) {
          query = query.eq('property_type', effectiveFilters.propertyType);
        }

        // Sorting
        if (effectiveFilters.sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (effectiveFilters.sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query.limit(100);

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
    filters, // Re-fetch when filters change
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
    let removeAppListener: PluginListenerHandle | undefined;
    const setupAppListener = async () => {
      try {
        if (CapacitorApp?.addListener) {
          removeAppListener = await CapacitorApp.addListener('appStateChange', ({ isActive }) => {
            if (isActive) fetchProperties();
          });
        }
      } catch {

      }
    };
    setupAppListener();

    // 4) Throttled live updates to prevent excessive queries
    let updateTimeout: NodeJS.Timeout;
    const channel = supabase
      .channel('properties-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        () => {
          clearTimeout(updateTimeout);
          updateTimeout = setTimeout(() => fetchProperties(), 1000);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(updateTimeout);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('online', onOnline);
      if (removeAppListener) {
        removeAppListener.remove().catch(() => { });
      }
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
        .select('id, title, price, price_type, city, area, property_type, status, available, verified, images, views, created_at')
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


      // Check current user
      const { data: { user: _user } } = await supabase.auth.getUser();


      // Check property ownership
      const { data: _property, error: fetchError } = await supabase
        .from('properties')
        .select('id, title, user_id')
        .eq('id', propertyId)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching property:', fetchError);
        throw new Error(`Cannot find property: ${fetchError.message}`);
      }




      // Attempt delete

      const { error } = await supabase
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
