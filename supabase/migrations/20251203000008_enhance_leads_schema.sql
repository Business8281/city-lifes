-- Add missing columns to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_type text DEFAULT 'organic' CHECK (lead_type IN ('organic', 'paid'));
ALTER TABLE leads ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS campaign_id text; -- Using text for flexibility if campaigns table doesn't exist yet
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_page text;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON leads(lead_type);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
