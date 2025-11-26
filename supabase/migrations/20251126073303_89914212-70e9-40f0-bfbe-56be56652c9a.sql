-- Fix review_interaction constraint to allow 'view' interaction type
ALTER TABLE review_interaction 
DROP CONSTRAINT IF EXISTS review_interaction_interaction_type_check;

-- Add updated constraint that includes 'view'
ALTER TABLE review_interaction 
ADD CONSTRAINT review_interaction_interaction_type_check 
CHECK (interaction_type IN ('lead', 'chat', 'message', 'booking', 'view'));

-- Also ensure RLS allows authenticated users to insert interactions
DROP POLICY IF EXISTS "System can insert interactions" ON review_interaction;
CREATE POLICY "Users can create interactions" ON review_interaction
  FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());