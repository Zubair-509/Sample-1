export type ScreenId = 'dashboard' | 'ledger' | 'tax-summary';

const TABS: { id: ScreenId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'ledger', label: 'Ledger' },
  { id: 'tax-summary', label: 'Tax Summary' },
];

interface NavTabsProps {
  active: ScreenId;
  onChange: (id: ScreenId) => void;
}

// Navigation tabs — Hisaab_Design_Document.md §7.6
// Horizontally scrollable on mobile, underline indicator on the active tab.
export function NavTabs({ active, onChange }: NavTabsProps) {
  return (
    <nav className="border-b border-neutral-100 bg-white" aria-label="Main sections">
      <div className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-4 sm:px-6 lg:px-10">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative shrink-0 whitespace-nowrap px-5 py-3 font-body text-sm transition-colors ${
                isActive
                  ? 'font-semibold text-primary-900'
                  : 'font-medium text-neutral-500 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              {tab.label}
              {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary-900" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
