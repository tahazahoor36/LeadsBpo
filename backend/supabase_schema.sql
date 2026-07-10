-- supabase_schema.sql
-- Run this in your Supabase SQL Editor to create the required tables.

-- 1. Admins Table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT DEFAULT 'Admin',
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Leads Table (Consultation / Contact Form)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT DEFAULT '',
  service_needed TEXT NOT NULL,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Applications Table (Careers)
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position_applied TEXT NOT NULL,
  experience TEXT DEFAULT '',
  message TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Row Level Security (RLS) is enabled by default in new Supabase projects.
-- The backend uses the Service Role Key to bypass RLS, which is the recommended approach
-- for a traditional Node.js backend setup.
