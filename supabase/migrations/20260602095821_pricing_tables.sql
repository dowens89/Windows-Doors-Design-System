/*
  # Pricing Tables

  Creates 7 clean-named tables for the WDO dynamic pricing system.

  ## New Tables
  1. `window_bands` — combined mm breakpoint → selling price
  2. `window_addons` — flat add-on costs for windows
  3. `window_colour_uplifts` — colour uplift multipliers for windows
  4. `door_ranges` — master door range records
  5. `door_variants` — individual SKU variants (FK → door_ranges, cascade delete)
  6. `door_addons` — flat add-on costs for doors
  7. `door_settings` — scalar settings (e.g. large_door_uplift)

  ## Security
  - RLS enabled on all tables
  - Authenticated users can SELECT (read pricing data)
  - No public write access — mutations only via service role / admin tool

  ## Notes
  - All tables have `created_at` and `updated_at` timestamps
  - `update_updated_at()` trigger function keeps `updated_at` current
  - Triggers attached to all 7 tables
  - Indexes on frequently queried columns
*/

-- ─── Trigger function ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── window_bands ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS window_bands (
  combined_mm   integer PRIMARY KEY,
  selling_price numeric(10,2) NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE window_bands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read window bands"
  ON window_bands FOR SELECT
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_window_bands_updated_at ON window_bands;
CREATE TRIGGER trg_window_bands_updated_at
  BEFORE UPDATE ON window_bands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── window_addons ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS window_addons (
  key           text PRIMARY KEY,
  label         text NOT NULL,
  price         numeric(10,2) NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE window_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read window addons"
  ON window_addons FOR SELECT
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_window_addons_updated_at ON window_addons;
CREATE TRIGGER trg_window_addons_updated_at
  BEFORE UPDATE ON window_addons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── window_colour_uplifts ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS window_colour_uplifts (
  key            text PRIMARY KEY,
  label          text NOT NULL,
  uplift_decimal numeric(5,4) NOT NULL,
  display_order  integer DEFAULT 0 NOT NULL,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE window_colour_uplifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read window colour uplifts"
  ON window_colour_uplifts FOR SELECT
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_window_colour_uplifts_updated_at ON window_colour_uplifts;
CREATE TRIGGER trg_window_colour_uplifts_updated_at
  BEFORE UPDATE ON window_colour_uplifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── door_ranges ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS door_ranges (
  range_id      text PRIMARY KEY,
  range_name    text NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE door_ranges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read door ranges"
  ON door_ranges FOR SELECT
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_door_ranges_updated_at ON door_ranges;
CREATE TRIGGER trg_door_ranges_updated_at
  BEFORE UPDATE ON door_ranges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── door_variants ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS door_variants (
  sku_id        text PRIMARY KEY,
  range_id      text NOT NULL REFERENCES door_ranges(range_id) ON DELETE CASCADE,
  variant_type  text NOT NULL,
  selling_price numeric(10,2) NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_door_variants_range_id ON door_variants(range_id);
CREATE INDEX IF NOT EXISTS idx_door_variants_sku_id   ON door_variants(sku_id);

ALTER TABLE door_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read door variants"
  ON door_variants FOR SELECT
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_door_variants_updated_at ON door_variants;
CREATE TRIGGER trg_door_variants_updated_at
  BEFORE UPDATE ON door_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── door_addons ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS door_addons (
  key           text PRIMARY KEY,
  label         text NOT NULL,
  price         numeric(10,2) NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE door_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read door addons"
  ON door_addons FOR SELECT
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_door_addons_updated_at ON door_addons;
CREATE TRIGGER trg_door_addons_updated_at
  BEFORE UPDATE ON door_addons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── door_settings ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS door_settings (
  key        text PRIMARY KEY,
  value      numeric(10,4) NOT NULL,
  label      text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE door_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read door settings"
  ON door_settings FOR SELECT
  TO authenticated
  USING (true);

DROP TRIGGER IF EXISTS trg_door_settings_updated_at ON door_settings;
CREATE TRIGGER trg_door_settings_updated_at
  BEFORE UPDATE ON door_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
