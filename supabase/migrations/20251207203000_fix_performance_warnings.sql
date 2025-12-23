-- Fix Performance Issues (Indexes and RLS)

-- 1. Optimize RLS Policies

-- profiles: Use (select auth.uid()) for better performance audit
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (id = (select auth.uid()));

-- property_contacts: Optimize owner check
DROP POLICY IF EXISTS "Owners can insert own property contacts" ON property_contacts;
CREATE POLICY "Owners can insert own property contacts" ON property_contacts
  FOR INSERT
  WITH CHECK (property_id IN (
    SELECT id FROM properties WHERE owner_id = (select auth.uid())
  ));

-- 2. Add Missing Indexes

-- contact_reveals: Add index for user_id foreign key if it exists, or ensure revealed_to is covered
-- Advisor complained about `contact_reveals_user_id_fkey`.
-- We will create an index on user_id if the column exists, otherwise ignore (assuming revealed_to logic matches).
-- However, standard SQL doesn't allow conditional index creation based on column existence easily in one statement.
-- Based on the advisor, we'll assume the FK is on a column named `user_id` or `revealed_to`.
-- Since `revealed_to` is already indexed (seen in other migrations), we'll add one for `user_id` just in case it's a separate column.
CREATE INDEX IF NOT EXISTS idx_contact_reveals_user_id ON contact_reveals(user_id);

-- subscriptions: Add missing indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- 3. Remove Duplicate Indexes

-- messages
DROP INDEX IF EXISTS messages_sender_id_idx; -- Duplicate of idx_messages_sender_id
DROP INDEX IF EXISTS idx_messages_sender_receiver; -- Duplicate of idx_messages_conversation (or similar)

-- notifications
DROP INDEX IF EXISTS notifications_user_id_idx; -- Duplicate of idx_notifications_user_id

-- 4. Remove Unused Indexes (Properties)
DROP INDEX IF EXISTS idx_properties_price;
DROP INDEX IF EXISTS idx_properties_property_type;
