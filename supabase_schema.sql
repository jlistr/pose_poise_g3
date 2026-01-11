-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ⚠️ DESTRUCTIVE: Drop existing tables to ensure schema matches (UUID vs Text)
drop table if exists public.shoot_images cascade;
drop table if exists public.shoots cascade;
drop table if exists public.images cascade;
drop table if exists public.portfolios cascade;
drop table if exists public.profiles cascade;
drop table if exists public.users cascade;
drop table if exists public.comp_cards cascade;

-- 1. Users table (PK is uid)
create table public.users (
  uid uuid references auth.users not null primary key,
  email text,
  created_at timestamptz default now()
);
alter table public.users enable row level security;

create policy "Users can read own entry" on public.users 
  for select using (auth.uid() = uid);
create policy "Users can insert own entry" on public.users 
  for insert with check (auth.uid() = uid);

-- 2. Profiles (PK is uid -> 1:1 with Users)
create table public.profiles (
  uid uuid references public.users(uid) not null primary key,
  name text not null,
  height text,
  bust text,
  waist text,
  hips text,
  shoe_size text,
  dress_size text,
  hair_color text,
  eye_color text,
  instagram text,
  avatar text,
  description text,
  career_goals text
);
alter table public.profiles enable row level security;

create policy "Users can all on own profile" on public.profiles 
  for all using (auth.uid() = uid);
create policy "Public can view profiles" on public.profiles 
  for select using (true);

-- 3. Portfolios (PK is uid -> 1:1 with Users)
create table public.portfolios (
  uid uuid references public.users(uid) not null primary key,
  is_public boolean default false,
  settings jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.portfolios enable row level security;

create policy "Users can all on own portfolio" on public.portfolios 
  for all using (auth.uid() = uid);
create policy "Public can view public portfolios" on public.portfolios 
  for select using (is_public = true);

-- 4. Images (PK is uid -> Item ID)
create table public.images (
  uid uuid default uuid_generate_v4() primary key,
  user_uid uuid references public.users(uid) not null,
  url text not null,
  metadata jsonb,
  file_hash text,
  uploaded_at timestamptz default now()
);
alter table public.images enable row level security;

create policy "Users can all on own images" on public.images 
  for all using (auth.uid() = user_uid);
create policy "Public can view images" on public.images 
  for select using (true);

-- 5. Shoots (PK is uid -> Item ID)
create table public.shoots (
  uid uuid default uuid_generate_v4() primary key,
  portfolio_uid uuid references public.portfolios(uid) not null,
  name text not null,
  vibes text,
  photographer text,
  studio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.shoots enable row level security;

create policy "Users can all on own shoots" on public.shoots 
  for all using (
    exists (
      select 1 from public.portfolios 
      where uid = shoots.portfolio_uid 
      and uid = auth.uid()
    )
  );
create policy "Public can view shoots of public portfolios" on public.shoots
  for select using (
    exists (
      select 1 from public.portfolios 
      where uid = shoots.portfolio_uid 
      and is_public = true
    )
  );

-- 6. Shoot Images (Join Table)
create table public.shoot_images (
  shoot_uid uuid references public.shoots(uid) on delete cascade not null,
  image_uid uuid references public.images(uid) on delete cascade not null,
  "order" int,
  is_visible boolean default true,
  primary key (shoot_uid, image_uid)
);
alter table public.shoot_images enable row level security;

create policy "Users can all on own shoot_images" on public.shoot_images 
  for all using (
    exists (
        select 1 from public.shoots s
        join public.portfolios p on s.portfolio_uid = p.uid
        where s.uid = shoot_images.shoot_uid
        and p.uid = auth.uid()
    )
  );

-- 7. CompCards
create table public.comp_cards (
  uid uuid default uuid_generate_v4() primary key,
  user_uid uuid references public.users(uid) not null,
  layout text not null,
  aesthetic text not null,
  profile_snapshot jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.comp_cards enable row level security;
create policy "Users all on own cards" on public.comp_cards for all using (auth.uid() = user_uid);
