-- Enable PostGIS if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA public;

-- Optimize search_properties_by_location to use PostGIS
CREATE OR REPLACE FUNCTION public.search_properties_by_location(
  search_city text DEFAULT NULL::text,
  search_area text DEFAULT NULL::text,
  search_pin_code text DEFAULT NULL::text,
  search_latitude numeric DEFAULT NULL::numeric,
  search_longitude numeric DEFAULT NULL::numeric,
  property_type_filter text DEFAULT NULL::text,
  radius_km numeric DEFAULT 10
)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  property_type text,
  price numeric,
  city text,
  area text,
  pin_code text,
  images text[],
  amenities text[],
  latitude numeric,
  longitude numeric,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  verified boolean,
  available boolean,
  created_at timestamp with time zone,
  distance_km numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.property_type,
    p.price,
    p.city,
    p.area,
    p.pin_code,
    p.images,
    p.amenities,
    p.latitude,
    p.longitude,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.verified,
    p.available,
    p.created_at,
    CASE 
      WHEN search_latitude IS NOT NULL AND search_longitude IS NOT NULL AND p.location IS NOT NULL
      THEN ROUND((ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint(search_longitude, search_latitude), 4326)::geography
      ) / 1000)::numeric, 2)
      ELSE NULL
    END AS distance_km
  FROM properties p
  WHERE 
    p.status = 'active' 
    AND p.available = true
    AND (search_city IS NULL OR p.city ILIKE '%' || search_city || '%')
    AND (search_area IS NULL OR p.area ILIKE '%' || search_area || '%')
    AND (search_pin_code IS NULL OR p.pin_code = search_pin_code)
    AND (property_type_filter IS NULL OR p.property_type = property_type_filter)
    AND (
      search_latitude IS NULL 
      OR search_longitude IS NULL 
      OR p.location IS NULL
      OR ST_DWithin(
        p.location,
        ST_SetSRID(ST_MakePoint(search_longitude, search_latitude), 4326)::geography,
        radius_km * 1000
      )
    )
  ORDER BY 
    CASE 
      WHEN search_latitude IS NOT NULL AND search_longitude IS NOT NULL AND p.location IS NOT NULL
      THEN ST_Distance(
        p.location,
        ST_SetSRID(ST_MakePoint(search_longitude, search_latitude), 4326)::geography
      )
      ELSE 0
    END,
    p.created_at DESC;
END;
$function$;
