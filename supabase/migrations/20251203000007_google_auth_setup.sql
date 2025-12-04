-- Trigger to handle new user creation from Google Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        'user' -- Default role
    )
    ON CONFLICT (id) DO UPDATE SET
        last_login = now(),
        avatar_url = EXCLUDED.avatar_url,
        full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);
        
    RETURN new;
END;
$$;

-- Drop existing trigger if it exists to avoid duplication errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add last_login column if not exists (useful for the trigger update)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
