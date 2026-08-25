import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { Camera, Sparkles, User, Users } from 'lucide-react';

export const CountdownOverlay: React.FC = () => {
  const { isCountdownActive, countdownValue, currentSlotIndex, room, isShutterFlashing, currentUser } = useRoomStore();

  if (!isCountdownActive || !room || !currentUser) return null;

  const totalSlots = room.maxPhotos || 4;
  const activeTurn = room.activeTurn || 'both';
  const isHost = currentUser.isHost;

  let turnTitle = "DUAL POSE! BOTH PLAYERS SMILE!";
  let isMyTurn = true;

  if (activeTurn === 'host') {
    isMyTurn = isHost;
    turnTitle = isHost ? "YOUR TURN — POSE NOW!" : "HOST'S TURN — OBSERVE & SMILE!";
  } else if (activeTurn === 'joiner') {
    isMyTurn = !isHost;
    turnTitle = !isHost ? "YOUR TURN — POSE NOW!" : "JOINER'S TURN — OBSERVE & SMILE!";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Shutter Flash Screen */}
      {isShutterFlashing && (
        <div className="fixed inset-0 z-50 bg-white animate-shutter-flash pointer-events-none" />
      )}

      <div className="flex flex-col items-center gap-6 text-center">
        {/* Turn & Role Indicator Badge */}
        <div className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-extrabold uppercase tracking-wider border shadow-xl transition-all ${
          isMyTurn
            ? 'bg-rose-600 text-white border-rose-400 shadow-rose-600/30 animate-pulse'
            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
        }`}>
          {activeTurn === 'both' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
          <span>{turnTitle}</span>
        </div>

        {/* Slot Progress */}
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          FRAME {currentSlotIndex + 1} OF {totalSlots}
        </div>

        {/* Countdown Number */}
        <div className="relative">
          <div className="text-9xl font-black text-rose-500 tracking-tighter scale-125 animate-bounce">
            {countdownValue > 0 ? countdownValue : 'SMILE!'}
          </div>
        </div>

        <p className="text-xs font-medium text-zinc-400 max-w-xs leading-relaxed">
          {isMyTurn 
            ? 'Position yourself in the video frame! Snapshot triggers automatically.' 
            : 'Watch your friend pose on screen! Your turn is coming up next.'}
        </p>
      </div>
    </div>
  );
};
