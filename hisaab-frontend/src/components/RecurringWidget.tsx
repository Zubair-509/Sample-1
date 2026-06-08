import { CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import type { RecurringTemplate } from '../hooks/useRecurring';
import { formatAmount } from '../lib/format';

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

interface RecurringWidgetProps {
  templates: RecurringTemplate[];
  /** Set of template IDs already applied this month */
  appliedIds: Set<string>;
  selectedMonth: string; // "2026-06"
  onManage: () => void;
}

export function RecurringWidget({ templates, appliedIds, selectedMonth, onManage }: RecurringWidgetProps) {
  if (templates.length === 0) return null;

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);
  const isCurrentMonth = selectedMonth === currentMonth;
  const todayDay = today.getDate();

  const rows = templates.map((t) => {
    const applied = appliedIds.has(t.id);
    const isDue = isCurrentMonth && !applied && t.day_of_month <= todayDay;
    const isUpcoming = isCurrentMonth && !applied && t.day_of_month > todayDay;
    return { t, applied, isDue, isUpcoming };
  });

  const dueCount = rows.filter((r) => r.isDue).length;

  return (
    <section className="rounded-lg border border-neutral-100 bg-white p-5 shadow-card lg:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw size={16} className="text-primary-600" aria-hidden="true" />
          <h2 className="font-display text-lg font-semibold text-neutral-900">Recurring</h2>
          {dueCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 px-1.5 font-body text-xs font-semibold text-amber-700">
              {dueCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onManage}
          className="font-body text-xs font-semibold text-primary-700 underline-offset-2 hover:underline"
        >
          Manage
        </button>
      </div>

      <ul className="mt-3 divide-y divide-neutral-100">
        {rows.map(({ t, applied, isDue, isUpcoming }) => (
          <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              {applied ? (
                <CheckCircle2 size={15} className="shrink-0 text-primary-600" aria-label="Applied" />
              ) : isDue ? (
                <Clock size={15} className="shrink-0 text-amber-500" aria-label="Due" />
              ) : (
                <Clock size={15} className="shrink-0 text-neutral-300" aria-label="Upcoming" />
              )}
              <div className="min-w-0">
                <p className="truncate font-body text-sm font-medium text-neutral-800">{t.vendor_name}</p>
                <p className="font-body text-xs text-neutral-400">
                  {applied
                    ? 'Applied this month'
                    : isDue
                    ? `Due ${ordinal(t.day_of_month)} — overdue`
                    : isUpcoming
                    ? `Due ${ordinal(t.day_of_month)}`
                    : `Every ${ordinal(t.day_of_month)}`}
                </p>
              </div>
            </div>
            <span
              className={`shrink-0 font-mono text-sm font-semibold tabular-nums ${
                t.transaction_type === 'income' ? 'text-income-text' : 'text-expense-text'
              }`}
            >
              {t.transaction_type === 'income' ? '+' : '−'} {formatAmount(t.total_amount)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
