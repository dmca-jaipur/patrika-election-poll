-- =========================================================
-- PATRIKA JAIPUR NEWS
-- PAVTA NAGAR PALIKA ELECTION 2026
-- DATABASE SCHEMA
-- =========================================================

create extension if not exists "pgcrypto";


-- =========================================================
-- WARDS
-- =========================================================

create table if not exists public.wards (
    id uuid primary key default gen_random_uuid(),

    ward_number integer not null unique,
    ward_name text not null,

    title text not null,
    description text,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- CANDIDATES
-- =========================================================

create table if not exists public.candidates (
    id uuid primary key default gen_random_uuid(),

    ward_id uuid not null
        references public.wards(id)
        on delete cascade,

    name text not null,
    party_name text not null,

    description text,

    photo_url text,

    initial_votes integer not null default 0
        check (initial_votes >= 0),

    display_order integer not null default 0,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================================================
-- VOTES
-- =========================================================

create table if not exists public.votes (
    id uuid primary key default gen_random_uuid(),

    ward_id uuid not null
        references public.wards(id)
        on delete cascade,

    candidate_id uuid not null
        references public.candidates(id)
        on delete cascade,

    ip_hash text not null,

    created_at timestamptz not null default now()
);


-- One IP can vote only once in a particular ward
create unique index if not exists
unique_vote_per_ward_ip
on public.votes (ward_id, ip_hash);


-- Useful indexes
create index if not exists
votes_ward_id_idx
on public.votes (ward_id);

create index if not exists
votes_candidate_id_idx
on public.votes (candidate_id);

create index if not exists
votes_created_at_idx
on public.votes (created_at);

create index if not exists
candidates_ward_id_idx
on public.candidates (ward_id);


-- =========================================================
-- VOTE ADJUSTMENTS
-- =========================================================

create table if not exists public.vote_adjustments (
    id uuid primary key default gen_random_uuid(),

    ward_id uuid not null
        references public.wards(id)
        on delete cascade,

    candidate_id uuid not null
        references public.candidates(id)
        on delete cascade,

    adjustment integer not null,

    reason text,

    admin_id uuid,

    created_at timestamptz not null default now()
);


-- =========================================================
-- AUDIT LOGS
-- =========================================================

create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),

    admin_id uuid,

    action text not null,

    details jsonb,

    created_at timestamptz not null default now()
);


-- =========================================================
-- RESULTS VIEW
-- =========================================================

create or replace view public.ward_results
with (security_invoker = true)
as
select
    c.id as candidate_id,
    c.ward_id,

    c.name,
    c.party_name,
    c.photo_url,

    c.initial_votes,

    count(v.id)::integer as new_votes,

    coalesce(
        (
            select sum(va.adjustment)
            from public.vote_adjustments va
            where va.candidate_id = c.id
        ),
        0
    )::integer as adjusted_votes,

    (
        c.initial_votes
        + count(v.id)
        + coalesce(
            (
                select sum(va.adjustment)
                from public.vote_adjustments va
                where va.candidate_id = c.id
            ),
            0
        )
    )::integer as total_votes

from public.candidates c

left join public.votes v
    on v.candidate_id = c.id

group by
    c.id,
    c.ward_id,
    c.name,
    c.party_name,
    c.photo_url,
    c.initial_votes;


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.wards enable row level security;
alter table public.candidates enable row level security;
alter table public.votes enable row level security;
alter table public.vote_adjustments enable row level security;
alter table public.audit_logs enable row level security;


-- =========================================================
-- PUBLIC READ ACCESS
-- =========================================================

drop policy if exists "Public can view active wards"
on public.wards;

create policy "Public can view active wards"
on public.wards
for select
using (is_active = true);


drop policy if exists "Public can view active candidates"
on public.candidates;

create policy "Public can view active candidates"
on public.candidates
for select
using (is_active = true);


-- =========================================================
-- IMPORTANT:
-- PUBLIC CLIENT MUST NOT DIRECTLY INSERT VOTES
-- Voting will happen through server-side API.
-- =========================================================

drop policy if exists "No public vote insert"
on public.votes;


-- =========================================================
-- STORAGE
-- =========================================================

insert into storage.buckets (
    id,
    name,
    public
)
values (
    'candidate-photos',
    'candidate-photos',
    true
)
on conflict (id) do nothing;


-- =========================================================
-- STORAGE PUBLIC READ
-- =========================================================

drop policy if exists "Public can view candidate photos"
on storage.objects;

create policy "Public can view candidate photos"
on storage.objects
for select
using (
    bucket_id = 'candidate-photos'
);


-- =========================================================
-- INITIAL WARD 25
-- =========================================================

insert into public.wards (
    ward_number,
    ward_name,
    title,
    description,
    is_active
)
values (
    25,
    'वार्ड नं. 25',
    'वार्ड नं. 25 — जनमत सर्वेक्षण',
    'यह जनमत सर्वेक्षण केवल वार्ड नं. 25 के मतदाताओं के लिए है।',
    true
)
on conflict (ward_number) do nothing;
