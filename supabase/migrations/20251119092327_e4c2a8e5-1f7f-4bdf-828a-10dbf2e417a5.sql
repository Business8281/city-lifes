-- Ensure phone number syncs between profiles and auth.users in all scenarios

-- Create function to sync profile updates to auth.users metadata
CREATE OR REPLACE FUNCTION public.sync_profile_to_auth_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Update auth.users user_metadata when profile is updated
  IF (NEW.phone IS DISTINCT FROM OLD.phone OR NEW.full_name IS DISTINCT FROM OLD.full_name) THEN
    UPDATE auth.users
    SET 
      raw_user_meta_data = raw_user_meta_data || 
        jsonb_build_object(
          'phone', NEW.phone,
          'full_name', NEW.full_name
        ),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to sync profile updates to auth metadata
DROP TRIGGER IF EXISTS sync_profile_to_auth ON public.profiles;
CREATE TRIGGER sync_profile_to_auth
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_to_auth_metadata();

-- Update handle_new_user to also set phone in auth.users if provided during signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_phone TEXT;
BEGIN
  -- Extract and validate phone
  v_phone := CASE 
    WHEN NEW.raw_user_meta_data->>'phone' IS NULL THEN NULL
    WHEN LENGTH(TRIM(NEW.raw_user_meta_data->>'phone')) < 10 THEN NULL
    ELSE TRIM(NEW.raw_user_meta_data->>'phone')
  END;
  
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    v_phone,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, profiles.email),
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.sync_profile_to_auth_metadata() IS 'Syncs profile updates (phone, full_name) back to auth.users.raw_user_meta_data';
COMMENT ON TRIGGER sync_profile_to_auth ON public.profiles IS 'Keeps auth.users metadata in sync with profile updates';