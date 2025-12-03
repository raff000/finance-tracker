-- Add type column to categories table (after name conceptually, though Postgres adds at end)
ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'Expense';

-- Add a check constraint to ensure only valid values
ALTER TABLE public.categories 
  ADD CONSTRAINT categories_type_check CHECK (type IN ('Income', 'Expense'));