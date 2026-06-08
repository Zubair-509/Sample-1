import { useEffect, useMemo, useState } from 'react';
import { LogOut, User, ArrowLeftRight } from 'lucide-react';
import { Header } from './components/Header';
import { NavTabs, type ScreenId } from './components/NavTabs';
import { FloatingActionButton } from './components/FloatingActionButton';
import { MonthSelector } from './components/MonthSelector';
import { ManualEntryModal } from './components/ManualEntryModal';
import { ScanReceiptModal } from './components/ScanReceiptModal';
import { BudgetModal } from './components/BudgetModal';
import { RecurringModal } from './components/RecurringModal';
import { DataTransferModal } from './components/DataTransferModal';
import { DashboardScreen } from './screens/DashboardScreen';
import { LedgerScreen } from './screens/LedgerScreen';
import { TaxSummaryScreen } from './screens/TaxSummaryScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTransactions } from './hooks/useTransactions';
import { useBudgets } from './hooks/useBudgets';
import { useRecurring } from './hooks/useRecurring';
import type { Transaction } from './types/transaction';

// ---------------------------------------------------------------------------
// Main authenticated app
// ---------------------------------------------------------------------------

function HisaabApp() {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const {
    transactions,
    monthTransactions,
    months,
    selectedMonth,
    setSelectedMonth,
    summary,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const { budgets, saveBudgets } = useBudgets();
  const { activeTemplates, templates, createTemplate, updateTemplate, deleteTemplate, applyForMonth } = useRecurring();

  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [dataTransferOpen, setDataTransferOpen] = useState(false);

  // Auto-apply recurring transactions for the current month on load
  useEffect(() => {
    if (!loading && activeTemplates.length > 0 && selectedMonth) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      if (selectedMonth === currentMonth) {
        applyForMonth(currentMonth).then((created) => {
          if (created > 0) {
            // Reload transactions to pick up newly created recurring entries
            window.location.reload();
          }
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]); // only run once after initial load

  // Build set of template IDs already applied this month (from transactions)
  const appliedRecurringIds = useMemo(() => {
    const set = new Set<string>();
    for (const t of transactions) {
      const raw = t as Transaction & { recurring_template_id?: string; recurring_month?: string };
      if (raw.recurring_template_id && raw.recurring_month === selectedMonth) {
        set.add(raw.recurring_template_id);
      }
    }
    return set;
  }, [transactions, selectedMonth]);

  const openManualEntry = (transaction?: Transaction) => {
    setEditingTransaction(transaction ?? null);
    setManualEntryOpen(true);
  };

  const closeManualEntry = () => {
    setManualEntryOpen(false);
    setEditingTransaction(null);
  };

  const handleManualSubmit = (values: {
    date: string;
    vendor_name: string;
    category: Transaction['category'];
    transaction_type: Transaction['transaction_type'];
    total_amount: number;
    notes: string | null;
    attachment: string | null;
  }) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        ...values,
        items: [{ description: values.vendor_name, quantity: null, unit_price: null, total: values.total_amount }],
      });
      showToast('Transaction updated.');
    } else {
      addTransaction({
        ...values,
        source: 'manual',
        items: [{ description: values.vendor_name, quantity: null, unit_price: null, total: values.total_amount }],
        tax_amount: null,
      });
      showToast('Added to your ledger.');
    }
  };

  const handleScanConfirm = (
    values: Omit<Transaction, 'id' | 'created_at' | 'source' | 'tax_amount'> & {
      tax_amount?: number | null;
    },
  ) => {
    addTransaction({
      ...values,
      source: 'scan',
      tax_amount: values.tax_amount ?? null,
      notes: values.notes ?? null,
      attachment: values.attachment ?? null,
    });
    setScanModalOpen(false);
    showToast('Added to your ledger.');
  };

  const handleDelete = (transaction: Transaction) => {
    if (window.confirm(`Remove "${transaction.vendor_name}" from your ledger? This cannot be undone.`)) {
      deleteTransaction(transaction.id);
      showToast('Transaction removed.', 'error');
    }
  };

  const handleSaveBudgets = async (next: typeof budgets) => {
    await saveBudgets(next);
    showToast('Budgets saved.');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />
        <p className="font-body text-sm text-neutral-500">Loading your ledger…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header
        selectedMonth={selectedMonth}
        months={months}
        onMonthChange={setSelectedMonth}
        onAddManually={() => openManualEntry()}
        onScanReceipt={() => setScanModalOpen(true)}
      >
        <div className="hidden items-center gap-2 border-l border-neutral-200 pl-3 sm:flex">
          <button
            type="button"
            onClick={() => setDataTransferOpen(true)}
            aria-label="Export / Import data"
            title="Export / Import data"
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
          >
            <ArrowLeftRight size={15} aria-hidden="true" />
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-900">
            <User size={15} aria-hidden="true" />
          </span>
          <span className="max-w-[120px] truncate font-body text-sm font-medium text-neutral-700">
            {user?.name}
          </span>
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
          >
            <LogOut size={15} aria-hidden="true" />
          </button>
        </div>
      </Header>
      <NavTabs active={activeScreen} onChange={setActiveScreen} />

      <div className="mx-auto w-full max-w-[1280px] px-4 pt-4 sm:px-6 md:hidden lg:px-10">
        <MonthSelector selectedMonth={selectedMonth} months={months} onChange={setSelectedMonth} />
      </div>

      <main className="flex-1 pb-24 sm:pb-8">
        {activeScreen === 'dashboard' && (
          <DashboardScreen
            summary={summary}
            monthTransactions={monthTransactions}
            allTransactions={transactions}
            selectedMonth={selectedMonth}
            budgets={budgets}
            recurringTemplates={activeTemplates}
            appliedRecurringIds={appliedRecurringIds}
            onNavigate={setActiveScreen}
            onScanReceipt={() => setScanModalOpen(true)}
            onAddManually={() => openManualEntry()}
            onManageBudgets={() => setBudgetModalOpen(true)}
            onManageRecurring={() => setRecurringModalOpen(true)}
          />
        )}
        {activeScreen === 'ledger' && (
          <LedgerScreen
            transactions={monthTransactions}
            selectedMonth={selectedMonth}
            onEdit={openManualEntry}
            onDelete={handleDelete}
            onScanReceipt={() => setScanModalOpen(true)}
            onAddManually={() => openManualEntry()}
          />
        )}
        {activeScreen === 'tax-summary' && <TaxSummaryScreen summary={summary} selectedMonth={selectedMonth} />}
      </main>

      <FloatingActionButton onClick={() => setScanModalOpen(true)} />

      <ManualEntryModal
        open={manualEntryOpen}
        onClose={closeManualEntry}
        onSubmit={handleManualSubmit}
        initial={editingTransaction}
      />

      <ScanReceiptModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onConfirm={handleScanConfirm}
        onFallbackToManual={() => openManualEntry()}
      />

      <BudgetModal
        open={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        current={budgets}
        onSave={handleSaveBudgets}
      />

      <RecurringModal
        open={recurringModalOpen}
        onClose={() => setRecurringModalOpen(false)}
        templates={templates}
        onCreate={createTemplate}
        onUpdate={updateTemplate}
        onDelete={deleteTemplate}
      />

      <DataTransferModal
        open={dataTransferOpen}
        onClose={() => setDataTransferOpen(false)}
        onImportDone={() => window.location.reload()}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auth gate
// ---------------------------------------------------------------------------

function AuthGate() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />
      </div>
    );
  }

  if (!user) {
    return screen === 'login'
      ? <LoginScreen onGoToSignup={() => setScreen('signup')} />
      : <SignupScreen onGoToLogin={() => setScreen('login')} />;
  }

  return <HisaabApp />;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthGate />
      </ToastProvider>
    </AuthProvider>
  );
}
