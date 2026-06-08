import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidthClassName?: string;
}

// Modal / review-card chrome — Hisaab_Design_Document.md §9.6
// Backdrop fades in; card scales up from 0.95 -> 1. Escape dismisses (§11.3).
export function Modal({ open, onClose, title, children, maxWidthClassName = 'max-w-[560px]' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={`relative z-10 max-h-[92vh] w-full ${maxWidthClassName} overflow-y-auto rounded-t-xl bg-white p-7 shadow-modal sm:rounded-xl`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-neutral-900">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
