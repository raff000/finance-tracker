import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTransactions = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (newTransaction: {
      description: string;
      amount: number;
      date: string;
      category: string;
      account_id: string;
      category_id?: string;
      subcategory_id?: string;
      transaction_type?: string;
      transfer_id?: string;
    }) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .insert([{ ...newTransaction, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error adding transaction",
        description: error.message,
      });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async (updatedTransaction: {
      id: string;
      description: string;
      amount: number;
      date: string;
      category: string;
      account_id: string;
      category_id?: string | null;
      subcategory_id?: string | null;
      transaction_type?: string;
    }) => {
      if (!userId) throw new Error("User not authenticated");
      const { id, ...transactionData } = updatedTransaction;

      const { data, error } = await supabase
        .from("transactions")
        .update(transactionData)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating transaction",
        description: error.message,
      });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      if (!userId) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error deleting transaction",
        description: error.message,
      });
    },
  });

  return {
    ...query,
    addTransaction: addTransactionMutation.mutate,
    isAddingTransaction: addTransactionMutation.isPending,
    updateTransaction: updateTransactionMutation.mutate,
    isUpdatingTransaction: updateTransactionMutation.isPending,
    deleteTransaction: deleteTransactionMutation.mutate,
    isDeletingTransaction: deleteTransactionMutation.isPending,
  };
};
