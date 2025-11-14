-- Create support tickets table and attachments
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text,
  description text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;

create policy if not exists "support_tickets_owners_all"
  on public.support_tickets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Attachments table
create table if not exists public.support_ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  path text not null,
  mime_type text,
  size bigint,
  created_at timestamptz not null default now()
);

alter table public.support_ticket_attachments enable row level security;

create policy if not exists "attachments_owner_manage"
  on public.support_ticket_attachments
  for all
  using (exists (
    select 1 from public.support_tickets t
    where t.id = support_ticket_attachments.ticket_id
      and t.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.support_tickets t
    where t.id = support_ticket_attachments.ticket_id
      and t.user_id = auth.uid()
  ));

-- Realtime for tickets
alter publication supabase_realtime add table public.support_tickets;

-- Storage bucket for uploads (private)
insert into storage.buckets (id, name, public)
values ('support-uploads', 'support-uploads', false)
on conflict (id) do nothing;

-- Storage RLS policies
create policy if not exists "support_uploads_insert"
  on storage.objects
  for insert to authenticated
  with check (bucket_id = 'support-uploads');

create policy if not exists "support_uploads_select"
  on storage.objects
  for select to authenticated
  using (bucket_id = 'support-uploads');
