import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { Camera, CameraOff, FlipHorizontal, Sparkles, CheckCircle2 } from 'lucide-react';

interface CameraControlsProps {
  onStartCamera: () => void;
  onStopCamera: () => void;
  onStartVirtualCamera: () => void;
  onToggleReady: (ready: boolean) => void;
  isReady: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onStartCamera,
  onStopCamera,
  onStartVirtualCamera,
  onToggleReady,
  isReady
}) => {
  const { isCameraActive, mirrorCamera, setMirrorCamera, usingVirtualCamera } = useRoomStore();

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl glass-panel p-3.5 border border-white/10 overflow-x-auto scrollbar-none">
      {/* Left controls */}
      <div className="flex items-center gap-2 shrink-0">
        {isCameraActive ? (
          <button
            onClick={onStopCamera}
            className="flex items-center gap-1.5 rounded-xl bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-all border border-white/5"
          >
            <CameraOff className="h-3.5 w-3.5 text-rose-400" />
            <span>Turn Off Camera</span>
          </button>
        ) : (
          <button
            onClick={onStartCamera}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Start Webcam</span>
          </button>
        )}

        <button
          onClick={onStartVirtualCamera}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border ${
            usingVirtualCamera
              ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/40'
              : 'bg-white/[0.05] text-zinc-400 hover:bg-white/10 hover:text-zinc-200 border-white/5'
          }`}
          title="Use Virtual Demo Webcam"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Virtual Demo Cam</span>
        </button>

        {isCameraActive && !usingVirtualCamera && (
          <button
            onClick={() => setMirrorCamera(!mirrorCamera)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all border ${
              mirrorCamera
                ? 'bg-white/15 text-white border-white/20'
                : 'bg-white/[0.05] text-zinc-400 hover:bg-white/10 border-white/5'
            }`}
            title="Toggle Mirror Camera"
          >
            <FlipHorizontal className="h-3.5 w-3.5" />
            <span>Mirror</span>
          </button>
        )}
      </div>

      {/* Right Ready Button */}
      <div className="shrink-0 ml-auto">
        <button
          onClick={() => onToggleReady(!isReady)}
          className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md ${
            isReady
              ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/25 ring-2 ring-emerald-400/40'
              : 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-600/20'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{isReady ? 'READY FOR SNAP ✓' : 'CLICK WHEN READY'}</span>
        </button>
      </div>
    </div>
  );
};
