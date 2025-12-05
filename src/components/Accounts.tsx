import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Banknote, PiggyBank, TrendingUp, CreditCard, Landmark, FileWarning, Wallet } from "lucide-react";

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

interface AccountsProps {
  accounts: Account[];
  onAddAccount: () => void;
  onAccountClick?: (account: Account) => void;
}

const getAccountIcon = (type: string) => {
  switch (type) {
    case "Cash":
      return <Banknote className="h-5 w-5" />;
    case "Savings":
      return <PiggyBank className="h-5 w-5" />;
    case "Investment":
      return <TrendingUp className="h-5 w-5" />;
    case "Credit Cards":
      return <CreditCard className="h-5 w-5" />;
    case "Loan":
      return <Landmark className="h-5 w-5" />;
    case "Liabilities":
      return <FileWarning className="h-5 w-5" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
};

export const Accounts = ({ accounts, onAddAccount, onAccountClick }: AccountsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-sm text-muted-foreground">Manage your financial accounts</p>
        </div>
        <Button onClick={onAddAccount} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card 
            key={account.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onAccountClick?.(account)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{account.type}</CardTitle>
              {getAccountIcon(account.type)}
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">{account.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No accounts yet</p>
            <p className="text-sm text-muted-foreground mb-4">Get started by adding your first account</p>
            <Button onClick={onAddAccount}>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};