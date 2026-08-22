create table if not exists public.public_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  enquiry_type text not null check (enquiry_type in ('contact','group_training')),
  name text not null,
  organisation text,
  email text not null,
  phone text,
  interest text,
  programme text,
  learner_count integer,
  delivery_format text,
  message text,
  submitted_at timestamptz not null default now()
);
alter table public.public_enquiries enable row level security;
revoke all on table public.public_enquiries from anon, authenticated;
grant insert on table public.public_enquiries to anon, authenticated;
create policy "Public website enquiries may be submitted" on public.public_enquiries for insert to anon, authenticated with check (length(name) between 2 and 160 and length(email) between 5 and 254 and enquiry_type in ('contact','group_training'));
create index if not exists public_enquiries_submitted_at_idx on public.public_enquiries (submitted_at desc);
