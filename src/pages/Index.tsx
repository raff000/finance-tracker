import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Accounts } from "@/components/Accounts";
import { Transactions } from "@/components/Transactions";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Wallet, Receipt } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type View = "dashboard" | "accounts" | "transactions";

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
  account: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([
    { id: "1", name: "Main Checking", balance: 5420.50, type: "Checking" },
    { id: "2", name: "Savings Account", balance: 12350.00, type: "Savings" },
    { id: "3", name: "Credit Card", balance: -1250.30, type: "Credit" },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", description: "Salary Deposit", amount: 3500.00, date: "2024-01-15", category: "Income", account: "Main Checking" },
    { id: "2", description: "Grocery Store", amount: -125.50, date: "2024-01-14", category: "Food", account: "Credit Card" },
    { id: "3", description: "Electric Bill", amount: -89.99, date: "2024-01-13", category: "Bills", account: "Main Checking" },
    { id: "4", description: "Restaurant", amount: -65.00, date: "2024-01-12", category: "Food", account: "Credit Card" },
    { id: "5", description: "Gas Station", amount: -45.20, date: "2024-01-11", category: "Transport", account: "Main Checking" },
  ]);

  const handleAddAccount = (newAccount: { name: string; balance: number; type: string }) => {
    const account: Account = {
      id: Date.now().toString(),
      ...newAccount,
    };
    setAccounts([...accounts, account]);
  };

  const handleAddTransaction = (newTransaction: {
    description: string;
    amount: number;
    date: string;
    category: string;
    account: string;
  }) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      ...newTransaction,
    };
    setTransactions([transaction, ...transactions]);
  };

  const renderContent = () => {
    switch (currentView) {
      case "accounts":
        return (
          <Accounts 
            accounts={accounts} 
            onAddAccount={() => setShowAddAccount(true)} 
          />
        );
      case "transactions":
        return (
          <Transactions 
            transactions={transactions} 
            onAddTransaction={() => setShowAddTransaction(true)} 
          />
        );
      default:
        return <Dashboard accounts={accounts} transactions={transactions} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sidebar-primary-foreground">FinanceApp</h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">Personal Finance Manager</p>
        </div>

        <nav className="space-y-2 flex-1">
          <Button
            variant={currentView === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={currentView === "accounts" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("accounts")}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Accounts
          </Button>
          <Button
            variant={currentView === "transactions" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setCurrentView("transactions")}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Transactions
          </Button>
        </nav>

        <div className="pt-6 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60">© 2024 FinanceApp</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-background">
        {renderContent()}
      </main>

      {/* Dialogs */}
      <AddAccountDialog
        open={showAddAccount}
        onOpenChange={setShowAddAccount}
        onAddAccount={handleAddAccount}
      />
      <AddTransactionDialog
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        accounts={accounts}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

export default Index;
