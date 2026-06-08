import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Scale, Receipt, type LucideIcon } from 'lucide-react';
import { formatAmount } from '../lib/format';

type CardKind = 'income' | 'expenses' | 'profit' | 'count';

interface SummaryCardProps {
  kind: CardKind;
  label: string;
  value: number;
  /** Index used to stagger the entry animation — Design Doc §9.2 */
  index?: number;
}

const KIND_STYLES: Record<
  CardKind,
  { icon: LucideIcon; amountClass: string; borderClass: string; iconClass: string; format: (v: number) => string }
> = {
  income: {
    icon: TrendingUp,
    amountClass: 'text-income-text',
    borderClass: 'border-l-income-border',
    iconClass: 'text-income-text',
    format: formatAmount,
  },
  expenses: {
    icon: TrendingDown,
    amountClass: 'text-expense-text',
    borderClass: 'border-l-expense-border',
    iconClass: 'text-expense-text',
    format: formatAmount,
  },
  profit: {
    icon: Scale,
    amountClass: '',
    borderClass: '',
    iconClass: '',
    format: formatAmount,
  },
  count: {
    icon: Receipt,
    amountClass: 'text-neutral-900',
    borderClass: 'border-l-neutral-500',
    iconClass: 'text-neutral-500',
    format: (v) => String(v),
  },
};

// Dashboard summary cards — Hisaab_Design_Document.md §7.2
export function SummaryCard({ kind, label, value, index = 0 }: SummaryCardProps) {
  const style = KIND_STYLES[kind];
  const Icon = style.icon;

  // Net Profit flips polarity based on sign (negative = loss, shown in red)
  const isLoss = kind === 'profit' && value < 0;
  const amountClass = kind === 'profit' ? (isLoss ? 'text-expense-text' : 'text-primary-900') : style.amountClass;
  const borderClass = kind === 'profit' ? (isLoss ? 'border-l-expense-border' : 'border-l-primary-500') : style.borderClass;
  const iconClass = kind === 'profit' ? (isLoss ? 'text-expense-text' : 'text-primary-900') : style.iconClass;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.075, ease: [0.4, 0, 0.2, 1] }}
      className={`rounded-lg border border-neutral-100 border-l-[3px] bg-white p-5 shadow-card sm:p-6 ${borderClass}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          {label}
        </span>
        <Icon size={20} className={iconClass} aria-hidden="true" />
      </div>
      <p
        className={`mt-3 font-display text-[28px] font-bold tabular-nums sm:text-[32px] ${amountClass}`}
        aria-label={
          kind === 'count'
            ? `${label}: ${value}`
            : `${label}: ${value.toLocaleString('en-US')} rupees${kind === 'profit' && isLoss ? ' (loss)' : ''}`
        }
      >
        {style.format(value)}
      </p>
    </motion.div>
  );
}
