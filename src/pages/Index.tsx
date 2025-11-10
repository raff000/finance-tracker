import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dashboard } from "@/components/Dashboard";
import { Accounts } from "@/components/Accounts";
import { Transactions } from "@/components/Transactions";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { PreferencesDialog } from "@/components/PreferencesDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import AuthDialog from "@/components/AuthDialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/useProfile";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { Session } from "@supabase/supabase-js";

type View = "dashboard" | "accounts" | "transactions";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const { data: profile, refetch: refetchProfile } = useProfile(session?.user?.id);
  const { data: accounts = [], addAccount, isAddingAccount } = useAccounts(session?.user?.id);
  const { data: transactions = [], addTransaction, isAddingTransaction } = useTransactions(session?.user?.id);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setShowAuth(!session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setShowAuth(!session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAddAccount = (newAccount: { 
    name: string; 
    balance: number; 
    type: string;
    opening_date: string;
    currency: string;
    notes?: string;
    status: string;
  }) => {
    addAccount(newAccount);
  };

  const handleAddTransaction = (newTransaction: {
    description: string;
    amount: number;
    date: string;
    category: string;
    account_id: string;
  }) => {
    addTransaction(newTransaction);
  };

  if (!session) {
    return <AuthDialog open={showAuth} onOpenChange={setShowAuth} />;
  }

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
            accounts={accounts}
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
            <h2 className="font-semibold capitalize flex-1">{currentView}</h2>
            <UserMenu profile={profile} onOpenPreferences={() => setShowPreferences(true)} />
          </header>

          {/* Desktop Header */}
          <header className="sticky top-0 z-10 hidden lg:flex h-14 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h2 className="font-semibold capitalize flex-1">{currentView}</h2>
            <UserMenu profile={profile} onOpenPreferences={() => setShowPreferences(true)} />
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
        <PreferencesDialog
          open={showPreferences}
          onOpenChange={setShowPreferences}
          profile={profile}
          onProfileUpdate={refetchProfile}
        />
        <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
      </div>
    </SidebarProvider>
  );
};

export default Index;
