-- Fix apply_admin_action function to match frontend expectations
CREATE OR REPLACE FUNCTION apply_admin_action(
  p_report_id uuid,
  p_admin_id uuid,
  p_action_type admin_action_type,
  p_admin_notes text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_reported_user_id uuid;
  v_listing_id uuid;
begin
  -- Get reported user and listing
  select reported_user_id, listing_id into v_reported_user_id, v_listing_id
  from reports
  where id = p_report_id;

  -- Update report status based on action
  update reports
  set 
    status = CASE 
      WHEN p_action_type = 'dismissed' THEN 'dismissed'::report_status
      ELSE 'action_taken'::report_status
    END,
    admin_id = p_admin_id,
    admin_action = p_action_type,
    admin_notes = p_admin_notes,
    updated_at = now()
  where id = p_report_id;

  -- Record action in user_actions table
  insert into user_actions (admin_id, user_id, report_id, action_type, action_reason)
  values (p_admin_id, v_reported_user_id, p_report_id, p_action_type, p_admin_notes);

  -- Apply the actual action on the user/listing
  case p_action_type
    when 'ban' then
      -- Permanent ban
      update profiles
      set is_banned = true, suspended_until = null, safety_score = GREATEST(safety_score - 50, 0)
      where id = v_reported_user_id;
      
      -- Deactivate all listings
      update properties
      set status = 'inactive', available = false
      where user_id = v_reported_user_id;
      
    when 'suspend_permanent' then
      -- Permanent suspension
      update profiles
      set suspended_until = '2099-12-31'::timestamp, safety_score = GREATEST(safety_score - 40, 0)
      where id = v_reported_user_id;
      
      update properties
      set status = 'inactive', available = false
      where user_id = v_reported_user_id;
      
    when 'suspend_30d' then
      -- 30 day suspension
      update profiles
      set suspended_until = now() + interval '30 days', safety_score = GREATEST(safety_score - 30, 0)
      where id = v_reported_user_id;
      
      update properties
      set status = 'inactive', available = false
      where user_id = v_reported_user_id;
      
    when 'suspend_7d' then
      -- 7 day suspension
      update profiles
      set suspended_until = now() + interval '7 days', safety_score = GREATEST(safety_score - 20, 0)
      where id = v_reported_user_id;
      
      update properties
      set status = 'inactive', available = false
      where user_id = v_reported_user_id;
      
    when 'warning' then
      -- Just a warning, reduce safety score slightly
      update profiles
      set safety_score = GREATEST(safety_score - 10, 0)
      where id = v_reported_user_id;
      
    when 'listing_removed' then
      -- Remove specific listing if provided
      if v_listing_id is not null then
        update properties
        set status = 'inactive', available = false
        where id = v_listing_id;
      end if;
      
    when 'dismissed' then
      -- No action taken, just mark as dismissed
      null;
      
    else
      null;
  end case;
end;
$$;

-- Fix get_report_stats to return correct field names
CREATE OR REPLACE FUNCTION get_report_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  stats json;
begin
  select json_build_object(
    'total_reports', (select count(*) from reports),
    'new_reports', (select count(*) from reports where status = 'new'),
    'in_review', (select count(*) from reports where status = 'in_review'),
    'action_taken', (select count(*) from reports where status = 'action_taken'),
    'dismissed', (select count(*) from reports where status = 'dismissed'),
    'fraud_reports', (select count(*) from reports where reason_type = 'fraud'),
    'spam_reports', (select count(*) from reports where reason_type = 'spam')
  ) into stats;
  
  return stats;
end;
$$;

-- Create index for better performance on admin queries
CREATE INDEX IF NOT EXISTS idx_reports_admin_id ON reports(admin_id) WHERE admin_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reports_listing_id ON reports(listing_id) WHERE listing_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON FUNCTION apply_admin_action IS 'Apply admin action on a report - handles user suspension, banning, listing removal, warnings, and dismissals';
COMMENT ON FUNCTION get_report_stats IS 'Get comprehensive report statistics for admin dashboard';