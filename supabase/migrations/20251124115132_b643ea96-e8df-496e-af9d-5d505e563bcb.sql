-- Fix remaining search and property functions with search_path

-- Fix search_properties
drop function if exists public.search_properties(text, text, text, text, numeric, numeric, numeric, numeric, numeric, numeric, integer, integer, numeric, numeric, numeric, numeric);

create function public.search_properties(
  query_text text default null,
  city_filter text default null,
  area_filter text default null,
  pincode_filter text default null,
  min_price numeric default null,
  max_price numeric default null,
  user_lat numeric default null,
  user_lng numeric default null,
  radius_km numeric default 10,
  category_filter text default null,
  page_number integer default 1,
  page_size integer default 20,
  min_lat numeric default null,
  max_lat numeric default null,
  min_lng numeric default null,
  max_lng numeric default null
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
  images text[],
  latitude numeric,
  longitude numeric,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  verified boolean,
  available boolean,
  distance_km numeric,
  relevance_score numeric,
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
  
  -- Get total count
  select count(*) into total_count_val
  from properties p
  where p.status = 'active'
    and p.available = true
    and (query_text is null or p.title ilike '%' || query_text || '%' or p.description ilike '%' || query_text || '%')
    and (city_filter is null or p.city = city_filter)
    and (area_filter is null or p.area = area_filter)
    and (pincode_filter is null or p.pin_code = pincode_filter)
    and (category_filter is null or p.property_type = category_filter)
    and (min_price is null or p.price >= min_price)
    and (max_price is null or p.price <= max_price);

  return query
  select 
    p.id,
    p.title,
    p.description,
    p.property_type,
    p.price,
    p.price_type,
    p.city,
    p.area,
    p.pin_code,
    p.images,
    p.latitude,
    p.longitude,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.verified,
    p.available,
    case 
      when user_lat is not null and user_lng is not null and p.latitude is not null and p.longitude is not null
      then (
        6371 * acos(
          cos(radians(user_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(user_lng)) + 
          sin(radians(user_lat)) * sin(radians(p.latitude))
        )
      )::numeric
      else null
    end as distance_km,
    case
      when query_text is not null
      then similarity(p.title || ' ' || coalesce(p.description, ''), query_text)
      else 0
    end::numeric as relevance_score,
    total_count_val
  from properties p
  where p.status = 'active'
    and p.available = true
    and (query_text is null or p.title ilike '%' || query_text || '%' or p.description ilike '%' || query_text || '%')
    and (city_filter is null or p.city = city_filter)
    and (area_filter is null or p.area = area_filter)
    and (pincode_filter is null or p.pin_code = pincode_filter)
    and (category_filter is null or p.property_type = category_filter)
    and (min_price is null or p.price >= min_price)
    and (max_price is null or p.price <= max_price)
  order by 
    case when query_text is not null then relevance_score else 0 end desc,
    case when user_lat is not null then distance_km else 999999 end asc,
    p.created_at desc
  limit page_size
  offset offset_val;
end;
$$;

-- Fix search_properties_by_location
drop function if exists public.search_properties_by_location(text, text, text, numeric, numeric, text, numeric);

create function public.search_properties_by_location(
  search_city text default null,
  search_area text default null,
  search_pin_code text default null,
  search_latitude numeric default null,
  search_longitude numeric default null,
  property_type_filter text default null,
  radius_km numeric default 10
)
returns table(
  id uuid,
  title text,
  description text,
  property_type text,
  price numeric,
  city text,
  area text,
  pin_code text,
  images text[],
  amenities text[],
  latitude numeric,
  longitude numeric,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  verified boolean,
  available boolean,
  created_at timestamptz,
  distance_km numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
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
    p.images,
    p.amenities,
    p.latitude,
    p.longitude,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.verified,
    p.available,
    p.created_at,
    case 
      when search_latitude is not null and search_longitude is not null and p.latitude is not null and p.longitude is not null
      then (
        6371 * acos(
          cos(radians(search_latitude)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(search_longitude)) + 
          sin(radians(search_latitude)) * sin(radians(p.latitude))
        )
      )::numeric
      else 999999::numeric
    end as distance_km
  from properties p
  where p.status = 'active'
    and p.available = true
    and (search_city is null or p.city = search_city)
    and (search_area is null or p.area = search_area)
    and (search_pin_code is null or p.pin_code = search_pin_code)
    and (property_type_filter is null or p.property_type = property_type_filter)
  having distance_km <= radius_km
  order by distance_km asc, p.created_at desc;
end;
$$;

-- Fix search_properties_nearby
drop function if exists public.search_properties_nearby(numeric, numeric, numeric, integer);

create function public.search_properties_nearby(
  user_lat numeric,
  user_lng numeric,
  radius_km numeric default 10,
  limit_count integer default 20
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
  images text[],
  amenities text[],
  latitude numeric,
  longitude numeric,
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  status text,
  verified boolean,
  available boolean,
  user_id uuid,
  created_at timestamptz,
  distance_km numeric
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select 
    p.*,
    (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(p.latitude)) * 
        cos(radians(p.longitude) - radians(user_lng)) + 
        sin(radians(user_lat)) * sin(radians(p.latitude))
      )
    )::numeric as distance_km
  from properties p
  where p.status = 'active'
    and p.available = true
    and p.latitude is not null
    and p.longitude is not null
  having distance_km <= radius_km
  order by distance_km asc
  limit limit_count;
end;
$$;