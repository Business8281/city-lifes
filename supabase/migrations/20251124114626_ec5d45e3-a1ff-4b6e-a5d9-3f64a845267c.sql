-- Create optimized security definer functions to fix Performance Advisor warnings

-- Function to get current user ID (replaces auth.uid() calls)
create or replace function public.get_current_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid()
$$;

-- Function to check if user owns a record (generic ownership check)
create or replace function public.is_owner(_user_id uuid, _record_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select _user_id = _record_user_id
$$;

-- Function to check message participation
create or replace function public.is_message_participant(_user_id uuid, _sender_id uuid, _receiver_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select _user_id = _sender_id or _user_id = _receiver_id
$$;

-- Function to check inquiry participation
create or replace function public.is_inquiry_participant(_user_id uuid, _sender_id uuid, _receiver_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select _user_id = _sender_id or _user_id = _receiver_id
$$;

-- Drop and recreate RLS policies for profiles table
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

create policy "Users can update own profile"
on public.profiles
for update
using (public.is_owner(public.get_current_user_id(), id));

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (public.is_owner(public.get_current_user_id(), id));

-- Drop and recreate RLS policies for favorites table
drop policy if exists "Users can insert own favorites" on public.favorites;
drop policy if exists "Users can delete own favorites" on public.favorites;
drop policy if exists "Users can view own favorites" on public.favorites;

create policy "Users can insert own favorites"
on public.favorites
for insert
with check (public.is_owner(public.get_current_user_id(), user_id));

create policy "Users can delete own favorites"
on public.favorites
for delete
using (public.is_owner(public.get_current_user_id(), user_id));

create policy "Users can view own favorites"
on public.favorites
for select
using (public.is_owner(public.get_current_user_id(), user_id));

-- Drop and recreate RLS policies for inquiries table
drop policy if exists "Users can insert inquiries" on public.inquiries;
drop policy if exists "Users can view inquiries they're part of" on public.inquiries;

create policy "Users can insert inquiries"
on public.inquiries
for insert
with check (public.is_owner(public.get_current_user_id(), sender_id));

create policy "Users can view inquiries they're part of"
on public.inquiries
for select
using (public.is_inquiry_participant(public.get_current_user_id(), sender_id, receiver_id));

-- Drop and recreate RLS policies for messages table
drop policy if exists "Users can insert messages" on public.messages;
drop policy if exists "Users can send messages" on public.messages;
drop policy if exists "Users can view messages they're part of" on public.messages;
drop policy if exists "Users can view their own messages" on public.messages;
drop policy if exists "Users can edit their own messages" on public.messages;
drop policy if exists "Users can update messages they received" on public.messages;
drop policy if exists "Users can update their received messages" on public.messages;
drop policy if exists "Users can delete messages in their conversations" on public.messages;

create policy "Users can insert messages"
on public.messages
for insert
with check (public.is_owner(public.get_current_user_id(), sender_id));

create policy "Users can view messages they're part of"
on public.messages
for select
using (public.is_message_participant(public.get_current_user_id(), sender_id, receiver_id));

create policy "Users can edit their own messages"
on public.messages
for update
using (public.is_owner(public.get_current_user_id(), sender_id))
with check (public.is_owner(public.get_current_user_id(), sender_id));

create policy "Users can update received messages"
on public.messages
for update
using (public.is_owner(public.get_current_user_id(), receiver_id));

create policy "Users can delete messages in their conversations"
on public.messages
for delete
using (public.is_message_participant(public.get_current_user_id(), sender_id, receiver_id));

-- Drop and recreate RLS policies for notifications table
drop policy if exists "Users can view own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
drop policy if exists "Users can delete own notifications" on public.notifications;

create policy "Users can view own notifications"
on public.notifications
for select
using (public.is_owner(public.get_current_user_id(), user_id));

create policy "Users can update own notifications"
on public.notifications
for update
using (public.is_owner(public.get_current_user_id(), user_id));

create policy "Users can delete own notifications"
on public.notifications
for delete
using (public.is_owner(public.get_current_user_id(), user_id));