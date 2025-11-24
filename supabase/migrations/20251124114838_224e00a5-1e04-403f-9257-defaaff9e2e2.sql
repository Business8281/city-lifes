-- Fix Function Search Path Mutable warnings by setting search_path on all custom functions

-- Fix increment_property_views
create or replace function public.increment_property_views(property_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update properties
  set views = views + 1
  where id = property_id;
end;
$$;

-- Fix increment_campaign_impressions
create or replace function public.increment_campaign_impressions(campaign_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update ad_campaigns
  set impressions = impressions + 1
  where id = campaign_id;
end;
$$;

-- Fix increment_campaign_clicks
create or replace function public.increment_campaign_clicks(campaign_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update ad_campaigns
  set clicks = clicks + 1
  where id = campaign_id;
end;
$$;

-- Fix approve_property
create or replace function public.approve_property(property_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update properties
  set verified = true, status = 'active'
  where id = property_id;
end;
$$;

-- Fix reject_property
create or replace function public.reject_property(property_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update properties
  set verified = false, status = 'rejected'
  where id = property_id;
end;
$$;

-- Fix get_user_role
create or replace function public.get_user_role(_user_id uuid)
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from user_roles
  where user_id = _user_id
  limit 1
$$;

-- Fix is_management_role
create or replace function public.is_management_role(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from user_roles
    where user_roles.user_id = is_management_role.user_id
    and role in ('admin', 'manager')
  )
$$;

-- Fix has_inquired_on_property
create or replace function public.has_inquired_on_property(_user_id uuid, _property_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from inquiries
    where sender_id = _user_id
    and property_id = _property_id
  )
$$;

-- Fix check_campaign_budgets
create or replace function public.check_campaign_budgets()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update ad_campaigns
  set status = 'paused'
  where status = 'active'
  and spent >= budget;
end;
$$;

-- Fix complete_expired_campaigns
create or replace function public.complete_expired_campaigns()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update ad_campaigns
  set status = 'completed'
  where status = 'active'
  and end_date < now();
end;
$$;

-- Fix purge_old_audit_logs
create or replace function public.purge_old_audit_logs(retention_days integer default 90)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from audit_logs
  where created_at < now() - (retention_days || ' days')::interval;
end;
$$;

-- Fix reveal_property_contact
create or replace function public.reveal_property_contact(p_property_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  contact_info json;
begin
  -- Record the reveal
  insert into contact_reveals (property_id, revealed_to)
  values (p_property_id, auth.uid())
  on conflict (property_id, revealed_to) do nothing;

  -- Return contact information
  select json_build_object(
    'contact_name', contact_name,
    'contact_phone', contact_phone,
    'contact_email', contact_email
  )
  into contact_info
  from properties
  where id = p_property_id;

  return contact_info;
end;
$$;

-- Fix apply_admin_action
create or replace function public.apply_admin_action(
  p_report_id uuid,
  p_admin_id uuid,
  p_action_type admin_action_type,
  p_admin_notes text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reported_user_id uuid;
begin
  -- Get reported user
  select reported_user_id into v_reported_user_id
  from reports
  where id = p_report_id;

  -- Update report
  update reports
  set 
    status = 'resolved',
    admin_id = p_admin_id,
    admin_action = p_action_type,
    admin_notes = p_admin_notes,
    updated_at = now()
  where id = p_report_id;

  -- Record action
  insert into user_actions (admin_id, user_id, report_id, action_type, action_reason)
  values (p_admin_id, v_reported_user_id, p_report_id, p_action_type, p_admin_notes);

  -- Apply action
  case p_action_type
    when 'ban' then
      update profiles
      set is_banned = true, suspended_until = null
      where id = v_reported_user_id;
      
      update properties
      set status = 'inactive'
      where user_id = v_reported_user_id;
      
    when 'suspend_7_days' then
      update profiles
      set suspended_until = now() + interval '7 days'
      where id = v_reported_user_id;
      
      update properties
      set status = 'inactive'
      where user_id = v_reported_user_id;
      
    when 'suspend_30_days' then
      update profiles
      set suspended_until = now() + interval '30 days'
      where id = v_reported_user_id;
      
      update properties
      set status = 'inactive'
      where user_id = v_reported_user_id;
      
    when 'warning' then
      -- Just record the warning in user_actions
      null;
      
    when 'remove_listing' then
      update properties
      set status = 'removed'
      where id = (select listing_id from reports where id = p_report_id);
      
    else
      null;
  end case;
end;
$$;