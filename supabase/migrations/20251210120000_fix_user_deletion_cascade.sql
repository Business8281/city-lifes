-- Fix FK constraints to allow user deletion
-- Target strict tables known to exist

DO $$
BEGIN
    -- contact_reveals.property_id
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'contact_reveals_property_id_fkey') THEN
        ALTER TABLE public.contact_reveals DROP CONSTRAINT contact_reveals_property_id_fkey;
        ALTER TABLE public.contact_reveals ADD CONSTRAINT contact_reveals_property_id_fkey
            FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;
    END IF;

    -- contact_reveals.user_id
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'contact_reveals_user_id_fkey') THEN
        ALTER TABLE public.contact_reveals DROP CONSTRAINT contact_reveals_user_id_fkey;
        ALTER TABLE public.contact_reveals ADD CONSTRAINT contact_reveals_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- properties.user_id
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'properties_user_id_fkey') THEN
        ALTER TABLE public.properties DROP CONSTRAINT properties_user_id_fkey;
        ALTER TABLE public.properties ADD CONSTRAINT properties_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    -- profiles.id
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_id_fkey') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey
            FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- properties.owner_id (if it exists, sometimes used instead of user_id)
     IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'properties_owner_id_fkey') THEN
        ALTER TABLE public.properties DROP CONSTRAINT properties_owner_id_fkey;
        ALTER TABLE public.properties ADD CONSTRAINT properties_owner_id_fkey
            FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

END $$;
