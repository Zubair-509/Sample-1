import { Receipt, Camera, Pencil } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  onScanReceipt: () => void;
  onAddManually: () => void;
}

// Empty state — Hisaab_Design_Document.md §7.9
// Shown only when a selected month has no transactions.
export function EmptyState({ onScanReceipt, onAddManually }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
      <Receipt size={48} className="text-neutral-300" aria-hidden="true" />
      <div>
        <p className="font-display text-lg font-semibold text-neutral-700">No transactions in this month</p>
        <p className="mt-1 font-body text-sm text-neutral-500">
          Scan a receipt or add one manually to get started.
        </p>
      </div>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" icon={<Camera size={16} aria-hidden="true" />} onClick={onScanReceipt}>
          Scan Receipt
        </Button>
        <Button variant="secondary" icon={<Pencil size={16} aria-hidden="true" />} onClick={onAddManually}>
          Add Manually
        </Button>
      </div>
    </div>
  );
}
