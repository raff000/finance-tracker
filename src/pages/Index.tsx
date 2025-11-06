import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Accounts } from "@/components/Accounts";
import { Transactions } from "@/components/Transactions";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />

        <div className="flex-1 flex flex-col w-full">
          {/* Mobile Header */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
            <SidebarTrigger />
            <h2 className="font-semibold capitalize">{currentView}</h2>
          </header>

          {/* Desktop Header */}
          <header className="sticky top-0 z-10 hidden lg:flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h2 className="font-semibold capitalize">{currentView}</h2>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-auto">
            {renderContent()}
          </main>
        </div>

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
    </SidebarProvider>
  );
};

export default Index;
