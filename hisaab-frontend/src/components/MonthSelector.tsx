import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthLabel } from '../lib/format';

interface MonthSelectorProps {
  selectedMonth: string;
  months: string[];
  onChange: (monthKey: string) => void;
  className?: string;
}

// Month selector — Hisaab_Design_Document.md §7.7
// Forward arrow disables on the most recent available month (no future nav).
export function MonthSelector({ selectedMonth, months, onChange, className = '' }: MonthSelectorProps) {
  const index = months.indexOf(selectedMonth);
  const canGoBack = index < months.length - 1 && index !== -1;
  const canGoForward = index > 0;

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-md bg-neutral-100 px-2 py-1.5 ${className}`}
      role="group"
      aria-label="Select month"
    >
      <button
        type="button"
        onClick={() => canGoBack && onChange(months[index + 1])}
        disabled={!canGoBack}
        aria-label="Previous month"
        className="flex h-8 w-8 items-center justify-center rounded text-neutral-700 transition-colors hover:bg-white hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <span className="min-w-[112px] text-center font-body text-sm font-semibold text-neutral-900 tabular-nums">
        {formatMonthLabel(selectedMonth)}
      </span>
      <button
        type="button"
        onClick={() => canGoForward && onChange(months[index - 1])}
        disabled={!canGoForward}
        aria-label="Next month"
        className="flex h-8 w-8 items-center justify-center rounded text-neutral-700 transition-colors hover:bg-white hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
