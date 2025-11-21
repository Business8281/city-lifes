-- Fix search_properties function return type mismatch
DROP FUNCTION IF EXISTS search_properties(TEXT, TEXT, TEXT, TEXT, TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION search_properties(
  query_text TEXT DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL,
  area_filter TEXT DEFAULT NULL,
  pincode_filter TEXT DEFAULT NULL,
  min_price NUMERIC DEFAULT NULL,
  max_price NUMERIC DEFAULT NULL,
  user_lat NUMERIC DEFAULT NULL,
  user_lng NUMERIC DEFAULT NULL,
  radius_km NUMERIC DEFAULT NULL,
  min_lat NUMERIC DEFAULT NULL,
  min_lng NUMERIC DEFAULT NULL,
  max_lat NUMERIC DEFAULT NULL,
  max_lng NUMERIC DEFAULT NULL,
  page_number INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  property_type TEXT,
  price NUMERIC,
  price_type TEXT,
  city TEXT,
  area TEXT,
  pin_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  images TEXT[],
  verified BOOLEAN,
  available BOOLEAN,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  distance_km DOUBLE PRECISION,  -- Changed from NUMERIC to DOUBLE PRECISION
  relevance_score REAL,
  total_count BIGINT
) AS $$
DECLARE
  offset_val INTEGER;
BEGIN
  offset_val := (page_number - 1) * page_size;

  RETURN QUERY
  WITH filtered_properties AS (
    SELECT 
      p.*,
      CASE 
        WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
          6371 * acos(
            cos(radians(user_lat)) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(user_lng)) +
            sin(radians(user_lat)) * sin(radians(p.latitude))
          )
        ELSE NULL
      END as dist_km,
      CASE
        WHEN query_text IS NOT NULL THEN
          ts_rank(
            to_tsvector('simple', coalesce(p.title, '') || ' ' || coalesce(p.description, '')),
            plainto_tsquery('simple', query_text)
          ) * 0.6 +
          similarity(p.title, query_text) * 0.4
        ELSE 0.0
      END as text_score
    FROM properties p
    WHERE p.status = 'active'
      AND p.available = true
      AND (category_filter IS NULL OR p.property_type = category_filter)
      AND (city_filter IS NULL OR p.city ILIKE '%' || city_filter || '%')
      AND (area_filter IS NULL OR p.area ILIKE '%' || area_filter || '%')
      AND (pincode_filter IS NULL OR p.pin_code = pincode_filter)
      AND (min_price IS NULL OR p.price >= min_price)
      AND (max_price IS NULL OR p.price <= max_price)
      AND (
        (user_lat IS NULL OR user_lng IS NULL OR radius_km IS NULL) OR
        (p.latitude IS NOT NULL AND p.longitude IS NOT NULL AND
          6371 * acos(
            cos(radians(user_lat)) * cos(radians(p.latitude)) *
            cos(radians(p.longitude) - radians(user_lng)) +
            sin(radians(user_lat)) * sin(radians(p.latitude))
          ) <= radius_km)
      )
      AND (
        (min_lat IS NULL OR min_lng IS NULL OR max_lat IS NULL OR max_lng IS NULL) OR
        (p.latitude BETWEEN min_lat AND max_lat AND p.longitude BETWEEN min_lng AND max_lng)
      )
  ),
  counted AS (
    SELECT COUNT(*) as cnt FROM filtered_properties
  )
  SELECT 
    fp.id,
    fp.title,
    fp.description,
    fp.property_type,
    fp.price,
    fp.price_type,
    fp.city,
    fp.area,
    fp.pin_code,
    fp.latitude,
    fp.longitude,
    fp.images,
    fp.verified,
    fp.available,
    fp.bedrooms,
    fp.bathrooms,
    fp.area_sqft,
    fp.dist_km::DOUBLE PRECISION as distance_km,  -- Explicit cast to DOUBLE PRECISION
    (COALESCE(fp.text_score, 0.0) * 0.7 + 
     CASE WHEN fp.dist_km IS NOT NULL THEN (1.0 / (1.0 + fp.dist_km / 10.0)) * 0.3 ELSE 0.0 END)::REAL as relevance_score,
    (SELECT cnt FROM counted) as total_count
  FROM filtered_properties fp
  ORDER BY 
    CASE WHEN query_text IS NOT NULL THEN relevance_score ELSE 0 END DESC,
    CASE WHEN user_lat IS NOT NULL THEN fp.dist_km ELSE 999999 END ASC,
    fp.created_at DESC
  LIMIT page_size
  OFFSET offset_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant permissions
GRANT EXECUTE ON FUNCTION search_properties TO authenticated, anon;