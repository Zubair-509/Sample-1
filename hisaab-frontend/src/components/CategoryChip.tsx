import { CATEGORY_META } from '../lib/categories';
import type { Category } from '../types/transaction';

// Category chip — Hisaab_Design_Document.md §7.3
export function CategoryChip({ category }: { category: Category }) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-neutral-100 px-2 py-0.5 font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-700">
      <Icon size={12} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
