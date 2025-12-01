-- Drop existing triggers with CASCADE to handle dependencies
DROP TRIGGER IF EXISTS update_campaign_leads_count_trigger ON leads CASCADE;
DROP TRIGGER IF EXISTS leads_campaign_count_trigger ON leads CASCADE;
DROP FUNCTION IF EXISTS update_campaign_leads_count() CASCADE;

-- Function to automatically update campaign leads_generated count
CREATE OR REPLACE FUNCTION update_campaign_leads_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF (TG_OP = 'INSERT') THEN
    IF NEW.campaign_id IS NOT NULL THEN
      UPDATE ad_campaigns
      SET leads_generated = COALESCE(leads_generated, 0) + 1
      WHERE id = NEW.campaign_id;
    END IF;
    RETURN NEW;
  END IF;

  -- Handle UPDATE (when campaign_id changes)
  IF (TG_OP = 'UPDATE') THEN
    -- Decrement old campaign if campaign_id changed from non-null
    IF OLD.campaign_id IS NOT NULL AND (NEW.campaign_id IS NULL OR NEW.campaign_id != OLD.campaign_id) THEN
      UPDATE ad_campaigns
      SET leads_generated = GREATEST(COALESCE(leads_generated, 0) - 1, 0)
      WHERE id = OLD.campaign_id;
    END IF;
    
    -- Increment new campaign if campaign_id changed to non-null
    IF NEW.campaign_id IS NOT NULL AND (OLD.campaign_id IS NULL OR NEW.campaign_id != OLD.campaign_id) THEN
      UPDATE ad_campaigns
      SET leads_generated = COALESCE(leads_generated, 0) + 1
      WHERE id = NEW.campaign_id;
    END IF;
    
    RETURN NEW;
  END IF;

  -- Handle DELETE
  IF (TG_OP = 'DELETE') THEN
    IF OLD.campaign_id IS NOT NULL THEN
      UPDATE ad_campaigns
      SET leads_generated = GREATEST(COALESCE(leads_generated, 0) - 1, 0)
      WHERE id = OLD.campaign_id;
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on leads table
CREATE TRIGGER update_campaign_leads_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_campaign_leads_count();

-- Recalculate all campaign lead counts to ensure accuracy
UPDATE ad_campaigns
SET leads_generated = (
  SELECT COUNT(*)
  FROM leads
  WHERE leads.campaign_id = ad_campaigns.id
);

COMMENT ON FUNCTION update_campaign_leads_count() IS 'Automatically updates ad_campaigns.leads_generated count when leads are inserted, updated, or deleted';
COMMENT ON TRIGGER update_campaign_leads_count_trigger ON leads IS 'Keeps ad campaign lead counts in sync with leads table changes';