-- Drop the duplicate overloaded functions
DROP FUNCTION IF EXISTS public.get_sponsored_properties(text, text, text, numeric, numeric, numeric);
DROP FUNCTION IF EXISTS public.get_sponsored_properties(text, text, numeric, numeric, text, numeric);

-- Create a single, clean version of the function
CREATE OR REPLACE FUNCTION public.get_sponsored_properties(
  filter_city text DEFAULT NULL,
  filter_area text DEFAULT NULL,
  filter_pin_code text DEFAULT NULL,
  filter_lat numeric DEFAULT NULL,
  filter_lng numeric DEFAULT NULL,
  radius_km numeric DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  description text,
  property_type text,
  price numeric,
  price_type text,
  city text,
  area text,
  pin_code text,
  address text,
  latitude numeric,
  longitude numeric,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  images text[],
  amenities text[],
  status text,
  verified boolean,
  available boolean,
  contact_name text,
  contact_phone text,
  contact_email text,
  is_agent boolean,
  views integer,
  created_at timestamptz,
  updated_at timestamptz,
  created_by_name text,
  created_by_email text,
  business_metadata jsonb,
  campaign_id uuid,
  distance_km numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.*,
    ac.id as campaign_id,
    CASE 
      WHEN filter_lat IS NOT NULL AND filter_lng IS NOT NULL AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
      THEN (
        6371 * acos(
          cos(radians(filter_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(filter_lng)) + 
          sin(radians(filter_lat)) * sin(radians(p.latitude))
        )
      )
      ELSE NULL
    END as distance_km
  FROM properties p
  INNER JOIN ad_campaigns ac ON ac.property_id = p.id
  WHERE 
    ac.status = 'active'
    AND ac.start_date <= now()
    AND ac.end_date >= now()
    AND p.status = 'active'
    AND p.available = true
    AND (filter_city IS NULL OR p.city ILIKE filter_city)
    AND (filter_area IS NULL OR p.area ILIKE filter_area)
    AND (filter_pin_code IS NULL OR p.pin_code = filter_pin_code)
    AND (
      filter_lat IS NULL OR filter_lng IS NULL OR p.latitude IS NULL OR p.longitude IS NULL
      OR (
        6371 * acos(
          cos(radians(filter_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(filter_lng)) + 
          sin(radians(filter_lat)) * sin(radians(p.latitude))
        )
      ) <= radius_km
    )
  ORDER BY ac.created_at DESC;
END;
$$;