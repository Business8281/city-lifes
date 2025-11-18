-- Create user_reviews table for reviewing users/sellers
CREATE TABLE public.user_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewed_user_id uuid NOT NULL,
  reviewer_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_user_review UNIQUE (reviewed_user_id, reviewer_id)
);

-- Enable RLS
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_reviews
CREATE POLICY "Anyone can view user reviews"
  ON public.user_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for others"
  ON public.user_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id 
    AND auth.uid() != reviewed_user_id
  );

CREATE POLICY "Users can update their own reviews"
  ON public.user_reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.user_reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

-- Trigger to update updated_at
CREATE TRIGGER update_user_reviews_updated_at
  BEFORE UPDATE ON public.user_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_user_reviews_reviewed_user ON public.user_reviews(reviewed_user_id);
CREATE INDEX idx_user_reviews_reviewer ON public.user_reviews(reviewer_id);

-- Function to get user rating stats
CREATE OR REPLACE FUNCTION public.get_user_rating_stats(_user_id uuid)
RETURNS TABLE (
  average_rating numeric,
  total_reviews bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ROUND(AVG(rating)::numeric, 2) as average_rating,
    COUNT(*) as total_reviews
  FROM public.user_reviews
  WHERE reviewed_user_id = _user_id;
$$;