import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

// Mobile FAB — Hisaab_Design_Document.md §8.5
export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Scan a receipt"
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-900 text-white shadow-fab sm:hidden"
    >
      <Camera size={24} aria-hidden="true" />
    </motion.button>
  );
}
