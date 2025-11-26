-- Fix leads table RLS policies for comprehensive access
-- Drop existing update policy that's too restrictive
DROP POLICY IF EXISTS "Owners can update their leads" ON leads;

-- Create new comprehensive update policies
CREATE POLICY "Owners can update their own leads"
ON leads
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can update all leads"
ON leads
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'::app_role
  )
);

CREATE POLICY "Moderators can update all leads"
ON leads
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'moderator'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'moderator'::app_role
  )
);

-- Ensure real-time is enabled for leads table
ALTER TABLE leads REPLICA IDENTITY FULL;
DROP PUBLICATION IF EXISTS supabase_realtime CASCADE;
CREATE PUBLICATION supabase_realtime FOR TABLE leads;