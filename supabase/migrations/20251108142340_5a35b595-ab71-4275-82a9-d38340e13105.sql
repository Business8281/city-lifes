-- Create ad_campaigns table for business advertising
CREATE TABLE public.ad_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  budget NUMERIC NOT NULL DEFAULT 0,
  spent NUMERIC NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for performance
CREATE INDEX idx_ad_campaigns_property_id ON public.ad_campaigns(property_id);
CREATE INDEX idx_ad_campaigns_user_id ON public.ad_campaigns(user_id);
CREATE INDEX idx_ad_campaigns_status ON public.ad_campaigns(status);

-- Enable RLS
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

-- Users can view all active campaigns
CREATE POLICY "Anyone can view active campaigns"
ON public.ad_campaigns
FOR SELECT
USING (status = 'active' AND end_date > now());

-- Users can manage their own campaigns
CREATE POLICY "Users can insert own campaigns"
ON public.ad_campaigns
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
ON public.ad_campaigns
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
ON public.ad_campaigns
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can manage all campaigns
CREATE POLICY "Admins can manage all campaigns"
ON public.ad_campaigns
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_ad_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger
CREATE TRIGGER update_ad_campaigns_updated_at
BEFORE UPDATE ON public.ad_campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_ad_campaigns_updated_at();

-- Function to get sponsored properties based on location filters
CREATE OR REPLACE FUNCTION public.get_sponsored_properties(
  filter_city TEXT DEFAULT NULL,
  filter_area TEXT DEFAULT NULL,
  filter_pin_code TEXT DEFAULT NULL,
  filter_lat NUMERIC DEFAULT NULL,
  filter_lng NUMERIC DEFAULT NULL,
  radius_km NUMERIC DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  property_type TEXT,
  price NUMERIC,
  price_type TEXT,
  city TEXT,
  area TEXT,
  pin_code TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  images TEXT[],
  amenities TEXT[],
  status TEXT,
  verified BOOLEAN,
  available BOOLEAN,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  is_agent BOOLEAN,
  views INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  campaign_id UUID,
  distance_km NUMERIC
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
    ac.id as campaign_id,
    CASE 
      WHEN filter_lat IS NOT NULL AND filter_lng IS NOT NULL AND p.location IS NOT NULL
      THEN ST_Distance(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(filter_lng, filter_lat), 4326)::geography
      ) / 1000.0
      ELSE NULL
    END as distance_km
  FROM public.properties p
  INNER JOIN public.ad_campaigns ac ON p.id = ac.property_id
  WHERE 
    ac.status = 'active'
    AND ac.end_date > now()
    AND p.status = 'active'
    AND p.available = true
    AND (
      -- No filter applied, show all
      (filter_city IS NULL AND filter_area IS NULL AND filter_pin_code IS NULL AND filter_lat IS NULL)
      OR
      -- City filter
      (filter_city IS NOT NULL AND p.city ILIKE '%' || filter_city || '%')
      OR
      -- Area filter
      (filter_area IS NOT NULL AND p.area ILIKE '%' || filter_area || '%')
      OR
      -- PIN code filter
      (filter_pin_code IS NOT NULL AND p.pin_code = filter_pin_code)
      OR
      -- Location filter with radius
      (
        filter_lat IS NOT NULL 
        AND filter_lng IS NOT NULL 
        AND p.location IS NOT NULL
        AND ST_DWithin(
          p.location::geography,
          ST_SetSRID(ST_MakePoint(filter_lng, filter_lat), 4326)::geography,
          radius_km * 1000
        )
      )
    )
  ORDER BY ac.impressions DESC, ac.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_sponsored_properties TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_sponsored_properties TO anon;