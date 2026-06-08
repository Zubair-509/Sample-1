import { Camera, Pencil } from 'lucide-react';
import type { ReactNode } from 'react';
import { Logo } from './Logo';
import { MonthSelector } from './MonthSelector';
import { Button } from './Button';

interface HeaderProps {
  selectedMonth: string;
  months: string[];
  onMonthChange: (monthKey: string) => void;
  onAddManually: () => void;
  onScanReceipt: () => void;
  children?: ReactNode;
}

export function Header({ selectedMonth, months, onMonthChange, onAddManually, onScanReceipt, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Logo />

        <MonthSelector
          selectedMonth={selectedMonth}
          months={months}
          onChange={onMonthChange}
          className="hidden md:inline-flex"
        />

        <div className="hidden items-center gap-3 sm:flex">
          <Button variant="secondary" icon={<Pencil size={16} aria-hidden="true" />} onClick={onAddManually}>
            Add Manually
          </Button>
          <Button variant="primary" icon={<Camera size={16} aria-hidden="true" />} onClick={onScanReceipt}>
            Scan Receipt
          </Button>
          {children}
        </div>

        {/* Mobile: compact "+" trigger */}
        <button
          type="button"
          onClick={onAddManually}
          aria-label="Add transaction manually"
          className="flex h-11 w-11 items-center justify-center rounded-md text-primary-900 transition-colors hover:bg-primary-50 sm:hidden"
        >
          <Pencil size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
