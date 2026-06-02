/*
  # Interest Registrations

  Stores email addresses from visitors outside our current service area
  who want to be notified when we expand to their region.

  ## New Tables
  - `interest_registrations`
    - `id` (uuid, primary key)
    - `email` (text, unique)
    - `postcode` (text) — the postcode they entered when checking coverage
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Anonymous users can INSERT (public-facing capture form)
  - No SELECT policy for anonymous — data is read via service role only
*/

CREATE TABLE IF NOT EXISTS interest_registrations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL,
  postcode   text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE interest_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register interest"
  ON interest_registrations FOR INSERT
  TO anon
  WITH CHECK (true);
