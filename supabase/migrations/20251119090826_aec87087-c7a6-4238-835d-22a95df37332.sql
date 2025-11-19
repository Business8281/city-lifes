-- Create helper function to check if user has any management role
CREATE OR REPLACE FUNCTION public.is_management_role(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_management_role.user_id
      AND role IN ('admin', 'manager', 'tech_team')
  )
$$;

-- Update profiles RLS policies for management access
DROP POLICY IF EXISTS "Management can manage all profiles" ON profiles;
CREATE POLICY "Management can manage all profiles" ON profiles
FOR ALL
USING (is_management_role(auth.uid()))
WITH CHECK (is_management_role(auth.uid()));

-- Update properties RLS policies for management access
DROP POLICY IF EXISTS "Management can view all properties" ON properties;
CREATE POLICY "Management can view all properties" ON properties
FOR SELECT
USING (is_management_role(auth.uid()));

DROP POLICY IF EXISTS "Management can delete any property" ON properties;
CREATE POLICY "Management can delete any property" ON properties
FOR DELETE
USING (is_management_role(auth.uid()));

-- Update messages RLS policies for management access
DROP POLICY IF EXISTS "Management can view all messages" ON messages;
CREATE POLICY "Management can view all messages" ON messages
FOR SELECT
USING (is_management_role(auth.uid()));

DROP POLICY IF EXISTS "Management can delete any message" ON messages;
CREATE POLICY "Management can delete any message" ON messages
FOR DELETE
USING (is_management_role(auth.uid()));

-- Update favorites RLS policies for management access
DROP POLICY IF EXISTS "Management can manage all favorites" ON favorites;
CREATE POLICY "Management can manage all favorites" ON favorites
FOR ALL
USING (is_management_role(auth.uid()))
WITH CHECK (is_management_role(auth.uid()));

-- Update ad_campaigns RLS policies for management access
DROP POLICY IF EXISTS "Management can view all campaigns" ON ad_campaigns;
CREATE POLICY "Management can view all campaigns" ON ad_campaigns
FOR SELECT
USING (is_management_role(auth.uid()));

-- Update reviews RLS policies for management access
DROP POLICY IF EXISTS "Management can manage all reviews" ON reviews;
CREATE POLICY "Management can manage all reviews" ON reviews
FOR ALL
USING (is_management_role(auth.uid()))
WITH CHECK (is_management_role(auth.uid()));

-- Update user_reviews RLS policies for management access
DROP POLICY IF EXISTS "Management can manage all user reviews" ON user_reviews;
CREATE POLICY "Management can manage all user reviews" ON user_reviews
FOR ALL
USING (is_management_role(auth.uid()))
WITH CHECK (is_management_role(auth.uid()));

-- Update inquiries RLS policies for management access
DROP POLICY IF EXISTS "Management can view all inquiries" ON inquiries;
CREATE POLICY "Management can view all inquiries" ON inquiries
FOR SELECT
USING (is_management_role(auth.uid()));

DROP POLICY IF EXISTS "Management can delete inquiries" ON inquiries;
CREATE POLICY "Management can delete inquiries" ON inquiries
FOR DELETE
USING (is_management_role(auth.uid()));

-- Update notifications RLS policies for management access
DROP POLICY IF EXISTS "Management can manage all notifications" ON notifications;
CREATE POLICY "Management can manage all notifications" ON notifications
FOR ALL
USING (is_management_role(auth.uid()))
WITH CHECK (is_management_role(auth.uid()));

-- Update support_tickets RLS policies for management access
DROP POLICY IF EXISTS "Management can view all support tickets" ON support_tickets;
CREATE POLICY "Management can view all support tickets" ON support_tickets
FOR SELECT
USING (is_management_role(auth.uid()));

DROP POLICY IF EXISTS "Management can update support tickets" ON support_tickets;
CREATE POLICY "Management can update support tickets" ON support_tickets
FOR UPDATE
USING (is_management_role(auth.uid()))
WITH CHECK (is_management_role(auth.uid()));

-- Add comment for documentation
COMMENT ON FUNCTION public.is_management_role IS 'Checks if user has admin, manager, or tech_team role. Used for management-level access control.';