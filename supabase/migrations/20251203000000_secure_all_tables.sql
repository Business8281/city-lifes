-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_interaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pincodes ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Leads Policies
CREATE POLICY "Users can view leads they own or submitted"
ON public.leads FOR SELECT
USING (auth.uid() = owner_id OR auth.uid() = user_id);

CREATE POLICY "Users can insert leads"
ON public.leads FOR INSERT
WITH CHECK (true); -- Allow anyone to create leads (e.g. contact form)

CREATE POLICY "Owners can update their leads"
ON public.leads FOR UPDATE
USING (auth.uid() = owner_id);

-- Messages Policies
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
ON public.messages FOR UPDATE
USING (auth.uid() = sender_id);

-- Favorites Policies
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Users can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = reviewer_id);

-- CRM Policies
CREATE POLICY "Users can view their own CRM clients"
ON public.crm_clients FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own CRM clients"
ON public.crm_clients FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own CRM clients"
ON public.crm_clients FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own CRM clients"
ON public.crm_clients FOR DELETE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can view their own CRM tasks"
ON public.crm_tasks FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own CRM tasks"
ON public.crm_tasks FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own CRM tasks"
ON public.crm_tasks FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own CRM tasks"
ON public.crm_tasks FOR DELETE
USING (auth.uid() = owner_id);

-- Ad Campaigns Policies
CREATE POLICY "Users can view their own campaigns"
ON public.ad_campaigns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaigns"
ON public.ad_campaigns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
ON public.ad_campaigns FOR UPDATE
USING (auth.uid() = user_id);

-- Public Data Policies (Cities, Areas, Pincodes)
CREATE POLICY "Public data is viewable by everyone"
ON public.cities FOR SELECT USING (true);

CREATE POLICY "Public data is viewable by everyone areas"
ON public.areas FOR SELECT USING (true);

CREATE POLICY "Public data is viewable by everyone pincodes"
ON public.pincodes FOR SELECT USING (true);

-- Support Tickets Policies
CREATE POLICY "Users can view their own support tickets"
ON public.support_tickets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own support tickets"
ON public.support_tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Reports Policies
CREATE POLICY "Users can insert reports"
ON public.reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT
USING (auth.uid() = reporter_id);

-- Lead Activity Policies
CREATE POLICY "Owners can view lead activity"
ON public.lead_activity FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.leads
  WHERE leads.id = lead_activity.lead_id
  AND leads.owner_id = auth.uid()
));

CREATE POLICY "Owners can insert lead activity"
ON public.lead_activity FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.leads
  WHERE leads.id = lead_activity.lead_id
  AND leads.owner_id = auth.uid()
));

-- Review Interaction Policies
CREATE POLICY "Users can view their own review interactions"
ON public.review_interaction FOR SELECT
USING (auth.uid() = reviewer_id OR auth.uid() = owner_id);

CREATE POLICY "System can insert review interactions"
ON public.review_interaction FOR INSERT
WITH CHECK (true); -- Usually inserted by system triggers/functions, but allow authenticated users to trigger it if needed
