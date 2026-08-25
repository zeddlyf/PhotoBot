import React from 'react';
import { X, Printer } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl glass-panel p-6 border border-zinc-800 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
            <Printer className="h-5 w-5 text-indigo-400" />
            <span>Print Photo Strip</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-zinc-300">
          <p className="font-semibold text-zinc-200">Print Specifications:</p>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>Paper format: Standard 2" × 6" photo booth strip or 4" × 6" postcard.</li>
            <li>DPI Resolution: High-DPI 300+ DPI Retina rendering.</li>
            <li>Select "Background Graphics: ON" in your browser print settings.</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
          >
            <Printer className="h-4 w-4" />
            <span>Open Print Dialog</span>
          </button>
        </div>
      </div>
    </div>
  );
};
