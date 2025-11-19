-- Fix RLS policies to allow viewing other users' properties and reviews

-- Drop existing restrictive policy for properties viewing
DROP POLICY IF EXISTS "Users can view active properties" ON properties;
DROP POLICY IF EXISTS "Anyone can view active properties" ON properties;

-- Create a more permissive policy for viewing properties
CREATE POLICY "Anyone can view available properties" 
ON properties 
FOR SELECT 
USING (
  (status = 'active' AND available = true) OR 
  (auth.uid() = user_id) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Ensure user_reviews table allows viewing all reviews
DROP POLICY IF EXISTS "Anyone can view user reviews" ON user_reviews;

CREATE POLICY "Anyone can view user reviews" 
ON user_reviews 
FOR SELECT 
USING (true);

-- Make sure profiles can be viewed by everyone (for public profiles)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Anyone can view profiles" 
ON profiles 
FOR SELECT 
USING (true);