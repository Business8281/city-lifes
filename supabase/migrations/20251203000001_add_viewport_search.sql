-- Function to search properties within a bounding box (viewport) with distance calculation
CREATE OR REPLACE FUNCTION public.search_properties_in_view(
  min_lat numeric,
  min_lng numeric,
  max_lat numeric,
  max_lng numeric,
  property_type_filter text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  min_bedrooms integer DEFAULT NULL,
  min_bathrooms integer DEFAULT NULL,
  user_lat numeric DEFAULT NULL,
  user_lng numeric DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  price numeric,
  price_type text,
  property_type text,
  status text,
  available boolean,
  images text[],
  bedrooms integer,
  bathrooms integer,
  area_sqft numeric,
  address text,
  city text,
  area text,
  pin_code text,
  latitude numeric,
  longitude numeric,
  amenities text[],
  user_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  views integer,
  verified boolean,
  featured boolean,
  distance_km numeric,
  relevance_score numeric,
  total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.price_type,
    p.property_type,
    p.status,
    p.available,
    p.images,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.address,
    p.city,
    p.area,
    p.pin_code,
    p.latitude,
    p.longitude,
    p.amenities,
    p.user_id,
    p.created_at,
    p.updated_at,
    p.views,
    p.verified,
    p.featured,
    -- Calculate distance if user location is provided
    CASE 
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
        (point(p.longitude, p.latitude) <@> point(user_lng, user_lat)) * 1.60934
      ELSE NULL
    END as distance_km,
    0.0 as relevance_score,
    COUNT(*) OVER() as total_count
  FROM properties p
  WHERE
    p.status = 'active'
    AND p.available = true
    AND p.latitude BETWEEN min_lat AND max_lat
    AND p.longitude BETWEEN min_lng AND max_lng
    AND (property_type_filter IS NULL OR p.property_type = property_type_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (min_bedrooms IS NULL OR p.bedrooms >= min_bedrooms)
    AND (min_bathrooms IS NULL OR p.bathrooms >= min_bathrooms)
  ORDER BY p.created_at DESC
  LIMIT 100;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.search_properties_in_view(
  numeric, numeric, numeric, numeric, text, numeric, numeric, integer, integer, numeric, numeric
) TO anon, authenticated;
