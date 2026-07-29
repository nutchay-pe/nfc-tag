-- Run this once in Supabase SQL Editor (Project > SQL Editor > New query).
-- Replaces the Google Sheet + Apps Script backend in Code.gs.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.profiles (
  id              text primary key,
  name            text default '',
  tagline         text default '',
  phone           text default '',
  line_id         text default '',
  email           text default '',
  message         text default '',
  template        text default 'minimal',
  image_url       text default '',
  status          text default 'normal',
  display_mode    text default 'show',
  facebook        text default '',
  instagram       text default '',
  tiktok          text default '',
  youtube         text default '',
  x               text default '',
  wechat          text default '',
  whatsapp        text default '',
  edit_code_hash  text not null,
  password2_hash  text not null,
  last_updated    date not null default current_date
);

alter table public.profiles enable row level security;
-- No policies are created on purpose: anon/authenticated get zero direct
-- access to public.profiles. All reads go through the view below, all
-- writes go through the RPC functions below.
revoke all on public.profiles from anon, authenticated;

-- Public read surface: every column except the password hashes.
-- security_invoker is intentionally left at its default (false) so this
-- view reads as its owner and bypasses the deny-all RLS on the base
-- table -- anon/authenticated never get direct table privileges.
create or replace view public.profiles_public as
select
  id, name, tagline, phone, line_id, email, message, template, image_url,
  status, display_mode, facebook, instagram, tiktok, youtube, x, wechat,
  whatsapp, last_updated
from public.profiles;

grant select on public.profiles_public to anon, authenticated;

-- Verify a customer's edit credentials without exposing the hashes.
create or replace function public.verify_edit_access(
  p_id text,
  p_edit_code text,
  p_password2 text
) returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from public.profiles
    where id = p_id
      and edit_code_hash = crypt(p_edit_code, edit_code_hash)
      and password2_hash = crypt(p_password2, password2_hash)
  );
$$;

revoke all on function public.verify_edit_access(text, text, text) from public;
grant execute on function public.verify_edit_access(text, text, text) to anon, authenticated;

-- Update an existing profile. Only ever UPDATEs a row that an admin
-- already provisioned (see provisioning note in schema.sql comments) --
-- it never creates new rows, so nobody can self-register a profile by
-- calling this endpoint directly.
create or replace function public.save_profile(
  p_id text,
  p_edit_code text,
  p_password2 text,
  p_payload jsonb,
  p_new_edit_code text default null,
  p_new_password2 text default null
) returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_ok boolean;
begin
  select public.verify_edit_access(p_id, p_edit_code, p_password2) into v_ok;

  if not v_ok then
    return jsonb_build_object('success', false, 'message', 'Invalid credentials');
  end if;

  update public.profiles set
    name         = coalesce(p_payload->>'name', name),
    tagline      = coalesce(p_payload->>'tagline', tagline),
    phone        = coalesce(p_payload->>'phone', phone),
    line_id      = coalesce(p_payload->>'lineId', line_id),
    email        = coalesce(p_payload->>'email', email),
    message      = coalesce(p_payload->>'message', message),
    template     = coalesce(p_payload->>'template', template),
    image_url    = coalesce(p_payload->>'imageUrl', image_url),
    status       = coalesce(p_payload->>'status', status),
    display_mode = coalesce(p_payload->>'displayMode', display_mode),
    facebook     = coalesce(p_payload->>'facebook', facebook),
    instagram    = coalesce(p_payload->>'instagram', instagram),
    tiktok       = coalesce(p_payload->>'tiktok', tiktok),
    youtube      = coalesce(p_payload->>'youtube', youtube),
    x            = coalesce(p_payload->>'x', x),
    wechat       = coalesce(p_payload->>'wechat', wechat),
    whatsapp     = coalesce(p_payload->>'whatsapp', whatsapp),
    edit_code_hash = case
      when p_new_edit_code is not null and length(p_new_edit_code) > 0
        then crypt(p_new_edit_code, gen_salt('bf'))
      else edit_code_hash
    end,
    password2_hash = case
      when p_new_password2 is not null and length(p_new_password2) > 0
        then crypt(p_new_password2, gen_salt('bf'))
      else password2_hash
    end,
    last_updated = current_date
  where id = p_id;

  return jsonb_build_object('success', true, 'message', 'Profile saved successfully', 'id', p_id);
end;
$$;

revoke all on function public.save_profile(text, text, text, jsonb, text, text) from public;
grant execute on function public.save_profile(text, text, text, jsonb, text, text) to anon, authenticated;

-- Admin-only: provision a new tag/profile with its initial credentials.
-- Do NOT grant execute to anon/authenticated -- run this from the SQL
-- editor (or with the service_role key) when you sell a new tag, same as
-- adding a new row to the Google Sheet used to be.
create or replace function public.provision_profile(
  p_id text,
  p_edit_code text,
  p_password2 text
) returns jsonb
language sql
security definer
set search_path = public, extensions
as $$
  insert into public.profiles (id, edit_code_hash, password2_hash)
  values (p_id, crypt(p_edit_code, gen_salt('bf')), crypt(p_password2, gen_salt('bf')))
  returning jsonb_build_object('success', true, 'id', id);
$$;

revoke all on function public.provision_profile(text, text, text) from public, anon, authenticated;

-- Storage bucket for profile images (replaces the Google Drive folder).
insert into storage.buckets (id, name, public)
values ('profile-images', 'profile-images', true)
on conflict (id) do nothing;

-- Anyone can view images (bucket is public); only anon/authenticated can
-- upload, and only into their own id's folder isn't enforced here since
-- the id itself is the shared secret-free public identifier -- keep the
-- 5MB client-side size check in register.js as the practical limit.
create policy "profile-images public read"
on storage.objects for select
using (bucket_id = 'profile-images');

create policy "profile-images anon upload"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'profile-images');
