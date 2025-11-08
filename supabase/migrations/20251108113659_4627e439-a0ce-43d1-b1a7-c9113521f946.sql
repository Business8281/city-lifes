-- Fix profiles RLS policy that exposes all user data
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;

-- Keep only the policy for users to view their own profiles
-- (The "Users can view own profile" policy already exists)

-- Note: Property owner contact info will be shown via properties.contact_* fields
-- This prevents exposing ALL user emails/phones while still allowing property contact display

-- Fix function search_path issues for security
-- Update get_public_profile function
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);
CREATE OR REPLACE FUNCTION public.get_public_profile(_user_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, full_name, avatar_url
  FROM public.profiles
  WHERE id = _user_id;
$$;

-- Update has_role function to ensure fixed search_path (already has it, but confirming)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update get_user_role function to ensure fixed search_path
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Add comments explaining the security model
COMMENT ON POLICY "Users can view own profile" ON public.profiles IS 
  'Users can only view their own profile data. Property owner contact info is exposed via properties.contact_* fields when they list properties.';