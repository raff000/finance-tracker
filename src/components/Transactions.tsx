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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">Track all your financial activity</p>
        </div>
        <Button onClick={onAddTransaction}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                        {transaction.category}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell className={`text-right font-semibold ${transaction.amount >= 0 ? "text-success" : "text-destructive"}`}>
                      {transaction.amount >= 0 ? "+" : "-"}$
                      {Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
