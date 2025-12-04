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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { ICON_MAP } from "@/components/IconPicker";
import { Folder, TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";
import { Category, Subcategory } from "@/hooks/useCategories";

interface Account {
  id: string;
  name: string;
}

type TransactionType = "income" | "expense" | "transfer";

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
    category_id?: string;
    subcategory_id?: string;
    transaction_type: string;
    transfer_id?: string;
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
  const [transactionType, setTransactionType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");

  // Filter categories based on transaction type
  const filteredCategories = categories.filter((c) => {
    if (transactionType === "income") return c.type === "Income";
    if (transactionType === "expense") return c.type === "Expense";
    return false;
  });

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (s) => s.category_id === categoryId
  );

  // Reset form when transaction type changes
  useEffect(() => {
    setCategoryId("");
    setSubcategoryId("");
  }, [transactionType]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategoryId("");
  }, [categoryId]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategoryId("");
    setSubcategoryId("");
    setAccountId("");
    setDestinationAccountId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (transactionType === "transfer") {
      if (description && amount && date && accountId && destinationAccountId) {
        const transferId = crypto.randomUUID();
        const amountNum = Math.abs(parseFloat(amount));
        
        // Create withdrawal from source account
        onAddTransaction({
          description: `Transfer to ${accounts.find(a => a.id === destinationAccountId)?.name || "Unknown"}`,
          amount: -amountNum,
          date,
          category: "Transfer",
          account_id: accountId,
          transaction_type: "transfer",
          transfer_id: transferId,
        });
        
        // Create deposit to destination account
        onAddTransaction({
          description: `Transfer from ${accounts.find(a => a.id === accountId)?.name || "Unknown"}`,
          amount: amountNum,
          date,
          category: "Transfer",
          account_id: destinationAccountId,
          transaction_type: "transfer",
          transfer_id: transferId,
        });
        
        resetForm();
        onOpenChange(false);
      }
    } else {
      if (description && amount && date && categoryId && subcategoryId && accountId) {
        const selectedCategory = categories.find((c) => c.id === categoryId);
        const selectedSubcategory = subcategories.find((s) => s.id === subcategoryId);
        const amountNum = parseFloat(amount);
        const finalAmount = transactionType === "expense" ? -Math.abs(amountNum) : Math.abs(amountNum);
        
        onAddTransaction({
          description,
          amount: finalAmount,
          date,
          category: `${selectedCategory?.name || ""} > ${selectedSubcategory?.name || ""}`,
          account_id: accountId,
          category_id: categoryId,
          subcategory_id: subcategoryId,
          transaction_type: transactionType,
        });
        resetForm();
        onOpenChange(false);
      }
    }
  };

  const renderIcon = (iconName: string, color?: string) => {
    const IconComponent = ICON_MAP[iconName] || Folder;
    return <IconComponent className="h-5 w-5 mr-2" style={color ? { color } : undefined} />;
  };

  const isFormValid = transactionType === "transfer" 
    ? description && amount && date && accountId && destinationAccountId && accountId !== destinationAccountId
    : description && amount && date && categoryId && subcategoryId && accountId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new income, expense, or transfer transaction.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={transactionType} onValueChange={(v) => setTransactionType(v as TransactionType)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expense" className="flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4" />
              <span className="hidden sm:inline">Expense</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Income</span>
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center gap-1.5">
              <ArrowLeftRight className="h-4 w-4" />
              <span className="hidden sm:inline">Transfer</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder={transactionType === "transfer" ? "e.g., Savings transfer" : "e.g., Grocery shopping"}
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
                placeholder="0.00"
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
            
            {transactionType === "transfer" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="sourceAccount">From Account</Label>
                  <Select value={accountId} onValueChange={setAccountId} required>
                    <SelectTrigger id="sourceAccount">
                      <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id} disabled={acc.id === destinationAccountId}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="destinationAccount">To Account</Label>
                  <Select value={destinationAccountId} onValueChange={setDestinationAccountId} required>
                    <SelectTrigger id="destinationAccount">
                      <SelectValue placeholder="Select destination account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id} disabled={acc.id === accountId}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
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
                          No {transactionType} categories. Create one in Categories.
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
                          No subcategories for this category.
                        </div>
                      ) : (
                        filteredSubcategories.map((sub) => {
                          const parentCategory = categories.find(c => c.id === sub.category_id);
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
              </>
            )}
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
