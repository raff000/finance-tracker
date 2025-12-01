import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewAccount {
  name: string;
  balance: number;
  type: string;
  opening_date: string;
  currency: string;
  notes?: string;
  status: string;
  // Savings & shared fields
  bank_name?: string;
  cut_day?: number;
  // Investment fields
  investment_length?: string;
  interest_rate?: number;
  due_date?: string;
  auto_renew?: boolean;
  reinvest_interest?: boolean;
  // Credit Card fields
  grace_period?: number;
  payment_reminder?: boolean;
  reminder_days_before?: number;
  overdue_interest_rate?: number;
  overdue_penalty?: number;
  // Loan fields
  principal?: number;
  apr?: number;
  loan_term?: string;
  repayment_structure?: string;
  collateral?: string;
  late_payment_interest?: number;
}

export const useAccounts = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["accounts", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const addAccountMutation = useMutation({
    mutationFn: async (newAccount: NewAccount) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("accounts")
        .insert([{ ...newAccount, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast({
        title: "Success",
        description: "Account added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error adding account",
        description: error.message,
      });
    },
  });

  return {
    ...query,
    addAccount: addAccountMutation.mutate,
    isAddingAccount: addAccountMutation.isPending,
  };
};