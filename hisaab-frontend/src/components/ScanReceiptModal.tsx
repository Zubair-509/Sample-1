import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Modal } from './Modal';
import { ReceiptUploadArea } from './ReceiptUploadArea';
import { ReceiptReviewCard } from './ReceiptReviewCard';
import { extractReceipt, ReceiptExtractionError } from '../services/receiptService';
import { fetchConfig } from '../services/configService';
import type { Category, ExtractedReceipt, Transaction, TransactionType } from '../types/transaction';

interface ScanReceiptModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: Omit<Transaction, 'id' | 'created_at' | 'source' | 'tax_amount'> & { tax_amount?: number | null }) => void;
  onFallbackToManual: () => void;
}

type Stage = 'upload' | 'processing' | 'review' | 'error';

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function AiSetupBanner({ onAddManually, onClose }: { onAddManually: () => void; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
          <div className="space-y-2">
            <p className="font-body text-sm font-semibold text-amber-800">
              AI receipt scanning is not set up yet
            </p>
            <p className="font-body text-sm text-amber-700">
              To enable scanning, add your <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">GEMINI_API_KEY</code> to this project's Secrets. You can get a free key from Google AI Studio.
            </p>
            <ol className="list-decimal pl-4 font-body text-sm text-amber-700 space-y-1">
              <li>
                Visit{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold underline underline-offset-2"
                >
                  aistudio.google.com
                  <ExternalLink size={12} aria-hidden="true" />
                </a>{' '}
                and create a free API key
              </li>
              <li>
                In Replit, open the <span className="font-semibold">Secrets</span> tab (🔒) and add a secret named{' '}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">GEMINI_API_KEY</code>
              </li>
              <li>Restart the Backend API workflow, then try again</li>
            </ol>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => { onClose(); onAddManually(); }}
        className="block w-full text-center font-body text-sm font-semibold text-primary-700 underline-offset-2 hover:underline"
      >
        Add this transaction manually instead
      </button>
    </div>
  );
}

export function ScanReceiptModal({ open, onClose, onConfirm, onFallbackToManual }: ScanReceiptModalProps) {
  const [stage, setStage] = useState<Stage>('upload');
  const [extracted, setExtracted] = useState<ExtractedReceipt | null>(null);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (open) {
      setStage('upload');
      setExtracted(null);
      setAttachment(null);
      setErrorMessage('');
      setAiEnabled(null);
      fetchConfig().then((cfg) => setAiEnabled(cfg.aiEnabled));
    }
  }, [open]);

  const handleFile = async (file: File) => {
    setStage('processing');
    try {
      // Convert to base64 for storage alongside the transaction
      const b64 = await fileToBase64(file).catch(() => null);
      setAttachment(b64);

      const result = await extractReceipt(file);
      setExtracted(result);
      setStage('review');
    } catch (err) {
      setErrorMessage(
        err instanceof ReceiptExtractionError
          ? err.userMessage
          : 'Could not reach AI — please try again or add manually',
      );
      setStage('error');
    }
  };

  const handleConfirm = (values: {
    vendor_name: string;
    date: string;
    category: Category;
    transaction_type: TransactionType;
    total_amount: number;
    notes: string | null;
    attachment: string | null;
  }) => {
    if (!extracted) return;
    onConfirm({ ...values, items: extracted.items, tax_amount: extracted.tax_amount });
  };

  const title = stage === 'review' ? 'Confirm Receipt Details' : 'Scan a Receipt';

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidthClassName="max-w-[640px]">
      {stage === 'review' && extracted ? (
        <ReceiptReviewCard
          extracted={extracted}
          attachment={attachment}
          onConfirm={handleConfirm}
          onDiscard={onClose}
        />
      ) : aiEnabled === false ? (
        <AiSetupBanner onAddManually={onFallbackToManual} onClose={onClose} />
      ) : (
        <div className="space-y-4">
          <ReceiptUploadArea
            status={stage === 'processing' ? 'processing' : stage === 'error' ? 'error' : 'idle'}
            errorMessage={errorMessage}
            onFileSelected={handleFile}
            onRetry={() => setStage('upload')}
          />
          {stage === 'error' && (
            <button
              type="button"
              onClick={() => { onClose(); onFallbackToManual(); }}
              className="block w-full text-center font-body text-sm font-semibold text-primary-700 underline-offset-2 hover:underline"
            >
              Add this transaction manually instead
            </button>
          )}
          <p className="text-center font-body text-xs text-neutral-500">
            Your receipt photo is saved with the transaction for your records.
          </p>
        </div>
      )}
    </Modal>
  );
}
