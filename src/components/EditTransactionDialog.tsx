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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { ICON_MAP } from "@/components/IconPicker";
import { Folder, Trash2 } from "lucide-react";
import { Category, Subcategory } from "@/hooks/useCategories";

interface Account {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  account_id: string;
  category_id?: string | null;
  subcategory_id?: string | null;
  transaction_type?: string | null;
}

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  accounts: Account[];
  categories: Category[];
  subcategories: Subcategory[];
  onUpdateTransaction: (transaction: {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
    account_id: string;
    category_id?: string | null;
    subcategory_id?: string | null;
    transaction_type?: string;
  }) => void;
  onDeleteTransaction: (id: string) => void;
}

export const EditTransactionDialog = ({
  open,
  onOpenChange,
  transaction,
  accounts,
  categories,
  subcategories,
  onUpdateTransaction,
  onDeleteTransaction,
}: EditTransactionDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [accountId, setAccountId] = useState("");

  const isTransfer = transaction?.transaction_type === "transfer";
  const transactionType = transaction?.amount && transaction.amount >= 0 ? "income" : "expense";

  const filteredCategories = categories.filter((c) => {
    if (transactionType === "income") return c.type === "Income";
    return c.type === "Expense";
  });

  const filteredSubcategories = subcategories.filter((s) => s.category_id === categoryId);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(Math.abs(transaction.amount).toString());
      setDate(transaction.date);
      setCategoryId(transaction.category_id || "");
      setSubcategoryId(transaction.subcategory_id || "");
      setAccountId(transaction.account_id);
    }
  }, [transaction]);

  useEffect(() => {
    setSubcategoryId("");
  }, [categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !description || !amount || !date || !accountId) return;

    if (isTransfer) {
      onUpdateTransaction({
        id: transaction.id,
        description,
        amount: transaction.amount >= 0 ? Math.abs(parseFloat(amount)) : -Math.abs(parseFloat(amount)),
        date,
        category: "Transfer",
        account_id: accountId,
        transaction_type: "transfer",
      });
    } else {
      if (!categoryId || !subcategoryId) return;
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const selectedSubcategory = subcategories.find((s) => s.id === subcategoryId);
      const amountNum = parseFloat(amount);
      const finalAmount = transactionType === "expense" ? -Math.abs(amountNum) : Math.abs(amountNum);

      onUpdateTransaction({
        id: transaction.id,
        description,
        amount: finalAmount,
        date,
        category: `${selectedCategory?.name || ""} > ${selectedSubcategory?.name || ""}`,
        account_id: accountId,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        transaction_type: transactionType,
      });
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (transaction) {
      onDeleteTransaction(transaction.id);
      onOpenChange(false);
    }
  };

  const renderIcon = (iconName: string, color?: string) => {
    const IconComponent = ICON_MAP[iconName] || Folder;
    return <IconComponent className="h-5 w-5 mr-2" style={color ? { color } : undefined} />;
  };

  const isFormValid = isTransfer
    ? description && amount && date && accountId
    : description && amount && date && categoryId && subcategoryId && accountId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            {isTransfer ? "Update transfer details." : `Update ${transactionType} transaction.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
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
                min="0"
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

            {!isTransfer && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No {transactionType} categories.
                        </div>
                      ) : (
                        filteredCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center">
                              {renderIcon(cat.icon, cat.color)}
                              <span style={{ color: cat.color }}>{cat.name}</span>
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
                          No subcategories.
                        </div>
                      ) : (
                        filteredSubcategories.map((sub) => {
                          const parentCategory = categories.find((c) => c.id === sub.category_id);
                          return (
                            <SelectItem key={sub.id} value={sub.id}>
                              <div className="flex items-center">
                                {renderIcon(sub.icon, parentCategory?.color)}
                                <span style={{ color: parentCategory?.color }}>{sub.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

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

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the transaction.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isFormValid}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};