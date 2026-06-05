ALTER TABLE quote_requests
ADD COLUMN IF NOT EXISTS product_reference text;
