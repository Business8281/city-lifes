-- Fix the defective constraint
-- `array_length` returns NULL for empty arrays, which passes CHECK constraints
-- `cardinality` returns 0 for empty arrays, which correctly fails the check

DO $$ 
BEGIN
  -- Remove the ineffective constraint
  ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS check_active_properties_images;

  -- Add the correct constraint
  ALTER TABLE public.properties
  ADD CONSTRAINT check_active_properties_images
  CHECK (
    status != 'active' OR 
    (images IS NOT NULL AND cardinality(images) > 0)
  );
END $$;
