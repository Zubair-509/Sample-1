import { EXPENSE_CATEGORIES, type MonthSummary, type Transaction } from '../types/transaction';

/** "2026-05-01" -> "2026-05" */
export function monthKeyOf(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function transactionsForMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  return transactions.filter((t) => monthKeyOf(t.date) === monthKey);
}

const emptyExpensesByCategory = () =>
  Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c, 0])) as MonthSummary['expensesByCategory'];

// PRD §11.2 — Dashboard State is computed from the ledger, never stored,
// so every screen (cards, chart, tax summary) always agrees with each other.
export function summarizeMonth(transactions: Transaction[], monthKey: string): MonthSummary {
  const monthly = transactionsForMonth(transactions, monthKey);
  const expensesByCategory = emptyExpensesByCategory();

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const t of monthly) {
    if (t.transaction_type === 'income') {
      totalIncome += t.total_amount;
    } else {
      totalExpenses += t.total_amount;
      if (t.category in expensesByCategory) {
        expensesByCategory[t.category as keyof typeof expensesByCategory] += t.total_amount;
      }
    }
  }

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    transactionCount: monthly.length,
    expensesByCategory,
  };
}

/** Months that actually have transactions, newest first — drives the month selector. */
export function availableMonths(transactions: Transaction[]): string[] {
  const keys = new Set(transactions.map((t) => monthKeyOf(t.date)));
  return Array.from(keys).sort((a, b) => (a < b ? 1 : -1));
}

export interface MonthTrendPoint {
  monthKey: string;   // "2026-05"
  label: string;      // "May '26"
  income: number;
  expenses: number;
  profit: number;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} '${year.slice(2)}`;
}

/**
 * Returns up to `count` consecutive months ending at `latestMonthKey`,
 * each with summed income, expenses, and profit.
 * Months with no transactions still appear with zeros.
 */
export function monthlyTrend(
  transactions: Transaction[],
  latestMonthKey: string | undefined,
  count = 6,
): MonthTrendPoint[] {
  // Guard: return empty array if no month key yet
  if (!latestMonthKey) return [];

  // Build list of month keys from oldest to newest
  const [year, month] = latestMonthKey.split('-').map(Number);
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  // Aggregate totals per month
  const totals = new Map<string, { income: number; expenses: number }>();
  for (const t of transactions) {
    const key = monthKeyOf(t.date);
    if (!totals.has(key)) totals.set(key, { income: 0, expenses: 0 });
    const entry = totals.get(key)!;
    if (t.transaction_type === 'income') entry.income += t.total_amount;
    else entry.expenses += t.total_amount;
  }

  return keys.map((key) => {
    const { income, expenses } = totals.get(key) ?? { income: 0, expenses: 0 };
    return { monthKey: key, label: monthLabel(key), income, expenses, profit: income - expenses };
  });
}
