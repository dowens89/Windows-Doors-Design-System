/*
  # User authentication and role-based access

  ## Summary
  Creates the user_profiles table that extends Supabase auth.users with a
  role field. Three roles exist:
    - super_admin  — full access to all internal tools
    - admin        — access to /pricing-admin and /pricing-debug
    - installer    — access to /installer only

  ## Tables
  - `user_profiles`
    - `id` (uuid, PK, FK → auth.users.id)
    - `email` (text)
    - `role` (text) — super_admin | admin | installer
    - `full_name` (text, nullable)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## How to create the first super_admin
  1. Create a user via Supabase Dashboard → Authentication → Users → Add user
  2. Run:
       UPDATE user_profiles SET role = 'super_admin' WHERE email = 'you@example.com';

  ## Security
  - RLS enabled
  - Users can read their own profile (needed by the app to resolve role)
  - Only super_admin can read and modify other users' profiles
*/

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email       text NOT NULL,
  role        text NOT NULL DEFAULT 'installer'
              CHECK (role IN ('super_admin', 'admin', 'installer')),
  full_name   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Every authenticated user can read their own profile
CREATE POLICY "user_read_own_profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Super admins can read all profiles
CREATE POLICY "super_admin_read_all_profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- Super admins can update any profile (role changes etc.)
CREATE POLICY "super_admin_update_profiles"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'super_admin'
  )
  WITH CHECK (
    (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- ── Auto-create profile on sign-up ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'installer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Keep updated_at current ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_profiles_set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
