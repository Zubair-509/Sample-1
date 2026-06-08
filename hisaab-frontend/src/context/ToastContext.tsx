import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

type ToastVariant = 'success' | 'error';

interface ToastEntry {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

// Toast notifications — Hisaab_Design_Document.md §7.10
// Bottom-center, success in forest green, error in deep red, auto-dismiss at 3s.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={`pointer-events-auto flex items-center gap-2 rounded-md px-5 py-3 shadow-lg ${
                toast.variant === 'success' ? 'bg-primary-900' : 'bg-expense-text'
              }`}
              role="status"
            >
              {toast.variant === 'success' ? (
                <CheckCircle2 size={18} className="shrink-0 text-white" aria-hidden="true" />
              ) : (
                <XCircle size={18} className="shrink-0 text-white" aria-hidden="true" />
              )}
              <span className="font-body text-sm text-white">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
