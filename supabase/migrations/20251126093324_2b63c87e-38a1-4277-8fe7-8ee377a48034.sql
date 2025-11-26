-- Fix RLS policies for leads table to ensure ALL users can submit leads
-- Drop existing insert policy
DROP POLICY IF EXISTS "Enable insert for all users" ON public.leads;

-- Create more explicit insert policy that works for authenticated users and anonymous users
CREATE POLICY "Allow all users to insert leads" 
ON public.leads 
FOR INSERT 
TO public
WITH CHECK (true);

-- Add index for better performance on lead queries
CREATE INDEX IF NOT EXISTS idx_leads_owner_id_created_at 
ON public.leads(owner_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_user_id_created_at 
ON public.leads(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

-- Ensure the leads table has proper constraints
-- Make sure email can be null (for users who don't provide it)
ALTER TABLE public.leads 
ALTER COLUMN email DROP NOT NULL;