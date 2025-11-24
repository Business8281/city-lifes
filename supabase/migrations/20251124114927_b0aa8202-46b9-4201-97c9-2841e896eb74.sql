-- Fix remaining custom functions with search_path (drop and recreate)

-- Drop and recreate get_admin_users_list with correct signature
drop function if exists public.get_admin_users_list();

create function public.get_admin_users_list()
returns table(
  id uuid,
  email text,
  full_name text,
  created_at timestamptz,
  last_active timestamptz,
  properties_count bigint,
  messages_sent bigint,
  favorites_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select 
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    p.updated_at as last_active,
    (select count(*) from properties where user_id = p.id) as properties_count,
    (select count(*) from messages where sender_id = p.id) as messages_sent,
    (select count(*) from favorites where user_id = p.id) as favorites_count
  from profiles p
  order by p.created_at desc
$$;

-- Fix get_admin_dashboard_stats
create or replace function public.get_admin_dashboard_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  stats json;
begin
  select json_build_object(
    'total_users', (select count(*) from profiles),
    'total_properties', (select count(*) from properties),
    'active_properties', (select count(*) from properties where status = 'active'),
    'total_messages', (select count(*) from messages),
    'total_inquiries', (select count(*) from inquiries),
    'pending_reports', (select count(*) from reports where status = 'new'),
    'active_campaigns', (select count(*) from ad_campaigns where status = 'active')
  ) into stats;
  
  return stats;
end;
$$;

-- Fix get_report_stats
create or replace function public.get_report_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  stats json;
begin
  select json_build_object(
    'total_reports', (select count(*) from reports),
    'pending_reports', (select count(*) from reports where status = 'new'),
    'resolved_reports', (select count(*) from reports where status = 'resolved'),
    'dismissed_reports', (select count(*) from reports where status = 'dismissed')
  ) into stats;
  
  return stats;
end;
$$;

-- Fix get_public_profile
create or replace function public.get_public_profile(_user_id uuid)
returns table(id uuid, full_name text, avatar_url text)
language sql
stable
security definer
set search_path = public
as $$
  select id, full_name, avatar_url
  from profiles
  where id = _user_id
$$;

-- Fix get_user_rating_stats
create or replace function public.get_user_rating_stats(_user_id uuid)
returns table(average_rating numeric, total_reviews bigint)
language sql
stable
security definer
set search_path = public
as $$
  select 
    coalesce(avg(rating), 0)::numeric as average_rating,
    count(*)::bigint as total_reviews
  from reviews
  where owner_id = _user_id
$$;

-- Fix get_owner_rating_stats
create or replace function public.get_owner_rating_stats(owner_user_id uuid)
returns table(average_rating numeric, total_reviews bigint, verified_reviews bigint)
language sql
stable
security definer
set search_path = public
as $$
  select 
    coalesce(avg(rating), 0)::numeric as average_rating,
    count(*)::bigint as total_reviews,
    count(*) filter (where verified = true)::bigint as verified_reviews
  from reviews
  where owner_id = owner_user_id
$$;

-- Fix get_campaign_analytics
create or replace function public.get_campaign_analytics(p_campaign_id uuid)
returns table(
  total_leads bigint,
  organic_leads bigint,
  paid_leads bigint,
  conversion_rate numeric,
  cpl numeric
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*)::bigint as total_leads,
    count(*) filter (where lead_type = 'organic')::bigint as organic_leads,
    count(*) filter (where lead_type = 'paid')::bigint as paid_leads,
    case 
      when (select clicks from ad_campaigns where id = p_campaign_id) > 0
      then (count(*) * 100.0 / (select clicks from ad_campaigns where id = p_campaign_id))::numeric
      else 0
    end as conversion_rate,
    case
      when count(*) filter (where lead_type = 'paid') > 0
      then ((select spent from ad_campaigns where id = p_campaign_id) / count(*) filter (where lead_type = 'paid'))::numeric
      else 0
    end as cpl
  from leads
  where campaign_id = p_campaign_id
$$;