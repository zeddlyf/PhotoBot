import React, { useEffect, useRef, useState } from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { generatePhotoStripCanvas } from '../../utils/canvasRenderer';
import { Download, Printer, QrCode, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotoStripCanvasProps {
  onOpenPrintModal: () => void;
  onOpenQRModal: (url: string) => void;
  onRetake: () => void;
}

export const PhotoStripCanvas: React.FC<PhotoStripCanvasProps> = ({
  onOpenPrintModal,
  onOpenQRModal,
  onRetake
}) => {
  const {
    room,
    selectedTemplate,
    headerText,
    setHeaderText,
    subText,
    setSubText,
    eventDate,
    setEventDate,
    activeFilter,
    stickers,
    removeSticker
  } = useRoomStore();

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  const capturedPhotos = room?.capturedPhotos || {};

  // Trigger celebration confetti on view load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  // Re-render canvas strip when settings change
  useEffect(() => {
    let isMounted = true;
    if (!selectedTemplate) return;

    setIsGenerating(true);
    generatePhotoStripCanvas({
      photos: capturedPhotos,
      template: selectedTemplate,
      headerText,
      subText,
      eventDate,
      filter: activeFilter,
      stickers
    }).then((dataUrl) => {
      if (isMounted) {
        setPreviewUrl(dataUrl);
        setIsGenerating(false);
      }
    }).catch((err) => {
      console.error('Failed to generate strip canvas', err);
      setIsGenerating(false);
    });

    return () => {
      isMounted = false;
    };
  }, [capturedPhotos, selectedTemplate, headerText, subText, eventDate, activeFilter, stickers]);

  const handleDownloadPNG = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `SnapTogether_${selectedTemplate?.category || 'Strip'}_${Date.now()}.png`;
    a.click();
  };

  const handleDownloadJPG = () => {
    if (!previewUrl) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const jpgUrl = canvas.toDataURL('image/jpeg', 0.95);
        const a = document.createElement('a');
        a.href = jpgUrl;
        a.download = `SnapTogether_Strip_${Date.now()}.jpg`;
        a.click();
      }
    };
    img.src = previewUrl;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Canvas Preview Display */}
      <div className="lg:col-span-5 flex flex-col items-center gap-4">
        <div className="relative w-full max-w-sm aspect-[1/3] rounded-2xl overflow-hidden glass-panel p-3 border border-zinc-800 shadow-2xl group">
          {isGenerating ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-900 text-zinc-400">
              <Sparkles className="h-10 w-10 text-rose-500 animate-spin" />
              <p className="text-xs font-semibold">Generating HD Photo Strip...</p>
            </div>
          ) : (
            <div id="printable-photo-strip" className="h-full w-full flex items-center justify-center">
              <img
                src={previewUrl}
                alt="Generated Photo Strip"
                className="h-full w-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
            <span>Retake Photos</span>
          </button>
        </div>
      </div>

      {/* Right Customizer & Export Tools */}
      <div className="lg:col-span-7 space-y-6">
        {/* Custom Text Section */}
        <div className="space-y-4 rounded-2xl glass-panel p-5 border border-zinc-800">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rose-400" />
            <span>Customize Photo Strip</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Header Title
              </label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none border border-zinc-800 focus:border-rose-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none border border-zinc-800 focus:border-rose-500 transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">
                Event Date Stamp
              </label>
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none border border-zinc-800 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Active Stickers list */}
          {stickers.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                Placed Stickers ({stickers.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {stickers.map((s) => (
                  <span
                    key={s.id}
                    className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200 border border-zinc-700"
                  >
                    <span>{s.emoji}</span>
                    <button
                      onClick={() => removeSticker(s.id)}
                      className="text-zinc-400 hover:text-rose-400 text-xs font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download & Share Actions */}
        <div className="space-y-4 rounded-2xl glass-panel p-5 border border-zinc-800">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
            Export & Share
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadPNG}
              className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG (High-Res)</span>
            </button>

            <button
              onClick={handleDownloadJPG}
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition-all"
            >
              <Download className="h-4 w-4 text-amber-400" />
              <span>Download JPG</span>
            </button>

            <button
              onClick={onOpenPrintModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition-all"
            >
              <Printer className="h-4 w-4 text-indigo-400" />
              <span>Print Ready Photo Strip</span>
            </button>

            <button
              onClick={() => onOpenQRModal(previewUrl)}
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition-all"
            >
              <QrCode className="h-4 w-4 text-emerald-400" />
              <span>Get Mobile QR Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
