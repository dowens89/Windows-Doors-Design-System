/*
  # Create contact_enquiries table

  Stores messages submitted via the public contact form.

  ## New Tables
  - `contact_enquiries`
    - `id` (uuid, primary key)
    - `name` (text)
    - `email` (text)
    - `message` (text)
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Anonymous users can INSERT (public-facing form)
  - No SELECT policy for anonymous — data is read via service role only
*/

CREATE TABLE IF NOT EXISTS contact_enquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  message    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact enquiry"
  ON contact_enquiries FOR INSERT
  TO anon
  WITH CHECK (true);
