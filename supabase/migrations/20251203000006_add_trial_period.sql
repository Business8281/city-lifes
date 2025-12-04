-- Add trial_end to subscriptions
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS trial_end timestamptz;

-- Update status check to include 'trialing' if needed, or just rely on trial_end
-- For now, we'll keep status as is and use trial_end to determine access
