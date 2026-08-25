import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';

const EMOJIS = ['❤️', '🎉', '📸', '🔥', '👏', '🥳', '✨', '💍', '🎂', '🎓'];

interface EmojiReactionsProps {
  onSendReaction: (emoji: string) => void;
}

export const EmojiReactions: React.FC<EmojiReactionsProps> = ({ onSendReaction }) => {
  const { floatingReactions } = useRoomStore();

  return (
    <div className="relative">
      {/* Floating Emojis Layer */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            className="absolute animate-float text-4xl"
            style={{
              bottom: '20%',
              left: `${15 + Math.random() * 70}%`,
              animation: 'float 3.5s ease-out forwards',
              opacity: 0.9
            }}
          >
            <div className="flex flex-col items-center">
              <span>{r.emoji}</span>
              <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md">
                {r.username}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Toolbar */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto rounded-2xl glass-panel p-2.5 border border-zinc-800">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSendReaction(emoji)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900/60 text-xl hover:bg-zinc-800 hover:scale-125 transition-all duration-200"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
