import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { Camera, Sparkles } from 'lucide-react';

export const CountdownOverlay: React.FC = () => {
  const { isCountdownActive, countdownValue, currentSlotIndex, room, isShutterFlashing } = useRoomStore();

  if (!isCountdownActive) return null;

  const totalSlots = room?.maxPhotos || 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Shutter Flash Screen */}
      {isShutterFlashing && (
        <div className="fixed inset-0 z-50 bg-white animate-shutter-flash pointer-events-none" />
      )}

      <div className="flex flex-col items-center gap-6 text-center">
        {/* Shot Badge */}
        <div className="flex items-center gap-2 rounded-full bg-rose-500/20 px-5 py-2 text-sm font-bold text-rose-300 border border-rose-500/40">
          <Camera className="h-4 w-4 text-rose-400" />
          <span>POSE NOW! SHOT {currentSlotIndex + 1} OF {totalSlots}</span>
        </div>

        {/* Countdown Number (Solid Red Text, No Gradient) */}
        <div className="relative">
          <div className="text-9xl font-black text-rose-500 tracking-tighter scale-125 animate-bounce">
            {countdownValue > 0 ? countdownValue : 'SMILE!'}
          </div>
        </div>

        <p className="text-sm font-medium text-zinc-400 max-w-xs">
          Get ready for the flash! Synchronized photo burst active across all members.
        </p>
      </div>
    </div>
  );
};
