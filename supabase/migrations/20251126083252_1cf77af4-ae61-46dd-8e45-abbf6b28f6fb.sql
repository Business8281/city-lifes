-- Ensure all report system enums have complete values
-- This migration safely adds missing enum values without breaking existing data

-- Check and update report_reason_type enum
DO $$ 
BEGIN
  -- Add missing enum values if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'fraud' AND enumtypid = 'report_reason_type'::regtype) THEN
    ALTER TYPE report_reason_type ADD VALUE IF NOT EXISTS 'fraud';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'cheating' AND enumtypid = 'report_reason_type'::regtype) THEN
    ALTER TYPE report_reason_type ADD VALUE IF NOT EXISTS 'cheating';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'misleading' AND enumtypid = 'report_reason_type'::regtype) THEN
    ALTER TYPE report_reason_type ADD VALUE IF NOT EXISTS 'misleading';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'inactive_owner' AND enumtypid = 'report_reason_type'::regtype) THEN
    ALTER TYPE report_reason_type ADD VALUE IF NOT EXISTS 'inactive_owner';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'spam' AND enumtypid = 'report_reason_type'::regtype) THEN
    ALTER TYPE report_reason_type ADD VALUE IF NOT EXISTS 'spam';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'abuse' AND enumtypid = 'report_reason_type'::regtype) THEN
    ALTER TYPE report_reason_type ADD VALUE IF NOT EXISTS 'abuse';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'other' AND enumtypid = 'report_reason_type'::regtype) THEN
    ALTER TYPE report_reason_type ADD VALUE IF NOT EXISTS 'other';
  END IF;
END $$;

-- Check and update report_status enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'new' AND enumtypid = 'report_status'::regtype) THEN
    ALTER TYPE report_status ADD VALUE IF NOT EXISTS 'new';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'in_review' AND enumtypid = 'report_status'::regtype) THEN
    ALTER TYPE report_status ADD VALUE IF NOT EXISTS 'in_review';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'action_taken' AND enumtypid = 'report_status'::regtype) THEN
    ALTER TYPE report_status ADD VALUE IF NOT EXISTS 'action_taken';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'dismissed' AND enumtypid = 'report_status'::regtype) THEN
    ALTER TYPE report_status ADD VALUE IF NOT EXISTS 'dismissed';
  END IF;
END $$;

-- Check and update admin_action_type enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'warning' AND enumtypid = 'admin_action_type'::regtype) THEN
    ALTER TYPE admin_action_type ADD VALUE IF NOT EXISTS 'warning';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'suspend_7d' AND enumtypid = 'admin_action_type'::regtype) THEN
    ALTER TYPE admin_action_type ADD VALUE IF NOT EXISTS 'suspend_7d';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'suspend_30d' AND enumtypid = 'admin_action_type'::regtype) THEN
    ALTER TYPE admin_action_type ADD VALUE IF NOT EXISTS 'suspend_30d';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'suspend_permanent' AND enumtypid = 'admin_action_type'::regtype) THEN
    ALTER TYPE admin_action_type ADD VALUE IF NOT EXISTS 'suspend_permanent';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'ban' AND enumtypid = 'admin_action_type'::regtype) THEN
    ALTER TYPE admin_action_type ADD VALUE IF NOT EXISTS 'ban';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'listing_removed' AND enumtypid = 'admin_action_type'::regtype) THEN
    ALTER TYPE admin_action_type ADD VALUE IF NOT EXISTS 'listing_removed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'dismissed' AND enumtypid = 'admin_action_type'::regtype) THEN
    ALTER TYPE admin_action_type ADD VALUE IF NOT EXISTS 'dismissed';
  END IF;
END $$;

-- Add default values if not set
ALTER TABLE reports ALTER COLUMN status SET DEFAULT 'new'::report_status;

-- Create indexes for faster filtering by reason_type and status
CREATE INDEX IF NOT EXISTS idx_reports_reason_type ON reports(reason_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Users can create reports" ON reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON reports;
DROP POLICY IF EXISTS "Admins can update reports" ON reports;

-- Users can create reports (authenticated users only)
CREATE POLICY "Users can create reports"
ON reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
ON reports FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports"
ON reports FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Admins can update reports (change status, add notes, etc.)
CREATE POLICY "Admins can update reports"
ON reports FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'moderator')
  )
);

-- Ensure RLS is enabled
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Add comment for documentation
COMMENT ON TABLE reports IS 'User safety reports system with all reason types: fraud, cheating, misleading, inactive_owner, spam, abuse, other';