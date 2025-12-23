-- Reorder triggers to ensure lead data is populated BEFORE incrementing stats
-- Current issue: 'trigger_increment...' runs before 'trigger_link...' due to alphabetical order

DO $$ 
BEGIN
  -- 1. Drop existing triggers (if they exist)
  DROP TRIGGER IF EXISTS trigger_increment_campaign_leads ON public.leads;
  DROP TRIGGER IF EXISTS trigger_link_lead_to_campaign ON public.leads; -- Old name seen in earlier step
  DROP TRIGGER IF EXISTS trigger_link_lead_to_active_campaign ON public.leads;
  DROP TRIGGER IF EXISTS trigger_set_lead_type ON public.leads;

  -- 2. Create new triggers with ordered prefixes
  -- Step 1: Link to campaign (Must happen first)
  CREATE TRIGGER "01_link_lead_to_active_campaign"
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.link_lead_to_active_campaign();

  -- Step 2: Set lead type (Must happen after linking)
  CREATE TRIGGER "02_set_lead_type_based_on_campaign"
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_lead_type_based_on_campaign();

  -- Step 3: Increment stats (Must happen last)
  CREATE TRIGGER "99_increment_campaign_leads"
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_campaign_leads();

END $$;
