-- Recreate get_sponsored_properties to show only Business category ads and ensure it works for all users
-- Drop existing function with prior signature (area, city, lat, lng, pin, radius)
DROP FUNCTION IF EXISTS public.get_sponsored_properties(TEXT, TEXT, NUMERIC, NUMERIC, TEXT, NUMERIC);

CREATE OR REPLACE FUNCTION public.get_sponsored_properties(
  filter_area TEXT DEFAULT NULL,
  filter_city TEXT DEFAULT NULL,
  filter_lat NUMERIC DEFAULT NULL,
  filter_lng NUMERIC DEFAULT NULL,
  filter_pin_code TEXT DEFAULT NULL,
  radius_km NUMERIC DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  property_type TEXT,
  price NUMERIC,
  price_type TEXT,
  city TEXT,
  area TEXT,
  pin_code TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  location GEOGRAPHY,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  images TEXT[],
  amenities TEXT[],
  status TEXT,
  verified BOOLEAN,
  available BOOLEAN,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  is_agent BOOLEAN,
  views INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  campaign_id UUID,
  distance_km NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.title,
    p.description,
    p.property_type,
    p.price,
    p.price_type,
    p.city,
    p.area,
    p.pin_code,
    p.address,
    p.latitude,
    p.longitude,
    p.location,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.images,
    p.amenities,
    p.status,
    p.verified,
    p.available,
    p.contact_name,
    p.contact_phone,
    p.contact_email,
    p.is_agent,
    p.views,
    p.created_at,
    p.updated_at,
    ac.id as campaign_id,
    (CASE 
      WHEN filter_lat IS NOT NULL AND filter_lng IS NOT NULL AND p.location IS NOT NULL
      THEN ST_Distance(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(filter_lng, filter_lat), 4326)::geography
      ) / 1000.0
      ELSE NULL
    END)::NUMERIC as distance_km
  FROM public.properties p
  INNER JOIN public.ad_campaigns ac ON p.id = ac.property_id
  WHERE 
    -- Only show ads for Business category properties
    p.property_type = 'business'
    AND ac.status = 'active'
    AND ac.end_date > now()
    AND ac.budget > ac.spent
    AND p.status = 'active'
    AND COALESCE(p.available, true) = true
    AND (
      -- No filter applied, show all active campaigns
      (filter_city IS NULL AND filter_area IS NULL AND filter_pin_code IS NULL AND filter_lat IS NULL)
      OR
      -- City filter
      (filter_city IS NOT NULL AND p.city ILIKE '%' || filter_city || '%')
      OR
      -- Area filter
      (filter_area IS NOT NULL AND p.area ILIKE '%' || filter_area || '%')
      OR
      -- PIN code filter
      (filter_pin_code IS NOT NULL AND p.pin_code = filter_pin_code)
      OR
      -- Location filter with radius
      (
        filter_lat IS NOT NULL 
        AND filter_lng IS NOT NULL 
        AND p.location IS NOT NULL
        AND ST_DWithin(
          p.location::geography,
          ST_SetSRID(ST_MakePoint(filter_lng, filter_lat), 4326)::geography,
          radius_km * 1000
        )
      )
    )
  ORDER BY 
    -- Prioritize campaigns with higher remaining budget and lower impressions
    (ac.budget - ac.spent) DESC,
    ac.impressions ASC,
    ac.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure everyone can execute the function
GRANT EXECUTE ON FUNCTION public.get_sponsored_properties(TEXT, TEXT, NUMERIC, NUMERIC, TEXT, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_sponsored_properties(TEXT, TEXT, NUMERIC, NUMERIC, TEXT, NUMERIC) TO anon;
