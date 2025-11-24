-- Fix remaining Performance Advisor warnings for all other tables

-- Drop and recreate RLS policies for properties table
drop policy if exists "Users can insert their own properties" on public.properties;
drop policy if exists "Users can update their own properties" on public.properties;
drop policy if exists "Anyone can view available properties" on public.properties;
drop policy if exists "Allow owners to delete their properties" on public.properties;

create policy "Users can insert their own properties"
on public.properties
for insert
with check (public.is_owner(public.get_current_user_id(), user_id));

create policy "Users can update their own properties"
on public.properties
for update
using (public.is_owner(public.get_current_user_id(), user_id))
with check (public.is_owner(public.get_current_user_id(), user_id));

create policy "Anyone can view available properties"
on public.properties
for select
using (
  (status = 'active' AND available = true) 
  OR public.is_owner(public.get_current_user_id(), user_id) 
  OR public.has_role(public.get_current_user_id(), 'admin'::app_role)
);

create policy "Allow owners to delete their properties"
on public.properties
for delete
using (public.is_owner(public.get_current_user_id(), user_id) OR public.has_role(public.get_current_user_id(), 'admin'::app_role));

-- Drop and recreate RLS policies for ad_campaigns table
drop policy if exists "Users can insert own campaigns" on public.ad_campaigns;
drop policy if exists "Users can update own campaigns" on public.ad_campaigns;
drop policy if exists "Users can view their own campaigns" on public.ad_campaigns;
drop policy if exists "Allow owners to delete their campaigns" on public.ad_campaigns;

create policy "Users can insert own campaigns"
on public.ad_campaigns
for insert
with check (public.is_owner(public.get_current_user_id(), user_id));

create policy "Users can update own campaigns"
on public.ad_campaigns
for update
using (public.is_owner(public.get_current_user_id(), user_id))
with check (public.is_owner(public.get_current_user_id(), user_id));

create policy "Users can view their own campaigns"
on public.ad_campaigns
for select
using (public.is_owner(public.get_current_user_id(), user_id));

create policy "Allow owners to delete their campaigns"
on public.ad_campaigns
for delete
using (public.is_owner(public.get_current_user_id(), user_id) OR public.has_role(public.get_current_user_id(), 'admin'::app_role));

-- Drop and recreate RLS policies for leads table
drop policy if exists "Owners can view their leads" on public.leads;
drop policy if exists "Owners can update their leads" on public.leads;
drop policy if exists "Owners can delete their leads" on public.leads;
drop policy if exists "Campaign owners can view their campaign leads" on public.leads;

create policy "Owners can view their leads"
on public.leads
for select
using (public.is_owner(public.get_current_user_id(), owner_id));

create policy "Owners can update their leads"
on public.leads
for update
using (public.is_owner(public.get_current_user_id(), owner_id));

create policy "Owners can delete their leads"
on public.leads
for delete
using (public.is_owner(public.get_current_user_id(), owner_id));

create policy "Campaign owners can view their campaign leads"
on public.leads
for select
using (EXISTS (
  SELECT 1 FROM ad_campaigns
  WHERE ad_campaigns.id = leads.campaign_id
  AND public.is_owner(public.get_current_user_id(), ad_campaigns.user_id)
));

-- Drop and recreate RLS policies for crm_clients table
drop policy if exists "Owners can manage their clients" on public.crm_clients;

create policy "Owners can manage their clients"
on public.crm_clients
for all
using (public.is_owner(public.get_current_user_id(), owner_id));

-- Drop and recreate RLS policies for crm_tasks table
drop policy if exists "Owners can manage their tasks" on public.crm_tasks;

create policy "Owners can manage their tasks"
on public.crm_tasks
for all
using (public.is_owner(public.get_current_user_id(), owner_id));

-- Drop and recreate RLS policies for contact_reveals table
drop policy if exists "Users can create contact reveals" on public.contact_reveals;
drop policy if exists "Users can view their own contact reveals" on public.contact_reveals;

create policy "Users can create contact reveals"
on public.contact_reveals
for insert
with check (public.is_owner(public.get_current_user_id(), revealed_to));

create policy "Users can view their own contact reveals"
on public.contact_reveals
for select
using (public.is_owner(public.get_current_user_id(), revealed_to));

-- Drop and recreate RLS policies for reports table
drop policy if exists "Users can create reports" on public.reports;
drop policy if exists "Users can view their own reports" on public.reports;

create policy "Users can create reports"
on public.reports
for insert
with check (public.is_owner(public.get_current_user_id(), reporter_id));

create policy "Users can view their own reports"
on public.reports
for select
using (public.is_owner(public.get_current_user_id(), reporter_id));

-- Drop and recreate RLS policies for reviews table
drop policy if exists "Users can create reviews if they have interaction" on public.reviews;
drop policy if exists "Users can update their own reviews" on public.reviews;
drop policy if exists "Users can delete their own reviews" on public.reviews;

create policy "Users can create reviews if they have interaction"
on public.reviews
for insert
with check (
  public.is_owner(public.get_current_user_id(), reviewer_id)
  AND EXISTS (
    SELECT 1 FROM review_interaction
    WHERE review_interaction.reviewer_id = public.get_current_user_id()
    AND review_interaction.owner_id = reviews.owner_id
  )
);

create policy "Users can update their own reviews"
on public.reviews
for update
using (public.is_owner(public.get_current_user_id(), reviewer_id))
with check (public.is_owner(public.get_current_user_id(), reviewer_id));

create policy "Users can delete their own reviews"
on public.reviews
for delete
using (public.is_owner(public.get_current_user_id(), reviewer_id));

-- Drop and recreate RLS policies for review_interaction table
drop policy if exists "Users can view their own interactions" on public.review_interaction;

create policy "Users can view their own interactions"
on public.review_interaction
for select
using (public.is_owner(public.get_current_user_id(), reviewer_id) OR public.is_owner(public.get_current_user_id(), owner_id));

-- Drop and recreate RLS policies for user_roles table
drop policy if exists "Users can view own roles" on public.user_roles;

create policy "Users can view own roles"
on public.user_roles
for select
using (public.is_owner(public.get_current_user_id(), user_id));

-- Drop and recreate RLS policies for rate_limits table
drop policy if exists "Users can view own rate limits" on public.rate_limits;
drop policy if exists "Users can view their own rate limits" on public.rate_limits;

create policy "Users can view own rate limits"
on public.rate_limits
for select
using (public.is_owner(public.get_current_user_id(), user_id));

-- Drop and recreate RLS policies for typing_indicators table
drop policy if exists "Users can update their own typing status" on public.typing_indicators;
drop policy if exists "Users can view typing status in their conversations" on public.typing_indicators;

create policy "Users can update their own typing status"
on public.typing_indicators
for all
using (public.is_owner(public.get_current_user_id(), sender_id));

create policy "Users can view typing status in their conversations"
on public.typing_indicators
for select
using (public.is_owner(public.get_current_user_id(), receiver_id) OR public.is_owner(public.get_current_user_id(), sender_id));

-- Drop and recreate RLS policies for fcm_tokens table
drop policy if exists "Users can manage their own tokens" on public.fcm_tokens;

create policy "Users can manage their own tokens"
on public.fcm_tokens
for all
using (public.is_owner(public.get_current_user_id(), user_id));

-- Drop and recreate RLS policies for support_tickets table
drop policy if exists "support_tickets_owners_all" on public.support_tickets;

create policy "support_tickets_owners_all"
on public.support_tickets
for all
using (public.is_owner(public.get_current_user_id(), user_id))
with check (public.is_owner(public.get_current_user_id(), user_id));

-- Drop and recreate RLS policies for lead_activity table
drop policy if exists "Owners can create lead activity" on public.lead_activity;
drop policy if exists "Owners can view lead activity" on public.lead_activity;

create policy "Owners can create lead activity"
on public.lead_activity
for insert
with check (EXISTS (
  SELECT 1 FROM leads
  WHERE leads.id = lead_activity.lead_id
  AND public.is_owner(public.get_current_user_id(), leads.owner_id)
));

create policy "Owners can view lead activity"
on public.lead_activity
for select
using (EXISTS (
  SELECT 1 FROM leads
  WHERE leads.id = lead_activity.lead_id
  AND public.is_owner(public.get_current_user_id(), leads.owner_id)
));