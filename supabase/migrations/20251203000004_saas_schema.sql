-- SaaS Schema Migration

-- 1. Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_monthly NUMERIC NOT NULL,
  price_yearly NUMERIC NOT NULL,
  listing_limit INTEGER NOT NULL,
  boost_limit INTEGER NOT NULL,
  priority_lead_access BOOLEAN DEFAULT false,
  analytics_level TEXT CHECK (analytics_level IN ('basic', 'pro', 'business')) DEFAULT 'basic',
  team_member_limit INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Plans are viewable by everyone
CREATE POLICY "Plans are viewable by everyone" ON public.plans
  FOR SELECT USING (true);

-- Only admins can modify plans (assuming admin role or service role)
-- For now, we'll restrict modification to service role only via dashboard/SQL

-- Insert default plans
INSERT INTO public.plans (name, price_monthly, price_yearly, listing_limit, boost_limit, priority_lead_access, analytics_level, team_member_limit, features)
VALUES
  ('Basic', 499, 4990, 10, 0, false, 'basic', 0, '["10 listings", "Standard leads", "CRM access", "Basic analytics"]'),
  ('Pro', 999, 9990, -1, 1, true, 'pro', 0, '["Unlimited listings", "Priority leads", "1 Boost/month", "Verified badge", "Enhanced analytics"]'),
  ('Business', 2999, 29990, -1, -1, true, 'business', 5, '["Team accounts", "Bulk uploads", "Business dashboard", "Unlimited boosts", "Branding"]');
  -- Note: -1 for unlimited

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  plan_id UUID REFERENCES public.plans(id) NOT NULL,
  razorpay_subscription_id TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'canceled', 'expired', 'past_due')) DEFAULT 'active',
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- 3. Usage Table (Tracking limits per cycle)
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  listings_count INTEGER DEFAULT 0,
  boosts_used INTEGER DEFAULT 0,
  cycle_start TIMESTAMPTZ DEFAULT now(),
  cycle_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for usage
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view own usage" ON public.usage
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Teams Table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Owners can view/manage their teams
CREATE POLICY "Owners can manage their teams" ON public.teams
  FOR ALL USING (auth.uid() = owner_id);

-- 5. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id), -- Can be null if invited but not yet registered
  email TEXT NOT NULL, -- For invitations
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  status TEXT CHECK (status IN ('active', 'invited')) DEFAULT 'invited',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team owners can manage members
CREATE POLICY "Team owners can manage members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.owner_id = auth.uid()
    )
  );

-- Members can view their own membership
CREATE POLICY "Members can view own membership" ON public.team_members
  FOR SELECT USING (
    auth.uid() = user_id OR 
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 6. Update Properties Table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS boosted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS promoted_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS owner_plan_status TEXT DEFAULT 'free';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_user_id ON public.usage(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON public.team_members(email);
