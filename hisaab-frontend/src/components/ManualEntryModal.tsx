import { useEffect, useState, type FormEvent } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FormField, inputClassName } from './FormField';
import {
  EXPENSE_CATEGORIES,
  type Category,
  type Transaction,
  type TransactionType,
} from '../types/transaction';
import { CATEGORY_META } from '../lib/categories';

export interface ManualEntryValues {
  date: string;
  vendor_name: string;
  category: Category;
  transaction_type: TransactionType;
  amount: string;
}

interface ManualEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Transaction, 'id' | 'created_at' | 'source' | 'items' | 'tax_amount' | 'notes'> & { total_amount: number }) => void;
  /** When present, the form edits this transaction instead of creating a new one. */
  initial?: Transaction | null;
}

const today = () => new Date().toISOString().slice(0, 10);

function categoryOptionsFor(type: TransactionType): Category[] {
  return type === 'income' ? ['Sales', ...EXPENSE_CATEGORIES] : [...EXPENSE_CATEGORIES];
}

function emptyValues(): ManualEntryValues {
  return { date: today(), vendor_name: '', category: 'Inventory', transaction_type: 'expense', amount: '' };
}

function valuesFromTransaction(t: Transaction): ManualEntryValues {
  return {
    date: t.date,
    vendor_name: t.vendor_name,
    category: t.category,
    transaction_type: t.transaction_type,
    amount: String(t.total_amount),
  };
}

// Manual entry form — Hisaab_PRD.md FR-05
// "Add Manually" opens a simple form: Date, Vendor/Description, Category,
// Type (Income/Expense), Amount. Doubles as the row-edit form (FR-02).
export function ManualEntryModal({ open, onClose, onSubmit, initial }: ManualEntryModalProps) {
  const [values, setValues] = useState<ManualEntryValues>(() => (initial ? valuesFromTransaction(initial) : emptyValues()));
  const [errors, setErrors] = useState<Partial<Record<keyof ManualEntryValues, string>>>({});

  useEffect(() => {
    if (open) {
      setValues(initial ? valuesFromTransaction(initial) : emptyValues());
      setErrors({});
    }
  }, [open, initial]);

  const setField = <K extends keyof ManualEntryValues>(key: K, value: ManualEntryValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      // Switching type changes which categories are sensible — keep the selection valid.
      if (key === 'transaction_type') {
        const options = categoryOptionsFor(value as TransactionType);
        if (!options.includes(next.category)) next.category = options[0];
      }
      return next;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof ManualEntryValues, string>> = {};
    if (!values.vendor_name.trim()) nextErrors.vendor_name = 'Enter a vendor name or short description.';
    if (!values.date) nextErrors.date = 'Pick a date.';
    const amount = Number(values.amount);
    if (!values.amount || Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = 'Enter an amount greater than zero.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      date: values.date,
      vendor_name: values.vendor_name.trim(),
      category: values.category,
      transaction_type: values.transaction_type,
      total_amount: Math.round(amount),
    });
    onClose();
  };

  const categoryOptions = categoryOptionsFor(values.transaction_type);

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Transaction' : 'Add Manually'} maxWidthClassName="max-w-[480px]">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Type toggle */}
        <FormField label="Transaction Type" htmlFor="manual-type">
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Transaction type">
            {(['expense', 'income'] as const).map((type) => {
              const active = values.transaction_type === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setField('transaction_type', type)}
                  className={`flex h-11 items-center justify-center gap-2 rounded-md border font-body text-sm font-semibold capitalize transition-colors ${
                    active
                      ? type === 'income'
                        ? 'border-income-border bg-income-bg text-income-text'
                        : 'border-expense-border bg-expense-bg text-expense-text'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${active ? (type === 'income' ? 'bg-income-border' : 'bg-expense-border') : 'bg-neutral-300'}`} aria-hidden="true" />
                  {type}
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="Vendor / Description" htmlFor="manual-vendor" error={errors.vendor_name}>
          <input
            id="manual-vendor"
            type="text"
            value={values.vendor_name}
            onChange={(e) => setField('vendor_name', e.target.value)}
            placeholder="e.g. Habib Flour Mills"
            className={inputClassName(Boolean(errors.vendor_name))}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" htmlFor="manual-date" error={errors.date}>
            <input
              id="manual-date"
              type="date"
              value={values.date}
              max={today()}
              onChange={(e) => setField('date', e.target.value)}
              className={inputClassName(Boolean(errors.date))}
            />
          </FormField>

          <FormField label="Category" htmlFor="manual-category">
            <select
              id="manual-category"
              value={values.category}
              onChange={(e) => setField('category', e.target.value as Category)}
              className={inputClassName()}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_META[c].label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Amount" htmlFor="manual-amount" error={errors.amount}>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center font-body text-sm text-neutral-500">
              Rs
            </span>
            <input
              id="manual-amount"
              type="number"
              inputMode="decimal"
              min={0}
              step="1"
              value={values.amount}
              onChange={(e) => setField('amount', e.target.value)}
              placeholder="0"
              className={`${inputClassName(Boolean(errors.amount))} pl-9 font-mono text-base`}
            />
          </div>
        </FormField>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            {initial ? 'Save Changes' : 'Add to Ledger'}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
