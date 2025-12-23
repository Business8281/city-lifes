-- Migration: Optimize Database for Scale (10M+ Users)
-- Description: Adds critical indexes for Foreign Keys and common query patterns (Filtering, Sorting).
-- Date: 2025-12-15

-- 1. Foreign Key Indexes (Prevent Sequential Scans on Joins)
-- leads
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_listing_id ON leads(listing_id);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);

-- ad_campaigns
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_property_id ON ad_campaigns(property_id);

-- messages
CREATE INDEX IF NOT EXISTS idx_messages_property_id ON messages(property_id);
-- (sender/receiver usually indexed, but ensuring composite for conversation view)
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);

-- inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);

-- favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_property ON favorites(user_id, property_id);

-- 2. Search & Filter Optimization (Properties)
-- Composite index for the most common search pattern: City + Status
CREATE INDEX IF NOT EXISTS idx_properties_city_status ON properties(city, status);

-- Composite index for Price filtering within a City (very common)
CREATE INDEX IF NOT EXISTS idx_properties_city_price ON properties(city, price);

-- Lat/Long index for bounding box queries (if PostGIS not used)
CREATE INDEX IF NOT EXISTS idx_properties_location_lat_lng ON properties(latitude, longitude);

-- 3. Partial Indexes (Optimization for "Active" or "Unread" states)
-- Notifications: rapid count of unread items
CREATE INDEX IF NOT EXISTS idx_notifications_unread_user ON notifications(user_id) WHERE read = false;

-- Reports: Admin queue (Unresolved reports)
CREATE INDEX IF NOT EXISTS idx_reports_status_active ON reports(status) WHERE status IN ('new', 'in_review');

-- 4. Maintenance / cleanup
-- Ensure statistics are up to date for the planner (optional, but good for major changes)
ANALYZE properties;
ANALYZE leads;
