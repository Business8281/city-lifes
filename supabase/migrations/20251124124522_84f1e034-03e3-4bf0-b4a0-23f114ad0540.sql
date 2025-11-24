
-- Fix the leads table RLS policy for inserting leads
-- Drop the existing incorrect policy
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Create a proper policy that allows anyone (including anonymous users) to insert leads
CREATE POLICY "Anyone can insert leads" 
ON public.leads 
FOR INSERT 
TO public
WITH CHECK (true);

-- Also ensure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
