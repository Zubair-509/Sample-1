import { Settings } from 'lucide-react';
import { EXPENSE_CATEGORIES, type MonthSummary } from '../types/transaction';
import type { BudgetMap } from '../hooks/useBudgets';
import { formatAmount } from '../lib/format';

interface BudgetOverviewPanelProps {
  budgets: BudgetMap;
  expensesByCategory: MonthSummary['expensesByCategory'];
  onManage: () => void;
}

function pct(spent: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min((spent / limit) * 100, 100);
}

function barColor(ratio: number): string {
  if (ratio >= 1) return 'bg-expense-text';   // over budget — red
  if (ratio >= 0.8) return 'bg-amber-500';    // warning — amber
  return 'bg-primary-600';                    // healthy — green
}

function labelColor(ratio: number): string {
  if (ratio >= 1) return 'text-expense-text';
  if (ratio >= 0.8) return 'text-amber-600';
  return 'text-primary-700';
}

export function BudgetOverviewPanel({ budgets, expensesByCategory, onManage }: BudgetOverviewPanelProps) {
  const rows = EXPENSE_CATEGORIES.filter((cat) => ((budgets ?? {})[cat] ?? 0) > 0).map((cat) => {
    const limit = budgets[cat]!;
    const spent = expensesByCategory[cat] ?? 0;
    const ratio = spent / limit;
    return { cat, limit, spent, ratio };
  });

  if (rows.length === 0) return null;

  const overBudgetCount = rows.filter((r) => r.ratio >= 1).length;

  return (
    <section className="rounded-lg border border-neutral-100 bg-white p-5 shadow-card lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-neutral-900">Monthly Budget</h2>
          {overBudgetCount > 0 ? (
            <p className="mt-0.5 font-body text-sm text-expense-text">
              {overBudgetCount} {overBudgetCount === 1 ? 'category' : 'categories'} over budget
            </p>
          ) : (
            <p className="mt-0.5 font-body text-sm text-neutral-500">Spending vs. your limits</p>
          )}
        </div>
        <button
          type="button"
          onClick={onManage}
          aria-label="Manage budgets"
          title="Manage budgets"
          className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <Settings size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map(({ cat, limit, spent, ratio }) => (
          <div key={cat} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-body text-sm font-medium text-neutral-700">{cat}</span>
              <span className={`font-mono text-xs font-semibold tabular-nums ${labelColor(ratio)}`}>
                {Math.round(ratio * 100)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor(ratio)}`}
                style={{ width: `${pct(spent, limit)}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-body text-xs text-neutral-500">
                {formatAmount(spent)} spent
              </span>
              <span className="font-body text-xs text-neutral-400">
                of {formatAmount(limit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
