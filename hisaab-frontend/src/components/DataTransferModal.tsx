import { useRef, useState } from 'react';
import { Download, Upload, CheckCircle, AlertCircle, FileJson } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

function getToken() {
  return localStorage.getItem('hisaab_token') ?? '';
}

interface DataTransferModalProps {
  open: boolean;
  onClose: () => void;
  onImportDone: () => void;
}

type Tab = 'export' | 'import';
type ImportState = 'idle' | 'previewing' | 'loading' | 'done' | 'error';

interface ParsedFile {
  transactions: unknown[];
  fileName: string;
}

export function DataTransferModal({ open, onClose, onImportDone }: DataTransferModalProps) {
  const [tab, setTab] = useState<Tab>('export');

  // Export state
  const [exporting, setExporting] = useState(false);

  // Import state
  const [importState, setImportState] = useState<ImportState>('idle');
  const [parsed, setParsed] = useState<ParsedFile | null>(null);
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().slice(0, 10);
      a.download = `hisaab-export-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportState('previewing');
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const list = Array.isArray(json) ? json : json.transactions;
        if (!Array.isArray(list)) throw new Error('Unrecognised format');
        setParsed({ transactions: list, fileName: file.name });
      } catch {
        setImportState('error');
        setErrorMsg('Could not read file. Make sure it is a Hisaab export JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!parsed) return;
    setImportState('loading');
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ transactions: parsed.transactions }),
      });
      if (!res.ok) throw new Error('Import failed');
      const data = await res.json();
      setResult(data);
      setImportState('done');
      onImportDone();
    } catch (err) {
      setImportState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Import failed');
    }
  };

  const resetImport = () => {
    setImportState('idle');
    setParsed(null);
    setResult(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetImport();
    setTab('export');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Data Transfer" maxWidthClassName="max-w-[480px]">
      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['export', 'import'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); resetImport(); }}
            className={`flex-1 rounded-md py-2 text-sm font-semibold capitalize transition-all ${
              tab === t
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Export ── */}
      {tab === 'export' && (
        <div className="flex flex-col gap-4">
          <p className="font-body text-sm text-neutral-600">
            Download all your ledger entries as a <strong>JSON file</strong>. You can then import
            this file into any other Hisaab account — including your Railway deployment.
          </p>
          <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center">
            <FileJson size={32} className="mx-auto mb-2 text-neutral-400" />
            <p className="font-body text-sm text-neutral-500">All transactions · JSON format</p>
          </div>
          <Button
            variant="primary"
            icon={<Download size={16} />}
            onClick={handleExport}
            disabled={exporting}
            className="w-full"
          >
            {exporting ? 'Downloading…' : 'Download Export File'}
          </Button>
        </div>
      )}

      {/* ── Import ── */}
      {tab === 'import' && (
        <div className="flex flex-col gap-4">
          {importState === 'done' && result ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle size={40} className="text-green-500" />
              <p className="font-display text-lg font-bold text-neutral-900">Import Complete!</p>
              <p className="font-body text-sm text-neutral-600">
                <strong>{result.imported}</strong> transactions imported
                {result.skipped > 0 && `, ${result.skipped} skipped (already exist)`}.
              </p>
              <Button variant="secondary" onClick={handleClose} className="mt-2">
                Close
              </Button>
            </div>
          ) : importState === 'error' ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <AlertCircle size={40} className="text-red-500" />
              <p className="font-body text-sm text-red-700">{errorMsg}</p>
              <Button variant="secondary" onClick={resetImport}>Try Again</Button>
            </div>
          ) : importState === 'previewing' && parsed ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="font-body text-sm font-semibold text-green-800">{parsed.fileName}</p>
                <p className="font-body text-sm text-green-700 mt-1">
                  Found <strong>{parsed.transactions.length}</strong> transaction
                  {parsed.transactions.length !== 1 ? 's' : ''} ready to import.
                </p>
                <p className="font-body text-xs text-green-600 mt-1">
                  Duplicates are automatically skipped.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={resetImport} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  icon={<Upload size={16} />}
                  onClick={handleImport}
                  className="flex-1"
                >
                  Import {parsed.transactions.length} Records
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-body text-sm text-neutral-600">
                Upload a <strong>Hisaab export JSON file</strong> to import transactions into this
                account. Existing records are never overwritten.
              </p>
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center transition-colors hover:border-primary-400 hover:bg-primary-50">
                <Upload size={28} className="text-neutral-400" />
                <span className="font-body text-sm text-neutral-600">
                  Click to choose file or drag &amp; drop
                </span>
                <span className="font-body text-xs text-neutral-400">.json files only</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              {importState === 'loading' && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-100 border-t-primary-500" />
                  <span className="font-body text-sm text-neutral-600">Importing…</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
