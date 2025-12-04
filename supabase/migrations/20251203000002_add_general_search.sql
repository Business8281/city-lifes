-- Function to search properties with various filters
CREATE OR REPLACE FUNCTION public.search_properties(
  query_text text DEFAULT NULL,
  category_filter text DEFAULT NULL,
  city_filter text DEFAULT NULL,
  area_filter text DEFAULT NULL,
  pincode_filter text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  user_lat numeric DEFAULT NULL,
  user_lng numeric DEFAULT NULL,
  radius_km numeric DEFAULT NULL,
  page_number integer DEFAULT 1,
  page_size integer DEFAULT 20
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
DECLARE
  offset_val integer;
BEGIN
  offset_val := (page_number - 1) * page_size;

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
    -- Simple relevance score (placeholder)
    0.0 as relevance_score,
    COUNT(*) OVER() as total_count
  FROM properties p
  WHERE
    p.status = 'active'
    AND p.available = true
    AND (
      query_text IS NULL OR 
      p.title ILIKE '%' || query_text || '%' OR
      p.description ILIKE '%' || query_text || '%' OR
      p.city ILIKE '%' || query_text || '%' OR
      p.area ILIKE '%' || query_text || '%'
    )
    AND (category_filter IS NULL OR p.property_type = category_filter)
    AND (city_filter IS NULL OR p.city ILIKE city_filter)
    AND (area_filter IS NULL OR p.area ILIKE area_filter)
    AND (pincode_filter IS NULL OR p.pin_code = pincode_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (
      radius_km IS NULL OR user_lat IS NULL OR user_lng IS NULL OR
      (point(p.longitude, p.latitude) <@> point(user_lng, user_lat)) * 1.60934 <= radius_km
    )
  ORDER BY 
    CASE WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
      (point(p.longitude, p.latitude) <@> point(user_lng, user_lat))
    ELSE NULL END ASC,
    p.created_at DESC
  LIMIT page_size
  OFFSET offset_val;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.search_properties(
  text, text, text, text, text, numeric, numeric, numeric, numeric, numeric, integer, integer
) TO anon, authenticated;
