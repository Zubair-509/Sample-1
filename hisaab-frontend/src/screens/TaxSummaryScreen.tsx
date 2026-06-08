import { Printer } from 'lucide-react';
import { Button } from '../components/Button';
import { CategoryChip } from '../components/CategoryChip';
import { formatAmount, formatMonthLabel } from '../lib/format';
import { EXPENSE_CATEGORIES, type MonthSummary } from '../types/transaction';

interface TaxSummaryScreenProps {
  summary: MonthSummary;
  selectedMonth: string;
}

// FBR Tax Summary — Hisaab_PRD.md FR-04 + Design Document §8.4
// Print-friendly: only this section is visible in print media (see App.tsx print styles).
export function TaxSummaryScreen({ summary, selectedMonth }: TaxSummaryScreenProps) {
  const rows = EXPENSE_CATEGORIES.map((category) => ({
    category,
    amount: summary.expensesByCategory[category],
  })).filter((r) => r.amount > 0);

  const grandTotal = rows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="mx-auto max-w-[840px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div id="tax-summary-print-area" className="overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 px-6 py-5">
          <div>
            <h1 className="font-display text-xl font-bold text-neutral-900 sm:text-2xl">
              FBR Monthly Expense Summary — {formatMonthLabel(selectedMonth)}
            </h1>
            <p className="mt-1 font-body text-sm text-neutral-500">Rehman General Store</p>
          </div>
          <Button variant="ghost" icon={<Printer size={16} aria-hidden="true" />} onClick={() => window.print()} className="print:hidden">
            Print
          </Button>
        </div>

        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center font-body text-sm text-neutral-500">
            No deductible expenses recorded for this month yet.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <caption className="sr-only">
              FBR monthly expense summary by category for {formatMonthLabel(selectedMonth)}
            </caption>
            <thead>
              <tr className="bg-cream">
                <th scope="col" className="px-6 py-3 text-left font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-right font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  Total (PKR)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row) => (
                <tr key={row.category}>
                  <td className="px-6 py-3.5"><CategoryChip category={row.category} /></td>
                  <td className="px-6 py-3.5 text-right font-mono text-[15px] font-medium tabular-nums text-neutral-900">
                    {formatAmount(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-900 bg-cream">
                <th scope="row" className="px-6 py-3.5 text-left font-body text-sm font-bold uppercase tracking-wide text-neutral-900">
                  Total Deductible Expenses
                </th>
                <td className="px-6 py-3.5 text-right font-mono text-lg font-bold tabular-nums text-primary-900">
                  {formatAmount(grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        )}

        <p className="border-t border-neutral-100 bg-primary-50 px-6 py-4 font-body text-sm text-primary-900">
          ⓘ Share this summary with your accountant or use it for your FBR income tax return filing.
        </p>
      </div>
    </div>
  );
}
