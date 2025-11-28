-- Function to auto-update leads_generated count on ad_campaigns
CREATE OR REPLACE FUNCTION update_campaign_leads_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.campaign_id IS NOT NULL THEN
    -- Increment leads_generated when a lead with campaign_id is created
    UPDATE ad_campaigns 
    SET leads_generated = COALESCE(leads_generated, 0) + 1 
    WHERE id = NEW.campaign_id;
  ELSIF TG_OP = 'DELETE' AND OLD.campaign_id IS NOT NULL THEN
    -- Decrement leads_generated when a lead with campaign_id is deleted
    UPDATE ad_campaigns 
    SET leads_generated = GREATEST(0, COALESCE(leads_generated, 0) - 1) 
    WHERE id = OLD.campaign_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle campaign_id changes (e.g., reassigning lead to different campaign)
    IF OLD.campaign_id IS DISTINCT FROM NEW.campaign_id THEN
      -- Decrement old campaign
      IF OLD.campaign_id IS NOT NULL THEN
        UPDATE ad_campaigns 
        SET leads_generated = GREATEST(0, COALESCE(leads_generated, 0) - 1) 
        WHERE id = OLD.campaign_id;
      END IF;
      -- Increment new campaign
      IF NEW.campaign_id IS NOT NULL THEN
        UPDATE ad_campaigns 
        SET leads_generated = COALESCE(leads_generated, 0) + 1 
        WHERE id = NEW.campaign_id;
      END IF;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on leads table
DROP TRIGGER IF EXISTS leads_campaign_count_trigger ON leads;
CREATE TRIGGER leads_campaign_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON leads
FOR EACH ROW EXECUTE FUNCTION update_campaign_leads_count();