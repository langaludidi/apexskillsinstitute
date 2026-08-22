-- Canonical catalogue generated from https://apexskillsinstitute.co.za/programmes
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
  ('BUS', 'business_entrepreneurship', 'School of Business & Entrepreneurship', 'business-entrepreneurship', 'Enterprise creation, growth and commercial capability.', 1, true),
  ('FIN', 'finance_administration', 'School of Finance & Administration', 'finance-administration', 'Financial control and administrative effectiveness.', 2, true),
  ('HR', 'human_resources_public_finance', 'School of Human Resources & Public Finance', 'human-resources-public-finance', 'People, administration and accountability.', 3, true),
  ('OHS', 'ohs_risk_compliance', 'School of OHS, Risk & Compliance', 'ohs-risk-compliance', 'Safer, better-controlled workplaces.', 4, true),
  ('DIG', 'digital_technology_data', 'School of Digital Technology & Data', 'digital-technology-data', 'Future-ready digital and data capability.', 5, true),
  ('PROJ', 'project_operations_built_environment', 'School of Project, Operations & Built Environment', 'project-operations-built-environment', 'Planning, execution and operational performance.', 6, true),
  ('PUB', 'public_sector_municipal_management', 'School of Public Sector & Municipal Management', 'public-sector-municipal-management', 'Capability for effective public institutions.', 7, true),
  ('SCM', 'supply_chain_fleet_logistics', 'School of Supply Chain, Fleet & Logistics', 'supply-chain-fleet-logistics', 'Control of resources, suppliers and movement.', 8, true),
  ('AGR', 'agriculture_rural_enterprise', 'School of Agriculture & Rural Enterprise', 'agriculture-rural-enterprise', 'Productive and sustainable rural enterprise.', 9, true)
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
  ('BUS-101', 'BUS', 'Entrepreneurship Fundamentals', 'entrepreneurship-fundamentals', 6, 'Standard', 1, true),
  ('BUS-102', 'BUS', 'Starting & Growing a Small Business', 'starting-and-growing-a-small-business', 8, 'Standard', 2, true),
  ('BUS-103', 'BUS', 'Tender Readiness for SMEs', 'tender-readiness-for-smes', 4, 'Standard', 3, true),
  ('BUS-104', 'BUS', 'Cooperative Governance & Management', 'cooperative-governance-and-management', 6, 'Standard', 4, true),
  ('BUS-105', 'BUS', 'Business Planning & Funding Readiness', 'business-planning-and-funding-readiness', 6, 'Standard', 5, true),
  ('BUS-106', 'BUS', 'Digital Entrepreneurship & E-commerce', 'digital-entrepreneurship-and-e-commerce', 6, 'Standard', 6, true),
  ('FIN-101', 'FIN', 'Bookkeeping Fundamentals', 'bookkeeping-fundamentals', 8, 'Standard', 7, true),
  ('FIN-102', 'FIN', 'Payroll Administration', 'payroll-administration', 6, 'Standard', 8, true),
  ('FIN-103', 'FIN', 'Finance for Non-Financial Managers', 'finance-for-non-financial-managers', 6, 'Professional', 9, true),
  ('FIN-104', 'FIN', 'Budgeting & Cash Flow Management', 'budgeting-and-cash-flow-management', 6, 'Standard', 10, true),
  ('ADM-101', 'FIN', 'Office Administration', 'office-administration', 8, 'Standard', 11, true),
  ('ADM-102', 'FIN', 'Records & Information Management', 'records-and-information-management', 6, 'Standard', 12, true),
  ('HR-101', 'HR', 'HR Administration Fundamentals', 'hr-administration-fundamentals', 8, 'Standard', 13, true),
  ('HR-102', 'HR', 'Labour Relations for Supervisors', 'labour-relations-for-supervisors', 6, 'Professional', 14, true),
  ('HR-103', 'HR', 'Recruitment & Selection Administration', 'recruitment-and-selection-administration', 4, 'Standard', 15, true),
  ('PFM-101', 'HR', 'Public Sector Financial Management Essentials', 'public-sector-financial-management-essentials', 6, 'Professional', 16, true),
  ('ADM-103', 'HR', 'Customer Service & Frontline Administration', 'customer-service-and-frontline-administration', 4, 'Standard', 17, true),
  ('HR-104', 'HR', 'Performance Management & Discipline', 'performance-management-and-discipline', 6, 'Professional', 18, true),
  ('OHS-101', 'OHS', 'Occupational Health & Safety Management', 'occupational-health-and-safety-management', 8, 'Standard', 19, true),
  ('OHS-102', 'OHS', 'Hazard Identification & Risk Assessment (HIRA)', 'hazard-identification-and-risk-assessment-hira', 4, 'Standard', 20, true),
  ('OHS-103', 'OHS', 'Incident Investigation', 'incident-investigation', 4, 'Standard', 21, true),
  ('OHS-104', 'OHS', 'Construction Health & Safety Essentials', 'construction-health-and-safety-essentials', 6, 'Standard', 22, true),
  ('RSK-101', 'OHS', 'Risk Management Fundamentals', 'risk-management-fundamentals', 6, 'Professional', 23, true),
  ('CMP-101', 'OHS', 'POPIA & Data Protection', 'popia-and-data-protection', 4, 'Standard', 24, true),
  ('DIG-101', 'DIG', 'Digital Literacy', 'digital-literacy', 4, 'Standard', 25, true),
  ('DIG-102', 'DIG', 'Microsoft 365 Workplace Productivity', 'microsoft-365-workplace-productivity', 6, 'Standard', 26, true),
  ('DIG-103', 'DIG', 'Excel Essentials', 'excel-essentials', 4, 'Standard', 27, true),
  ('DIG-104', 'DIG', 'Advanced Excel', 'advanced-excel', 6, 'Standard', 28, true),
  ('DIG-105', 'DIG', 'Cybersecurity Awareness', 'cybersecurity-awareness', 4, 'Standard', 29, true),
  ('DIG-106', 'DIG', 'AI for Business Productivity', 'ai-for-business-productivity', 4, 'Professional', 30, true),
  ('DAT-101', 'DIG', 'Power BI for Business Reporting', 'power-bi-for-business-reporting', 6, 'Professional', 31, true),
  ('DAT-102', 'DIG', 'Data Literacy for Managers', 'data-literacy-for-managers', 4, 'Professional', 32, true),
  ('DAT-103', 'DIG', 'SQL & Database Fundamentals', 'sql-and-database-fundamentals', 8, 'Technical', 33, true),
  ('CYB-101', 'DIG', 'Cybersecurity Fundamentals', 'cybersecurity-fundamentals', 8, 'Technical', 34, true),
  ('AI-201', 'DIG', 'AI for Executives & Public Leaders', 'ai-for-executives-and-public-leaders', 3, 'Executive', 35, true),
  ('DAT-201', 'DIG', 'Data Analytics Bootcamp', 'data-analytics-bootcamp', 10, 'Bootcamp', 36, true),
  ('PM-101', 'PROJ', 'Project Management Fundamentals', 'project-management-fundamentals', 8, 'Professional', 37, true),
  ('PM-201', 'PROJ', 'Advanced Project Management', 'advanced-project-management', 8, 'Professional', 38, true),
  ('PM-102', 'PROJ', 'Project Scheduling: Gantt, CPM & PERT', 'project-scheduling-gantt-cpm-and-pert', 6, 'Technical', 39, true),
  ('MER-101', 'PROJ', 'Monitoring, Evaluation & Reporting Fundamentals', 'monitoring-evaluation-and-reporting-fundamentals', 8, 'Professional', 40, true),
  ('OPS-101', 'PROJ', 'Operations Management', 'operations-management', 8, 'Professional', 41, true),
  ('FAC-101', 'PROJ', 'Facilities Management', 'facilities-management', 8, 'Professional', 42, true),
  ('PUB-101', 'PUB', 'Public Management Fundamentals', 'public-management-fundamentals', 8, 'Professional', 43, true),
  ('MUN-101', 'PUB', 'Local Government Management', 'local-government-management', 8, 'Professional', 44, true),
  ('SCM-201', 'PUB', 'Public Procurement & SCM Fundamentals', 'public-procurement-and-scm-fundamentals', 8, 'Professional', 45, true),
  ('MUN-201', 'PUB', 'Municipal Project Management', 'municipal-project-management', 8, 'Professional', 46, true),
  ('MER-201', 'PUB', 'Monitoring & Evaluation for Public Programmes', 'monitoring-and-evaluation-for-public-programmes', 8, 'Professional', 47, true),
  ('PUB-102', 'PUB', 'Public Sector Ethics & Governance', 'public-sector-ethics-and-governance', 6, 'Professional', 48, true),
  ('SCM-101', 'SCM', 'Supply Chain Management Fundamentals', 'supply-chain-management-fundamentals', 8, 'Professional', 49, true),
  ('SCM-102', 'SCM', 'Procurement Management', 'procurement-management', 6, 'Professional', 50, true),
  ('SCM-103', 'SCM', 'Inventory & Stock Control', 'inventory-and-stock-control', 6, 'Standard', 51, true),
  ('LOG-101', 'SCM', 'Logistics Management Fundamentals', 'logistics-management-fundamentals', 8, 'Professional', 52, true),
  ('FLT-101', 'SCM', 'Fleet Management Fundamentals', 'fleet-management-fundamentals', 6, 'Professional', 53, true),
  ('SCM-104', 'SCM', 'Supplier & Contract Management', 'supplier-and-contract-management', 6, 'Professional', 54, true),
  ('AGR-101', 'AGR', 'Farm Business Management', 'farm-business-management', 8, 'Professional', 55, true),
  ('AGR-102', 'AGR', 'Agribusiness Planning & Market Access', 'agribusiness-planning-and-market-access', 8, 'Professional', 56, true),
  ('COOP-201', 'AGR', 'Cooperative Financial Management', 'cooperative-financial-management', 6, 'Standard', 57, true),
  ('AGR-103', 'AGR', 'Farm Bookkeeping & Record Keeping', 'farm-bookkeeping-and-record-keeping', 6, 'Standard', 58, true),
  ('RUR-101', 'AGR', 'Rural Retail & Spaza Enterprise Management', 'rural-retail-and-spaza-enterprise-management', 6, 'Standard', 59, true),
  ('AGR-104', 'AGR', 'Agricultural Health & Safety', 'agricultural-health-and-safety', 4, 'Standard', 60, true)
on conflict (programme_code) do update set
  school_code = excluded.school_code,
  title = excluded.title,
  slug = excluded.slug,
  duration_weeks = excluded.duration_weeks,
  tier = excluded.tier,
  sort_order = excluded.sort_order,
  active = excluded.active,
  updated_at = now();
