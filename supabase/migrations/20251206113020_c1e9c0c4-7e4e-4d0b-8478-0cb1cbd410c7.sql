-- Create a trigger function to update account balances when transactions change
CREATE OR REPLACE FUNCTION public.update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    UPDATE public.accounts 
    SET balance = balance + NEW.amount
    WHERE id = NEW.account_id;
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    -- If account changed, update both accounts
    IF OLD.account_id != NEW.account_id THEN
      -- Subtract from old account
      UPDATE public.accounts 
      SET balance = balance - OLD.amount
      WHERE id = OLD.account_id;
      -- Add to new account
      UPDATE public.accounts 
      SET balance = balance + NEW.amount
      WHERE id = NEW.account_id;
    ELSE
      -- Same account, just adjust the difference
      UPDATE public.accounts 
      SET balance = balance - OLD.amount + NEW.amount
      WHERE id = NEW.account_id;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    UPDATE public.accounts 
    SET balance = balance - OLD.amount
    WHERE id = OLD.account_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_account_balance ON public.transactions;
CREATE TRIGGER trigger_update_account_balance
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_account_balance();