-- Update leads table with new attribution fields
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lead_type text DEFAULT 'organic' CHECK (lead_type IN ('organic', 'paid')),
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS subcategory text,
ADD COLUMN IF NOT EXISTS source_page text DEFAULT 'listing_page' CHECK (source_page IN ('listing_page', 'category_page', 'internal_ad')),
ADD COLUMN IF NOT EXISTS campaign_id uuid REFERENCES ad_campaigns(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_leads_owner_status ON leads(owner_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Update ad_campaigns table with lead tracking
ALTER TABLE ad_campaigns
ADD COLUMN IF NOT EXISTS leads_generated integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS subcategory text;

-- Create index for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON ad_campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON ad_campaigns(status);

-- Function to auto-increment leads_generated when a paid lead is created
CREATE OR REPLACE FUNCTION increment_campaign_leads()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lead_type = 'paid' AND NEW.campaign_id IS NOT NULL THEN
    UPDATE ad_campaigns
    SET leads_generated = leads_generated + 1
    WHERE id = NEW.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-incrementing leads
DROP TRIGGER IF EXISTS trigger_increment_campaign_leads ON leads;
CREATE TRIGGER trigger_increment_campaign_leads
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION increment_campaign_leads();

-- Function to auto-create CRM client when lead becomes interested
CREATE OR REPLACE FUNCTION auto_create_crm_client()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create CRM client if status changed to 'interested' and client doesn't exist
  IF NEW.status = 'interested' AND OLD.status != 'interested' THEN
    INSERT INTO crm_clients (owner_id, lead_id, name, phone, email, stage, created_at)
    VALUES (NEW.owner_id, NEW.id, NEW.name, NEW.phone, NEW.email, 'contacted', now())
    ON CONFLICT (lead_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-creating CRM clients
DROP TRIGGER IF EXISTS trigger_auto_create_crm_client ON leads;
CREATE TRIGGER trigger_auto_create_crm_client
AFTER UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION auto_create_crm_client();

-- Drop existing policy if it exists, then create new one
DO $$
BEGIN
  DROP POLICY IF EXISTS "Campaign owners can view their campaign leads" ON leads;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add policy for paid campaign attribution
CREATE POLICY "Campaign owners can view their campaign leads"
ON leads FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM ad_campaigns
    WHERE ad_campaigns.id = leads.campaign_id
    AND ad_campaigns.user_id = auth.uid()
  )
);

-- Function to get campaign analytics
CREATE OR REPLACE FUNCTION get_campaign_analytics(p_campaign_id uuid)
RETURNS TABLE (
  total_leads bigint,
  organic_leads bigint,
  paid_leads bigint,
  conversion_rate numeric,
  cpl numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint as total_leads,
    COUNT(*) FILTER (WHERE lead_type = 'organic')::bigint as organic_leads,
    COUNT(*) FILTER (WHERE lead_type = 'paid')::bigint as paid_leads,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(*) FILTER (WHERE status IN ('interested', 'closed'))::numeric / COUNT(*)::numeric * 100)
      ELSE 0
    END as conversion_rate,
    CASE
      WHEN COUNT(*) FILTER (WHERE lead_type = 'paid') > 0 THEN
        (SELECT spent FROM ad_campaigns WHERE id = p_campaign_id) / COUNT(*) FILTER (WHERE lead_type = 'paid')::numeric
      ELSE 0
    END as cpl
  FROM leads
  WHERE campaign_id = p_campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_campaign_analytics(uuid) TO authenticated;