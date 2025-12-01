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
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAccount: (account: { 
    name: string; 
    balance: number; 
    type: string;
    opening_date: string;
    currency: string;
    notes?: string;
    status: string;
    // Savings & shared fields
    bank_name?: string;
    cut_day?: number;
    // Investment fields
    investment_length?: string;
    interest_rate?: number;
    due_date?: string;
    auto_renew?: boolean;
    reinvest_interest?: boolean;
    // Credit Card fields
    grace_period?: number;
    payment_reminder?: boolean;
    reminder_days_before?: number;
    overdue_interest_rate?: number;
    overdue_penalty?: number;
    // Loan fields
    principal?: number;
    apr?: number;
    loan_term?: string;
    repayment_structure?: string;
    collateral?: string;
    late_payment_interest?: number;
  }) => void;
}

const ACCOUNT_TYPES = [
  "Cash",
  "Savings",
  "Investment",
  "Credit Cards",
  "Loan",
  "Liabilities",
];

const INVESTMENT_LENGTHS = [
  "30 days",
  "60 days",
  "90 days",
  "6 months",
  "1 year",
  "2 years",
];

const REPAYMENT_STRUCTURES = [
  "Fixed",
  "Variable",
  "Interest-only",
  "Balloon",
];

export const AddAccountDialog = ({ open, onOpenChange, onAddAccount }: AddAccountDialogProps) => {
  // Basic fields
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("");
  const [openingDate, setOpeningDate] = useState<Date>(new Date());
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("active");

  // Shared fields
  const [bankName, setBankName] = useState("");
  const [cutDay, setCutDay] = useState("");

  // Investment fields
  const [investmentLength, setInvestmentLength] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [autoRenew, setAutoRenew] = useState(false);
  const [reinvestInterest, setReinvestInterest] = useState(false);

  // Credit Card fields
  const [gracePeriod, setGracePeriod] = useState("");
  const [paymentReminder, setPaymentReminder] = useState(false);
  const [reminderDaysBefore, setReminderDaysBefore] = useState("");
  const [overdueInterestRate, setOverdueInterestRate] = useState("");
  const [overduePenalty, setOverduePenalty] = useState("");

  // Loan fields
  const [principal, setPrincipal] = useState("");
  const [apr, setApr] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [repaymentStructure, setRepaymentStructure] = useState("");
  const [collateral, setCollateral] = useState("");
  const [latePaymentInterest, setLatePaymentInterest] = useState("");

  // Reset type-specific fields when type changes
  useEffect(() => {
    setBankName("");
    setCutDay("");
    setInvestmentLength("");
    setInterestRate("");
    setDueDate(undefined);
    setAutoRenew(false);
    setReinvestInterest(false);
    setGracePeriod("");
    setPaymentReminder(false);
    setReminderDaysBefore("");
    setOverdueInterestRate("");
    setOverduePenalty("");
    setPrincipal("");
    setApr("");
    setLoanTerm("");
    setRepaymentStructure("");
    setCollateral("");
    setLatePaymentInterest("");
  }, [type]);

  const resetForm = () => {
    setName("");
    setBalance("");
    setType("");
    setOpeningDate(new Date());
    setCurrency("USD");
    setNotes("");
    setStatus("active");
    setBankName("");
    setCutDay("");
    setInvestmentLength("");
    setInterestRate("");
    setDueDate(undefined);
    setAutoRenew(false);
    setReinvestInterest(false);
    setGracePeriod("");
    setPaymentReminder(false);
    setReminderDaysBefore("");
    setOverdueInterestRate("");
    setOverduePenalty("");
    setPrincipal("");
    setApr("");
    setLoanTerm("");
    setRepaymentStructure("");
    setCollateral("");
    setLatePaymentInterest("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && balance && type && openingDate) {
      const accountData: Parameters<typeof onAddAccount>[0] = {
        name,
        balance: parseFloat(balance),
        type,
        opening_date: format(openingDate, "yyyy-MM-dd"),
        currency,
        notes: notes || undefined,
        status,
      };

      // Add type-specific fields
      if (type === "Savings") {
        accountData.bank_name = bankName || undefined;
        accountData.cut_day = cutDay ? parseInt(cutDay) : undefined;
      } else if (type === "Investment") {
        accountData.bank_name = bankName || undefined;
        accountData.investment_length = investmentLength || undefined;
        accountData.interest_rate = interestRate ? parseFloat(interestRate) : undefined;
        accountData.due_date = dueDate ? format(dueDate, "yyyy-MM-dd") : undefined;
        accountData.auto_renew = autoRenew;
        accountData.reinvest_interest = reinvestInterest;
      } else if (type === "Credit Cards") {
        accountData.bank_name = bankName || undefined;
        accountData.cut_day = cutDay ? parseInt(cutDay) : undefined;
        accountData.grace_period = gracePeriod ? parseInt(gracePeriod) : undefined;
        accountData.payment_reminder = paymentReminder;
        accountData.reminder_days_before = reminderDaysBefore ? parseInt(reminderDaysBefore) : undefined;
        accountData.overdue_interest_rate = overdueInterestRate ? parseFloat(overdueInterestRate) : undefined;
        accountData.overdue_penalty = overduePenalty ? parseFloat(overduePenalty) : undefined;
      } else if (type === "Loan") {
        accountData.bank_name = bankName || undefined;
        accountData.principal = principal ? parseFloat(principal) : undefined;
        accountData.apr = apr ? parseFloat(apr) : undefined;
        accountData.loan_term = loanTerm || undefined;
        accountData.repayment_structure = repaymentStructure || undefined;
        accountData.collateral = collateral || undefined;
        accountData.late_payment_interest = latePaymentInterest ? parseFloat(latePaymentInterest) : undefined;
      }

      onAddAccount(accountData);
      resetForm();
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
                <Input
                  id="bankName"
                  placeholder="e.g., Chase Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cutDay">Cut Day (1-31)</Label>
                <Input
                  id="cutDay"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="15"
                  value={cutDay}
                  onChange={(e) => setCutDay(e.target.value)}
                />
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
                  <Input
                    id="bankName"
                    placeholder="e.g., Fidelity"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="investmentLength">Length</Label>
                  <Select value={investmentLength} onValueChange={setInvestmentLength}>
                    <SelectTrigger id="investmentLength">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      {INVESTMENT_LENGTHS.map((length) => (
                        <SelectItem key={length} value={length}>{length}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="5.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoRenew"
                    checked={autoRenew}
                    onCheckedChange={setAutoRenew}
                  />
                  <Label htmlFor="autoRenew">Auto Renew?</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reinvestInterest"
                    checked={reinvestInterest}
                    onCheckedChange={setReinvestInterest}
                  />
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
                  <Input
                    id="bankName"
                    placeholder="e.g., Capital One"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cutDay">Cut Day (1-31)</Label>
                  <Input
                    id="cutDay"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="15"
                    value={cutDay}
                    onChange={(e) => setCutDay(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    placeholder="21"
                    value={gracePeriod}
                    onChange={(e) => setGracePeriod(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reminderDays">Reminder Days Before</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    placeholder="3"
                    value={reminderDaysBefore}
                    onChange={(e) => setReminderDaysBefore(e.target.value)}
                    disabled={!paymentReminder}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="paymentReminder"
                  checked={paymentReminder}
                  onCheckedChange={setPaymentReminder}
                />
                <Label htmlFor="paymentReminder">Payment Reminder?</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="overdueInterestRate">Overdue Interest Rate (%)</Label>
                  <Input
                    id="overdueInterestRate"
                    type="number"
                    step="0.01"
                    placeholder="29.99"
                    value={overdueInterestRate}
                    onChange={(e) => setOverdueInterestRate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="overduePenalty">Overdue Penalty</Label>
                  <Input
                    id="overduePenalty"
                    type="number"
                    step="0.01"
                    placeholder="35.00"
                    value={overduePenalty}
                    onChange={(e) => setOverduePenalty(e.target.value)}
                  />
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
                  <Input
                    id="bankName"
                    placeholder="e.g., Wells Fargo"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="principal">Principal</Label>
                  <Input
                    id="principal"
                    type="number"
                    step="0.01"
                    placeholder="100000"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="apr">APR (%)</Label>
                  <Input
                    id="apr"
                    type="number"
                    step="0.01"
                    placeholder="6.5"
                    value={apr}
                    onChange={(e) => setApr(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="loanTerm">Loan Term</Label>
                  <Input
                    id="loanTerm"
                    placeholder="e.g., 30 years"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="repaymentStructure">Repayment Structure</Label>
                  <Select value={repaymentStructure} onValueChange={setRepaymentStructure}>
                    <SelectTrigger id="repaymentStructure">
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                    <SelectContent>
                      {REPAYMENT_STRUCTURES.map((structure) => (
                        <SelectItem key={structure} value={structure}>{structure}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="latePaymentInterest">Late Payment Interest (%)</Label>
                  <Input
                    id="latePaymentInterest"
                    type="number"
                    step="0.01"
                    placeholder="2.0"
                    value={latePaymentInterest}
                    onChange={(e) => setLatePaymentInterest(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collateral">Collateral</Label>
                <Input
                  id="collateral"
                  placeholder="e.g., Property at 123 Main St"
                  value={collateral}
                  onChange={(e) => setCollateral(e.target.value)}
                />
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
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Create a new account to track your finances.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Account Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Account Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Checking"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Account Type</Label>
                    <Select value={type} onValueChange={setType} required>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCOUNT_TYPES.map((accountType) => (
                          <SelectItem key={accountType} value={accountType}>
                            {accountType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus} required>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
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

            {/* Financial Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Financial Details</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="balance">Initial Balance</Label>
                    <Input
                      id="balance"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency} required>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
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
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !openingDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {openingDate ? format(openingDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={openingDate}
                        onSelect={(date) => date && setOpeningDate(date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Type-Specific Fields */}
            {renderTypeSpecificFields()}

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Additional Information</h3>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this account..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};