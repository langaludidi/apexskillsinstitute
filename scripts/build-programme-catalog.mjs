import { writeFile } from 'node:fs/promises';

const sourceUrl = 'https://apexskillsinstitute.co.za/programmes';
const outputPath = new URL('../supabase/migrations/202608220004_canonical_programme_catalog.sql', import.meta.url);

const schools = [
  ['BUS', 'business_entrepreneurship', 'School of Business & Entrepreneurship', 'business-entrepreneurship', 'Enterprise creation, growth and commercial capability.'],
  ['FIN', 'finance_administration', 'School of Finance & Administration', 'finance-administration', 'Financial control and administrative effectiveness.'],
  ['HR', 'human_resources_public_finance', 'School of Human Resources & Public Finance', 'human-resources-public-finance', 'People, administration and accountability.'],
  ['OHS', 'ohs_risk_compliance', 'School of OHS, Risk & Compliance', 'ohs-risk-compliance', 'Safer, better-controlled workplaces.'],
  ['DIG', 'digital_technology_data', 'School of Digital Technology & Data', 'digital-technology-data', 'Future-ready digital and data capability.'],
  ['PROJ', 'project_operations_built_environment', 'School of Project, Operations & Built Environment', 'project-operations-built-environment', 'Planning, execution and operational performance.'],
  ['PUB', 'public_sector_municipal_management', 'School of Public Sector & Municipal Management', 'public-sector-municipal-management', 'Capability for effective public institutions.'],
  ['SCM', 'supply_chain_fleet_logistics', 'School of Supply Chain, Fleet & Logistics', 'supply-chain-fleet-logistics', 'Control of resources, suppliers and movement.'],
  ['AGR', 'agriculture_rural_enterprise', 'School of Agriculture & Rural Enterprise', 'agriculture-rural-enterprise', 'Productive and sustainable rural enterprise.']
];

const schoolAliases = new Map([
  ['Business & Entrepreneurship', 'BUS'],
  ['Finance & Administration', 'FIN'],
  ['Human Resources & Public Finance', 'HR'],
  ['OHS, Risk & Compliance', 'OHS'],
  ['Digital Technology & Data', 'DIG'],
  ['Project, Operations & Built Environment', 'PROJ'],
  ['Public Sector & Municipal', 'PUB'],
  ['Supply Chain, Fleet & Logistics', 'SCM'],
  ['Agriculture & Rural Enterprise', 'AGR']
]);

const decode = value => value
  .replaceAll('&amp;', '&')
  .replaceAll('&#39;', "'")
  .replaceAll('&quot;', '"');
const quote = value => `'${String(value).replaceAll("'", "''")}'`;

const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Catalogue source returned ${response.status}`);
const html = await response.text();
const rowPattern = /<a class="program-row"[^>]*data-school="([^"]+)"[^>]*data-tier="([^"]+)"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<span class="program-code">([^<]+)<\/span>[\s\S]*?<span class="program-title">([^<]+)<\/span>[\s\S]*?<span class="meta">([^<]+)<\/span>/g;

const programmes = [];
for (const match of html.matchAll(rowPattern)) {
  const schoolName = decode(match[1]);
  const schoolCode = schoolAliases.get(schoolName);
  if (!schoolCode) throw new Error(`Unmapped school: ${schoolName}`);
  programmes.push({
    schoolCode,
    tier: decode(match[2]),
    slug: match[3].split('/').filter(Boolean).at(-1),
    code: decode(match[4]),
    title: decode(match[5]),
    durationWeeks: Number.parseInt(match[6], 10)
  });
}

if (programmes.length !== 60) {
  throw new Error(`Expected 60 live programmes, found ${programmes.length}`);
}

const schoolValues = schools.map((row, index) =>
  `  (${row.slice(0, 5).map(quote).join(', ')}, ${index + 1}, true)`
).join(',\n');
const programmeValues = programmes.map((row, index) =>
  `  (${quote(row.code)}, ${quote(row.schoolCode)}, ${quote(row.title)}, ${quote(row.slug)}, ${row.durationWeeks}, ${quote(row.tier)}, ${index + 1}, true)`
).join(',\n');

const sql = `-- Canonical catalogue generated from ${sourceUrl}
-- Do not add sample credits or accreditation claims: these are not part of the
-- approved public programme catalogue.

create table if not exists public.apex_schools (
  school_code text primary key,
  school_key public.apex_school not null unique,
  name text not null,
  slug text not null unique,
  description text not null,
  sort_order integer not null check (sort_order > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.apex_programmes (
  programme_code text primary key,
  school_code text not null references public.apex_schools(school_code),
  title text not null,
  slug text not null unique,
  duration_weeks integer not null check (duration_weeks > 0),
  tier text not null check (tier in ('Standard', 'Professional', 'Technical', 'Executive', 'Bootcamp')),
  sort_order integer not null check (sort_order > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.apex_schools enable row level security;
alter table public.apex_programmes enable row level security;

create policy "active schools are publicly readable"
on public.apex_schools for select to anon, authenticated
using (active = true);

create policy "active programmes are publicly readable"
on public.apex_programmes for select to anon, authenticated
using (active = true);

insert into public.apex_schools
  (school_code, school_key, name, slug, description, sort_order, active)
values
${schoolValues}
on conflict (school_code) do update set
  school_key = excluded.school_key,
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  sort_order = excluded.sort_order,
  active = excluded.active,
  updated_at = now();

insert into public.apex_programmes
  (programme_code, school_code, title, slug, duration_weeks, tier, sort_order, active)
values
${programmeValues}
on conflict (programme_code) do update set
  school_code = excluded.school_code,
  title = excluded.title,
  slug = excluded.slug,
  duration_weeks = excluded.duration_weeks,
  tier = excluded.tier,
  sort_order = excluded.sort_order,
  active = excluded.active,
  updated_at = now();
`;

await writeFile(outputPath, sql);
console.log(`Wrote ${programmes.length} programmes to ${outputPath.pathname}`);
