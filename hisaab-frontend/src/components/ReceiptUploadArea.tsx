import { useRef, useState, type DragEvent } from 'react';
import { Camera, Loader2, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ReceiptUploadAreaProps {
  status: 'idle' | 'processing' | 'error';
  errorMessage?: string;
  onFileSelected: (file: File) => void;
  onRetry: () => void;
}

// Upload / scan area — Hisaab_Design_Document.md §7.8
// States: default, drag-over, processing (spinner + pulsing copy), error.
export function ReceiptUploadArea({ status, errorMessage, onFileSelected, onRetry }: ReceiptUploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 px-6 py-12 text-center">
        <Loader2 size={32} className="animate-spin text-primary-500" aria-hidden="true" />
        <p className="animate-pulse-soft font-body text-sm text-neutral-500" aria-live="polite">
          Reading your receipt…
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-expense-border bg-[#FFF5F5] px-6 py-12 text-center">
        <Camera size={48} className="text-expense-text" aria-hidden="true" />
        <div>
          <p className="font-body text-sm font-semibold text-expense-text">{errorMessage}</p>
        </div>
        <Button variant="secondary" icon={<RotateCcw size={16} aria-hidden="true" />} onClick={onRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        dragOver ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 bg-neutral-50'
      }`}
    >
      <Camera size={48} className="text-neutral-500" aria-hidden="true" />
      <div>
        <p className="font-body text-base font-semibold text-neutral-700">Snap a receipt or invoice</p>
        <p className="mt-0.5 font-body text-sm text-neutral-500">Tap to take a photo or upload from gallery</p>
      </div>
      <Button
        variant="primary"
        icon={<Camera size={16} aria-hidden="true" />}
        onClick={() => inputRef.current?.click()}
      >
        Scan Receipt
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = '';
        }}
      />
      <p className="font-body text-xs text-neutral-500">JPG, PNG, or HEIC — your receipt is processed instantly and never stored.</p>
    </div>
  );
}
