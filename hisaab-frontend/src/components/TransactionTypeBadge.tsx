import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { TransactionType } from '../types/transaction';

// Income/expense badge — Hisaab_Design_Document.md §6.3 + §3.5
// Color is never the sole differentiator: icon + label always accompany it.
export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  const isIncome = type === 'income';
  const Icon = isIncome ? ArrowDownCircle : ArrowUpCircle;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-body text-[11px] font-semibold uppercase tracking-wide ${
        isIncome ? 'bg-income-bg text-income-text' : 'bg-expense-bg text-expense-text'
      }`}
    >
      <Icon size={12} aria-hidden="true" />
      {isIncome ? 'Income' : 'Expense'}
    </span>
  );
}
