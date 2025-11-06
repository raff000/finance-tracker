import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, CreditCard, PiggyBank } from "lucide-react";

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

interface AccountsProps {
  accounts: Account[];
  onAddAccount: () => void;
}

const getAccountIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "checking":
      return <Wallet className="h-5 w-5" />;
    case "savings":
      return <PiggyBank className="h-5 w-5" />;
    case "credit":
      return <CreditCard className="h-5 w-5" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
};

export const Accounts = ({ accounts, onAddAccount }: AccountsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">Manage your financial accounts</p>
        </div>
        <Button onClick={onAddAccount}>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
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
