-- Add new columns to accounts table
ALTER TABLE public.accounts 
ADD COLUMN opening_date date DEFAULT CURRENT_DATE,
ADD COLUMN currency text DEFAULT 'USD' NOT NULL,
ADD COLUMN notes text,
ADD COLUMN status text DEFAULT 'active' NOT NULL;