import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';

interface FilterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

// Compact filter dropdown used in the Ledger toolbar — Hisaab_Design_Document.md §8.3
export function FilterSelect({ label, children, className = '', ...rest }: FilterSelectProps) {
  return (
    <label className="inline-flex items-center gap-2 font-body text-sm text-neutral-700">
      <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <span className="relative inline-flex items-center">
        <select
          className={`h-10 appearance-none rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 font-body text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/15 ${className}`}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-2.5 text-neutral-500" aria-hidden="true" />
      </span>
    </label>
  );
}
