import React from 'react';
import { User } from '../../types';
import { Users, Crown, CheckCircle, Clock } from 'lucide-react';

interface ParticipantListProps {
  members: User[];
  currentUserId?: string;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  members,
  currentUserId
}) => {
  return (
    <div className="space-y-3 rounded-2xl glass-panel p-4 border border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Users className="h-4 w-4 text-rose-400" />
          <span>Participants ({members.length})</span>
        </div>
        <span className="text-[11px] text-zinc-500 font-medium">Room Lobby</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 max-h-48 overflow-y-auto pr-1">
        {members.map((member) => {
          const isMe = member.id === currentUserId;
          return (
            <div
              key={member.id}
              className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all ${
                isMe
                  ? 'bg-rose-500/10 border border-rose-500/30'
                  : 'bg-zinc-900/60 border border-zinc-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-xs font-bold text-white shadow-md">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-200">
                      {member.username} {isMe && '(You)'}
                    </span>
                    {member.isHost && (
                      <span title="Host">
                        <Crown className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {member.isHost ? 'Room Creator' : 'Guest'}
                  </span>
                </div>
              </div>

              <div>
                {member.readyStatus ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle className="h-3 w-3" />
                    Ready
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                    <Clock className="h-3 w-3" />
                    Not Ready
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
