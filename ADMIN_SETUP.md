# Admin Role Setup for Supabase

**CRITICAL SECURITY**: Never use hardcoded credentials for admin access. This implementation uses proper role-based authentication.

## Step 1: Create the User Roles System

Run this SQL in your Supabase SQL Editor:

```sql
-- Create enum for roles
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Create user_roles table
create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null,
    created_at timestamp with time zone default now(),
    unique (user_id, role)
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create function to get user role (for client-side display)
create or replace function public.get_user_role(_user_id uuid)
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.user_roles
  where user_id = _user_id
  limit 1
$$;

-- RLS Policies for user_roles table
-- Users can view their own roles
create policy "Users can view own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

-- Only admins can insert/update/delete roles
create policy "Admins can manage all roles"
on public.user_roles
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));
```

## Step 2: Assign Admin Role to Your User

After creating your admin account through the normal signup process, run this SQL to make that user an admin:

```sql
-- Replace 'admin@citylifes.com' with your actual admin email
insert into public.user_roles (user_id, role)
select id, 'admin'::app_role
from auth.users
where email = 'admin@citylifes.com';
```

## Step 3: Protect Admin Routes

The admin dashboard will now check the user's role from the database before allowing access.

## Security Notes

- ✅ Roles are stored in a separate table with proper RLS
- ✅ Role checking uses security definer functions to avoid RLS recursion
- ✅ No hardcoded credentials or client-side role storage
- ✅ All role validation happens server-side through Supabase
- ❌ Never use localStorage/sessionStorage for admin status
- ❌ Never hardcode admin credentials in the application
