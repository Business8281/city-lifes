-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.user_reviews CASCADE;
DROP TABLE IF EXISTS public.review_interaction CASCADE;

-- Create reviews table with proper schema
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  listing_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reviewer_id, owner_id)
);

-- Create review_interaction table for verification
CREATE TABLE public.review_interaction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  listing_id UUID NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('lead', 'chat', 'booking', 'message')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(reviewer_id, owner_id, interaction_type)
);

-- Create indexes
CREATE INDEX idx_reviews_owner ON public.reviews(owner_id);
CREATE INDEX idx_reviews_listing ON public.reviews(listing_id);
CREATE INDEX idx_reviews_verified ON public.reviews(verified);
CREATE INDEX idx_review_interaction_reviewer_owner ON public.review_interaction(reviewer_id, owner_id);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_interaction ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews if they have interaction"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id 
    AND EXISTS (
      SELECT 1 FROM public.review_interaction
      WHERE reviewer_id = auth.uid() AND owner_id = reviews.owner_id
    )
  );

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Admins can manage all reviews"
  ON public.reviews FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- RLS Policies for review_interaction
CREATE POLICY "Users can view their own interactions"
  ON public.review_interaction FOR SELECT
  USING (auth.uid() = reviewer_id OR auth.uid() = owner_id);

CREATE POLICY "System can insert interactions"
  ON public.review_interaction FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all interactions"
  ON public.review_interaction FOR SELECT
  USING (is_management_role(auth.uid()));

-- Function to auto-verify review on creation
CREATE OR REPLACE FUNCTION auto_verify_review()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.review_interaction
    WHERE reviewer_id = NEW.reviewer_id AND owner_id = NEW.owner_id
  ) THEN
    NEW.verified := true;
  ELSE
    NEW.verified := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER verify_review_on_insert
  BEFORE INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION auto_verify_review();

-- Function to update review timestamp
CREATE OR REPLACE FUNCTION update_review_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_timestamp_trigger
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_review_timestamp();

-- Function to get owner average rating
CREATE OR REPLACE FUNCTION get_owner_rating_stats(owner_user_id UUID)
RETURNS TABLE(
  average_rating NUMERIC,
  total_reviews BIGINT,
  verified_reviews BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ROUND(AVG(rating)::numeric, 2), 0) as average_rating,
    COUNT(*) as total_reviews,
    COUNT(*) FILTER (WHERE verified = true) as verified_reviews
  FROM public.reviews
  WHERE owner_id = owner_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create interaction when lead is created
CREATE OR REPLACE FUNCTION create_review_interaction_from_lead()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.review_interaction (reviewer_id, owner_id, listing_id, interaction_type)
  VALUES (NEW.user_id, NEW.owner_id, NEW.listing_id, 'lead')
  ON CONFLICT (reviewer_id, owner_id, interaction_type) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create interaction when message is sent
CREATE OR REPLACE FUNCTION create_review_interaction_from_message()
RETURNS TRIGGER AS $$
DECLARE
  property_owner_id UUID;
BEGIN
  IF NEW.property_id IS NOT NULL THEN
    SELECT user_id INTO property_owner_id
    FROM public.properties
    WHERE id = NEW.property_id;
    
    IF property_owner_id IS NOT NULL AND property_owner_id != NEW.sender_id THEN
      INSERT INTO public.review_interaction (reviewer_id, owner_id, listing_id, interaction_type)
      VALUES (NEW.sender_id, property_owner_id, NEW.property_id, 'message')
      ON CONFLICT (reviewer_id, owner_id, interaction_type) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER create_interaction_on_lead
  AFTER INSERT ON public.leads
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL AND NEW.listing_id IS NOT NULL)
  EXECUTE FUNCTION create_review_interaction_from_lead();

CREATE TRIGGER create_interaction_on_message
  AFTER INSERT ON public.messages
  FOR EACH ROW
  WHEN (NEW.property_id IS NOT NULL)
  EXECUTE FUNCTION create_review_interaction_from_message();

-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_interaction;