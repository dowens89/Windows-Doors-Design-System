-- Allow anonymous (public) visitors to read all pricing tables.
-- Previously these policies only allowed 'authenticated' role,
-- which blocked the public configurator from fetching prices.

-- window_bands
DROP POLICY IF EXISTS "Authenticated users can read window bands" ON window_bands;
CREATE POLICY "Public can read window bands"
  ON window_bands FOR SELECT
  TO anon, authenticated
  USING (true);

-- window_addons
DROP POLICY IF EXISTS "Authenticated users can read window addons" ON window_addons;
CREATE POLICY "Public can read window addons"
  ON window_addons FOR SELECT
  TO anon, authenticated
  USING (true);

-- window_colour_uplifts
DROP POLICY IF EXISTS "Authenticated users can read window colour uplifts" ON window_colour_uplifts;
CREATE POLICY "Public can read window colour uplifts"
  ON window_colour_uplifts FOR SELECT
  TO anon, authenticated
  USING (true);

-- door_ranges
DROP POLICY IF EXISTS "Authenticated users can read door ranges" ON door_ranges;
CREATE POLICY "Public can read door ranges"
  ON door_ranges FOR SELECT
  TO anon, authenticated
  USING (true);

-- door_variants
DROP POLICY IF EXISTS "Authenticated users can read door variants" ON door_variants;
CREATE POLICY "Public can read door variants"
  ON door_variants FOR SELECT
  TO anon, authenticated
  USING (true);

-- door_addons
DROP POLICY IF EXISTS "Authenticated users can read door addons" ON door_addons;
CREATE POLICY "Public can read door addons"
  ON door_addons FOR SELECT
  TO anon, authenticated
  USING (true);

-- door_settings
DROP POLICY IF EXISTS "Authenticated users can read door settings" ON door_settings;
CREATE POLICY "Public can read door settings"
  ON door_settings FOR SELECT
  TO anon, authenticated
  USING (true);
