-- Add suspended_until to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_until timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'owner', 'agent', 'admin'));

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL, -- 'view', 'click', 'lead', 'search', 'favorite'
    user_id uuid REFERENCES profiles(id),
    listing_id uuid REFERENCES properties(id),
    meta jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_listing_id ON analytics_events(listing_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_meta ON analytics_events USING gin(meta);

-- RLS for analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own events
CREATE POLICY "Users can insert their own events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Owners can view events for their listings
CREATE POLICY "Owners can view events for their listings" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties p
            WHERE p.id = analytics_events.listing_id
            AND p.user_id = auth.uid()
        )
    );

-- Admins can view all events
CREATE POLICY "Admins can view all events" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role = 'admin'
        )
    );

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id uuid REFERENCES properties(id),
    owner_id uuid REFERENCES profiles(id),
    user_id uuid REFERENCES profiles(id),
    status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'closed', 'lost')),
    source text DEFAULT 'platform',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_owner_id ON leads(owner_id);
CREATE INDEX IF NOT EXISTS idx_leads_listing_id ON leads(listing_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- RLS for leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Owners can view leads for their listings
CREATE POLICY "Owners can view their leads" ON leads
    FOR SELECT USING (auth.uid() = owner_id);

-- Owners can update their leads
CREATE POLICY "Owners can update their leads" ON leads
    FOR UPDATE USING (auth.uid() = owner_id);

-- Users can view leads they created (if applicable, e.g. their inquiries)
CREATE POLICY "Users can view their own leads" ON leads
    FOR SELECT USING (auth.uid() = user_id);

-- RPC: Get Dashboard Stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    user_role text;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM profiles WHERE id = user_id;
    
    -- Default stats
    result := json_build_object(
        'active_listings', 0,
        'total_views', 0,
        'new_leads', 0,
        'favorites', 0,
        'unread_messages', 0
    );

    -- Active Listings
    SELECT count(*) INTO result FROM json_populate_record(result, json_build_object(
        'active_listings', (SELECT count(*) FROM properties WHERE properties.user_id = get_dashboard_stats.user_id AND status = 'active')
    ));

    -- Total Views (from analytics or properties views count)
    SELECT count(*) INTO result FROM json_populate_record(result, json_build_object(
        'total_views', (SELECT coalesce(sum(views), 0) FROM properties WHERE properties.user_id = get_dashboard_stats.user_id)
    ));

    -- New Leads
    SELECT count(*) INTO result FROM json_populate_record(result, json_build_object(
        'new_leads', (SELECT count(*) FROM leads WHERE owner_id = get_dashboard_stats.user_id AND status = 'new')
    ));

    -- Favorites
    SELECT count(*) INTO result FROM json_populate_record(result, json_build_object(
        'favorites', (SELECT count(*) FROM favorites WHERE favorites.user_id = get_dashboard_stats.user_id)
    ));

    -- Unread Messages
    SELECT count(*) INTO result FROM json_populate_record(result, json_build_object(
        'unread_messages', (SELECT count(*) FROM messages WHERE receiver_id = get_dashboard_stats.user_id AND read = false)
    ));

    RETURN result;
END;
$$;

-- RPC: Get Analytics Data (Time Series)
CREATE OR REPLACE FUNCTION get_analytics_data(user_id uuid, time_range text DEFAULT '30d')
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    start_date timestamptz;
    result json;
BEGIN
    CASE time_range
        WHEN '7d' THEN start_date := now() - interval '7 days';
        WHEN '90d' THEN start_date := now() - interval '90 days';
        ELSE start_date := now() - interval '30 days';
    END CASE;

    SELECT json_agg(t) INTO result
    FROM (
        SELECT
            date_trunc('day', created_at) as date,
            count(*) as views
        FROM analytics_events
        WHERE listing_id IN (SELECT id FROM properties WHERE properties.user_id = get_analytics_data.user_id)
        AND type = 'view'
        AND created_at >= start_date
        GROUP BY 1
        ORDER BY 1
    ) t;

    RETURN coalesce(result, '[]'::json);
END;
$$;
