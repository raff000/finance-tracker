import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Folder, ArrowLeftRight } from "lucide-react";
import { ICON_MAP } from "@/components/IconPicker";
import { Category, Subcategory } from "@/hooks/useCategories";

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
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

interface TransactionsProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  subcategories: Subcategory[];
  onAddTransaction: () => void;
}

export const Transactions = ({ 
  transactions, 
  accounts, 
  categories,
  subcategories,
  onAddTransaction 
}: TransactionsProps) => {
  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account?.name || "Unknown";
  };

  const getCategoryInfo = (categoryId: string | null | undefined) => {
    if (!categoryId) return null;
    return categories.find(c => c.id === categoryId);
  };

  const getSubcategoryInfo = (subcategoryId: string | null | undefined) => {
    if (!subcategoryId) return null;
    return subcategories.find(s => s.id === subcategoryId);
  };

  const renderCategoryBadge = (transaction: Transaction) => {
    // Handle transfer transactions
    if (transaction.transaction_type === "transfer") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
          <ArrowLeftRight className="h-4 w-4 mr-1" />
          Transfer
        </span>
      );
    }

    const category = getCategoryInfo(transaction.category_id);
    const subcategory = getSubcategoryInfo(transaction.subcategory_id);

    if (category && subcategory) {
      const CategoryIcon = ICON_MAP[category.icon] || Folder;
      const SubcategoryIcon = ICON_MAP[subcategory.icon] || Folder;
      
      return (
        <div className="flex flex-col gap-1">
          <span 
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ 
              backgroundColor: `${category.color}20`,
              color: category.color 
            }}
          >
            <CategoryIcon className="h-4 w-4 mr-1" />
            {category.name}
          </span>
          <span 
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ 
              backgroundColor: `${category.color}10`,
              color: category.color 
            }}
          >
            <SubcategoryIcon className="h-4 w-4 mr-1" />
            {subcategory.name}
          </span>
        </div>
      );
    }

    // Fallback to old text-based category
    return (
      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
        {transaction.category}
      </span>
    );
  };

  const renderMobileCategory = (transaction: Transaction) => {
    if (transaction.transaction_type === "transfer") {
      return "Transfer";
    }

    const category = getCategoryInfo(transaction.category_id);
    const subcategory = getSubcategoryInfo(transaction.subcategory_id);

    if (category && subcategory) {
      return `${category.name} > ${subcategory.name}`;
    }
    return transaction.category;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">Track all your financial activity</p>
        </div>
        <Button onClick={onAddTransaction} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[150px]">Description</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Account</TableHead>
                    <TableHead className="text-right min-w-[100px]">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium text-sm">{transaction.date}</TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <div>{transaction.description}</div>
                          <div className="sm:hidden text-xs text-muted-foreground mt-1">
                            {renderMobileCategory(transaction)} • {getAccountName(transaction.account_id)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {renderCategoryBadge(transaction)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{getAccountName(transaction.account_id)}</TableCell>
                      <TableCell className={`text-right font-semibold text-sm ${transaction.amount >= 0 ? "text-success" : "text-destructive"}`}>
                        {transaction.amount >= 0 ? "+" : "-"}$
                        {Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-lg font-medium mb-2">No transactions yet</p>
              <p className="text-sm text-muted-foreground mb-4">Start tracking by adding your first transaction</p>
              <Button onClick={onAddTransaction}>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
