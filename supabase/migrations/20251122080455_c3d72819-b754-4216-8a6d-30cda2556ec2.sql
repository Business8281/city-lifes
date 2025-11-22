-- Performance optimization: Add critical indexes for faster queries

-- Properties table indexes (most queried table)
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_pin_code ON properties(pin_code);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status_available ON properties(status, available);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING gist(location);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_city_type ON properties(city, property_type);
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_property_id ON messages(property_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_property ON favorites(user_id, property_id);

-- Reviews indexes  
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_owner_id ON reviews(owner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Ad campaigns indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON ad_campaigns(start_date, end_date);

-- Analyze tables for query planner optimization
ANALYZE properties;
ANALYZE messages;
ANALYZE leads;
ANALYZE favorites;
ANALYZE reviews;
ANALYZE ad_campaigns;