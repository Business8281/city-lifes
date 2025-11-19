-- Drop the existing function first
DROP FUNCTION IF EXISTS get_admin_users_list();

-- Recreate the get_admin_users_list function with proper favorites counting
CREATE OR REPLACE FUNCTION get_admin_users_list()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  created_at timestamp with time zone,
  properties_count bigint,
  favorites_count bigint,
  messages_sent bigint,
  last_active timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    COALESCE(prop_count.count, 0) as properties_count,
    COALESCE(fav_count.count, 0) as favorites_count,
    COALESCE(msg_count.count, 0) as messages_sent,
    COALESCE(GREATEST(p.updated_at, last_msg.last_message), p.updated_at) as last_active
  FROM profiles p
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM properties
    GROUP BY user_id
  ) prop_count ON p.id = prop_count.user_id
  LEFT JOIN (
    SELECT user_id, COUNT(*) as count
    FROM favorites
    GROUP BY user_id
  ) fav_count ON p.id = fav_count.user_id
  LEFT JOIN (
    SELECT sender_id, COUNT(*) as count
    FROM messages
    GROUP BY sender_id
  ) msg_count ON p.id = msg_count.sender_id
  LEFT JOIN (
    SELECT sender_id, MAX(created_at) as last_message
    FROM messages
    GROUP BY sender_id
  ) last_msg ON p.id = last_msg.sender_id
  ORDER BY p.created_at DESC;
END;
$$;