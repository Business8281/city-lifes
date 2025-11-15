-- Add business_metadata column to properties table for storing detailed business information
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS business_metadata JSONB DEFAULT NULL;

-- Add comment to the column
COMMENT ON COLUMN properties.business_metadata IS 'Stores detailed business information including category, operating hours, social media, etc.';

-- Create index for better performance when querying business metadata
CREATE INDEX IF NOT EXISTS idx_properties_business_metadata ON properties USING GIN (business_metadata);

-- Create index for business properties specifically
CREATE INDEX IF NOT EXISTS idx_properties_business_type ON properties (property_type) WHERE property_type = 'business';