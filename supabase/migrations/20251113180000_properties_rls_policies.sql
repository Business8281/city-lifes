-- Ensure properties are visible to all users while respecting ownership for write operations

-- Enable Row Level Security on properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Read policies
-- Allow anyone (including anon) to view active and available properties
CREATE POLICY IF NOT EXISTS "Anyone can view active properties"
ON public.properties
FOR SELECT
USING (status = 'active' AND available = true);

-- Allow authenticated users to view their own properties regardless of status/availability
CREATE POLICY IF NOT EXISTS "Users can view their own properties"
ON public.properties
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Write policies
-- Only owners can insert/update/delete their properties
CREATE POLICY IF NOT EXISTS "Users can insert their own properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own properties"
ON public.properties
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Optional: clean up overly-permissive temporary delete policy if present
DROP POLICY IF EXISTS "Allow authenticated users to delete properties (testing)" ON public.properties;

-- Ensure search RPC is callable by both anon and authenticated
GRANT EXECUTE ON FUNCTION public.search_properties_by_location(
  search_city text,
  search_area text,
  search_pin_code text,
  search_latitude numeric,
  search_longitude numeric,
  radius_km numeric,
  property_type_filter text
) TO anon, authenticated;
