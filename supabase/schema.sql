-- FounderLoop MVP schema
-- Run this once in your Supabase project's SQL editor.

-- Profiles: one row per authenticated user, linked to auth.users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('founder', 'expert')),
  created_at timestamptz default now()
);

-- Requests: a founder's ask, visible to everyone on the open feed
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  founder_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  details text not null,
  created_at timestamptz default now()
);

-- Responses: an expert's reply to a request
create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  expert_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table requests enable row level security;
alter table responses enable row level security;

-- Profiles: anyone signed in can read profiles (for showing names); a user can only edit their own
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);
create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

-- Requests: open feed, anyone signed in can read; only founders can post; only the author can edit/delete
create policy "Requests are viewable by everyone" on requests
  for select using (true);
create policy "Founders can create requests" on requests
  for insert with check (
    auth.uid() = founder_id
    and exists (select 1 from profiles where id = auth.uid() and role = 'founder')
  );
create policy "Founders can update their own requests" on requests
  for update using (auth.uid() = founder_id);
create policy "Founders can delete their own requests" on requests
  for delete using (auth.uid() = founder_id);

-- Responses: open feed, anyone signed in can read; only experts can respond
create policy "Responses are viewable by everyone" on responses
  for select using (true);
create policy "Experts can create responses" on responses
  for insert with check (
    auth.uid() = expert_id
    and exists (select 1 from profiles where id = auth.uid() and role = 'expert')
  );
create policy "Experts can update their own responses" on responses
  for update using (auth.uid() = expert_id);
create policy "Experts can delete their own responses" on responses
  for delete using (auth.uid() = expert_id);
