import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dashboard } from "@/components/Dashboard";
import { Accounts } from "@/components/Accounts";
import { Transactions } from "@/components/Transactions";
import { Categories } from "@/components/Categories";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { EditAccountDialog } from "@/components/EditAccountDialog";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { EditTransactionDialog } from "@/components/EditTransactionDialog";
import { PreferencesDialog } from "@/components/PreferencesDialog";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import AuthDialog from "@/components/AuthDialog";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/useProfile";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { useCategories } from "@/hooks/useCategories";
import { Session } from "@supabase/supabase-js";

type View = "dashboard" | "accounts" | "transactions" | "categories";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const navigate = useNavigate();

  const { data: profile, refetch: refetchProfile } = useProfile(session?.user?.id);
  const { data: accounts = [], addAccount, isAddingAccount, updateAccount, deleteAccount } = useAccounts(session?.user?.id);
  const { data: transactions = [], addTransaction, isAddingTransaction, updateTransaction, deleteTransaction } = useTransactions(session?.user?.id);
  const {
    categories,
    subcategories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
  } = useCategories(session?.user?.id);

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

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleAddAccount = (newAccount: { 
    name: string; 
    balance: number; 
    type: string;
    opening_date: string;
    currency: string;
    notes?: string;
    status: string;
    bank_name?: string;
    cut_day?: number;
    investment_length?: string;
    interest_rate?: number;
    due_date?: string;
    auto_renew?: boolean;
    reinvest_interest?: boolean;
    grace_period?: number;
    payment_reminder?: boolean;
    reminder_days_before?: number;
    overdue_interest_rate?: number;
    overdue_penalty?: number;
    principal?: number;
    apr?: number;
    loan_term?: string;
    repayment_structure?: string;
    collateral?: string;
    late_payment_interest?: number;
  }) => {
    addAccount(newAccount);
  };

  const handleAddTransaction = (newTransaction: {
    description: string;
    amount: number;
    date: string;
    category: string;
    account_id: string;
    category_id?: string;
    subcategory_id?: string;
    transaction_type?: string;
    transfer_id?: string;
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
            onAccountClick={(account) => setEditingAccount(account)}
          />
        );
      case "transactions":
        return (
          <Transactions 
            transactions={transactions}
            accounts={accounts}
            categories={categories}
            subcategories={subcategories}
            onAddTransaction={() => setShowAddTransaction(true)}
            onTransactionClick={(transaction) => setEditingTransaction(transaction)}
          />
        );
      case "categories":
        return (
          <Categories
            categories={categories}
            subcategories={subcategories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onAddSubcategory={addSubcategory}
            onUpdateSubcategory={updateSubcategory}
            onDeleteSubcategory={deleteSubcategory}
          />
        );
      default:
        return <Dashboard accounts={accounts} transactions={transactions} />;
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <AppSidebar currentView={currentView} onViewChange={handleViewChange} />

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
        <EditAccountDialog
          open={!!editingAccount}
          onOpenChange={(open) => !open && setEditingAccount(null)}
          account={editingAccount}
          onUpdateAccount={updateAccount}
          onDeleteAccount={deleteAccount}
        />
        <AddTransactionDialog
          open={showAddTransaction}
          onOpenChange={setShowAddTransaction}
          accounts={accounts}
          categories={categories}
          subcategories={subcategories}
          onAddTransaction={handleAddTransaction}
        />
        <EditTransactionDialog
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          transaction={editingTransaction}
          accounts={accounts}
          categories={categories}
          subcategories={subcategories}
          onUpdateTransaction={updateTransaction}
          onDeleteTransaction={deleteTransaction}
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
