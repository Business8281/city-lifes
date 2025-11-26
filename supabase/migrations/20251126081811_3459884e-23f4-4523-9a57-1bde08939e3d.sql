-- Add review_type column to distinguish business listing reviews from user profile reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_type text NOT NULL DEFAULT 'profile';

-- Add check constraint to ensure valid review types
ALTER TABLE reviews ADD CONSTRAINT review_type_check 
  CHECK (review_type IN ('business', 'profile'));

-- Make listing_id nullable to support user profile reviews
ALTER TABLE reviews ALTER COLUMN listing_id DROP NOT NULL;

-- Create index for efficient filtering by review_type
CREATE INDEX IF NOT EXISTS idx_reviews_review_type ON reviews(review_type);

-- Create index for business reviews (listing-based queries)
CREATE INDEX IF NOT EXISTS idx_reviews_business_listing ON reviews(listing_id, review_type) WHERE review_type = 'business';

-- Create index for profile reviews (owner-based queries)
CREATE INDEX IF NOT EXISTS idx_reviews_profile_owner ON reviews(owner_id, review_type) WHERE review_type = 'profile';

-- Update existing reviews: Set review_type based on listing property_type
UPDATE reviews r
SET review_type = CASE 
  WHEN EXISTS (
    SELECT 1 FROM properties p 
    WHERE p.id = r.listing_id 
    AND p.property_type = 'business'
  ) THEN 'business'
  ELSE 'profile'
END
WHERE review_type = 'profile'; -- only update if still default

-- Add comment for documentation
COMMENT ON COLUMN reviews.review_type IS 'Type of review: business (for business listings) or profile (for user profiles)';
COMMENT ON COLUMN reviews.listing_id IS 'Required for business reviews, optional for profile reviews';