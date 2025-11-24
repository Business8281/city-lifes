-- Drop the current insert policy
DROP POLICY IF EXISTS "Enable insert for all users" ON public.leads;

-- Create a new insert policy that applies to all roles including public
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (true);