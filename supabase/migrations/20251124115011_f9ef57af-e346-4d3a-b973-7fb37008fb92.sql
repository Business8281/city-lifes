-- Drop and recreate final custom functions

drop function if exists public.autocomplete_search(text, integer);
drop function if exists public.get_properties_paginated(integer, integer, text, text, boolean);
drop function if exists public.get_user_properties_paginated(uuid, integer, integer);

-- Recreate autocomplete_search with search_path
create function public.autocomplete_search(
  query_text text,
  limit_count integer default 10
)
returns table(
  type text,
  label text,
  city_id uuid,
  area_id uuid,
  pincode text,
  latitude numeric,
  longitude numeric,
  relevance double precision
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select 
    s.type,
    s.label,
    s.city_id,
    s.area_id,
    s.pincode,
    s.latitude,
    s.longitude,
    similarity(s.label, query_text) as relevance
  from search_suggestions s
  where s.label ilike '%' || query_text || '%'
  order by relevance desc, s.search_count desc
  limit limit_count;
end;
$$;

-- Recreate get_properties_paginated with search_path
create function public.get_properties_paginated(
  page_number integer default 1,
  page_size integer default 20,
  filter_type text default null,
  filter_city text default null,
  filter_verified boolean default null
)
returns table(
  id uuid,
  title text,
  description text,
  property_type text,
  price numeric,
  price_type text,
  city text,
  area text,
  pin_code text,
  address text,
  latitude numeric,
  longitude numeric,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  images text[],
  amenities text[],
  contact_name text,
  contact_phone text,
  contact_email text,
  is_agent boolean,
  status text,
  verified boolean,
  available boolean,
  views integer,
  user_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  offset_val integer;
  total_count_val bigint;
begin
  offset_val := (page_number - 1) * page_size;
  
  select count(*) into total_count_val
  from properties p
  where (filter_type is null or p.property_type = filter_type)
    and (filter_city is null or p.city = filter_city)
    and (filter_verified is null or p.verified = filter_verified)
    and p.status = 'active';

  return query
  select 
    p.*,
    total_count_val
  from properties p
  where (filter_type is null or p.property_type = filter_type)
    and (filter_city is null or p.city = filter_city)
    and (filter_verified is null or p.verified = filter_verified)
    and p.status = 'active'
  order by p.created_at desc
  limit page_size
  offset offset_val;
end;
$$;

-- Recreate get_user_properties_paginated with search_path
create function public.get_user_properties_paginated(
  p_user_id uuid,
  page_number integer default 1,
  page_size integer default 20
)
returns table(
  id uuid,
  title text,
  description text,
  property_type text,
  price numeric,
  price_type text,
  city text,
  area text,
  pin_code text,
  address text,
  latitude numeric,
  longitude numeric,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  images text[],
  amenities text[],
  contact_name text,
  contact_phone text,
  contact_email text,
  is_agent boolean,
  status text,
  verified boolean,
  available boolean,
  views integer,
  user_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  offset_val integer;
  total_count_val bigint;
begin
  offset_val := (page_number - 1) * page_size;
  
  select count(*) into total_count_val
  from properties p
  where p.user_id = p_user_id;

  return query
  select 
    p.*,
    total_count_val
  from properties p
  where p.user_id = p_user_id
  order by p.created_at desc
  limit page_size
  offset offset_val;
end;
$$;