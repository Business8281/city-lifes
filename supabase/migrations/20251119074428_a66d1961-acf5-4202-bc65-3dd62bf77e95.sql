
-- Drop any triggers that might be referencing favorites_count
DROP TRIGGER IF EXISTS update_favorites_count_trigger ON favorites;
DROP TRIGGER IF EXISTS increment_favorites_count ON favorites;
DROP TRIGGER IF EXISTS decrement_favorites_count ON favorites;

-- Drop any functions that might be updating favorites_count
DROP FUNCTION IF EXISTS update_favorites_count() CASCADE;
DROP FUNCTION IF EXISTS increment_favorites_count() CASCADE;
DROP FUNCTION IF EXISTS decrement_favorites_count() CASCADE;
