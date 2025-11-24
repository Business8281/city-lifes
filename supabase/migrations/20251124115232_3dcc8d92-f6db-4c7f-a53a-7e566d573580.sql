-- Fix remaining functions without unknown type

-- Fix get_sponsored_properties
drop function if exists public.get_sponsored_properties(text, text, text, numeric, numeric, numeric);

create function public.get_sponsored_properties(
  filter_city text default null,
  filter_area text default null,
  filter_pin_code text default null,
  filter_lat numeric default null,
  filter_lng numeric default null,
  radius_km numeric default 10
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
  user_id uuid,
  views integer,
  created_at timestamptz,
  updated_at timestamptz,
  campaign_id text,
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
    p.price_type,
    p.city,
    p.area,
    p.pin_code,
    p.address,
    p.latitude,
    p.longitude,
    p.bedrooms,
    p.bathrooms,
    p.area_sqft,
    p.images,
    p.amenities,
    p.contact_name,
    p.contact_phone,
    p.contact_email,
    p.is_agent,
    p.status,
    p.verified,
    p.available,
    p.user_id,
    p.views,
    p.created_at,
    p.updated_at,
    c.id::text as campaign_id,
    case 
      when filter_lat is not null and filter_lng is not null and p.latitude is not null and p.longitude is not null
      then (
        6371 * acos(
          cos(radians(filter_lat)) * cos(radians(p.latitude)) * 
          cos(radians(p.longitude) - radians(filter_lng)) + 
          sin(radians(filter_lat)) * sin(radians(p.latitude))
        )
      )::numeric
      else 0::numeric
    end as distance_km
  from properties p
  inner join ad_campaigns c on c.property_id = p.id
  where c.status = 'active'
    and c.start_date <= now()
    and c.end_date >= now()
    and c.spent < c.budget
    and p.status = 'active'
    and p.available = true
    and (filter_city is null or p.city = filter_city)
    and (filter_area is null or p.area = filter_area)
    and (filter_pin_code is null or p.pin_code = filter_pin_code)
  having (filter_lat is null or distance_km <= radius_km)
  order by c.budget desc, distance_km asc
  limit 10;
end;
$$;

-- Fix get_map_clusters
drop function if exists public.get_map_clusters(numeric, numeric, numeric, numeric, integer, text);

create function public.get_map_clusters(
  min_lat numeric,
  max_lat numeric,
  min_lng numeric,
  max_lng numeric,
  zoom_level integer default 10,
  category_filter text default null
)
returns table(
  cluster_lat numeric,
  cluster_lng numeric,
  property_count bigint,
  avg_price numeric,
  property_ids text[]
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return query
  select 
    avg(p.latitude)::numeric as cluster_lat,
    avg(p.longitude)::numeric as cluster_lng,
    count(*)::bigint as property_count,
    avg(p.price)::numeric as avg_price,
    array_agg(p.id::text) as property_ids
  from properties p
  where p.status = 'active'
    and p.available = true
    and p.latitude between min_lat and max_lat
    and p.longitude between min_lng and max_lng
    and (category_filter is null or p.property_type = category_filter)
  group by 
    floor(p.latitude * power(2, zoom_level)),
    floor(p.longitude * power(2, zoom_level))
  having count(*) > 0;
end;
$$;