# Supabase Setup Instructions

## Run this SQL in your Supabase SQL Editor

Go to your Supabase Dashboard → SQL Editor → New Query, then paste and run this SQL:

```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- Create profiles trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS policies for profiles
create policy "Users can view all profiles"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create properties table
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text not null,
  price decimal not null,
  location text not null,
  city text not null,
  state text not null,
  images text[] default '{}',
  description text not null,
  bedrooms int,
  bathrooms int,
  area decimal,
  amenities text[] default '{}',
  status text default 'pending' check (status in ('active', 'pending', 'expired')),
  views int default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.properties enable row level security;

-- RLS policies for properties
create policy "Anyone can view active properties"
  on properties for select
  using (status = 'active' or auth.uid() = user_id);

create policy "Users can insert own properties"
  on properties for insert
  with check (auth.uid() = user_id);

create policy "Users can update own properties"
  on properties for update
  using (auth.uid() = user_id);

create policy "Users can delete own properties"
  on properties for delete
  using (auth.uid() = user_id);

-- Create favorites table
create table public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, property_id)
);

alter table public.favorites enable row level security;

-- RLS policies for favorites
create policy "Users can view own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on favorites for delete
  using (auth.uid() = user_id);

-- Create inquiries table
create table public.inquiries (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  created_at timestamptz default now() not null
);

alter table public.inquiries enable row level security;

-- RLS policies for inquiries
create policy "Users can view inquiries they're part of"
  on inquiries for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert inquiries"
  on inquiries for insert
  with check (auth.uid() = sender_id);

-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete set null,
  content text not null,
  read boolean default false,
  created_at timestamptz default now() not null
);

alter table public.messages enable row level security;

-- RLS policies for messages
create policy "Users can view messages they're part of"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert messages"
  on messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can update messages they received"
  on messages for update
  using (auth.uid() = receiver_id);

-- Create notifications table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('message', 'inquiry', 'favorite', 'listing')),
  title text not null,
  message text not null,
  read boolean default false,
  link text,
  created_at timestamptz default now() not null
);

alter table public.notifications enable row level security;

-- RLS policies for notifications
create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on notifications for delete
  using (auth.uid() = user_id);

-- Create indexes
create index properties_user_id_idx on properties(user_id);
create index properties_status_idx on properties(status);
create index favorites_user_id_idx on favorites(user_id);
create index messages_sender_id_idx on messages(sender_id);
create index messages_receiver_id_idx on messages(receiver_id);
create index notifications_user_id_idx on notifications(user_id);
```

## Important Settings

### 1. Disable Email Confirmation (for testing)
Go to: Authentication → Providers → Email → Disable "Confirm email"

### 2. Set URL Configuration
Go to: Authentication → URL Configuration
- **Site URL**: Set to your app URL
- **Redirect URLs**: Add your app URL

This prevents "requested path is invalid" errors.

## Next Steps

After running the SQL:
1. Visit `/auth` to create an account
2. Start adding properties and testing the app!
