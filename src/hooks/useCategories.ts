import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type CategoryType = 'Income' | 'Expense';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  created_at: string;
}

export interface Subcategory {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  icon: string;
  created_at: string;
}

export const useCategories = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const categoriesQuery = useQuery({
    queryKey: ["categories", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!userId,
  });

  const subcategoriesQuery = useQuery({
    queryKey: ["subcategories", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: !!userId,
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: { name: string; type: CategoryType; icon: string; color: string }) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("categories")
        .insert([{ ...newCategory, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", userId] });
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error adding category",
        description: error.message,
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name, type, icon, color }: { id: string; name: string; type: CategoryType; icon: string; color: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .update({ name, type, icon, color })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", userId] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating category",
        description: error.message,
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", userId] });
      queryClient.invalidateQueries({ queryKey: ["subcategories", userId] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: error.message,
      });
    },
  });

  const addSubcategoryMutation = useMutation({
    mutationFn: async (newSubcategory: { name: string; icon: string; category_id: string }) => {
      if (!userId) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("subcategories")
        .insert([{ ...newSubcategory, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories", userId] });
      toast({
        title: "Success",
        description: "Subcategory added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error adding subcategory",
        description: error.message,
      });
    },
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: async ({ id, name, icon }: { id: string; name: string; icon: string }) => {
      const { data, error } = await supabase
        .from("subcategories")
        .update({ name, icon })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories", userId] });
      toast({
        title: "Success",
        description: "Subcategory updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating subcategory",
        description: error.message,
      });
    },
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories", userId] });
      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error deleting subcategory",
        description: error.message,
      });
    },
  });

  return {
    categories: categoriesQuery.data || [],
    subcategories: subcategoriesQuery.data || [],
    isLoadingCategories: categoriesQuery.isLoading,
    isLoadingSubcategories: subcategoriesQuery.isLoading,
    addCategory: addCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    addSubcategory: addSubcategoryMutation.mutate,
    updateSubcategory: updateSubcategoryMutation.mutate,
    deleteSubcategory: deleteSubcategoryMutation.mutate,
    isAddingCategory: addCategoryMutation.isPending,
    isAddingSubcategory: addSubcategoryMutation.isPending,
  };
};
