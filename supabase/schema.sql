-- Ritu Gupta studio schema
-- Paste this into the Supabase SQL editor, then create one author user
-- under Authentication and turn off public sign-ups.

create extension if not exists pgcrypto;

create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  author_name text not null default '',
  descriptor text not null default '',
  hero_statement text not null default '',
  hero_intro text not null default '',
  profile_image text not null default '',
  announcement text not null default '',
  announcement_active boolean not null default false,
  cta_primary_label text not null default '',
  cta_primary_href text not null default '',
  cta_secondary_label text not null default '',
  cta_secondary_href text not null default '',
  currently_writing text not null default '',
  currently_reading text not null default '',
  currently_listening text not null default '',
  currently_publishing text not null default '',
  poetry_heading text not null default '',
  writing_heading text not null default '',
  listen_heading text not null default '',
  listen_subheading text not null default '',
  elsewhere_heading text not null default '',
  about_teaser text not null default '',
  about_heading text not null default '',
  about_lede text not null default '',
  about_image text not null default '',
  about_sections jsonb not null default '[]'::jsonb,
  about_quotes jsonb not null default '[]'::jsonb,
  contact_heading text not null default '',
  contact_intro text not null default '',
  books_intro text not null default '',
  poetry_intro text not null default '',
  writing_intro text not null default '',
  listen_intro text not null default '',
  links_intro text not null default '',
  closing_statement text not null default '',
  footer_line text not null default '',
  email text not null default '',
  substack_url text not null default '',
  spotify_profile_url text not null default '',
  meta_description text not null default '',
  featured_book_id uuid,
  featured_poem_id uuid,
  featured_writing_id uuid,
  featured_audio_id uuid,
  updated_at timestamptz not null default now()
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  slug text not null unique,
  cover_image text not null default '',
  description text not null default '',
  author_note text not null default '',
  year int,
  publisher text not null default '',
  isbn text not null default '',
  amazon_url text not null default '',
  purchase_links jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists poems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body text not null default '',
  date date,
  category text not null default '',
  book_id uuid,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists writings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image text not null default '',
  date date,
  category text not null default '',
  external_url text not null default '',
  book_id uuid,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  spotify_url text not null default '',
  cover_image text not null default '',
  type text not null default 'playlist',
  featured boolean not null default false,
  published boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  icon text not null default 'web',
  description text not null default '',
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  path text not null default '',
  alt text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table site_settings enable row level security;
alter table books enable row level security;
alter table poems enable row level security;
alter table writings enable row level security;
alter table audio_items enable row level security;
alter table links enable row level security;
alter table media enable row level security;
alter table messages enable row level security;

drop policy if exists "public read settings" on site_settings;
create policy "public read settings" on site_settings for select using (true);
drop policy if exists "admin write settings" on site_settings;
create policy "admin write settings" on site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public read published books" on books;
create policy "public read published books" on books for select using (published = true);
drop policy if exists "admin write books" on books;
create policy "admin write books" on books for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public read published poems" on poems;
create policy "public read published poems" on poems for select using (published = true);
drop policy if exists "admin write poems" on poems;
create policy "admin write poems" on poems for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public read published writings" on writings;
create policy "public read published writings" on writings for select using (published = true);
drop policy if exists "admin write writings" on writings;
create policy "admin write writings" on writings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public read published audio" on audio_items;
create policy "public read published audio" on audio_items for select using (published = true);
drop policy if exists "admin write audio" on audio_items;
create policy "admin write audio" on audio_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public read active links" on links;
create policy "public read active links" on links for select using (active = true);
drop policy if exists "admin write links" on links;
create policy "admin write links" on links for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public read media" on media;
create policy "public read media" on media for select using (true);
drop policy if exists "admin write media" on media;
create policy "admin write media" on media for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public send messages" on messages;
create policy "public send messages" on messages for insert with check (true);
drop policy if exists "admin read messages" on messages;
create policy "admin read messages" on messages for select using (auth.role() = 'authenticated');
drop policy if exists "admin delete messages" on messages;
create policy "admin delete messages" on messages for delete using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media files" on storage.objects;
create policy "public read media files" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "admin upload media files" on storage.objects;
create policy "admin upload media files" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');
drop policy if exists "admin delete media files" on storage.objects;
create policy "admin delete media files" on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
