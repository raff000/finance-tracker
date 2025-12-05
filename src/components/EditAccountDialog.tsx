import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
  opening_date?: string | null;
  currency: string;
  notes?: string | null;
  status: string;
  bank_name?: string | null;
  cut_day?: number | null;
  investment_length?: string | null;
  interest_rate?: number | null;
  due_date?: string | null;
  auto_renew?: boolean | null;
  reinvest_interest?: boolean | null;
  grace_period?: number | null;
  payment_reminder?: boolean | null;
  reminder_days_before?: number | null;
  overdue_interest_rate?: number | null;
  overdue_penalty?: number | null;
  principal?: number | null;
  apr?: number | null;
  loan_term?: string | null;
  repayment_structure?: string | null;
  collateral?: string | null;
  late_payment_interest?: number | null;
}

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onUpdateAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
}

const ACCOUNT_TYPES = ["Cash", "Savings", "Investment", "Credit Cards", "Loan", "Liabilities"];
const INVESTMENT_LENGTHS = ["30 days", "60 days", "90 days", "6 months", "1 year", "2 years"];
const REPAYMENT_STRUCTURES = ["Fixed", "Variable", "Interest-only", "Balloon"];

export const EditAccountDialog = ({ open, onOpenChange, account, onUpdateAccount, onDeleteAccount }: EditAccountDialogProps) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("");
  const [openingDate, setOpeningDate] = useState<Date>(new Date());
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("active");
  const [bankName, setBankName] = useState("");
  const [cutDay, setCutDay] = useState("");
  const [investmentLength, setInvestmentLength] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [autoRenew, setAutoRenew] = useState(false);
  const [reinvestInterest, setReinvestInterest] = useState(false);
  const [gracePeriod, setGracePeriod] = useState("");
  const [paymentReminder, setPaymentReminder] = useState(false);
  const [reminderDaysBefore, setReminderDaysBefore] = useState("");
  const [overdueInterestRate, setOverdueInterestRate] = useState("");
  const [overduePenalty, setOverduePenalty] = useState("");
  const [principal, setPrincipal] = useState("");
  const [apr, setApr] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [repaymentStructure, setRepaymentStructure] = useState("");
  const [collateral, setCollateral] = useState("");
  const [latePaymentInterest, setLatePaymentInterest] = useState("");

  useEffect(() => {
    if (account) {
      setName(account.name);
      setBalance(account.balance.toString());
      setType(account.type);
      setOpeningDate(account.opening_date ? parseISO(account.opening_date) : new Date());
      setCurrency(account.currency);
      setNotes(account.notes || "");
      setStatus(account.status);
      setBankName(account.bank_name || "");
      setCutDay(account.cut_day?.toString() || "");
      setInvestmentLength(account.investment_length || "");
      setInterestRate(account.interest_rate?.toString() || "");
      setDueDate(account.due_date ? parseISO(account.due_date) : undefined);
      setAutoRenew(account.auto_renew || false);
      setReinvestInterest(account.reinvest_interest || false);
      setGracePeriod(account.grace_period?.toString() || "");
      setPaymentReminder(account.payment_reminder || false);
      setReminderDaysBefore(account.reminder_days_before?.toString() || "");
      setOverdueInterestRate(account.overdue_interest_rate?.toString() || "");
      setOverduePenalty(account.overdue_penalty?.toString() || "");
      setPrincipal(account.principal?.toString() || "");
      setApr(account.apr?.toString() || "");
      setLoanTerm(account.loan_term || "");
      setRepaymentStructure(account.repayment_structure || "");
      setCollateral(account.collateral || "");
      setLatePaymentInterest(account.late_payment_interest?.toString() || "");
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !name || !balance || !type) return;

    const accountData: Account = {
      id: account.id,
      name,
      balance: parseFloat(balance),
      type,
      opening_date: format(openingDate, "yyyy-MM-dd"),
      currency,
      notes: notes || null,
      status,
      bank_name: bankName || null,
      cut_day: cutDay ? parseInt(cutDay) : null,
      investment_length: investmentLength || null,
      interest_rate: interestRate ? parseFloat(interestRate) : null,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      auto_renew: autoRenew,
      reinvest_interest: reinvestInterest,
      grace_period: gracePeriod ? parseInt(gracePeriod) : null,
      payment_reminder: paymentReminder,
      reminder_days_before: reminderDaysBefore ? parseInt(reminderDaysBefore) : null,
      overdue_interest_rate: overdueInterestRate ? parseFloat(overdueInterestRate) : null,
      overdue_penalty: overduePenalty ? parseFloat(overduePenalty) : null,
      principal: principal ? parseFloat(principal) : null,
      apr: apr ? parseFloat(apr) : null,
      loan_term: loanTerm || null,
      repayment_structure: repaymentStructure || null,
      collateral: collateral || null,
      late_payment_interest: latePaymentInterest ? parseFloat(latePaymentInterest) : null,
    };

    onUpdateAccount(accountData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (account) {
      onDeleteAccount(account.id);
      onOpenChange(false);
    }
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case "Savings":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Savings Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cutDay">Cut Day (1-31)</Label>
                <Input id="cutDay" type="number" min="1" max="31" value={cutDay} onChange={(e) => setCutDay(e.target.value)} />
              </div>
            </div>
          </div>
        );
      case "Investment":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Investment Details</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="investmentLength">Length</Label>
                  <Select value={investmentLength} onValueChange={setInvestmentLength}>
                    <SelectTrigger><SelectValue placeholder="Select length" /></SelectTrigger>
                    <SelectContent>
                      {INVESTMENT_LENGTHS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input id="interestRate" type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="autoRenew" checked={autoRenew} onCheckedChange={setAutoRenew} />
                  <Label htmlFor="autoRenew">Auto Renew?</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="reinvestInterest" checked={reinvestInterest} onCheckedChange={setReinvestInterest} />
                  <Label htmlFor="reinvestInterest">Reinvest Interest?</Label>
                </div>
              </div>
            </div>
          </div>
        );
      case "Credit Cards":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Credit Card Details</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cutDay">Cut Day (1-31)</Label>
                  <Input id="cutDay" type="number" min="1" max="31" value={cutDay} onChange={(e) => setCutDay(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                  <Input id="gracePeriod" type="number" value={gracePeriod} onChange={(e) => setGracePeriod(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reminderDays">Reminder Days Before</Label>
                  <Input id="reminderDays" type="number" value={reminderDaysBefore} onChange={(e) => setReminderDaysBefore(e.target.value)} disabled={!paymentReminder} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="paymentReminder" checked={paymentReminder} onCheckedChange={setPaymentReminder} />
                <Label htmlFor="paymentReminder">Payment Reminder?</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="overdueInterestRate">Overdue Interest Rate (%)</Label>
                  <Input id="overdueInterestRate" type="number" step="0.01" value={overdueInterestRate} onChange={(e) => setOverdueInterestRate(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="overduePenalty">Overdue Penalty</Label>
                  <Input id="overduePenalty" type="number" step="0.01" value={overduePenalty} onChange={(e) => setOverduePenalty(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        );
      case "Loan":
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Loan Details</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="principal">Principal</Label>
                  <Input id="principal" type="number" step="0.01" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="apr">APR (%)</Label>
                  <Input id="apr" type="number" step="0.01" value={apr} onChange={(e) => setApr(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="loanTerm">Loan Term</Label>
                  <Input id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="repaymentStructure">Repayment Structure</Label>
                  <Select value={repaymentStructure} onValueChange={setRepaymentStructure}>
                    <SelectTrigger><SelectValue placeholder="Select structure" /></SelectTrigger>
                    <SelectContent>
                      {REPAYMENT_STRUCTURES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="latePaymentInterest">Late Payment Interest (%)</Label>
                  <Input id="latePaymentInterest" type="number" step="0.01" value={latePaymentInterest} onChange={(e) => setLatePaymentInterest(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collateral">Collateral</Label>
                <Input id="collateral" value={collateral} onChange={(e) => setCollateral(e.target.value)} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>Update account details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Account Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Account Type</Label>
                    <Select value={type} onValueChange={setType} required>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {ACCOUNT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus} required>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Financial Details</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="balance">Balance</Label>
                    <Input id="balance" type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency} required>
                      <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Opening Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("justify-start text-left font-normal", !openingDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {openingDate ? format(openingDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={openingDate} onSelect={(d) => d && setOpeningDate(d)} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            {renderTypeSpecificFields()}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Additional Information</h3>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. This will permanently delete the account.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};