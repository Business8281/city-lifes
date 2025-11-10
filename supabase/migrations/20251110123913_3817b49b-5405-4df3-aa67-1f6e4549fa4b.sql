-- Performance optimization - Add indexes for faster queries

-- Index on properties user_id for faster user property lookups
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON public.properties(user_id);

-- Index on properties status and available for filtering active properties
CREATE INDEX IF NOT EXISTS idx_properties_status_available ON public.properties(status, available);

-- Index on properties verified for admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_properties_verified ON public.properties(verified);

-- Index on properties created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);

-- Index on messages for conversation queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON public.messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Index on favorites for user favorites lookup
CREATE INDEX IF NOT EXISTS idx_favorites_user_property ON public.favorites(user_id, property_id);

-- Index on inquiries for property inquiry checks
CREATE INDEX IF NOT EXISTS idx_inquiries_property_sender ON public.inquiries(property_id, sender_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_receiver ON public.inquiries(property_id, receiver_id);

-- Index on user_roles for role checking
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);

-- Index on ad_campaigns for active campaign queries
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status_dates ON public.ad_campaigns(status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON public.ad_campaigns(user_id);

-- Index on notifications for user notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Composite indexes for common query patterns
-- For searching properties by location
CREATE INDEX IF NOT EXISTS idx_properties_city_area ON public.properties(city, area);

-- For properties with geolocation queries (GIST index for geography type)
CREATE INDEX IF NOT EXISTS idx_properties_location ON public.properties USING GIST(location);

-- Analyze tables to update query planner statistics
ANALYZE public.properties;
ANALYZE public.profiles;
ANALYZE public.messages;
ANALYZE public.favorites;
ANALYZE public.inquiries;
ANALYZE public.user_roles;
ANALYZE public.ad_campaigns;
ANALYZE public.notifications;