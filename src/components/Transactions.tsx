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
import { Plus } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  account: string;
}

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

export const Transactions = ({ transactions, onAddTransaction }: TransactionsProps) => {
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
                            {transaction.category} • {transaction.account}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                          {transaction.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{transaction.account}</TableCell>
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
