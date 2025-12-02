import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { ICON_MAP } from "@/components/IconPicker";
import { Folder } from "lucide-react";
import { Category, Subcategory } from "@/hooks/useCategories";

interface Account {
  id: string;
  name: string;
}

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
  categories: Category[];
  subcategories: Subcategory[];
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    date: string;
    category: string;
    account_id: string;
    category_id: string;
    subcategory_id: string;
  }) => void;
}

export const AddTransactionDialog = ({
  open,
  onOpenChange,
  accounts,
  categories,
  subcategories,
  onAddTransaction,
}: AddTransactionDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [accountId, setAccountId] = useState("");

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (s) => s.category_id === categoryId
  );

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategoryId("");
  }, [categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && amount && date && categoryId && subcategoryId && accountId) {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const selectedSubcategory = subcategories.find((s) => s.id === subcategoryId);
      
      onAddTransaction({
        description,
        amount: parseFloat(amount),
        date,
        category: `${selectedCategory?.name || ""} > ${selectedSubcategory?.name || ""}`,
        account_id: accountId,
        category_id: categoryId,
        subcategory_id: subcategoryId,
      });
      setDescription("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategoryId("");
      setSubcategoryId("");
      setAccountId("");
      onOpenChange(false);
    }
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || Folder;
    return <IconComponent className="h-4 w-4 mr-2" />;
  };

  const isFormValid = description && amount && date && categoryId && subcategoryId && accountId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Grocery shopping"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00 (use negative for expenses)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No categories. Create one in Categories.
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center">
                          {renderIcon(cat.icon)}
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select 
                value={subcategoryId} 
                onValueChange={setSubcategoryId} 
                required
                disabled={!categoryId}
              >
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder={categoryId ? "Select subcategory" : "Select a category first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No subcategories for this category.
                    </div>
                  ) : (
                    filteredSubcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        <div className="flex items-center">
                          {renderIcon(sub.icon)}
                          {sub.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account">Account</Label>
              <Select value={accountId} onValueChange={setAccountId} required>
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid}>Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
