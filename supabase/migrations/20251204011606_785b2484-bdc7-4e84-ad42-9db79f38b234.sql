-- Add color column to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT '#6366f1';

-- Add transfer support to transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transfer_id uuid DEFAULT NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS transaction_type text NOT NULL DEFAULT 'expense';