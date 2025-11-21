-- Add function to search properties by distance (Near Me functionality)
CREATE OR REPLACE FUNCTION search_properties_nearby(
  user_lat FLOAT,
  user_lng FLOAT,
  radius_km FLOAT DEFAULT 5,
  limit_count INT DEFAULT 50
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
  bedrooms INT,
  bathrooms INT,
  area_sqft INT,
  amenities TEXT[],
  verified BOOLEAN,
  available BOOLEAN,
  status TEXT,
  created_at TIMESTAMPTZ,
  user_id UUID,
  distance_km FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.description,
    p.property_type,
    p.price,
    p.price_type,
    p.city,
    p.area,
    p.pin_code,
    p.latitude,
    p.longitude,
    p.images,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.amenities,
    p.verified,
    p.available,
    p.status,
    p.created_at,
    p.user_id,
    -- Calculate distance using Haversine formula
    (
      6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(p.latitude::FLOAT)) * 
        cos(radians(p.longitude::FLOAT) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(p.latitude::FLOAT))
      )
    )::FLOAT AS distance_km
  FROM properties p
  WHERE 
    p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND p.status = 'active'
    AND p.available = true
    AND (
      6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(p.latitude::FLOAT)) * 
        cos(radians(p.longitude::FLOAT) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(p.latitude::FLOAT))
      )
    ) <= radius_km
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_properties_nearby TO authenticated, anon;

-- Add indexes for lat/lng queries
CREATE INDEX IF NOT EXISTS idx_properties_latitude ON properties(latitude) WHERE latitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_longitude ON properties(longitude) WHERE longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_location_active ON properties(latitude, longitude) WHERE status = 'active' AND available = true;

-- Add comment
COMMENT ON FUNCTION search_properties_nearby IS 'Search properties within specified radius using GPS coordinates. Returns distance in kilometers sorted nearest first.';