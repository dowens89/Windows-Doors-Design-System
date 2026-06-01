/*
  # Create quote_requests table

  ## Summary
  Creates a table to store customer survey request submissions from the checkout flow.
  No authentication is required — submissions are anonymous (homeowner enquiries).

  ## New Tables
  - `quote_requests`
    - `id` (uuid, primary key)
    - `reference` (text, unique) — human-readable ref e.g. WDO-2026-4821
    - `name` (text) — customer full name
    - `email` (text) — customer email
    - `phone` (text) — customer phone
    - `address_line1` (text)
    - `address_line2` (text, nullable)
    - `town` (text)
    - `postcode` (text)
    - `products` (jsonb) — JSON array of basket items
    - `indicative_total` (integer) — pence total
    - `notes` (text, nullable) — free-text from customer
    - `status` (text) — defaults to 'new'
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - INSERT allowed for anonymous (unauthenticated) users — public submission form
  - SELECT restricted: no public read (only service role can read)
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address_line1 text NOT NULL DEFAULT '',
  address_line2 text DEFAULT '',
  town text NOT NULL DEFAULT '',
  postcode text NOT NULL DEFAULT '',
  products jsonb NOT NULL DEFAULT '[]',
  indicative_total integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public checkout form)
CREATE POLICY "Anyone can submit a quote request"
  ON quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No public reads — only service role access
-- (admin dashboard would use service role key)
