-- Drop all versions of get_sponsored_properties to resolve overloading
DROP FUNCTION IF EXISTS get_sponsored_properties(text, text, text, double precision, double precision, double precision);
DROP FUNCTION IF EXISTS get_sponsored_properties(text, text, text, numeric, numeric, numeric);

-- Create single definitive version with numeric types (PostgreSQL standard)
CREATE OR REPLACE FUNCTION get_sponsored_properties(
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
  business_metadata jsonb,
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
  campaign_id uuid,
  distance_km numeric
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
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.images,
    p.amenities,
    p.business_metadata,
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
    p.created_by_name,
    p.created_by_email,
    ac.id as campaign_id,
    CASE 
      WHEN filter_lat IS NOT NULL AND filter_lng IS NOT NULL AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
      THEN (
        6371 * acos(
          cos(radians(filter_lat)) * 
          cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(filter_lng)) + 
          sin(radians(filter_lat)) * 
          sin(radians(p.latitude))
        )
      )::numeric
      ELSE NULL
    END as distance_km
  FROM properties p
  INNER JOIN ad_campaigns ac ON ac.property_id = p.id
  WHERE 
    ac.status = 'active'
    AND ac.start_date <= NOW()
    AND ac.end_date >= NOW()
    AND p.status = 'active'
    AND p.available = true
    AND (filter_city IS NULL OR p.city ILIKE '%' || filter_city || '%')
    AND (filter_area IS NULL OR p.area ILIKE '%' || filter_area || '%')
    AND (filter_pin_code IS NULL OR p.pin_code = filter_pin_code)
    AND (
      filter_lat IS NULL 
      OR filter_lng IS NULL 
      OR p.latitude IS NULL 
      OR p.longitude IS NULL
      OR (
        6371 * acos(
          cos(radians(filter_lat)) * 
          cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(filter_lng)) + 
          sin(radians(filter_lat)) * 
          sin(radians(p.latitude))
        )
      ) <= radius_km
    )
  ORDER BY ac.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql STABLE;