-- Fix Performance Advisor warnings by adding missing indexes

-- Properties table indexes
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_area ON public.properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type); -- Note: listing_type might be price_type in schema, checking usage
CREATE INDEX IF NOT EXISTS idx_properties_price_type ON public.properties(price_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);

-- Leads table indexes
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON public.leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON public.leads(campaign_id);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_property_id ON public.messages(property_id);

-- Favorites table indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON public.favorites(property_id);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_owner_id ON public.reviews(owner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON public.reviews(property_id);

-- CRM Clients table indexes
CREATE INDEX IF NOT EXISTS idx_crm_clients_owner_id ON public.crm_clients(owner_id);

-- CRM Tasks table indexes
CREATE INDEX IF NOT EXISTS idx_crm_tasks_owner_id ON public.crm_tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_client_id ON public.crm_tasks(client_id);

-- Ad Campaigns table indexes
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON public.ad_campaigns(user_id);

-- Support Tickets table indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);

-- Reports table indexes
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON public.reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_property_id ON public.reports(property_id);

-- Lead Activity table indexes
CREATE INDEX IF NOT EXISTS idx_lead_activity_lead_id ON public.lead_activity(lead_id);

-- Review Interaction table indexes
CREATE INDEX IF NOT EXISTS idx_review_interaction_reviewer_id ON public.review_interaction(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_review_interaction_owner_id ON public.review_interaction(owner_id);

-- Contact Reveals table indexes
CREATE INDEX IF NOT EXISTS idx_contact_reveals_revealed_to ON public.contact_reveals(revealed_to);
CREATE INDEX IF NOT EXISTS idx_contact_reveals_property_id ON public.contact_reveals(property_id);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- User Roles table indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Rate Limits table indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_id ON public.rate_limits(user_id);

-- Typing Indicators table indexes
CREATE INDEX IF NOT EXISTS idx_typing_indicators_sender_id ON public.typing_indicators(sender_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_receiver_id ON public.typing_indicators(receiver_id);

-- FCM Tokens table indexes
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON public.fcm_tokens(user_id);
