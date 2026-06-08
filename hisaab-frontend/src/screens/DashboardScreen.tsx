import { motion } from 'framer-motion';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { SummaryCard } from '../components/SummaryCard';
import { CategoryBarChart } from '../components/CategoryBarChart';
import { MonthlyTrendChart } from '../components/MonthlyTrendChart';
import { BudgetOverviewPanel } from '../components/BudgetOverviewPanel';
import { RecurringWidget } from '../components/RecurringWidget';
import { TransactionTypeBadge } from '../components/TransactionTypeBadge';
import { CategoryChip } from '../components/CategoryChip';
import { EmptyState } from '../components/EmptyState';
import { formatPKR, formatShortDate } from '../lib/format';
import { monthlyTrend } from '../lib/dashboard';
import type { MonthSummary, Transaction } from '../types/transaction';
import type { BudgetMap } from '../hooks/useBudgets';
import type { RecurringTemplate } from '../hooks/useRecurring';
import type { ScreenId } from '../components/NavTabs';

interface DashboardScreenProps {
  summary: MonthSummary;
  monthTransactions: Transaction[];
  allTransactions: Transaction[];
  selectedMonth: string;
  budgets: BudgetMap;
  recurringTemplates: RecurringTemplate[];
  appliedRecurringIds: Set<string>;
  onNavigate: (screen: ScreenId) => void;
  onScanReceipt: () => void;
  onAddManually: () => void;
  onManageBudgets: () => void;
  onManageRecurring: () => void;
}

export function DashboardScreen({
  summary,
  monthTransactions,
  allTransactions,
  selectedMonth,
  budgets,
  recurringTemplates,
  appliedRecurringIds,
  onNavigate,
  onScanReceipt,
  onAddManually,
  onManageBudgets,
  onManageRecurring,
}: DashboardScreenProps) {
  const recent = [...monthTransactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 5);

  const trendData = useMemo(
    () => monthlyTrend(allTransactions, selectedMonth, 6),
    [allTransactions, selectedMonth],
  );

  const hasBudgets = Object.values(budgets ?? {}).some((v) => v != null && v > 0);
  const activeRecurring = (recurringTemplates ?? []).filter((t) => t.is_active);

  if (monthTransactions.length === 0 && allTransactions.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10">
        <EmptyState onScanReceipt={onScanReceipt} onAddManually={onAddManually} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard kind="income" label="Total Income" value={summary.totalIncome} index={0} />
        <SummaryCard kind="expenses" label="Total Expenses" value={summary.totalExpenses} index={1} />
        <SummaryCard kind="profit" label="Net Profit" value={summary.netProfit} index={2} />
        <SummaryCard kind="count" label="Transactions" value={summary.transactionCount} index={3} />
      </div>

      {/* 6-month trend */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-lg border border-neutral-100 bg-white p-5 shadow-card lg:p-6"
      >
        <h2 className="font-display text-lg font-semibold text-neutral-900">Income vs. Expenses</h2>
        <p className="mt-0.5 font-body text-sm text-neutral-500">Last 6 months at a glance</p>
        <div className="mt-5">
          <MonthlyTrendChart data={trendData} />
        </div>
      </motion.section>

      {/* Budget overview + Recurring side by side (when both exist) or full-width individually */}
      {(hasBudgets || activeRecurring.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`grid grid-cols-1 gap-4 ${hasBudgets && activeRecurring.length > 0 ? 'lg:grid-cols-3' : ''}`}
        >
          {hasBudgets && (
            <div className={activeRecurring.length > 0 ? 'lg:col-span-2' : ''}>
              <BudgetOverviewPanel
                budgets={budgets}
                expensesByCategory={summary.expensesByCategory}
                onManage={onManageBudgets}
              />
            </div>
          )}
          {activeRecurring.length > 0 && (
            <RecurringWidget
              templates={activeRecurring}
              appliedIds={appliedRecurringIds}
              selectedMonth={selectedMonth}
              onManage={onManageRecurring}
            />
          )}
        </motion.div>
      )}

      {/* Category breakdown + recent transactions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-lg border border-neutral-100 bg-white p-5 shadow-card lg:col-span-2 lg:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-neutral-900">Expenses by Category</h2>
              <p className="mt-0.5 font-body text-sm text-neutral-500">Where this month's money went</p>
            </div>
            {!hasBudgets && (
              <button
                type="button"
                onClick={onManageBudgets}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-body text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                <SlidersHorizontal size={13} aria-hidden="true" />
                Set budgets
              </button>
            )}
          </div>
          <div className="mt-4">
            <CategoryBarChart expensesByCategory={summary.expensesByCategory} />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.42, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-lg border border-neutral-100 bg-white p-5 shadow-card lg:p-6"
        >
          <h2 className="font-display text-lg font-semibold text-neutral-900">Recent Transactions</h2>
          <ul className="mt-3 divide-y divide-neutral-100">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-medium text-neutral-900">{t.vendor_name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="font-body text-xs text-neutral-500">{formatShortDate(t.date)}</span>
                    <CategoryChip category={t.category} />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <TransactionTypeBadge type={t.transaction_type} />
                  <span
                    className={`font-mono text-sm font-medium tabular-nums ${
                      t.transaction_type === 'income' ? 'text-income-text' : 'text-expense-text'
                    }`}
                  >
                    {formatPKR(t.transaction_type === 'income' ? t.total_amount : -t.total_amount, { signed: true })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {monthTransactions.length === 0 ? (
            <p className="mt-3 font-body text-sm text-neutral-400">No transactions this month.</p>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('ledger')}
              className="mt-3 inline-flex items-center gap-1 font-body text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
            >
              View all <ArrowRight size={14} aria-hidden="true" />
            </button>
          )}
        </motion.section>
      </div>
    </div>
  );
}
