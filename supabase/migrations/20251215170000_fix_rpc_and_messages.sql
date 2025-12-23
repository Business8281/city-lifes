-- Add get_sponsored_properties RPC function to support ad campaign filtering
-- This fixes the 400 error where the function was missing
CREATE OR REPLACE FUNCTION get_sponsored_properties(
  filter_city text DEFAULT NULL,
  filter_area text DEFAULT NULL,
  filter_pin_code text DEFAULT NULL,
  filter_lat float DEFAULT NULL,
  filter_lng float DEFAULT NULL,
  radius_km float DEFAULT 10
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
  verified boolean,
  images text[],
  bedrooms numeric,
  bathrooms numeric,
  area_sqft numeric,
  city text,
  area text,
  pin_code text,
  latitude float,
  longitude float,
  user_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  views numeric,
  campaign_id uuid
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
    p.verified,
    p.images,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.city,
    p.area,
    p.pin_code,
    p.latitude,
    p.longitude,
    p.user_id,
    p.created_at,
    p.updated_at,
    p.views,
    ac.id as campaign_id
  FROM properties p
  JOIN ad_campaigns ac ON p.id = ac.property_id
  WHERE 
    ac.status = 'active'
    AND ac.start_date <= now()
    AND ac.end_date >= now()
    AND p.status = 'active'
    AND p.available = true
    AND (
      -- Filter by City
      (filter_city IS NULL OR p.city ILIKE '%' || filter_city || '%')
      AND
      -- Filter by Area
      (filter_area IS NULL OR p.area ILIKE '%' || filter_area || '%')
      AND
      -- Filter by Pin Code
      (filter_pin_code IS NULL OR p.pin_code = filter_pin_code)
      AND
      -- Filter by Location (Radius)
      (
        filter_lat IS NULL 
        OR filter_lng IS NULL 
        OR (
          p.latitude IS NOT NULL 
          AND p.longitude IS NOT NULL 
          AND (
            6371 * acos(
              cos(radians(filter_lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(filter_lng)) +
              sin(radians(filter_lat)) * sin(radians(p.latitude))
            )
          ) <= radius_km
        )
      )
    )
  ORDER BY ac.created_at DESC;
END;
$$;

-- Add explicit relationships between messages and public.profiles schema
-- This enables PostgREST to join messages -> profiles (e.g. sender:profiles!fk_messages_sender)
DO $$ 
BEGIN
  -- Add sender FK if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_messages_sender_profiles') THEN
    ALTER TABLE public.messages 
    ADD CONSTRAINT fk_messages_sender_profiles 
    FOREIGN KEY (sender_id) 
    REFERENCES public.profiles(id);
  END IF;

  -- Add receiver FK if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_messages_receiver_profiles') THEN
    ALTER TABLE public.messages 
    ADD CONSTRAINT fk_messages_receiver_profiles 
    FOREIGN KEY (receiver_id) 
    REFERENCES public.profiles(id);
  END IF;
END $$;
