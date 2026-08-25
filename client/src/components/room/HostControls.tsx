import React from 'react';
import { Room } from '../../types';
import { Settings, Play, Sliders, Timer, Camera } from 'lucide-react';

interface HostControlsProps {
  room: Room;
  onStartSession: () => void;
  allMembersReady: boolean;
}

export const HostControls: React.FC<HostControlsProps> = ({
  room,
  onStartSession,
  allMembersReady
}) => {
  return (
    <div className="space-y-4 rounded-2xl glass-panel p-5 border border-rose-500/30 bg-rose-950/10 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
          <Settings className="h-4 w-4" />
          <span>Host Controls</span>
        </div>
        <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
          HOST ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-zinc-900/80 p-3 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium mb-1">
            <Timer className="h-3.5 w-3.5 text-amber-400" />
            <span>Countdown</span>
          </div>
          <span className="font-bold text-zinc-200">{room.countdownSeconds || 3} Seconds</span>
        </div>

        <div className="rounded-xl bg-zinc-900/80 p-3 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium mb-1">
            <Camera className="h-3.5 w-3.5 text-rose-400" />
            <span>Burst Shots</span>
          </div>
          <span className="font-bold text-zinc-200">{room.maxPhotos || 4} Photos</span>
        </div>
      </div>

      <button
        onClick={onStartSession}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-xl ${
          allMembersReady
            ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white hover:from-rose-500 hover:to-amber-500 shadow-rose-600/30 ring-2 ring-rose-400/50 animate-pulse'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
        }`}
      >
        <Play className="h-5 w-5 fill-current" />
        <span>START PHOTO SESSION</span>
      </button>

      {!allMembersReady && (
        <p className="text-[11px] text-amber-400/80 text-center font-medium">
          Waiting for all participants to click "Ready"...
        </p>
      )}
    </div>
  );
};
