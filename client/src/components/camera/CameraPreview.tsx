import React, { useEffect } from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { Camera, Sparkles, VideoOff, RefreshCw } from 'lucide-react';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream?: MediaStream | null;
  isLive?: boolean;
  username?: string;
  isHost?: boolean;
  readyStatus?: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  videoRef,
  stream,
  username = 'You',
  isHost = false,
  readyStatus = false
}) => {
  const { mirrorCamera, activeFilter, usingVirtualCamera, isCameraActive } = useRoomStore();

  useEffect(() => {
    if (videoRef.current) {
      if (isCameraActive && stream) {
        if (videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [videoRef, stream, isCameraActive]);

  const getFilterStyle = () => {
    switch (activeFilter) {
      case 'vintage': return 'sepia(0.5) contrast(1.1) brightness(0.95)';
      case 'bw': return 'grayscale(1) contrast(1.2)';
      case 'cyberpunk': return 'hue-rotate(290deg) saturate(1.8)';
      case 'warm': return 'sepia(0.2) saturate(1.4)';
      case 'softglow': return 'brightness(1.1) contrast(0.9)';
      case 'contrast': return 'contrast(1.4)';
      default: return 'none';
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl group">
      {/* Video Element Always Mounted for Ref Binding */}
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        autoPlay
        playsInline
        muted
        style={{
          transform: mirrorCamera && !usingVirtualCamera ? 'scaleX(-1)' : 'none',
          filter: getFilterStyle()
        }}
        className={`h-full w-full object-cover transition-all duration-300 ${
          isCameraActive ? 'block' : 'hidden'
        }`}
      />

      {!isCameraActive && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-900 text-zinc-400">
          <VideoOff className="h-12 w-12 text-zinc-600 animate-pulse" />
          <p className="text-sm font-medium">Camera Offline</p>
        </div>
      )}

      {/* Face Framing Guide Overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
        <div className="h-48 w-40 rounded-full border-2 border-dashed border-rose-400/60" />
      </div>

      {/* User Info Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white border border-white/10">
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${readyStatus ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
          <span className={`relative inline-flex h-2 w-2 rounded-full ${readyStatus ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
        </span>
        <span>{username}</span>
        {isHost && (
          <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
            HOST
          </span>
        )}
      </div>

      {/* Virtual Camera Indicator */}
      {usingVirtualCamera && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-indigo-500/30 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-indigo-200 border border-indigo-500/40">
          <Sparkles className="h-3 w-3 text-indigo-400 animate-spin" />
          <span>Virtual Camera</span>
        </div>
      )}

      {/* Ready Badge */}
      <div className="absolute bottom-3 right-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold shadow-lg backdrop-blur-md ${
          readyStatus 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
        }`}>
          {readyStatus ? 'READY ✓' : 'NOT READY'}
        </span>
      </div>
    </div>
  );
};
