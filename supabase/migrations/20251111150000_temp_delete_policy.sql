-- Temporary: Add a more permissive delete policy for testing
-- This will help us identify if RLS is the issue

-- For properties table
CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete properties (testing)"
ON properties
FOR DELETE
TO authenticated
USING (true);

-- For ad_campaigns table  
CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete campaigns (testing)"
ON ad_campaigns
FOR DELETE
TO authenticated
USING (true);

-- Note: These are TEMPORARY policies for debugging
-- They allow ANY authenticated user to delete ANY record
-- After confirming deletion works, we'll remove these and fix the original policies
