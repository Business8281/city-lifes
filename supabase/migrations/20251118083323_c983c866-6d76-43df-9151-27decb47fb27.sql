-- Performance Optimization Migration
-- Add missing indexes for better query performance

-- Indexes for messages table (frequently queried)
CREATE INDEX IF NOT EXISTS idx_messages_receiver_read ON messages(receiver_id, read) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS idx_messages_sender_created ON messages(sender_id, created_at DESC) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS idx_messages_property_created ON messages(property_id, created_at DESC) WHERE property_id IS NOT NULL AND deleted = false;
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status) WHERE status IS NOT NULL;

-- Indexes for properties table (high read volume)
CREATE INDEX IF NOT EXISTS idx_properties_user_status ON properties(user_id, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_properties_verified_available ON properties(verified, available) WHERE verified = true AND available = true;
CREATE INDEX IF NOT EXISTS idx_properties_city_type ON properties(city, property_type) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_properties_price_range ON properties(price) WHERE status = 'active' AND available = true;
CREATE INDEX IF NOT EXISTS idx_properties_created_desc ON properties(created_at DESC) WHERE status = 'active';

-- Indexes for favorites table
CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_created ON favorites(user_id, created_at DESC);

-- Indexes for inquiries table  
CREATE INDEX IF NOT EXISTS idx_inquiries_receiver ON inquiries(receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_sender ON inquiries(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_created ON inquiries(property_id, created_at DESC);

-- Indexes for ad_campaigns table
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status_dates ON ad_campaigns(status, start_date, end_date) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_property ON ad_campaigns(property_id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_status ON ad_campaigns(user_id, status);

-- Indexes for notifications table
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type, created_at DESC);

-- Indexes for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_property_created ON reviews(property_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Indexes for user_reviews table
CREATE INDEX IF NOT EXISTS idx_user_reviews_reviewed_user ON user_reviews(reviewed_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reviews_reviewer ON user_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_rating ON user_reviews(rating);

-- Indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created ON profiles(created_at DESC);

-- Indexes for audit_logs table
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON audit_logs(user_id, action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);

-- Indexes for fcm_tokens table
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user ON fcm_tokens(user_id) WHERE user_id IS NOT NULL;

-- Indexes for contact_reveals table
CREATE INDEX IF NOT EXISTS idx_contact_reveals_revealed_to ON contact_reveals(revealed_to, revealed_at DESC);

-- Indexes for support_tickets table
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status ON support_tickets(user_id, status, created_at DESC);

-- Indexes for rate_limits table
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint ON rate_limits(ip_address, endpoint, window_start DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON rate_limits(user_id, endpoint) WHERE user_id IS NOT NULL;

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_properties_location_type_verified ON properties(city, property_type, verified, available) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC) WHERE deleted = false;
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_active ON ad_campaigns(property_id, status, end_date);

-- Add search_path to update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Optimize reject_property function with search_path
CREATE OR REPLACE FUNCTION public.reject_property(property_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reject properties';
  END IF;
  
  DELETE FROM properties WHERE id = property_id;
END;
$$;

-- Optimize reveal_property_contact function with search_path
CREATE OR REPLACE FUNCTION public.reveal_property_contact(p_property_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result json;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF EXISTS (
    SELECT 1 FROM contact_reveals 
    WHERE property_id = p_property_id 
    AND revealed_to = v_user_id
  ) THEN
    SELECT json_build_object(
      'contact_name', contact_name,
      'contact_phone', contact_phone,
      'contact_email', contact_email
    ) INTO v_result
    FROM properties
    WHERE id = p_property_id;
    
    RETURN v_result;
  END IF;

  INSERT INTO contact_reveals (property_id, revealed_to)
  VALUES (p_property_id, v_user_id);

  SELECT json_build_object(
    'contact_name', contact_name,
    'contact_phone', contact_phone,
    'contact_email', contact_email
  ) INTO v_result
  FROM properties
  WHERE id = p_property_id;

  RETURN v_result;
END;
$$;

-- Optimize increment functions with search_path
CREATE OR REPLACE FUNCTION public.increment_property_views(property_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $$
  UPDATE properties 
  SET views = COALESCE(views, 0) + 1 
  WHERE id = property_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_campaign_impressions(campaign_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $$
  UPDATE ad_campaigns 
  SET impressions = impressions + 1 
  WHERE id = campaign_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_campaign_clicks(campaign_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $$
  UPDATE ad_campaigns 
  SET clicks = clicks + 1,
      spent = spent + (budget::numeric / NULLIF(EXTRACT(DAY FROM (end_date - start_date)), 0)::numeric / 100)
  WHERE id = campaign_id;
$$;

-- Analyze tables to update statistics
ANALYZE properties;
ANALYZE messages;
ANALYZE favorites;
ANALYZE inquiries;
ANALYZE ad_campaigns;
ANALYZE notifications;
ANALYZE reviews;
ANALYZE user_reviews;
ANALYZE profiles;