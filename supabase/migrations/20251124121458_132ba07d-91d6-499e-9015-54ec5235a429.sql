-- Fix leads table RLS policy to allow inserts
-- Drop existing insert policy
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;

-- Create new explicit insert policy that allows all inserts
CREATE POLICY "Enable insert for all users"
ON public.leads
FOR INSERT
TO authenticated, anon
WITH CHECK (true);