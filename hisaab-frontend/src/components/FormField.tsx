import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  warning?: string;
  children: ReactNode;
  className?: string;
}

// Form field chrome — Hisaab_Design_Document.md §7.5
export function FormField({ label, htmlFor, error, warning, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-[0.05em] text-neutral-700"
      >
        {label}
      </label>
      {children}
      {warning && (
        <p className="mt-1 flex items-center gap-1 font-body text-xs text-warning-text">{warning}</p>
      )}
      {error && (
        <p className="mt-1 flex items-center gap-1 font-body text-xs text-expense-text">{error}</p>
      )}
    </div>
  );
}

const BASE_INPUT =
  'h-11 w-full rounded-md border bg-white px-3.5 font-body text-sm text-neutral-900 transition-colors placeholder:text-neutral-500 focus:outline-none focus:ring-3';

export function inputClassName(hasIssue?: boolean) {
  return `${BASE_INPUT} ${
    hasIssue
      ? 'border-warning-border focus:border-warning-border focus:ring-warning-border/15'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/15'
  }`;
}
