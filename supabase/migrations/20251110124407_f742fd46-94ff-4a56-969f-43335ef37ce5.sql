-- Enable real-time updates for admin dashboard

-- Enable replica identity for real-time updates
ALTER TABLE public.properties REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.favorites REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.ad_campaigns REPLICA IDENTITY FULL;
ALTER TABLE public.inquiries REPLICA IDENTITY FULL;

-- Create a function to get comprehensive admin statistics
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'new_users_today', (SELECT COUNT(*) FROM profiles WHERE created_at::date = CURRENT_DATE),
    'new_users_this_week', (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    'total_properties', (SELECT COUNT(*) FROM properties),
    'active_properties', (SELECT COUNT(*) FROM properties WHERE status = 'active' AND available = true),
    'pending_properties', (SELECT COUNT(*) FROM properties WHERE verified = false),
    'verified_properties', (SELECT COUNT(*) FROM properties WHERE verified = true),
    'new_properties_today', (SELECT COUNT(*) FROM properties WHERE created_at::date = CURRENT_DATE),
    'total_messages', (SELECT COUNT(*) FROM messages),
    'messages_today', (SELECT COUNT(*) FROM messages WHERE created_at::date = CURRENT_DATE),
    'unread_messages', (SELECT COUNT(*) FROM messages WHERE read = false),
    'total_favorites', (SELECT COUNT(*) FROM favorites),
    'favorites_today', (SELECT COUNT(*) FROM favorites WHERE created_at::date = CURRENT_DATE),
    'total_inquiries', (SELECT COUNT(*) FROM inquiries),
    'inquiries_today', (SELECT COUNT(*) FROM inquiries WHERE created_at::date = CURRENT_DATE),
    'total_campaigns', (SELECT COUNT(*) FROM ad_campaigns),
    'active_campaigns', (SELECT COUNT(*) FROM ad_campaigns WHERE status = 'active' AND end_date > NOW()),
    'total_views', (SELECT COALESCE(SUM(views), 0) FROM properties),
    'avg_property_price', (SELECT COALESCE(AVG(price), 0)::numeric(10,2) FROM properties WHERE status = 'active'),
    'properties_by_type', (
      SELECT json_object_agg(property_type, count)
      FROM (
        SELECT property_type, COUNT(*) as count
        FROM properties
        WHERE status = 'active'
        GROUP BY property_type
        ORDER BY count DESC
        LIMIT 10
      ) t
    ),
    'top_cities', (
      SELECT json_object_agg(city, count)
      FROM (
        SELECT city, COUNT(*) as count
        FROM properties
        WHERE status = 'active'
        GROUP BY city
        ORDER BY count DESC
        LIMIT 10
      ) t
    ),
    'recent_activity', (
      SELECT json_agg(activity)
      FROM (
        SELECT 
          'property' as type,
          title as description,
          created_at,
          user_id
        FROM properties
        ORDER BY created_at DESC
        LIMIT 10
      ) activity
    )
  )
$$;

-- Create function to get user list with stats
CREATE OR REPLACE FUNCTION public.get_admin_users_list()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  created_at timestamptz,
  properties_count bigint,
  messages_sent bigint,
  favorites_count bigint,
  last_active timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    COALESCE(prop.count, 0) as properties_count,
    COALESCE(msg.count, 0) as messages_sent,
    COALESCE(fav.count, 0) as favorites_count,
    GREATEST(
      p.created_at,
      COALESCE(msg.last_message, p.created_at),
      COALESCE(prop.last_property, p.created_at)
    ) as last_active
  FROM profiles p
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count, MAX(created_at) as last_property
    FROM properties
    GROUP BY user_id
  ) prop ON p.id = prop.user_id
  LEFT JOIN (
    SELECT sender_id, COUNT(*) as count, MAX(created_at) as last_message
    FROM messages
    GROUP BY sender_id
  ) msg ON p.id = msg.sender_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM favorites
    GROUP BY user_id
  ) fav ON p.id = fav.user_id
  ORDER BY last_active DESC;
$$;