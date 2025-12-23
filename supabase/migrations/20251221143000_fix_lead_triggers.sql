-- Fix broken triggers that reference non-existent 'listing_id' column in ad_campaigns table
-- ad_campaigns uses 'property_id', while leads uses 'listing_id'

-- 1. Fix link_lead_to_active_campaign
CREATE OR REPLACE FUNCTION public.link_lead_to_active_campaign()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AC AS $function$
DECLARE
  active_campaign_id uuid;
BEGIN
  -- Find active campaign for this property (using property_id)
  SELECT id INTO active_campaign_id
  FROM ad_campaigns
  WHERE property_id = NEW.listing_id -- Fixed: was listing_id
  AND status = 'active'
  AND start_date <= CURRENT_DATE
  AND end_date >= CURRENT_DATE
  LIMIT 1;

  -- If found, link lead to campaign
  IF active_campaign_id IS NOT NULL THEN
    NEW.campaign_id := active_campaign_id;
  END IF;

  RETURN NEW;
END;
$function$;

-- 2. Fix set_lead_type_based_on_campaign
CREATE OR REPLACE FUNCTION public.set_lead_type_based_on_campaign()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Check if the property is part of an active campaign (using property_id)
  IF EXISTS (
    SELECT 1 
    FROM ad_campaigns 
    WHERE property_id = NEW.listing_id -- Fixed: was listing_id
    AND status = 'active'
    AND start_date <= CURRENT_DATE 
    AND end_date >= CURRENT_DATE
  ) THEN
    -- Use 'paid' to match frontend/system convention (was 'sponsored')
    NEW.lead_type := 'paid';
  ELSE
    -- Only set to organic if not already set (allow frontend to pass specific types if needed)
    IF NEW.lead_type IS NULL OR NEW.lead_type = 'sponsored' THEN 
        NEW.lead_type := 'organic';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;
