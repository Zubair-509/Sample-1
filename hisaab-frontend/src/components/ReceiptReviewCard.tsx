import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, XCircle } from 'lucide-react';
import { Button } from './Button';
import { FormField, inputClassName } from './FormField';
import { CATEGORY_META } from '../lib/categories';
import { formatAmount } from '../lib/format';
import { EXPENSE_CATEGORIES, type Category, type ExtractedReceipt, type TransactionType } from '../types/transaction';

interface ReceiptReviewCardProps {
  extracted: ExtractedReceipt;
  onConfirm: (values: {
    vendor_name: string;
    date: string;
    category: Category;
    transaction_type: TransactionType;
    total_amount: number;
  }) => void;
  onDiscard: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const FIELD_LABELS: Record<string, string> = {
  vendor_name: 'Vendor name',
  date: 'Date',
  total_amount: 'Total amount',
};

// AI Receipt Review Card — Hisaab_Design_Document.md §7.4 / Hisaab_PRD.md FR-01
// "Trust through transparency": every AI extraction is shown for review and
// editable before it ever touches the ledger. Unclear fields carry a warning chip.
export function ReceiptReviewCard({ extracted, onConfirm, onDiscard }: ReceiptReviewCardProps) {
  const unclear = new Set(extracted.unclear_fields ?? []);
  const [vendor, setVendor] = useState(extracted.vendor_name);
  const [date, setDate] = useState(extracted.date ?? today());
  const [category, setCategory] = useState<Category>(extracted.category);
  const [type, setType] = useState<TransactionType>(extracted.transaction_type);
  const [amount, setAmount] = useState(String(extracted.total_amount));

  const categoryOptions: Category[] = type === 'income' ? ['Sales', ...EXPENSE_CATEGORIES] : [...EXPENSE_CATEGORIES];

  const handleConfirm = () => {
    const numericAmount = Number(amount);
    onConfirm({
      vendor_name: vendor.trim() || 'Unknown – please check',
      date,
      category,
      transaction_type: type,
      total_amount: Number.isFinite(numericAmount) && numericAmount > 0 ? Math.round(numericAmount) : extracted.total_amount,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2">
          <ClipboardList size={18} className="text-primary-700" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-neutral-900">Review Extracted Details</h3>
        </div>
        {unclear.size > 0 && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-warning-bg px-2 py-1 font-body text-xs font-semibold text-warning-text">
            <AlertTriangle size={12} aria-hidden="true" /> {unclear.size} unclear
          </span>
        )}
      </div>

      <div className="space-y-4 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Vendor" htmlFor="review-vendor" warning={unclear.has('vendor_name') ? 'Could not read clearly — please verify.' : undefined}>
            <input
              id="review-vendor"
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className={inputClassName(unclear.has('vendor_name'))}
            />
          </FormField>
          <FormField label="Date" htmlFor="review-date" warning={unclear.has('date') ? 'Could not read clearly — please verify.' : undefined}>
            <input
              id="review-date"
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              className={inputClassName(unclear.has('date'))}
            />
          </FormField>
          <FormField label="Category" htmlFor="review-category">
            <select
              id="review-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Total Amount" htmlFor="review-amount" warning={unclear.has('total_amount') ? 'Best estimate — please verify.' : undefined}>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center font-body text-sm text-neutral-500">Rs</span>
              <input
                id="review-amount"
                type="number"
                inputMode="decimal"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`${inputClassName(unclear.has('total_amount'))} pl-9 font-mono text-base`}
              />
            </div>
          </FormField>
          <FormField label="Transaction Type" htmlFor="review-type">
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Transaction type">
              {(['expense', 'income'] as const).map((t) => {
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setType(t)}
                    className={`flex h-11 items-center justify-center gap-2 rounded-md border font-body text-sm font-semibold capitalize transition-colors ${
                      active
                        ? t === 'income'
                          ? 'border-income-border bg-income-bg text-income-text'
                          : 'border-expense-border bg-expense-bg text-expense-text'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${active ? (t === 'income' ? 'bg-income-border' : 'bg-expense-border') : 'bg-neutral-300'}`} aria-hidden="true" />
                    {t}
                  </button>
                );
              })}
            </div>
          </FormField>
        </div>

        {extracted.items.length > 0 && (
          <div className="border-t border-neutral-100 pt-4">
            <h4 className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">Items Detected</h4>
            <ul className="mt-2 space-y-1.5">
              {extracted.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3 font-body text-sm text-neutral-700">
                  <span className="truncate">
                    {item.description}
                    {item.quantity ? ` × ${item.quantity}` : ''}
                    {item.unit_price ? ` · ${formatAmount(item.unit_price)} each` : ''}
                  </span>
                  <span className="shrink-0 font-mono text-sm tabular-nums text-neutral-900">{formatAmount(item.total)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {extracted.notes && (
          <p className="border-t border-neutral-100 pt-4 font-body text-sm text-neutral-500">
            <span className="font-semibold text-neutral-700">Notes: </span>
            {extracted.notes}
          </p>
        )}

        {unclear.size > 0 && (
          <div className="flex items-start gap-2 rounded-md border-l-4 border-warning-border bg-warning-bg px-3.5 py-3">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning-border" aria-hidden="true" />
            <p className="font-body text-[13px] text-warning-text">
              {Array.from(unclear).map((f) => FIELD_LABELS[f] ?? f).join(' and ')} could not be read clearly. Please verify before saving.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row">
        <Button variant="destructive" icon={<XCircle size={16} aria-hidden="true" />} onClick={onDiscard} className="w-full justify-center sm:flex-1">
          Discard
        </Button>
        <Button variant="primary" icon={<CheckCircle2 size={16} aria-hidden="true" />} onClick={handleConfirm} className="w-full justify-center sm:flex-1">
          Confirm &amp; Save
        </Button>
      </div>
    </div>
  );
}
