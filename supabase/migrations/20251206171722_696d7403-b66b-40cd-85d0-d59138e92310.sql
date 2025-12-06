-- Drop the overly permissive policy that exposes all user data
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- Create a security definer function to check if users have interacted
-- This avoids infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.has_interaction_with_user(_viewer_id uuid, _profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Check if there's a message between the users
    SELECT 1 FROM messages 
    WHERE (sender_id = _viewer_id AND receiver_id = _profile_id)
       OR (sender_id = _profile_id AND receiver_id = _viewer_id)
    UNION ALL
    -- Check if there's a lead relationship
    SELECT 1 FROM leads 
    WHERE (owner_id = _viewer_id AND user_id = _profile_id)
       OR (owner_id = _profile_id AND user_id = _viewer_id)
    UNION ALL
    -- Check if viewer owns a property that profile_id inquired about
    SELECT 1 FROM inquiries i
    JOIN properties p ON i.property_id = p.id
    WHERE (p.user_id = _viewer_id AND i.sender_id = _profile_id)
       OR (p.user_id = _profile_id AND i.sender_id = _viewer_id)
    LIMIT 1
  )
$$;

-- Create a function to get public profile data (only safe fields)
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
  SELECT p.id, p.full_name, p.avatar_url
  FROM profiles p
  WHERE p.id = _user_id
$$;

-- Policy 1: Users can always view their own full profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Policy 2: Authenticated users can view profiles they have interactions with
CREATE POLICY "Users can view profiles they interact with"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.has_interaction_with_user(auth.uid(), id));

-- Policy 3: Property owners can see profiles of users who contacted them
CREATE POLICY "Owners can view inquirer profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      JOIN leads l ON l.listing_id = p.id
      WHERE p.user_id = auth.uid() AND l.user_id = profiles.id
    )
  );

-- Policy 4: Users can view property owner profiles (for contact purposes)
CREATE POLICY "Users can view property owner profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.user_id = profiles.id AND p.status = 'active'
    )
  );

-- Keep existing INSERT/UPDATE/DELETE policies unchanged
-- Users can only insert their own profile (handled by existing policy)
-- Users can only update their own profile (handled by existing policy)