-- Fix function_search_path_mutable
ALTER ROUTINE public.check_report_limit() SET search_path = public;
ALTER ROUTINE public.get_nearby_properties(double precision, double precision, double precision, integer) SET search_path = public;
ALTER ROUTINE public.track_campaign_click(uuid) SET search_path = public;

-- Fix auth_rls_initplan
-- Update policies to wrap auth.uid() in (select ...)
ALTER POLICY "Management can manage all favorites" ON public.favorites
USING (is_management_role((select auth.uid())));

ALTER POLICY "Management can manage all profiles" ON public.profiles
USING (is_management_role((select auth.uid())));

-- Fix duplicate_index
-- Dropping redundant indexes
DROP INDEX IF EXISTS idx_properties_created_at_desc;
DROP INDEX IF EXISTS idx_properties_pincode;
DROP INDEX IF EXISTS idx_properties_property_type;
DROP INDEX IF EXISTS idx_reports_created;
