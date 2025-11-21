-- Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('tier1', 'tier2', 'tier3')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create areas table  
CREATE TABLE IF NOT EXISTS public.areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pincode_list TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(city_id, name)
);

-- Create pincodes table
CREATE TABLE IF NOT EXISTS public.pincodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
  pincode TEXT NOT NULL CHECK (length(pincode) = 6 AND pincode ~ '^[0-9]{6}$'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(pincode, area_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_areas_city_id ON public.areas(city_id);
CREATE INDEX IF NOT EXISTS idx_pincodes_city_id ON public.pincodes(city_id);
CREATE INDEX IF NOT EXISTS idx_pincodes_area_id ON public.pincodes(area_id);
CREATE INDEX IF NOT EXISTS idx_pincodes_pincode ON public.pincodes(pincode);
CREATE INDEX IF NOT EXISTS idx_cities_tier ON public.cities(tier);
CREATE INDEX IF NOT EXISTS idx_cities_name ON public.cities(name);
CREATE INDEX IF NOT EXISTS idx_areas_name ON public.areas(name);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pincodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Only admins can manage cities" ON public.cities FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view areas" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Only admins can manage areas" ON public.areas FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view pincodes" ON public.pincodes FOR SELECT USING (true);
CREATE POLICY "Only admins can manage pincodes" ON public.pincodes FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Populate Tier-1 Cities
INSERT INTO public.cities (name, state, tier) VALUES
('Mumbai', 'Maharashtra', 'tier1'),
('Delhi', 'Delhi', 'tier1'),
('Bangalore', 'Karnataka', 'tier1'),
('Hyderabad', 'Telangana', 'tier1'),
('Chennai', 'Tamil Nadu', 'tier1'),
('Kolkata', 'West Bengal', 'tier1'),
('Pune', 'Maharashtra', 'tier1'),
('Ahmedabad', 'Gujarat', 'tier1')
ON CONFLICT (name) DO NOTHING;

-- Populate Tier-2 Cities
INSERT INTO public.cities (name, state, tier) VALUES
('Jaipur', 'Rajasthan', 'tier2'),
('Lucknow', 'Uttar Pradesh', 'tier2'),
('Kanpur', 'Uttar Pradesh', 'tier2'),
('Nagpur', 'Maharashtra', 'tier2'),
('Indore', 'Madhya Pradesh', 'tier2'),
('Thane', 'Maharashtra', 'tier2'),
('Bhopal', 'Madhya Pradesh', 'tier2'),
('Visakhapatnam', 'Andhra Pradesh', 'tier2'),
('Patna', 'Bihar', 'tier2'),
('Vadodara', 'Gujarat', 'tier2'),
('Ghaziabad', 'Uttar Pradesh', 'tier2'),
('Ludhiana', 'Punjab', 'tier2'),
('Agra', 'Uttar Pradesh', 'tier2'),
('Nashik', 'Maharashtra', 'tier2'),
('Faridabad', 'Haryana', 'tier2'),
('Meerut', 'Uttar Pradesh', 'tier2'),
('Rajkot', 'Gujarat', 'tier2'),
('Varanasi', 'Uttar Pradesh', 'tier2'),
('Srinagar', 'Jammu and Kashmir', 'tier2'),
('Aurangabad', 'Maharashtra', 'tier2'),
('Dhanbad', 'Jharkhand', 'tier2'),
('Amritsar', 'Punjab', 'tier2'),
('Allahabad', 'Uttar Pradesh', 'tier2'),
('Ranchi', 'Jharkhand', 'tier2'),
('Howrah', 'West Bengal', 'tier2'),
('Coimbatore', 'Tamil Nadu', 'tier2'),
('Jabalpur', 'Madhya Pradesh', 'tier2'),
('Gwalior', 'Madhya Pradesh', 'tier2'),
('Vijayawada', 'Andhra Pradesh', 'tier2'),
('Jodhpur', 'Rajasthan', 'tier2'),
('Madurai', 'Tamil Nadu', 'tier2'),
('Raipur', 'Chhattisgarh', 'tier2'),
('Kota', 'Rajasthan', 'tier2')
ON CONFLICT (name) DO NOTHING;

-- Populate Areas for all Tier-1 cities
DO $$
DECLARE mumbai_id UUID; delhi_id UUID; bangalore_id UUID; hyderabad_id UUID; chennai_id UUID; kolkata_id UUID; pune_id UUID; ahmedabad_id UUID;
BEGIN
  SELECT id INTO mumbai_id FROM cities WHERE name = 'Mumbai';
  SELECT id INTO delhi_id FROM cities WHERE name = 'Delhi';
  SELECT id INTO bangalore_id FROM cities WHERE name = 'Bangalore';
  SELECT id INTO hyderabad_id FROM cities WHERE name = 'Hyderabad';
  SELECT id INTO chennai_id FROM cities WHERE name = 'Chennai';
  SELECT id INTO kolkata_id FROM cities WHERE name = 'Kolkata';
  SELECT id INTO pune_id FROM cities WHERE name = 'Pune';
  SELECT id INTO ahmedabad_id FROM cities WHERE name = 'Ahmedabad';
  
  -- Mumbai areas
  INSERT INTO areas (city_id, name, pincode_list) VALUES
  (mumbai_id, 'Andheri', ARRAY['400053','400058','400059','400069']),
  (mumbai_id, 'Bandra', ARRAY['400050','400051']),
  (mumbai_id, 'Borivali', ARRAY['400066','400091','400092']),
  (mumbai_id, 'Dadar', ARRAY['400014','400028']),
  (mumbai_id, 'Ghatkopar', ARRAY['400077','400086']),
  (mumbai_id, 'Juhu', ARRAY['400049']),
  (mumbai_id, 'Kurla', ARRAY['400070','400024']),
  (mumbai_id, 'Malad', ARRAY['400064','400097']),
  (mumbai_id, 'Powai', ARRAY['400076']),
  (mumbai_id, 'Worli', ARRAY['400018','400025'])
  ON CONFLICT (city_id, name) DO NOTHING;
  
  -- Delhi areas
  INSERT INTO areas (city_id, name, pincode_list) VALUES
  (delhi_id, 'Connaught Place', ARRAY['110001']),
  (delhi_id, 'Dwarka', ARRAY['110075','110077','110078']),
  (delhi_id, 'Karol Bagh', ARRAY['110005']),
  (delhi_id, 'Lajpat Nagar', ARRAY['110024']),
  (delhi_id, 'Nehru Place', ARRAY['110019']),
  (delhi_id, 'Rohini', ARRAY['110085','110086']),
  (delhi_id, 'Saket', ARRAY['110017']),
  (delhi_id, 'Vasant Kunj', ARRAY['110070'])
  ON CONFLICT (city_id, name) DO NOTHING;
  
  -- Bangalore areas
  INSERT INTO areas (city_id, name, pincode_list) VALUES
  (bangalore_id, 'Koramangala', ARRAY['560034','560095']),
  (bangalore_id, 'Whitefield', ARRAY['560066','560067']),
  (bangalore_id, 'Indiranagar', ARRAY['560038']),
  (bangalore_id, 'HSR Layout', ARRAY['560102']),
  (bangalore_id, 'Jayanagar', ARRAY['560041','560069']),
  (bangalore_id, 'Malleswaram', ARRAY['560003']),
  (bangalore_id, 'Marathahalli', ARRAY['560037']),
  (bangalore_id, 'Yelahanka', ARRAY['560064'])
  ON CONFLICT (city_id, name) DO NOTHING;
  
  -- Hyderabad areas
  INSERT INTO areas (city_id, name, pincode_list) VALUES
  (hyderabad_id, 'Banjara Hills', ARRAY['500034']),
  (hyderabad_id, 'Gachibowli', ARRAY['500032']),
  (hyderabad_id, 'Hitech City', ARRAY['500081']),
  (hyderabad_id, 'Jubilee Hills', ARRAY['500033','500096']),
  (hyderabad_id, 'Kondapur', ARRAY['500084']),
  (hyderabad_id, 'Madhapur', ARRAY['500081']),
  (hyderabad_id, 'Secunderabad', ARRAY['500003','500015'])
  ON CONFLICT (city_id, name) DO NOTHING;
  
  -- Chennai areas
  INSERT INTO areas (city_id, name, pincode_list) VALUES
  (chennai_id, 'Adyar', ARRAY['600020']),
  (chennai_id, 'Anna Nagar', ARRAY['600040','600102']),
  (chennai_id, 'T Nagar', ARRAY['600017']),
  (chennai_id, 'Velachery', ARRAY['600042']),
  (chennai_id, 'Besant Nagar', ARRAY['600090']),
  (chennai_id, 'Mylapore', ARRAY['600004']),
  (chennai_id, 'Nungambakkam', ARRAY['600034'])
  ON CONFLICT (city_id, name) DO NOTHING;
  
  -- Kolkata areas
  INSERT INTO areas (city_id, name, pincode_list) VALUES
  (kolkata_id, 'Park Street', ARRAY['700016','700017']),
  (kolkata_id, 'Salt Lake', ARRAY['700064','700091']),
  (kolkata_id, 'Ballygunge', ARRAY['700019']),
  (kolkata_id, 'Howrah', ARRAY['711101','711102']),
  (kolkata_id, 'New Town', ARRAY['700156']),
  (kolkata_id, 'Rajarhat', ARRAY['700135','700136'])
  ON CONFLICT (city_id, name) DO NOTHING;
  
  -- Pune areas
  INSERT INTO areas (city_id, name, pincode_list) VALUES
  (pune_id, 'Hinjewadi', ARRAY['411057']),
  (pune_id, 'Kothrud', ARRAY['411038']),
  (pune_id, 'Viman Nagar', ARRAY['411014']),
  (pune_id, 'Wakad', ARRAY['411057']),
  (pune_id, 'Baner', ARRAY['411045']),
  (pune_id, 'Aundh', ARRAY['411007']),
  (pune_id, 'Magarpatta', ARRAY['411028'])
  ON CONFLICT (city_id, name) DO NOTHING;
  
  -- Ahmedabad areas
  INSERT INTO areas (city_id, name, pincode_list) VALUES
  (ahmedabad_id, 'Satellite', ARRAY['380015']),
  (ahmedabad_id, 'Vastrapur', ARRAY['380015']),
  (ahmedabad_id, 'Maninagar', ARRAY['380008']),
  (ahmedabad_id, 'Prahlad Nagar', ARRAY['380015']),
  (ahmedabad_id, 'Bodakdev', ARRAY['380054'])
  ON CONFLICT (city_id, name) DO NOTHING;
END $$;

-- Populate pincodes from areas
INSERT INTO pincodes (city_id, area_id, pincode)
SELECT a.city_id, a.id, unnest(a.pincode_list)
FROM areas a
ON CONFLICT (pincode, area_id) DO NOTHING;