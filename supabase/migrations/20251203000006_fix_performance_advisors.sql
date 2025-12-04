-- Fix unindexed_foreign_keys
CREATE INDEX IF NOT EXISTS idx_typing_indicators_property_id ON public.typing_indicators(property_id);
CREATE INDEX IF NOT EXISTS idx_support_ticket_attachments_ticket_id ON public.support_ticket_attachments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_crm_clients_lead_id ON public.crm_clients(lead_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_report_id ON public.user_actions(report_id);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_city_id ON public.search_suggestions(city_id);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_area_id ON public.search_suggestions(area_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON public.subscriptions(plan_id);

-- Fix duplicate_index
-- Dropping redundant indexes (keeping one of each pair)
DROP INDEX IF EXISTS idx_reports_reported_user_id;
DROP INDEX IF EXISTS idx_reports_reporter_id;
DROP INDEX IF EXISTS idx_reviews_listing_id;
DROP INDEX IF EXISTS idx_reviews_owner_id;
