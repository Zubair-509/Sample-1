import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { EXPENSE_CATEGORIES } from '../types/transaction';
import type { BudgetMap } from '../hooks/useBudgets';

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  current: BudgetMap;
  onSave: (next: BudgetMap) => Promise<void>;
}

export function BudgetModal({ open, onClose, current, onSave }: BudgetModalProps) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Sync draft whenever modal opens with fresh values
  useEffect(() => {
    if (open) {
      const init: Record<string, string> = {};
      for (const cat of EXPENSE_CATEGORIES) {
        init[cat] = current[cat] != null ? String(current[cat]) : '';
      }
      setDraft(init);
      setError('');
    }
  }, [open, current]);

  const handleSave = async () => {
    const next: BudgetMap = {};
    for (const cat of EXPENSE_CATEGORIES) {
      const raw = draft[cat]?.trim();
      if (raw) {
        const val = parseFloat(raw);
        if (isNaN(val) || val < 0) {
          setError(`"${cat}" limit must be a positive number`);
          return;
        }
        if (val > 0) next[cat] = val;
      }
    }
    setSaving(true);
    setError('');
    try {
      await onSave(next);
      onClose();
    } catch {
      setError('Could not save budgets — please try again');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Monthly Budgets" maxWidthClassName="max-w-[480px]">
      <p className="mb-5 font-body text-sm text-neutral-500">
        Set a monthly spending limit per category. Leave a field empty to remove that budget.
      </p>

      <div className="space-y-3">
        {EXPENSE_CATEGORIES.map((cat) => (
          <div key={cat} className="flex items-center gap-3">
            <label
              htmlFor={`budget-${cat}`}
              className="w-28 shrink-0 font-body text-sm font-medium text-neutral-700"
            >
              {cat}
            </label>
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-neutral-400">
                PKR
              </span>
              <input
                id={`budget-${cat}`}
                type="number"
                min="0"
                step="100"
                placeholder="No limit"
                value={draft[cat] ?? ''}
                onChange={(e) => setDraft((prev) => ({ ...prev, [cat]: e.target.value }))}
                className="h-10 w-full rounded-md border border-neutral-300 bg-white pl-11 pr-3 font-body text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500/15"
              />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-expense-bg px-3 py-2 font-body text-sm text-expense-text">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save budgets'}
        </Button>
      </div>
    </Modal>
  );
}
