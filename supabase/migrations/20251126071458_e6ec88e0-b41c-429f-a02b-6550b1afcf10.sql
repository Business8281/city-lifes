-- Add REPLICA IDENTITY FULL to reviews table for complete row data in realtime
ALTER TABLE reviews REPLICA IDENTITY FULL;

-- Create or replace function to auto-create review interaction when viewing property details
CREATE OR REPLACE FUNCTION create_review_interaction_on_view()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create interaction if user is authenticated and not the owner
  IF auth.uid() IS NOT NULL AND auth.uid() != NEW.user_id THEN
    INSERT INTO review_interaction (
      reviewer_id,
      owner_id,
      listing_id,
      interaction_type
    )
    VALUES (
      auth.uid(),
      NEW.user_id,
      NEW.id,
      'view'
    )
    ON CONFLICT DO NOTHING; -- Prevent duplicates
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ensure lead creation also creates review interaction
CREATE OR REPLACE FUNCTION create_review_interaction_on_lead()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  property_owner_id UUID;
BEGIN
  -- Get the property owner
  SELECT user_id INTO property_owner_id
  FROM properties
  WHERE id = NEW.listing_id;
  
  -- Create review interaction if user is authenticated and not the owner
  IF NEW.user_id IS NOT NULL AND NEW.user_id != property_owner_id THEN
    INSERT INTO review_interaction (
      reviewer_id,
      owner_id,
      listing_id,
      interaction_type
    )
    VALUES (
      NEW.user_id,
      property_owner_id,
      NEW.listing_id,
      'lead'
    )
    ON CONFLICT DO NOTHING; -- Prevent duplicates
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on leads table
DROP TRIGGER IF EXISTS create_review_interaction_on_lead_trigger ON leads;
CREATE TRIGGER create_review_interaction_on_lead_trigger
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION create_review_interaction_on_lead();

-- Ensure message creation also creates review interaction
CREATE OR REPLACE FUNCTION create_review_interaction_on_message()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  property_owner_id UUID;
BEGIN
  -- If message has property_id, create interaction
  IF NEW.property_id IS NOT NULL THEN
    -- Get the property owner
    SELECT user_id INTO property_owner_id
    FROM properties
    WHERE id = NEW.property_id;
    
    -- Create review interaction if sender is not the owner
    IF NEW.sender_id != property_owner_id THEN
      INSERT INTO review_interaction (
        reviewer_id,
        owner_id,
        listing_id,
        interaction_type
      )
      VALUES (
        NEW.sender_id,
        property_owner_id,
        NEW.property_id,
        'message'
      )
      ON CONFLICT DO NOTHING; -- Prevent duplicates
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on messages table
DROP TRIGGER IF EXISTS create_review_interaction_on_message_trigger ON messages;
CREATE TRIGGER create_review_interaction_on_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION create_review_interaction_on_message();

-- Add unique constraint to prevent duplicate interactions (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'review_interaction_unique'
  ) THEN
    ALTER TABLE review_interaction
    ADD CONSTRAINT review_interaction_unique 
    UNIQUE (reviewer_id, owner_id, listing_id);
  END IF;
END $$;