
-- Migration: Enable Full Text Search and Geospatial Indexing
-- functionality: Adds 'fts' column and indexes for high-performance search

-- 1. Ensure PostGIS is enabled
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA public;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA public; -- for fuzzy match if needed, but FTS is better for scale

-- 2. Add 'location' column if it doesn't exist (sync with lat/lng)
-- Note: It appears 'location' is already used in previous RPCs, but we ensure it is populated.
-- We create a trigger to keep location in sync with latitude/longitude
CREATE OR REPLACE FUNCTION public.sync_location_column()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.location := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_properties_location ON properties;
CREATE TRIGGER trg_sync_properties_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON properties
FOR EACH ROW EXECUTE FUNCTION public.sync_location_column();

-- Backfill location for existing rows
UPDATE properties SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE location IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;

-- 3. Add GIST Index for fast geo-searches
CREATE INDEX IF NOT EXISTS idx_properties_location_gist ON properties USING GIST(location);

-- 4. Add Full Text Search (FTS) Column
-- We combine title, city, area, and description/pincode for search
ALTER TABLE properties ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(city, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(area, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(pin_code, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'C')
) STORED;

-- 5. Add GIN Index for fast text searches
CREATE INDEX IF NOT EXISTS idx_properties_fts_gin ON properties USING GIN(fts);
