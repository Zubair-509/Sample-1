// Mirrors the Transaction Object schema in Hisaab_PRD.md §11.1
// "Sales" is included alongside the 8 official categories (PRD FR-06)
// because the pre-loaded demo dataset (PRD Appendix B) tags every
// income row as "Sales" — it never appears as an expense category.

export const EXPENSE_CATEGORIES = [
  'Inventory',
  'Utilities',
  'Transport',
  'Equipment',
  'Services',
  'Salary',
  'Food',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type Category = ExpenseCategory | 'Sales';

export type TransactionType = 'income' | 'expense';
export type TransactionSource = 'scan' | 'manual';

export interface TransactionItem {
  description: string;
  quantity: number | null;
  unit_price: number | null;
  total: number;
}

export interface Transaction {
  id: string;
  created_at: string; // ISO 8601 timestamp
  source: TransactionSource;
  transaction_type: TransactionType;
  vendor_name: string;
  date: string; // YYYY-MM-DD
  category: Category;
  total_amount: number;
  items: TransactionItem[];
  tax_amount: number | null;
  notes: string | null;
}

// PRD §11.2 — Dashboard State (computed from transactions, never stored)
export interface MonthSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
  expensesByCategory: Record<ExpenseCategory, number>;
}

// PRD §10.2 — shape returned by the Gemini extraction endpoint
export interface ExtractedReceipt {
  transaction_type: TransactionType;
  vendor_name: string;
  date: string | null;
  items: TransactionItem[];
  subtotal: number;
  tax_amount: number | null;
  total_amount: number;
  currency: 'PKR';
  category: Category;
  notes: string | null;
  unclear_fields?: string[];
}
