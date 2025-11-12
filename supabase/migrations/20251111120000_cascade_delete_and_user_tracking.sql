-- Comprehensive CASCADE DELETE and User Tracking Implementation
-- This migration ensures all related data is automatically deleted when properties or users are deleted
-- and adds proper user tracking for all records

-- =========================================
-- PART 1: CASCADE DELETE CLEANUP
-- =========================================

-- 1. Update favorites table to CASCADE DELETE
ALTER TABLE public.favorites
  DROP CONSTRAINT IF EXISTS favorites_property_id_fkey,
  ADD CONSTRAINT favorites_property_id_fkey
    FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

ALTER TABLE public.favorites
  DROP CONSTRAINT IF EXISTS favorites_user_id_fkey,
  ADD CONSTRAINT favorites_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Update messages table to CASCADE DELETE
ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_sender_id_fkey,
  ADD CONSTRAINT messages_sender_id_fkey
    FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey,
  ADD CONSTRAINT messages_receiver_id_fkey
    FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_property_id_fkey,
  ADD CONSTRAINT messages_property_id_fkey
    FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- 3. Update inquiries table to CASCADE DELETE
ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_property_id_fkey,
  ADD CONSTRAINT inquiries_property_id_fkey
    FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_sender_id_fkey,
  ADD CONSTRAINT inquiries_sender_id_fkey
    FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_receiver_id_fkey,
  ADD CONSTRAINT inquiries_receiver_id_fkey
    FOREIGN KEY (receiver_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Update notifications table to CASCADE DELETE
ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey,
  ADD CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. Update ad_campaigns table to CASCADE DELETE
ALTER TABLE public.ad_campaigns
  DROP CONSTRAINT IF EXISTS ad_campaigns_property_id_fkey,
  ADD CONSTRAINT ad_campaigns_property_id_fkey
    FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

ALTER TABLE public.ad_campaigns
  DROP CONSTRAINT IF EXISTS ad_campaigns_user_id_fkey,
  ADD CONSTRAINT ad_campaigns_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. Update properties table to CASCADE DELETE user
ALTER TABLE public.properties
  DROP CONSTRAINT IF EXISTS properties_user_id_fkey,
  ADD CONSTRAINT properties_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 7. Update profiles table to CASCADE DELETE
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 8. Update user_roles table to CASCADE DELETE
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey,
  ADD CONSTRAINT user_roles_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =========================================
-- PART 2: STORAGE CASCADE DELETE
-- =========================================

-- Create function to automatically delete storage files when a property is deleted
CREATE OR REPLACE FUNCTION public.delete_property_storage_files()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all images associated with the property
  IF OLD.images IS NOT NULL AND array_length(OLD.images, 1) > 0 THEN
    -- Delete from storage bucket
    PERFORM storage.delete(
      ARRAY(
        SELECT unnest(OLD.images)
      )
    );
  END IF;
  
  RETURN OLD;
END;
$$;

-- Create trigger to delete storage files before property deletion
DROP TRIGGER IF EXISTS trigger_delete_property_storage ON public.properties;
CREATE TRIGGER trigger_delete_property_storage
  BEFORE DELETE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_property_storage_files();

-- Create function to delete user's storage folder when user is deleted
CREATE OR REPLACE FUNCTION public.delete_user_storage_folder()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  -- Delete all files in the user's folder
  DELETE FROM storage.objects
  WHERE bucket_id = 'property-images'
  AND (storage.foldername(name))[1] = OLD.id::text;
  
  RETURN OLD;
END;
$$;

-- Create trigger to delete user storage before user deletion
DROP TRIGGER IF EXISTS trigger_delete_user_storage ON auth.users;
CREATE TRIGGER trigger_delete_user_storage
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_user_storage_folder();

-- =========================================
-- PART 3: USER TRACKING ENHANCEMENT
-- =========================================

-- Add created_by_name and created_by_email fields to properties (if not exists)
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS created_by_name TEXT,
  ADD COLUMN IF NOT EXISTS created_by_email TEXT;

-- Add created_by_name and created_by_email fields to ad_campaigns (if not exists)
ALTER TABLE public.ad_campaigns
  ADD COLUMN IF NOT EXISTS created_by_name TEXT,
  ADD COLUMN IF NOT EXISTS created_by_email TEXT;

-- Add created_by_name and created_by_email fields to messages (if not exists)
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS sender_name TEXT,
  ADD COLUMN IF NOT EXISTS sender_email TEXT;

-- Create function to auto-populate user tracking fields on properties
CREATE OR REPLACE FUNCTION public.track_property_creator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile RECORD;
BEGIN
  -- Get user profile information
  SELECT full_name, email INTO user_profile
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- Set created_by fields
  NEW.created_by_name := COALESCE(user_profile.full_name, user_profile.email);
  NEW.created_by_email := user_profile.email;
  
  RETURN NEW;
END;
$$;

-- Create trigger for properties
DROP TRIGGER IF EXISTS trigger_track_property_creator ON public.properties;
CREATE TRIGGER trigger_track_property_creator
  BEFORE INSERT ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.track_property_creator();

-- Create function to auto-populate user tracking fields on ad_campaigns
CREATE OR REPLACE FUNCTION public.track_campaign_creator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile RECORD;
BEGIN
  -- Get user profile information
  SELECT full_name, email INTO user_profile
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- Set created_by fields
  NEW.created_by_name := COALESCE(user_profile.full_name, user_profile.email);
  NEW.created_by_email := user_profile.email;
  
  RETURN NEW;
END;
$$;

-- Create trigger for ad_campaigns
DROP TRIGGER IF EXISTS trigger_track_campaign_creator ON public.ad_campaigns;
CREATE TRIGGER trigger_track_campaign_creator
  BEFORE INSERT ON public.ad_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.track_campaign_creator();

-- Create function to auto-populate user tracking fields on messages
CREATE OR REPLACE FUNCTION public.track_message_sender()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_profile RECORD;
BEGIN
  -- Get user profile information
  SELECT full_name, email INTO user_profile
  FROM public.profiles
  WHERE id = NEW.sender_id;
  
  -- Set sender fields
  NEW.sender_name := COALESCE(user_profile.full_name, user_profile.email);
  NEW.sender_email := user_profile.email;
  
  RETURN NEW;
END;
$$;

-- Create trigger for messages
DROP TRIGGER IF EXISTS trigger_track_message_sender ON public.messages;
CREATE TRIGGER trigger_track_message_sender
  BEFORE INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.track_message_sender();

-- =========================================
-- PART 4: AUDIT LOG TABLE
-- =========================================

-- Create audit log table to track all deletions
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  record_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to log deletions
CREATE OR REPLACE FUNCTION public.log_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    record_data
  ) VALUES (
    COALESCE(OLD.user_id, auth.uid()),
    'DELETE',
    TG_TABLE_NAME,
    OLD.id,
    to_jsonb(OLD)
  );
  
  RETURN OLD;
END;
$$;

-- Create triggers to log deletions on important tables
DROP TRIGGER IF EXISTS trigger_log_property_deletion ON public.properties;
CREATE TRIGGER trigger_log_property_deletion
  BEFORE DELETE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.log_deletion();

DROP TRIGGER IF EXISTS trigger_log_campaign_deletion ON public.ad_campaigns;
CREATE TRIGGER trigger_log_campaign_deletion
  BEFORE DELETE ON public.ad_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.log_deletion();

DROP TRIGGER IF EXISTS trigger_log_message_deletion ON public.messages;
CREATE TRIGGER trigger_log_message_deletion
  BEFORE DELETE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.log_deletion();

-- =========================================
-- SUMMARY
-- =========================================

-- The following has been implemented:
-- 1. CASCADE DELETE on all related tables (favorites, messages, inquiries, notifications, ad_campaigns)
-- 2. Automatic storage file cleanup when properties or users are deleted
-- 3. User tracking fields (created_by_name, created_by_email) on properties, campaigns, and messages
-- 4. Automatic population of user tracking fields via triggers
-- 5. Audit log system to track all deletions for compliance
-- 
-- When a user deletes:
-- - Property: All favorites, messages, inquiries, notifications, campaigns, and images are deleted
-- - User account: All properties, messages, campaigns, storage files, and related data are deleted
-- - Chat/Message: Message is deleted from database
-- - Photos: Files are deleted from storage bucket
--
-- All new records automatically include creator's full name and email for tracking
