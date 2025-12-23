-- Grant full access to admins for all tables

-- Function to check generic admin access (re-verified)
-- Assumes is_management_role(auth.uid()) is already defined and working

-- List of tables to secure
-- profiles, properties, leads, user_roles, inquiries, contact_reveals, reports, 
-- audit_logs, ad_campaigns, reviews, support_tickets, user_actions, notifications, favorites

-- PROFILES
DROP POLICY IF EXISTS "Admins have full control of profiles" ON profiles;
CREATE POLICY "Admins have full control of profiles" ON profiles
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- PROPERTIES
DROP POLICY IF EXISTS "Admins have full control of properties" ON properties;
CREATE POLICY "Admins have full control of properties" ON properties
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- LEADS
DROP POLICY IF EXISTS "Admins have full control of leads" ON leads;
CREATE POLICY "Admins have full control of leads" ON leads
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- USER_ROLES
DROP POLICY IF EXISTS "Admins have full control of user_roles" ON user_roles;
CREATE POLICY "Admins have full control of user_roles" ON user_roles
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- INQUIRIES
DROP POLICY IF EXISTS "Admins have full control of inquiries" ON inquiries;
CREATE POLICY "Admins have full control of inquiries" ON inquiries
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- CONTACT_REVEALS
DROP POLICY IF EXISTS "Admins have full control of contact_reveals" ON contact_reveals;
CREATE POLICY "Admins have full control of contact_reveals" ON contact_reveals
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- REPORTS
DROP POLICY IF EXISTS "Admins have full control of reports" ON reports;
CREATE POLICY "Admins have full control of reports" ON reports
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- AUDIT_LOGS
DROP POLICY IF EXISTS "Admins have full control of audit_logs" ON audit_logs;
CREATE POLICY "Admins have full control of audit_logs" ON audit_logs
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- AD_CAMPAIGNS
DROP POLICY IF EXISTS "Admins have full control of ad_campaigns" ON ad_campaigns;
CREATE POLICY "Admins have full control of ad_campaigns" ON ad_campaigns
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- REVIEWS
DROP POLICY IF EXISTS "Admins have full control of reviews" ON reviews;
CREATE POLICY "Admins have full control of reviews" ON reviews
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- SUPPORT_TICKETS
DROP POLICY IF EXISTS "Admins have full control of support_tickets" ON support_tickets;
CREATE POLICY "Admins have full control of support_tickets" ON support_tickets
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- SUPPORT_TICKET_ATTACHMENTS
DROP POLICY IF EXISTS "Admins have full control of support_ticket_attachments" ON support_ticket_attachments;
CREATE POLICY "Admins have full control of support_ticket_attachments" ON support_ticket_attachments
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- USER_ACTIONS
DROP POLICY IF EXISTS "Admins have full control of user_actions" ON user_actions;
CREATE POLICY "Admins have full control of user_actions" ON user_actions
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Admins have full control of notifications" ON notifications;
CREATE POLICY "Admins have full control of notifications" ON notifications
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));

-- FAVORITES
DROP POLICY IF EXISTS "Admins have full control of favorites" ON favorites;
CREATE POLICY "Admins have full control of favorites" ON favorites
  FOR ALL
  USING (is_management_role(auth.uid()))
  WITH CHECK (is_management_role(auth.uid()));
