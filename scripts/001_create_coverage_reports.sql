-- Create table for storing coverage reports
create table if not exists public.coverage_reports (
  id uuid primary key default gen_random_uuid(),
  repository text not null,
  filename text not null,
  data jsonb not null,
  uploaded_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create index for faster queries
create index if not exists idx_coverage_reports_repository on public.coverage_reports(repository);
create index if not exists idx_coverage_reports_uploaded_at on public.coverage_reports(uploaded_at desc);

-- Enable RLS (Row Level Security)
alter table public.coverage_reports enable row level security;

-- Use DO blocks to handle policy idempotency
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'coverage_reports' 
    AND policyname = 'coverage_reports_select_all'
  ) THEN
    CREATE POLICY "coverage_reports_select_all"
      ON public.coverage_reports FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'coverage_reports' 
    AND policyname = 'coverage_reports_insert_all'
  ) THEN
    CREATE POLICY "coverage_reports_insert_all"
      ON public.coverage_reports FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;
