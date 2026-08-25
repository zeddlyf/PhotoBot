import React from 'react';
import { useRoomStore } from '../store/useRoomStore';
import { User as UserIcon, Camera, History, Shield, Sparkles } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser } = useRoomStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-4 pb-12">
      <div className="rounded-3xl glass-panel p-8 border border-zinc-800 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-2xl font-extrabold text-white shadow-xl">
            {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100">
              {currentUser?.username || 'Guest User'}
            </h2>
            <p className="text-xs text-zinc-400">SnapTogether Photo Booth Member</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Sessions Attended</span>
            <div className="text-xl font-bold text-zinc-100 mt-1">1 Session</div>
          </div>
          <div className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Strips Created</span>
            <div className="text-xl font-bold text-rose-400 mt-1">1 Photo Strip</div>
          </div>
        </div>
      </div>
    </div>
  );
};
