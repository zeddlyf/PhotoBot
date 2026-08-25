import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, Smartphone } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, shareUrl }) => {
  if (!isOpen) return null;

  const url = shareUrl || window.location.href;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-2xl glass-panel p-6 border border-zinc-800 space-y-6 shadow-2xl text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-100">
            <QrCode className="h-5 w-5 text-emerald-400" />
            <span>Scan to Download</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-2xl bg-white p-4 shadow-xl border border-zinc-200">
            <QRCodeSVG value={url} size={180} level="H" includeMargin={true} />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
            <Smartphone className="h-4 w-4" />
            <span>Scan with phone camera to save!</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};
