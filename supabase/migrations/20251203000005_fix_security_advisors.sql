-- Fix function_search_path_mutable
ALTER FUNCTION public.increment_campaign_leads() SET search_path = public;
ALTER FUNCTION public.run_purge_audit_logs() SET search_path = public;
ALTER FUNCTION public.search_properties_nearby(double precision, double precision, double precision, integer) SET search_path = public;
ALTER FUNCTION public.search_properties_nearby(numeric, numeric, numeric, integer) SET search_path = public;

-- Fix rls_disabled_in_public
-- Enable RLS on spatial_ref_sys if it exists and is in public
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'spatial_ref_sys') THEN
        ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
        -- Add a policy to allow read access to everyone, as it's reference data
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'spatial_ref_sys' AND policyname = 'Allow read access to all') THEN
            CREATE POLICY "Allow read access to all" ON public.spatial_ref_sys FOR SELECT USING (true);
        END IF;
    END IF;
END $$;
