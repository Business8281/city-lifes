-- Add foreign key constraints for proper relations

-- Add foreign key from properties.user_id to profiles.id
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_user_id_fkey;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add foreign key from favorites.property_id to properties.id
ALTER TABLE public.favorites 
DROP CONSTRAINT IF EXISTS favorites_property_id_fkey;

ALTER TABLE public.favorites 
ADD CONSTRAINT favorites_property_id_fkey 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- Add foreign key from favorites.user_id to auth.users
ALTER TABLE public.favorites 
DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;

ALTER TABLE public.favorites 
ADD CONSTRAINT favorites_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;