-- Add search_suggestions table for autocomplete
CREATE TABLE IF NOT EXISTS search_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('city', 'area', 'pincode', 'category', 'place')),
  city_id UUID REFERENCES cities(id),
  area_id UUID REFERENCES areas(id),
  pincode TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  search_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for fast search performance on properties
CREATE INDEX IF NOT EXISTS idx_properties_lat_lng ON properties(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_city_area ON properties(city, area);
CREATE INDEX IF NOT EXISTS idx_properties_pincode ON properties(pin_code);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status, available) WHERE status = 'active' AND available = true;

-- Full-text search index on properties
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties USING gin(
  to_tsvector('simple', 
    coalesce(title, '') || ' ' || 
    coalesce(description, '') || ' ' || 
    coalesce(city, '') || ' ' || 
    coalesce(area, '')
  )
);

-- Trigram indexes for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_cities_name_trgm ON cities USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_areas_name_trgm ON areas USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_title_trgm ON properties USING gin(title gin_trgm_ops);

-- Index for search suggestions
CREATE INDEX IF NOT EXISTS idx_search_suggestions_type ON search_suggestions(type);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_label_trgm ON search_suggestions USING gin(label gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_count ON search_suggestions(search_count DESC);

-- RLS for search_suggestions (public read, admin write)
ALTER TABLE search_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view search suggestions" ON search_suggestions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage search suggestions" ON search_suggestions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Function for autocomplete search
CREATE OR REPLACE FUNCTION autocomplete_search(
  query_text TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  label TEXT,
  type TEXT,
  city_id UUID,
  area_id UUID,
  pincode TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  WITH city_matches AS (
    SELECT 
      c.name as label,
      'city'::text as type,
      c.id as city_id,
      NULL::uuid as area_id,
      NULL::text as pincode,
      NULL::numeric as latitude,
      NULL::numeric as longitude,
      similarity(c.name, query_text) * 2.0 as relevance
    FROM cities c
    WHERE c.name ILIKE query_text || '%'
       OR c.name % query_text
    ORDER BY similarity(c.name, query_text) DESC
    LIMIT 3
  ),
  area_matches AS (
    SELECT 
      a.name || ', ' || c.name as label,
      'area'::text as type,
      c.id as city_id,
      a.id as area_id,
      NULL::text as pincode,
      NULL::numeric as latitude,
      NULL::numeric as longitude,
      similarity(a.name, query_text) * 1.5 as relevance
    FROM areas a
    JOIN cities c ON a.city_id = c.id
    WHERE a.name ILIKE query_text || '%'
       OR a.name % query_text
    ORDER BY similarity(a.name, query_text) DESC
    LIMIT 4
  ),
  pincode_matches AS (
    SELECT 
      'PIN ' || p.pincode || ' - ' || a.name || ', ' || c.name as label,
      'pincode'::text as type,
      c.id as city_id,
      a.id as area_id,
      p.pincode as pincode,
      NULL::numeric as latitude,
      NULL::numeric as longitude,
      1.0 as relevance
    FROM pincodes p
    JOIN areas a ON p.area_id = a.id
    JOIN cities c ON p.city_id = c.id
    WHERE p.pincode LIKE query_text || '%'
    LIMIT 3
  ),
  suggestion_matches AS (
    SELECT 
      s.label,
      s.type,
      s.city_id,
      s.area_id,
      s.pincode,
      s.latitude,
      s.longitude,
      similarity(s.label, query_text) as relevance
    FROM search_suggestions s
    WHERE s.label ILIKE query_text || '%'
       OR s.label % query_text
    ORDER BY s.search_count DESC, similarity(s.label, query_text) DESC
    LIMIT 2
  )
  SELECT * FROM (
    SELECT * FROM city_matches
    UNION ALL
    SELECT * FROM area_matches
    UNION ALL
    SELECT * FROM pincode_matches
    UNION ALL
    SELECT * FROM suggestion_matches
  ) combined
  ORDER BY relevance DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function for map clustering
CREATE OR REPLACE FUNCTION get_map_clusters(
  min_lat NUMERIC,
  min_lng NUMERIC,
  max_lat NUMERIC,
  max_lng NUMERIC,
  zoom_level INTEGER DEFAULT 12,
  category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  cluster_lat NUMERIC,
  cluster_lng NUMERIC,
  property_count BIGINT,
  avg_price NUMERIC,
  property_ids TEXT[]
) AS $$
DECLARE
  precision INTEGER;
BEGIN
  precision := CASE 
    WHEN zoom_level <= 8 THEN 1
    WHEN zoom_level <= 11 THEN 2
    WHEN zoom_level <= 14 THEN 3
    ELSE 4
  END;

  RETURN QUERY
  SELECT 
    ROUND(AVG(p.latitude), precision) as cluster_lat,
    ROUND(AVG(p.longitude), precision) as cluster_lng,
    COUNT(*)::BIGINT as property_count,
    ROUND(AVG(p.price), 0) as avg_price,
    ARRAY_AGG(p.id::TEXT) as property_ids
  FROM properties p
  WHERE p.status = 'active'
    AND p.available = true
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND p.latitude BETWEEN min_lat AND max_lat
    AND p.longitude BETWEEN min_lng AND max_lng
    AND (category_filter IS NULL OR p.property_type = category_filter)
  GROUP BY ROUND(p.latitude, precision), ROUND(p.longitude, precision)
  HAVING COUNT(*) > 0;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function for advanced search with scoring
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
  distance_km NUMERIC,
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
    fp.dist_km as distance_km,
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