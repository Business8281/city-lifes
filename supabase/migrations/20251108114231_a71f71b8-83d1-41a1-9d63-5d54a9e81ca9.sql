-- Fix search_properties_by_location function to include SET search_path
CREATE OR REPLACE FUNCTION public.search_properties_by_location(
  search_city text DEFAULT NULL::text, 
  search_area text DEFAULT NULL::text, 
  search_pin_code text DEFAULT NULL::text, 
  search_latitude numeric DEFAULT NULL::numeric, 
  search_longitude numeric DEFAULT NULL::numeric, 
  radius_km numeric DEFAULT 10, 
  property_type_filter text DEFAULT NULL::text
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
  latitude numeric, 
  longitude numeric, 
  bedrooms integer, 
  bathrooms integer, 
  area_sqft integer, 
  images text[], 
  amenities text[], 
  verified boolean, 
  available boolean, 
  distance_km numeric, 
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    p.latitude,
    p.longitude,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.images,
    p.amenities,
    p.verified,
    p.available,
    CASE 
      WHEN search_latitude IS NOT NULL AND search_longitude IS NOT NULL AND p.location IS NOT NULL
      THEN ROUND((ST_Distance(
        p.location,
        ST_MakePoint(search_longitude, search_latitude)::geography
      ) / 1000)::numeric, 2)
      ELSE NULL
    END AS distance_km,
    p.created_at
  FROM public.properties p
  WHERE 
    p.status = 'active' 
    AND p.available = true
    AND (search_city IS NULL OR LOWER(p.city) = LOWER(search_city))
    AND (search_area IS NULL OR LOWER(p.area) = LOWER(search_area))
    AND (search_pin_code IS NULL OR p.pin_code = search_pin_code)
    AND (property_type_filter IS NULL OR p.property_type = property_type_filter)
    AND (
      search_latitude IS NULL 
      OR search_longitude IS NULL 
      OR p.location IS NULL
      OR ST_DWithin(
        p.location,
        ST_MakePoint(search_longitude, search_latitude)::geography,
        radius_km * 1000
      )
    )
  ORDER BY 
    CASE 
      WHEN search_latitude IS NOT NULL AND search_longitude IS NOT NULL AND p.location IS NOT NULL
      THEN ST_Distance(
        p.location,
        ST_MakePoint(search_longitude, search_latitude)::geography
      )
      ELSE 0
    END,
    p.created_at DESC;
END;
$function$;