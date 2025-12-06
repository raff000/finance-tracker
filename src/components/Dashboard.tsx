import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Scale, Plus, Bell } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";

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
  category_id?: string | null;
  account_id: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  type: string;
}

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  categories?: Category[];
  onAddTransaction?: () => void;
  onAddAccount?: () => void;
  onAddReminder?: () => void;
}

const ASSET_TYPES = ["Cash", "Savings", "Investment"];
const LIABILITY_TYPES = ["Credit Card", "Loan", "Liabilities"];

const CATEGORY_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const Dashboard = ({
  accounts,
  transactions,
  categories = [],
  onAddTransaction,
  onAddAccount,
  onAddReminder,
}: DashboardProps) => {
  const [monthsToShow, setMonthsToShow] = useState(6);

  // Responsive months calculation
  useEffect(() => {
    const updateMonths = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setMonthsToShow(3);
      } else if (width < 1024) {
        setMonthsToShow(6);
      } else {
        setMonthsToShow(12);
      }
    };

    updateMonths();
    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  // Calculate Net Worth (Assets - Liabilities)
  const netWorth = useMemo(() => {
    const assets = accounts
      .filter((acc) => ASSET_TYPES.includes(acc.type))
      .reduce((sum, acc) => sum + acc.balance, 0);
    const liabilities = accounts
      .filter((acc) => LIABILITY_TYPES.includes(acc.type))
      .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);
    return assets - liabilities;
  }, [accounts]);

  const recentTransactions = transactions.slice(0, 5);
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Calculate monthly income/expense data for chart
  const chartData = useMemo(() => {
    const now = new Date();
    const data = [];

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = parseISO(t.date);
        return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
      });

      const monthIncome = monthTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      const monthExpenses = monthTransactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      data.push({
        month: format(monthDate, "MMM"),
        income: monthIncome,
        expenses: monthExpenses,
      });
    }

    return data;
  }, [transactions, monthsToShow]);

  // Calculate expense breakdown by category
  const expenseByCategory = useMemo(() => {
    const expenseTransactions = transactions.filter((t) => t.amount < 0);
    const categoryMap = new Map<string, { name: string; value: number; color: string }>();

    expenseTransactions.forEach((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      const categoryName = category?.name || t.category || "Uncategorized";
      const categoryColor = category?.color || CATEGORY_COLORS[categoryMap.size % CATEGORY_COLORS.length];

      const existing = categoryMap.get(categoryName);
      if (existing) {
        existing.value += Math.abs(t.amount);
      } else {
        categoryMap.set(categoryName, {
          name: categoryName,
          value: Math.abs(t.amount),
          color: categoryColor,
        });
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--success))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your finances</p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAddTransaction} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
        <Button onClick={onAddAccount} variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
        <Button onClick={onAddReminder} variant="outline" size="sm" className="gap-2" disabled>
          <Bell className="h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-base">Net Worth</CardTitle>
            <Scale className="text-muted-foreground w-[18px] h-[18px]" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netWorth >= 0 ? "text-success" : "text-destructive"}`}>
              ${netWorth.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">Assets minus liabilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-base">Income</CardTitle>
            <ArrowUpRight className="text-success w-[18px] h-[18px]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              +${income.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-base">Expenses</CardTitle>
            <ArrowDownRight className="text-destructive w-[18px] h-[18px]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              -${expenses.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
      </Card>

      {/* Expense Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseByCategory.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <ChartContainer config={{}} className="h-[250px] w-full max-w-[300px]">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="font-medium">{data.name}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${data.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
              <div className="flex flex-wrap gap-3 justify-center lg:flex-col lg:justify-start">
                {expenseByCategory.slice(0, 6).map((category) => (
                  <div key={category.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="truncate max-w-[120px]">{category.name}</span>
                    <span className="text-muted-foreground">
                      ${category.value.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No expense data available
            </div>
          )}
        </CardContent>
      </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-base">Net Savings</CardTitle>
            <TrendingUp className="text-muted-foreground w-[18px] h-[18px]" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${income - expenses >= 0 ? "text-success" : "text-destructive"}`}
            >
              ${(income - expenses).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Income/Expense Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions & Accounts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div
                    className={`font-semibold ${transaction.amount >= 0 ? "text-success" : "text-destructive"}`}
                  >
                    {transaction.amount >= 0 ? "+" : "-"}$
                    {Math.abs(transaction.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{account.name}</p>
                    <p className="text-sm text-muted-foreground">{account.type}</p>
                  </div>
                  <div className="font-semibold">
                    ${account.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
