import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  children?: ReactNode;
}

// Button styles — Hisaab_Design_Document.md §7.1
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-primary-900 text-white hover:bg-primary-700 active:bg-primary-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-card',
  secondary:
    'bg-transparent text-primary-900 border border-primary-900 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed',
  destructive:
    'bg-transparent text-expense-text border border-expense-border hover:bg-expense-bg disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed',
};

export function Button({ variant = 'primary', icon, children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 font-body text-sm font-semibold transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-px active:translate-y-0 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
