-- Fix Contact Owner (Leads) System - Complete RLS Policy Fix

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
DROP POLICY IF EXISTS "Owners can view their leads" ON leads;
DROP POLICY IF EXISTS "Owners can update their leads" ON leads;
DROP POLICY IF EXISTS "Owners can delete their leads" ON leads;
DROP POLICY IF EXISTS "Campaign owners can view their campaign leads" ON leads;
DROP POLICY IF EXISTS "Management can view all leads" ON leads;

-- Allow ALL users (authenticated and anonymous) to insert leads
CREATE POLICY "Enable insert for all users"
ON leads FOR INSERT
TO public
WITH CHECK (true);

-- Allow lead owners to view their own leads
CREATE POLICY "Owners can view their leads"
ON leads FOR SELECT
TO authenticated
USING (owner_id = auth.uid());

-- Allow users who submitted leads to view their own submissions
CREATE POLICY "Users can view their submitted leads"
ON leads FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow management to view all leads
CREATE POLICY "Management can view all leads"
ON leads FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Allow owners to update their leads
CREATE POLICY "Owners can update their leads"
ON leads FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Allow owners to delete their leads
CREATE POLICY "Owners can delete their leads"
ON leads FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- Campaign owners can view leads from their campaigns
CREATE POLICY "Campaign owners can view campaign leads"
ON leads FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM ad_campaigns
    WHERE ad_campaigns.id = leads.campaign_id
    AND ad_campaigns.user_id = auth.uid()
  )
);

-- Ensure RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Add comment
COMMENT ON TABLE leads IS 'Contact Owner system - stores all lead submissions with support for authenticated and anonymous users';