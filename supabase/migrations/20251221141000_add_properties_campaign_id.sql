-- Add campaign_id to properties table to support Paid vs Organic lead differentiation
-- This matches the frontend expectation in PropertyDetails.tsx and database.ts types

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'campaign_id') THEN
    ALTER TABLE public.properties
    ADD COLUMN campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE SET NULL;
    
    -- Add index for performance
    CREATE INDEX idx_properties_campaign_id ON public.properties(campaign_id);
  END IF;
END $$;
