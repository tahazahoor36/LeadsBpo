-- =============================================================
-- Leads BPO — Supabase Migration
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- =============================================================
-- SAFE: all statements use IF NOT EXISTS / DROP IF EXISTS guards.
-- The existing leads, applications, and admins tables are preserved.
-- =============================================================


-- ──────────────────────────────────────────────────────────────
-- STEP 1: Ensure core tables exist (they likely already do)
-- ──────────────────────────────────────────────────────────────

-- leads table (consultation / contact form submissions)
CREATE TABLE IF NOT EXISTS public.leads (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    TEXT    NOT NULL,
  email        TEXT    NOT NULL,
  phone        TEXT    NOT NULL,
  company_name TEXT    NOT NULL DEFAULT '',
  service_needed TEXT  NOT NULL,
  message      TEXT    NOT NULL DEFAULT '',
  status       TEXT    NOT NULL DEFAULT 'new'
                       CHECK (status IN ('new', 'contacted', 'closed')),
  source       TEXT             DEFAULT 'website',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- applications table (career / job applications)
CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT    NOT NULL,
  email           TEXT    NOT NULL,
  phone           TEXT    NOT NULL,
  position_applied TEXT   NOT NULL,
  experience      TEXT             DEFAULT '',
  message         TEXT             DEFAULT '',
  resume_url      TEXT             DEFAULT '',
  status          TEXT    NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new', 'reviewed', 'accepted', 'rejected')),
  source          TEXT             DEFAULT 'website',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ──────────────────────────────────────────────────────────────
-- STEP 2: Add missing columns (safe — skipped if already exist)
-- ──────────────────────────────────────────────────────────────

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website';

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website';


-- ──────────────────────────────────────────────────────────────
-- STEP 3: Indexes for performance
-- ──────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS leads_created_at_idx   ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx        ON public.leads (status);
CREATE INDEX IF NOT EXISTS leads_email_idx         ON public.leads (email);

CREATE INDEX IF NOT EXISTS apps_created_at_idx    ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS apps_status_idx         ON public.applications (status);
CREATE INDEX IF NOT EXISTS apps_email_idx          ON public.applications (email);


-- ──────────────────────────────────────────────────────────────
-- STEP 4: Admin allow-list table (links to Supabase Auth users)
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ──────────────────────────────────────────────────────────────
-- STEP 5: Secure helper function to check admin status
-- SECURITY DEFINER = runs as table owner, bypassing recursive RLS.
-- Explicit search_path prevents schema injection.
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
END;
$$;

-- Restrict who can call the function
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ──────────────────────────────────────────────────────────────
-- STEP 6: Enable Row Level Security
-- ──────────────────────────────────────────────────────────────

ALTER TABLE public.leads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users  ENABLE ROW LEVEL SECURITY;


-- ──────────────────────────────────────────────────────────────
-- STEP 7: RLS Policies for `leads`
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anon can insert leads"    ON public.leads;
DROP POLICY IF EXISTS "Admins can read leads"    ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads"  ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads"  ON public.leads;

CREATE POLICY "Anon can insert leads"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read leads"
  ON public.leads FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE TO authenticated
  USING (public.is_admin());


-- ──────────────────────────────────────────────────────────────
-- STEP 8: RLS Policies for `applications`
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anon can insert applications"   ON public.applications;
DROP POLICY IF EXISTS "Admins can read applications"   ON public.applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON public.applications;

CREATE POLICY "Anon can insert applications"
  ON public.applications FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read applications"
  ON public.applications FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete applications"
  ON public.applications FOR DELETE TO authenticated
  USING (public.is_admin());


-- ──────────────────────────────────────────────────────────────
-- STEP 9: RLS Policies for `admin_users`
-- Only admins can see who the admins are. No public access.
-- Rows are inserted MANUALLY via Supabase Dashboard only.
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;

CREATE POLICY "Admins can read admin_users"
  ON public.admin_users FOR SELECT TO authenticated
  USING (public.is_admin());


-- ──────────────────────────────────────────────────────────────
-- DONE
-- After running this migration, create your first admin:
--   1. Supabase Dashboard → Authentication → Users → Add user
--      (use "Create new user", set email + password)
--   2. Copy the new user's UUID from the users list
--   3. Run in SQL Editor:
--        INSERT INTO public.admin_users (user_id)
--        VALUES ('PASTE-UUID-HERE');
-- ──────────────────────────────────────────────────────────────
