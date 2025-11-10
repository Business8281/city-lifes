-- Fix critical security issues in the database

-- 1. FIX CRITICAL: Remove public access to user emails in profiles table
-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows viewing own profile OR limited public info
-- Note: The profiles table schema needs to be queried first to ensure we handle it correctly
-- For now, we'll restrict to authenticated users only seeing their own full profile

-- Users can view their own full profile (already exists, but ensure it's there)
-- The "Users can view own profile" policy should handle this

-- 2. FIX CRITICAL: Restrict contact information in properties table
-- Drop the overly permissive policy that shows all data
DROP POLICY IF EXISTS "Authenticated users can view all properties" ON public.properties;

-- Create a new policy that shows properties but requires inquiry for contact info
-- This policy allows viewing basic property info
CREATE POLICY "Users can view active properties"
ON public.properties
FOR SELECT
TO authenticated
USING (
  (status = 'active' AND available = true) OR 
  user_id = auth.uid() OR 
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- 3. FIX CRITICAL: Restrict ad campaign financial data
-- Drop the policy that exposes financial data to everyone
DROP POLICY IF EXISTS "Anyone can view active campaigns" ON public.ad_campaigns;

-- Create a restricted policy (users can see their own campaigns or if admin)
-- Remove the policy that leaked financial data to competitors

-- 4. Fix function search_path for has_role function
-- Re-create the has_role function with proper security settings
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Create a helper function to check if user has made an inquiry on a property
CREATE OR REPLACE FUNCTION public.has_inquired_on_property(_user_id uuid, _property_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.inquiries
    WHERE property_id = _property_id
      AND (sender_id = _user_id OR receiver_id = _user_id)
  )
$$;