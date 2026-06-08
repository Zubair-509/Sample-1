import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FormField, inputClassName } from './FormField';
import { EXPENSE_CATEGORIES, type Category, type TransactionType } from '../types/transaction';
import { CATEGORY_META } from '../lib/categories';
import { formatAmount } from '../lib/format';
import type { RecurringTemplate } from '../hooks/useRecurring';

// Day-of-month suffix
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function categoryOptionsFor(type: TransactionType): Category[] {
  return type === 'income' ? ['Sales', ...EXPENSE_CATEGORIES] : [...EXPENSE_CATEGORIES];
}

interface RecurringFormValues {
  vendor_name: string;
  transaction_type: TransactionType;
  category: Category;
  amount: string;
  day_of_month: string;
  notes: string;
}

function emptyForm(): RecurringFormValues {
  return { vendor_name: '', transaction_type: 'expense', category: 'Inventory', amount: '', day_of_month: '1', notes: '' };
}

function fromTemplate(t: RecurringTemplate): RecurringFormValues {
  return {
    vendor_name: t.vendor_name,
    transaction_type: t.transaction_type,
    category: t.category,
    amount: String(t.total_amount),
    day_of_month: String(t.day_of_month),
    notes: t.notes ?? '',
  };
}

interface RecurringModalProps {
  open: boolean;
  onClose: () => void;
  templates: RecurringTemplate[];
  onCreate: (input: Omit<RecurringTemplate, 'id' | 'is_active' | 'created_at'>) => Promise<unknown>;
  onUpdate: (id: string, patch: Partial<RecurringTemplate>) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
}

type ViewMode = 'list' | 'form';

export function RecurringModal({ open, onClose, templates, onCreate, onUpdate, onDelete }: RecurringModalProps) {
  const [mode, setMode] = useState<ViewMode>('list');
  const [editing, setEditing] = useState<RecurringTemplate | null>(null);
  const [form, setForm] = useState<RecurringFormValues>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (open) { setMode('list'); setEditing(null); setError(''); setConfirmDeleteId(null); }
  }, [open]);

  const openNew = () => { setForm(emptyForm()); setEditing(null); setMode('form'); setError(''); };
  const openEdit = (t: RecurringTemplate) => { setForm(fromTemplate(t)); setEditing(t); setMode('form'); setError(''); };

  const setField = <K extends keyof RecurringFormValues>(key: K, value: RecurringFormValues[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'transaction_type') {
        const opts = categoryOptionsFor(value as TransactionType);
        if (!opts.includes(next.category as Category)) next.category = opts[0];
      }
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const amount = parseFloat(form.amount);
    const day = parseInt(form.day_of_month, 10);
    if (!form.vendor_name.trim()) { setError('Enter a vendor name.'); return; }
    if (isNaN(amount) || amount <= 0) { setError('Enter a valid amount.'); return; }
    if (isNaN(day) || day < 1 || day > 28) { setError('Day must be between 1 and 28.'); return; }

    setSaving(true);
    try {
      const payload = {
        vendor_name: form.vendor_name.trim(),
        transaction_type: form.transaction_type,
        category: form.category,
        total_amount: Math.round(amount),
        day_of_month: day,
        notes: form.notes.trim() || null,
      };
      if (editing) {
        await onUpdate(editing.id, payload);
      } else {
        await onCreate(payload as Omit<RecurringTemplate, 'id' | 'is_active' | 'created_at'>);
      }
      setMode('list');
    } catch {
      setError('Could not save — please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try { await onDelete(id); setConfirmDeleteId(null); }
    catch { setError('Could not delete template.'); }
    finally { setSaving(false); }
  };

  const activeTemplates = templates.filter((t) => t.is_active);
  const categoryOptions = categoryOptionsFor(form.transaction_type);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'list' ? 'Recurring Transactions' : editing ? 'Edit Recurring' : 'New Recurring'}
      maxWidthClassName="max-w-[520px]"
    >
      {mode === 'list' ? (
        <>
          <p className="mb-4 font-body text-sm text-neutral-500">
            Recurring transactions are automatically added to your ledger each month on the date you choose.
          </p>

          {activeTemplates.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <RefreshCw size={32} className="text-neutral-300" />
              <p className="font-body text-sm text-neutral-500">No recurring transactions yet.</p>
            </div>
          ) : (
            <ul className="mb-4 divide-y divide-neutral-100">
              {activeTemplates.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-body text-sm font-medium text-neutral-900">{t.vendor_name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span
                        className={`font-body text-xs font-semibold ${
                          t.transaction_type === 'income' ? 'text-income-text' : 'text-expense-text'
                        }`}
                      >
                        {t.transaction_type === 'income' ? '+' : '−'} {formatAmount(t.total_amount)}
                      </span>
                      <span className="font-body text-xs text-neutral-400">{t.category}</span>
                      <span className="font-body text-xs text-neutral-400">Every {ordinal(t.day_of_month)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {confirmDeleteId === t.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id)}
                          disabled={saving}
                          className="rounded px-2 py-1 font-body text-xs font-semibold text-expense-text hover:bg-expense-bg"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded px-2 py-1 font-body text-xs text-neutral-500 hover:bg-neutral-100"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          aria-label="Edit"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(t.id)}
                          aria-label="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-expense-bg hover:text-expense-text"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Button variant="primary" icon={<Plus size={15} />} onClick={openNew} className="w-full">
            Add recurring transaction
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Type toggle */}
          <FormField label="Transaction Type" htmlFor="rec-type">
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {(['expense', 'income'] as const).map((type) => {
                const active = form.transaction_type === type;
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

          <FormField label="Vendor / Description" htmlFor="rec-vendor">
            <input
              id="rec-vendor"
              type="text"
              value={form.vendor_name}
              onChange={(e) => setField('vendor_name', e.target.value)}
              placeholder="e.g. Office Rent, Monthly Salary"
              className={inputClassName()}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category" htmlFor="rec-category">
              <select
                id="rec-category"
                value={form.category}
                onChange={(e) => setField('category', e.target.value as Category)}
                className={inputClassName()}
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{CATEGORY_META[c].label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Day of Month" htmlFor="rec-day">
              <select
                id="rec-day"
                value={form.day_of_month}
                onChange={(e) => setField('day_of_month', e.target.value)}
                className={inputClassName()}
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{ordinal(d)}</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Amount (PKR)" htmlFor="rec-amount">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center font-body text-sm text-neutral-500">Rs</span>
              <input
                id="rec-amount"
                type="number"
                inputMode="decimal"
                min={0}
                step="1"
                value={form.amount}
                onChange={(e) => setField('amount', e.target.value)}
                placeholder="0"
                className={`${inputClassName()} pl-9 font-mono`}
              />
            </div>
          </FormField>

          <FormField label="Notes (optional)" htmlFor="rec-notes">
            <input
              id="rec-notes"
              type="text"
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder="e.g. 3-month advance"
              className={inputClassName()}
            />
          </FormField>

          {error && (
            <p className="rounded-md bg-expense-bg px-3 py-2 font-body text-sm text-expense-text">{error}</p>
          )}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row-reverse">
            <Button type="submit" variant="primary" disabled={saving} className="w-full sm:w-auto">
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Recurring'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setMode('list')} className="w-full sm:w-auto">
              Back
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
