-- Create enum for reason types
CREATE TYPE public.report_reason_type AS ENUM (
  'fraud',
  'cheating',
  'misleading',
  'inactive_owner',
  'spam',
  'abuse',
  'other'
);

-- Create enum for report status
CREATE TYPE public.report_status AS ENUM (
  'new',
  'in_review',
  'action_taken',
  'dismissed'
);

-- Create enum for admin action types
CREATE TYPE public.admin_action_type AS ENUM (
  'warning',
  'suspend_7d',
  'suspend_30d',
  'suspend_permanent',
  'ban',
  'listing_removed',
  'dismissed'
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL,
  listing_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  reason_type public.report_reason_type NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status public.report_status NOT NULL DEFAULT 'new',
  admin_action public.admin_action_type,
  admin_id UUID,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_actions table
CREATE TABLE public.user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  user_id UUID NOT NULL,
  action_type public.admin_action_type NOT NULL,
  action_reason TEXT NOT NULL,
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add suspension fields to profiles
ALTER TABLE public.profiles
ADD COLUMN suspended_until TIMESTAMPTZ,
ADD COLUMN is_banned BOOLEAN DEFAULT false,
ADD COLUMN safety_score INTEGER DEFAULT 100 CHECK (safety_score >= 0 AND safety_score <= 100);

-- Create indexes
CREATE INDEX idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX idx_reports_reported_user ON public.reports(reported_user_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_created ON public.reports(created_at DESC);
CREATE INDEX idx_user_actions_user ON public.user_actions(user_id);
CREATE INDEX idx_user_actions_admin ON public.user_actions(admin_id);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Management can view all reports"
  ON public.reports FOR SELECT
  USING (is_management_role(auth.uid()));

CREATE POLICY "Management can update reports"
  ON public.reports FOR UPDATE
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- RLS Policies for user_actions
CREATE POLICY "Only admins can view user actions"
  ON public.user_actions FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR is_management_role(auth.uid()));

CREATE POLICY "Only admins can create user actions"
  ON public.user_actions FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR is_management_role(auth.uid()));

-- Function to check reporting limits (prevent spam)
CREATE OR REPLACE FUNCTION check_report_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.reports
    WHERE reporter_id = NEW.reporter_id
      AND reported_user_id = NEW.reported_user_id
      AND created_at > NOW() - INTERVAL '48 hours'
  ) THEN
    RAISE EXCEPTION 'You can only report the same user once every 48 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_report_limit_trigger
  BEFORE INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION check_report_limit();

-- Function to update safety score
CREATE OR REPLACE FUNCTION update_safety_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'action_taken' THEN
    UPDATE public.profiles
    SET safety_score = GREATEST(0, safety_score - 
      CASE NEW.admin_action
        WHEN 'warning' THEN 5
        WHEN 'suspend_7d' THEN 10
        WHEN 'suspend_30d' THEN 20
        WHEN 'suspend_permanent' THEN 30
        WHEN 'ban' THEN 100
        WHEN 'listing_removed' THEN 15
        ELSE 0
      END
    )
    WHERE id = NEW.reported_user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_safety_score_trigger
  AFTER UPDATE ON public.reports
  FOR EACH ROW
  WHEN (NEW.status = 'action_taken' AND OLD.status != 'action_taken')
  EXECUTE FUNCTION update_safety_score();

-- Function to auto-flag users with multiple reports
CREATE OR REPLACE FUNCTION auto_flag_reported_users()
RETURNS TRIGGER AS $$
DECLARE
  fraud_count INTEGER;
  total_count INTEGER;
BEGIN
  -- Count fraud reports
  SELECT COUNT(*) INTO fraud_count
  FROM public.reports
  WHERE reported_user_id = NEW.reported_user_id
    AND reason_type = 'fraud'
    AND created_at > NOW() - INTERVAL '30 days';
  
  -- Count total reports
  SELECT COUNT(*) INTO total_count
  FROM public.reports
  WHERE reported_user_id = NEW.reported_user_id
    AND created_at > NOW() - INTERVAL '30 days';
  
  -- Auto-flag for priority review
  IF fraud_count >= 3 THEN
    UPDATE public.reports
    SET status = 'in_review'
    WHERE reported_user_id = NEW.reported_user_id
      AND status = 'new';
  END IF;
  
  -- Auto-suspend for review if 5+ reports
  IF total_count >= 5 THEN
    UPDATE public.profiles
    SET suspended_until = NOW() + INTERVAL '7 days'
    WHERE id = NEW.reported_user_id
      AND suspended_until IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER auto_flag_trigger
  AFTER INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION auto_flag_reported_users();

-- Function to handle admin actions
CREATE OR REPLACE FUNCTION apply_admin_action(
  p_report_id UUID,
  p_admin_id UUID,
  p_action_type admin_action_type,
  p_admin_notes TEXT
)
RETURNS VOID AS $$
DECLARE
  v_reported_user_id UUID;
  v_listing_id UUID;
BEGIN
  -- Get reported user and listing
  SELECT reported_user_id, listing_id
  INTO v_reported_user_id, v_listing_id
  FROM public.reports
  WHERE id = p_report_id;
  
  -- Update report
  UPDATE public.reports
  SET status = CASE 
      WHEN p_action_type = 'dismissed' THEN 'dismissed'
      ELSE 'action_taken'
    END,
    admin_action = p_action_type,
    admin_id = p_admin_id,
    admin_notes = p_admin_notes,
    updated_at = NOW()
  WHERE id = p_report_id;
  
  -- Create user action record
  INSERT INTO public.user_actions (admin_id, user_id, action_type, action_reason, report_id)
  VALUES (p_admin_id, v_reported_user_id, p_action_type, p_admin_notes, p_report_id);
  
  -- Apply action to user
  CASE p_action_type
    WHEN 'warning' THEN
      -- Warning recorded in user_actions table
      NULL;
    WHEN 'suspend_7d' THEN
      UPDATE public.profiles
      SET suspended_until = NOW() + INTERVAL '7 days'
      WHERE id = v_reported_user_id;
      
      UPDATE public.properties
      SET available = false, status = 'inactive'
      WHERE user_id = v_reported_user_id;
    WHEN 'suspend_30d' THEN
      UPDATE public.profiles
      SET suspended_until = NOW() + INTERVAL '30 days'
      WHERE id = v_reported_user_id;
      
      UPDATE public.properties
      SET available = false, status = 'inactive'
      WHERE user_id = v_reported_user_id;
    WHEN 'suspend_permanent' THEN
      UPDATE public.profiles
      SET suspended_until = NOW() + INTERVAL '100 years'
      WHERE id = v_reported_user_id;
      
      UPDATE public.properties
      SET available = false, status = 'inactive'
      WHERE user_id = v_reported_user_id;
    WHEN 'ban' THEN
      UPDATE public.profiles
      SET is_banned = true, suspended_until = NOW() + INTERVAL '100 years'
      WHERE id = v_reported_user_id;
      
      DELETE FROM public.properties WHERE user_id = v_reported_user_id;
    WHEN 'listing_removed' THEN
      IF v_listing_id IS NOT NULL THEN
        UPDATE public.properties
        SET available = false, status = 'inactive'
        WHERE id = v_listing_id;
      END IF;
    ELSE
      NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to get report statistics
CREATE OR REPLACE FUNCTION get_report_stats()
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'total_reports', (SELECT COUNT(*) FROM public.reports),
    'new_reports', (SELECT COUNT(*) FROM public.reports WHERE status = 'new'),
    'in_review', (SELECT COUNT(*) FROM public.reports WHERE status = 'in_review'),
    'action_taken', (SELECT COUNT(*) FROM public.reports WHERE status = 'action_taken'),
    'dismissed', (SELECT COUNT(*) FROM public.reports WHERE status = 'dismissed'),
    'fraud_reports', (SELECT COUNT(*) FROM public.reports WHERE reason_type = 'fraud'),
    'spam_reports', (SELECT COUNT(*) FROM public.reports WHERE reason_type = 'spam')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;