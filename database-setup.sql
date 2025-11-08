-- Properties Database Setup with Location-Based Filtering
-- Run this in your Supabase SQL Editor

-- Enable PostGIS extension for geolocation features
create extension if not exists postgis;

-- Create properties table with location-based fields
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  
  -- Basic property information
  title text not null,
  description text,
  property_type text not null,
  price decimal(12,2) not null,
  price_type text default 'monthly', -- monthly, yearly, one-time
  
  -- Location fields
  city text not null,
  area text not null,
  pin_code text not null,
  address text,
  latitude decimal(10,8),
  longitude decimal(11,8),
  location geography(Point, 4326), -- PostGIS geography for distance calculations
  
  -- Property details
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  
  -- Media
  images text[] default array[]::text[],
  
  -- Amenities and features
  amenities text[] default array[]::text[],
  
  -- Status and verification
  status text default 'active' check (status in ('active', 'inactive', 'rented', 'sold')),
  verified boolean default false,
  available boolean default true,
  
  -- Contact info
  contact_name text,
  contact_phone text,
  contact_email text,
  is_agent boolean default false,
  
  -- Metadata
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for faster queries
create index if not exists idx_properties_user_id on public.properties(user_id);
create index if not exists idx_properties_city on public.properties(city);
create index if not exists idx_properties_area on public.properties(area);
create index if not exists idx_properties_pin_code on public.properties(pin_code);
create index if not exists idx_properties_property_type on public.properties(property_type);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_created_at on public.properties(created_at desc);

-- Create spatial index for location-based queries
create index if not exists idx_properties_location on public.properties using gist(location);

-- Create trigger to automatically update location geography from lat/lng
create or replace function update_property_location()
returns trigger as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.location = st_makepoint(new.longitude, new.latitude)::geography;
  end if;
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_update_property_location on public.properties;
create trigger trigger_update_property_location
  before insert or update on public.properties
  for each row
  execute function update_property_location();

-- Enable Row Level Security
alter table public.properties enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Anyone can view active properties" on public.properties;
drop policy if exists "Authenticated users can view all properties" on public.properties;
drop policy if exists "Users can insert their own properties" on public.properties;
drop policy if exists "Users can update their own properties" on public.properties;
drop policy if exists "Users can delete their own properties" on public.properties;

-- RLS Policies

-- Anyone can view active properties
create policy "Anyone can view active properties"
  on public.properties
  for select
  using (status = 'active' and available = true);

-- Authenticated users can view all properties (including their own inactive ones)
create policy "Authenticated users can view all properties"
  on public.properties
  for select
  to authenticated
  using (true);

-- Users can insert their own properties
create policy "Users can insert their own properties"
  on public.properties
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own properties
create policy "Users can update their own properties"
  on public.properties
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can delete their own properties
create policy "Users can delete their own properties"
  on public.properties
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create function to search properties by location
create or replace function search_properties_by_location(
  search_city text default null,
  search_area text default null,
  search_pin_code text default null,
  search_latitude decimal default null,
  search_longitude decimal default null,
  radius_km decimal default 10,
  property_type_filter text default null
)
returns table (
  id uuid,
  title text,
  description text,
  property_type text,
  price decimal,
  city text,
  area text,
  pin_code text,
  latitude decimal,
  longitude decimal,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  images text[],
  amenities text[],
  verified boolean,
  available boolean,
  distance_km decimal,
  created_at timestamptz
) as $$
begin
  return query
  select 
    p.id,
    p.title,
    p.description,
    p.property_type,
    p.price,
    p.city,
    p.area,
    p.pin_code,
    p.latitude,
    p.longitude,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.images,
    p.amenities,
    p.verified,
    p.available,
    case 
      when search_latitude is not null and search_longitude is not null and p.location is not null
      then round((st_distance(
        p.location,
        st_makepoint(search_longitude, search_latitude)::geography
      ) / 1000)::numeric, 2)
      else null
    end as distance_km,
    p.created_at
  from public.properties p
  where 
    p.status = 'active' 
    and p.available = true
    and (search_city is null or lower(p.city) = lower(search_city))
    and (search_area is null or lower(p.area) = lower(search_area))
    and (search_pin_code is null or p.pin_code = search_pin_code)
    and (property_type_filter is null or p.property_type = property_type_filter)
    and (
      search_latitude is null 
      or search_longitude is null 
      or p.location is null
      or st_dwithin(
        p.location,
        st_makepoint(search_longitude, search_latitude)::geography,
        radius_km * 1000
      )
    )
  order by 
    case 
      when search_latitude is not null and search_longitude is not null and p.location is not null
      then st_distance(
        p.location,
        st_makepoint(search_longitude, search_latitude)::geography
      )
      else 0
    end,
    p.created_at desc;
end;
$$ language plpgsql security definer;

-- Grant execute permission on the function
grant execute on function search_properties_by_location to authenticated, anon;

-- Sample data insert (optional - remove if not needed)
-- Uncomment below to add sample properties

/*
insert into public.properties (
  user_id, title, description, property_type, price, city, area, pin_code,
  latitude, longitude, bedrooms, bathrooms, area_sqft, verified, available
) values
  (
    auth.uid(), -- Replace with actual user_id
    'Luxury 3BHK Apartment',
    'Beautiful spacious apartment with modern amenities',
    'apartment',
    45000,
    'Delhi',
    'Green Park',
    '110016',
    28.5494,
    77.2001,
    3,
    2,
    1850,
    true,
    true
  );
*/
