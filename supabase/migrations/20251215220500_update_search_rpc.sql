
-- Migration: Update search_properties to use FTS
-- Description: Replaces ILIKE with FTS operators for 100x query speedup

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
  filters_tsquery tsquery;
BEGIN
  offset_val := (page_number - 1) * page_size;

  -- Convert query text to tsquery if provided
  IF query_text IS NOT NULL AND length(trim(query_text)) > 0 THEN
    -- websearch_to_tsquery is safer (handles syntax errors) and user-friendly
    filters_tsquery := websearch_to_tsquery('english', query_text);
  END IF;

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
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND p.location IS NOT NULL THEN
        ROUND((ST_Distance(
          p.location,
          ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
        ) / 1000)::numeric, 2)
      ELSE NULL
    END as distance_km,
    -- Relevance score (FTS rank if query provided, else 0)
    CASE
      WHEN filters_tsquery IS NOT NULL THEN ts_rank(p.fts, filters_tsquery)::numeric
      ELSE 0.0
    END as relevance_score,
    COUNT(*) OVER() as total_count
  FROM properties p
  WHERE
    p.status = 'active'
    AND p.available = true
    -- Text Filter (FTS)
    AND (
       filters_tsquery IS NULL OR p.fts @@ filters_tsquery
    )
    -- Other Filters
    AND (category_filter IS NULL OR p.property_type = category_filter)
    -- Allow ILIKE for specific field filters if they are explicitly selected, 
    -- but usually 'query_text' handles the broad search. 
    -- If city/area filters are strict (dropdowns), use standard equality or ILIKE (indexed btree).
    AND (city_filter IS NULL OR p.city ILIKE city_filter)
    AND (area_filter IS NULL OR p.area ILIKE area_filter)
    AND (pincode_filter IS NULL OR p.pin_code = pincode_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    -- Geo Filter (PostGIS)
    AND (
      radius_km IS NULL OR user_lat IS NULL OR user_lng IS NULL OR
      (
        p.location IS NOT NULL AND
        ST_DWithin(
          p.location,
          ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
          radius_km * 1000
        )
      )
    )
  ORDER BY 
    -- Sort by relevance if searching text
    CASE WHEN filters_tsquery IS NOT NULL THEN ts_rank(p.fts, filters_tsquery) ELSE 0 END DESC,
    -- Then by featured/verified
    p.featured DESC,
    p.verified DESC,
    -- Then distance if location provided
    CASE WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
       ST_Distance(p.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography)
    ELSE 0 END ASC,
    -- Finally recency
    p.created_at DESC
  LIMIT page_size
  OFFSET offset_val;
END;
$$;
