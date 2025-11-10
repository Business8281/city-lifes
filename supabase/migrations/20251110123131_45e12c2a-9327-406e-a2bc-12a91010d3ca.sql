-- Grant admin role to admin@citylifes.com
-- This will find the user with this email and assign them the admin role

DO $$ 
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the user ID for admin@citylifes.com
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@citylifes.com';

  -- Only proceed if the user exists
  IF admin_user_id IS NOT NULL THEN
    -- Insert admin role (or update if exists due to unique constraint)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role granted to admin@citylifes.com (user_id: %)', admin_user_id;
  ELSE
    RAISE NOTICE 'User admin@citylifes.com not found. Please ensure the user has signed up first.';
  END IF;
END $$;