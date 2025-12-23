-- Migration to enforce mandatory images for active properties
-- This ensures that zero-error UX is backed by zero-error data integrity

-- First, ensure existing data complies with the new constraint
-- Set any active properties with no images to 'inactive' to prevent migration failure
UPDATE public.properties
SET status = 'inactive'
WHERE status = 'active'
AND (images IS NULL OR array_length(images, 1) IS NULL OR array_length(images, 1) = 0);

DO $$ 
BEGIN
  -- Add constraint if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_table_usage WHERE constraint_name = 'check_active_properties_images') THEN
    ALTER TABLE public.properties
    ADD CONSTRAINT check_active_properties_images
    CHECK (
      status != 'active' OR 
      (images IS NOT NULL AND array_length(images, 1) > 0)
    );
  END IF;
END $$;
