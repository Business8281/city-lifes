-- Update RLS policy to allow anonymous lead submissions
-- This is safe because we're collecting contact info from the form
DROP POLICY IF EXISTS "Users can create leads" ON leads;

CREATE POLICY "Anyone can create leads"
ON leads
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Add index for better performance on owner queries
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);