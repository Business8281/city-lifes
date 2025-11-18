-- Remove ambiguous overload of get_sponsored_properties to ensure RPC works reliably
DROP FUNCTION IF EXISTS public.get_sponsored_properties(TEXT, TEXT, TEXT, NUMERIC, NUMERIC, NUMERIC);

-- Verify only one function remains (for our own log)
-- (No-op for runtime, but useful during development)
